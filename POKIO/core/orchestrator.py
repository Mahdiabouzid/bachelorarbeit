"""
Orchestrator for POKIO system (Cycle 2: Planner/Coder).
Coordinates between the Planner and Coder agents and their respective services.
"""
import logging
from typing import Dict, Any, List, Tuple, Optional
import json
import os
import sys
from dotenv import load_dotenv
from utils import OrchestratorState, format_history_lines, save_conversation, format_duration_hms
import hashlib
import time

# Import services
from verification_service import VerificationService
from tool_service import ToolService
from file_operations_service import FileOperationsService
from prompt_builder import PromptBuilder
from ai import AI
# from rag_service import UIUXRAGService
from logging_service import log_coder_errors, log_token_usage_final, log_token_usage_per_call, check_project_syntax, compile_react_src, check_project_lint, copy_src_to_exp_folder

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
CODER = os.getenv("CODER")
PLANNER = os.getenv("PLANNER")

VERSION = os.getenv("VERSION")
MAX_RETRIES = 3
EXPERIMENT = os.getenv("EXPERIMENT")

GLOBAL_HISTORY_MAX = 14

class Orchestrator:
    """Orchestrator to coordinate between Planner and Coder agents."""
    
    def __init__(self, project_root: str):
        """Initialize Orchestrator."""
        self.project_root = project_root
        if not self.project_root:
            raise ValueError("Project root not specified.")
        
        # State Management
        self.state = OrchestratorState.IDLE
        self.plan: Dict[str, Any] = {}
        self.current_step_index = -1
        
        self.conversation_history: List[Dict[str, str]] = []
        self.change_history: List[Dict[str, str]] = []
        self.implemented_files = ["src/App.tsx", "src/main.tsx", "src/index.css"]

        # Initialize services
        self.coder = AI(model=CODER, temperature=0.1)
        self.planner = AI(model=PLANNER, temperature=0.1)
        
        self.verification_service = VerificationService()
        self.file_operations_service = FileOperationsService(project_root=self.project_root)
        self.tool_service = ToolService(project_root=self.project_root, file_operations_service=self.file_operations_service)
        self.prompt_builder = PromptBuilder(project_root=project_root)
        # self.rag_service = UIUXRAGService(guidelines_dir="guidelines")

        self.total_token_usage = 0
        self.total_request_cost = 0.0

        #append system prompt to conversation history
        self._init_conversation_history()

        logger.info(f"Orchestrator initialized for Cycle 3 with project root: {self.project_root}")

    # --- Memory Management ---
    def _init_conversation_history(self):
        system_prompt = self.prompt_builder.load_system_prompt(state=OrchestratorState.PLANNING)
        self.conversation_history.append({"role": "system", "content": system_prompt})

    def _trim_global_history(self) -> None:
         """Ensure global memory does not exceed the cap."""
         if len(self.conversation_history) > GLOBAL_HISTORY_MAX:
             self.conversation_history.pop(1)

    def update_conversation_history(self, role: str, content: Dict[str, Any]) -> None:
        """Persist one *condensed* turn to global memory."""     
        self.conversation_history.append({"role": role, "content": json.dumps(content)})
        self._trim_global_history()


    def get_guidelines_for_current_step(self, step: Dict[str, Any]) -> str:
        if step:
            context = self.rag_service.get_guidelines_for_step(step)
            logger.info(f"Extracted {len(context)} chars guidelines for Coder Context")
            return context
        else:
            logger.warning("Step in not defined, could not retreive guidelines")
    
    # --- Main Entry Point and State Machine ---
    def handle_user_request(self, user_request: str):
        """
        Main entry point for a user request. Manages the Planner -> Coder workflow.
        """
        logger.info(f"--- New Request Received: '{user_request[:50]}...' ---")
        request_start_time  = time.time()

        try:
            history_lines = format_history_lines(self.change_history)
            enhanced_prompt = self.prompt_builder.build_user_prompt(base_prompt=user_request, change_history=history_lines)

            # === PHASE 1: PLANNING ===
            self.state = OrchestratorState.PLANNING
            planning_success, plan_or_error = self._execute_planning_phase(enhanced_prompt, user_request=user_request)
            self.update_conversation_history(role="user", content={"request": user_request})

            if not planning_success:
                self.state = OrchestratorState.FAILED
                logger.error(f"Planning failed: {plan_or_error}")
                return {"status": "failure", "reason": "Planning phase failed", "details": plan_or_error}

            self.plan = plan_or_error
            logger.info("Plan generated successfully")

            # Persist the generated plan to global history for context
            self.update_conversation_history(role="assistant", content={"plan_generated": self.plan})
            
            # === PHASE 2: CODING ===
            self.state = OrchestratorState.CODING
            all_steps = self.plan.get("steps", [])
            
            for i, step_details in enumerate(all_steps):
                self.current_step_index = i
                logger.info(f"--- Executing Step {i+1}/{len(all_steps)}: {step_details.get('title')} ---")
                
                step_result, parsed_json_from_step = self._execute_coding_step(step_details, user_request=user_request)
                
                if step_result["status"] == "failure":
                    self.state = OrchestratorState.FAILED
                    logger.error(f"Coding failed at step {i+1}. Aborting.")
                    return {
                        "status": "failure", 
                        "reason": f"Failed at coding step {i+1}", 
                        "details": step_result.get("details")
                    }

                logger.info(f"--- Step {i+1} completed successfully. ---")
                # We could add a summary of the step to global history here, but it might be too verbose.
                # For now, we only store the initial request and the final plan.

            self.state = OrchestratorState.COMPLETED
            # reset previously implemented files for the next request
            self.implemented_files = []

            logger.info("--- All coding steps completed successfully. Workflow finished. ---")
            return {"status": "success", "report": "All planned steps were executed successfully."}
        finally:
            ## Log everything
            total_duration = time.time() - request_start_time
            planner_tokens = self.planner.get_total_token_usage()
            coder_tokens = self.coder.get_total_token_usage()
            
            check_project_syntax()
            compile_react_src()
            check_project_lint()
            copy_src_to_exp_folder()

            log_data = {
                "request": user_request,
                "planner_tokens": planner_tokens,
                "coder_tokens": coder_tokens,
                "total_tokens": planner_tokens + coder_tokens,
                "total_time": format_duration_hms(total_duration),
                "total_cost": self.total_request_cost
            }
            log_token_usage_final(log_data)
            logger.info("Final token usage and timing for the request have been logged.")

            # Reset token counters for the next request
            self.planner.total_tokens_used = 0
            self.coder.total_tokens_used = 0

    # --- Phase-Specific Execution Logic ---
    def _execute_planning_phase(self, enhanced_prompt: str, user_request: str) -> Tuple[bool, Dict]:
        """Orchestrates the planning agent to generate a step-by-step plan."""
        attempts = 0
        messages = []
        
        system_prompt = self.prompt_builder.load_system_prompt(state=OrchestratorState.PLANNING)
        #messages.extend(self.conversation_history) # Give planner context of past conversations
        messages.append({"role": "system", "content": system_prompt + "\n" + enhanced_prompt})
        messages.append({"role": "user", "content": user_request})

        # For simplicity, we won't implement a retry loop for the planner, but one could be added.
        while True:
            response_text, token_usage, duration = self.stream_ai_response(messages=messages)
            
            is_valid, response_type, parsed_json = self.verification_service.verify_response(response_text)
            
            #save for control
            messages.append({"role": "assistant", "content": response_text})
            save_conversation(
                messages=messages, 
                filename=f"{EXPERIMENT}/{VERSION}_logs/planner.md",
                token_usage=token_usage,
                duration=duration)

            if not is_valid:
                if attempts > MAX_RETRIES:
                    return False, parsed_json.get("error", "Planner response verification failed.")
                fix_prompt = self.prompt_builder.build_invalid_JSON_fixing_prompt("Invalid JSON")
                messages.append({"role": "user", "content": fix_prompt})
                continue
            
            elif response_type == "tool":
                tool_result = self._handle_tool_request(parsed_json)
                messages.append({"role": "assistant", "content": response_text})
                messages.append({"role": "user", "content": json.dumps(tool_result)})
                continue
            elif response_type == "plan":
                return True, parsed_json
            else:
                return False, f"Received an unexpected response type {response_type}"
                
    def _execute_coding_step(self, step_details: Dict, user_request: str) -> Tuple[Dict, Dict]:
        """
        Orchestrates the coder agent for a single step with a reconstruction-based
        retry strategy:
        - Initial attempt: normal system + step context
        - On failure (file): rebuild memory to EDIT repair (only error files)
        - On failure (project): rebuild memory to BUILD repair (only tsc-error files)
        Returns: (final_report_dict, last_successful_parsed_json_or_None)
        """
        unique_files = step_details.get('requires', []) #list(set(self.implemented_files)) #step_details.get('requires', [])
        # --- Initial prompts for the step
        history_lines = format_history_lines(self.change_history)
        coder_system_prompt = self.prompt_builder.load_system_prompt(state=OrchestratorState.CODING)
        
        # Disabled for Experiemnt 2
        context = "" #self.get_guidelines_for_current_step(step=step_details)

        coder_context_prompt, current_task = self.prompt_builder.build_coder_prompt_for_step(
            plan=self.plan,
            current_step=step_details,
            guidelines=context,
            file_blobs=self._get_current_file_blobs(unique_files)
        )

        # --- Lightweight change ledger for this step (one-liners only)
        step_id = f"step-{self.current_step_index + 1}"
    
        # --- Initialize memory for first attempt (normal coding)
        step_memory: List[Dict[str, str]] = [
            {"role": "system", "content": coder_system_prompt + "\n" + coder_context_prompt},
            {"role": "user", "content": current_task},
        ]

        # ============================
        # OUTER LOOP: Self-correction
        # ============================
        # TODO add an agent that is only specialized in fixing errors with faulty files contents and tsc lint errors and as output a minimal write_to_files tool
        for attempt_index in range(MAX_RETRIES + 1):
            logger.info(f"{step_id} - Attempt {attempt_index + 1}/{MAX_RETRIES + 1}")

            attempt_report, error_message_for_model, parsed_json = self._run_tool_use_loop(step_memory)

            if error_message_for_model:
                logger.info("Retry due to invalid JSON tool call.")
                step_memory.append({"role": "user", "content": error_message_for_model})
                continue

            if not attempt_report:
                logger.error(f"{step_id} failed without a final_report. Aborting.")
                return {"status": "failure", "reason": "No final_report returned."}, None
                
            if isinstance(attempt_report, str):
                return {"status": "verification", "details": attempt_report}, None
            
            # Record last change summary to *global* change ledger
            self._append_change_summary_from_parsed_json(parsed_json, self.change_history)
            
            if attempt_report and attempt_report.get("status") == "success":
                logger.info(f"{step_id} operations successful.")
                return {"status": "success", "report": attempt_report}, parsed_json

            logger.error(f"{step_id} failed. scope={attempt_report.get('scope')} errors:\n{attempt_report.get('errors')}")

            if attempt_index >= MAX_RETRIES:
                return {"status": "failure", "reason": "Max retries exceeded", "details": attempt_report.get('errors')}, None

            # Derive scope and generate EDIT/BUILD repair report
            results = attempt_report.get("results", []) or []
            scope = attempt_report.get("scope")
            error_files: List[str] = list(attempt_report.get("error_files", []) or [])
            errors_raw = attempt_report.get("errors")

            # Log coder errors
            data = {
                "step": step_id,
                "attempt": attempt_index,
                "tsc_error_files": error_files,
                "tsc_errors": errors_raw
            }

            log_coder_errors(data=data)
            
            # If we encountered SEARCH/REPLACE Block errors, request the model to fix building upon the new context
            if scope == "file":
                applied_paths = [r["path"] for r in results if r.get("status") == "success" and r.get("path")]
                skipped_or_failed_paths = [r["path"] for r in results if r.get("status") != "success" and r.get("path")]
                scope_paths = sorted(set(error_files or skipped_or_failed_paths))
                report = self.prompt_builder.build_orchestrator_report_edit_repair(
                    step_id=step_id,
                    txn_id=f"{step_id}-txn-{attempt_index + 1}",
                    applied_paths=applied_paths,
                    failed_paths=scope_paths,
                    errors=errors_raw
                )

                # append error fixing prompt to the existing context
                step_memory.append({"role": "user", "content": report})
                continue

            elif scope == "project":
                applied_paths = [r["path"] for r in results if r.get("path")]
                scope_paths = sorted(set(error_files))
                report = self.prompt_builder.build_orchestrator_report_build_repair(
                    step_id=step_id,
                    txn_id=f"{step_id}-txn-{attempt_index + 1}",
                    change_history=self.change_history,
                    applied_paths=applied_paths,
                    tsc_error_files=scope_paths,
                    tsc_errors=errors_raw,
                    file_blobs=self._get_current_file_blobs(scope_paths)
                )
                # Rebuild step memory minimal context
                step_memory = [{"role": "system", "content": coder_system_prompt},
                            {"role": "user", "content": report}]

                continue

            else:
                return {"status": "failure", "reason": f"Unknown failure scope: {scope}", "details": errors_raw}, None

        return {"status": "failure", "reason": "Max retries exceeded without success."}, None
    
    def _run_tool_use_loop(self, step_memory: List[Dict[str, str]]):
        """
        The inner loop for iterative tool use until a completion is attempted.
        This modularizes the logic from the old implementation.
        """
        final_report = None
        error_message_for_model = None
        last_parsed_json = None

        while True: 
            response_text, token_usage, duration = self.stream_ai_response(messages=step_memory)
            step_memory.append({"role": "assistant", "content": response_text})
            save_conversation(
                messages=step_memory, 
                filename=f"{EXPERIMENT}/{VERSION}_logs/step_{self.current_step_index + 1}.md",
                token_usage=token_usage, 
                duration=duration
            )
            
            is_valid, response_type, parsed_json = self.verification_service.verify_response(response_text)
            last_parsed_json = parsed_json

            if not is_valid:
                error_message_for_model = self.prompt_builder.build_invalid_JSON_fixing_prompt(
                    error_details=parsed_json.get("error", "Unknown verification error")
                )
                break

            if response_type == "tool":
                tool_result = self._handle_tool_request(parsed_json)
                if parsed_json.get("tool_name") == "write_to_files":
                    final_report = tool_result.get("result")
                    # if no chanegs were provided
                    if isinstance(final_report, str):
                        logger.info(final_report)
                        break

                    # add successfully implemented files
                    if not final_report.get("results"):
                        logger.warning("Final report does not contain results")
                    else:
                        for result in final_report.get("results"):
                            if result.get("status") == "success":
                                # append file's path
                                file = result.get("path")
                                self.implemented_files.append(file)
                    break
                else:
                    step_memory.append({"role": "user", "content": json.dumps(tool_result)})
                    continue
            else:
                error_message_for_model = "Received an unexpected response type."
                break
        
        return final_report, error_message_for_model, last_parsed_json

    def print_streaming_response(self, chunk: str):
        sys.stdout.write(chunk)
        sys.stdout.flush()

    def stream_ai_response(self, messages: List[Dict[str, str]]) -> Tuple[str, int, float]:
        logger.info(f"Streaming response with {len(messages)} messages")

        if self.state == OrchestratorState.PLANNING:
            agent = self.planner
            agent_name = "PLanner"
        elif self.state == OrchestratorState.CODING:
            agent = self.coder
            agent_name = "Coder"
        else:
            logger.warning(f"No Agent defined for state {self.state} ")
        
        full_response = ""
        try:
            for chunk in agent.call_model(messages=messages):
                if isinstance(chunk, str):
                    self.print_streaming_response(chunk)
                    full_response += chunk
            token_usage = agent.get_call_token_usage()
            duration = agent.get_call_duration()
            cost = agent.calculate_token_cost()
            self.total_request_cost += cost

            print()
            log_token_usage_per_call({
                "agent_name": agent_name,
                "tokens": agent.last_call_tokens,
                "duration": agent.last_call_duration,
                "response": full_response
            })
            self.total_token_usage += token_usage
            logger.info(f"Total tokens used so far (Coder and Planner): {self.total_token_usage}")
            print()
        except Exception as e:
            print(f"\n❌ Error streaming response: {e}")
        return full_response, token_usage, duration
    
    def _handle_tool_request(self, parsed_json: Dict[str, Any]) -> Dict[str, Any]:
        return self.tool_service.execute_tool(parsed_json)
    

    # =======================================
    # Helpers: Change summary & file content
    # =======================================
    def _append_change_summary_from_parsed_json(self, parsed_json: Optional[Dict], history: List[Dict[str, str]]) -> None:
        """Extract a compact, durable commit-like summary from the model's last tool call."""
        if not parsed_json:
            return
        params = (parsed_json.get("parameters") or {}) if isinstance(parsed_json, dict) else {}
        title = (params.get("title") or "").strip()
        summary = (params.get("summary") or "").strip()
        implementation = (params.get("implementation") or "").strip()
        if title or summary or implementation:
            history.append({
                "title": title[:160],
                "summary": summary[:400],
                "implementation": implementation[:800]
            })

    def _get_current_file_blobs(self, paths: List[str]) -> List[Dict[str, str]]:
        """
        Uses self.tool_service._fetch_files to obtain the latest file content.
        Matches the fetch_files return shape:
        {"tool": "fetch_files", "result": [{filePath, content?, status, metadata?, error?}, ...]}
        Returns a list of dicts: {"path": str, "sha256": str, "content": str}
        in the same order as `paths`.
        """
        if not paths:
            return []

        resp = self.tool_service._fetch_files(paths)
        results = (resp or {}).get("result", [])
        # Index by filePath for quick lookup
        by_path = {item.get("filePath"): item for item in results if isinstance(item, dict)}

        blobs: List[Dict[str, str]] = []
        for p in paths:
            item = by_path.get(p, {})
            status = item.get("status")
            if status != "success":
                # Not found or error — provide empty content but keep the entry
                err = item.get("error", "Unknown fetch error") if item else "File not returned by fetch_files"
                try:
                    logger.warning(f"Fetch blob warning for {p}: {err}")
                except Exception:
                    pass
                content = ""
            else:
                content = item.get("content", "")

            blobs.append({
                "path": p,
                "sha256": self._sha256_text(content),
                "content": content
            })

        return blobs

    @staticmethod
    def _sha256_text(text: str) -> str:
        return hashlib.sha256(text.encode("utf-8")).hexdigest()