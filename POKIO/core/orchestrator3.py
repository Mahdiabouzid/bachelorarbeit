"""
Orchestrator for POKIO system (Single Agent: Coder only).
Coordinates the Coder agent and its respective services.
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
from logging_service import log_coder_errors, log_token_usage_final, log_token_usage_per_call, check_project_syntax, compile_react_src, check_project_lint, copy_src_to_exp_folder

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
CODER = os.getenv("CODER")
VERSION = os.getenv("VERSION")
MAX_RETRIES = 3
EXPERIMENT = os.getenv("EXPERIMENT")
GLOBAL_HISTORY_MAX = 14

class Orchestrator:
    """Orchestrator to coordinate the Coder agent."""
    
    def __init__(self, project_root: str):
        """Initialize Orchestrator."""
        self.project_root = project_root
        if not self.project_root:
            raise ValueError("Project root not specified.")
        
        # State Management
        self.state = OrchestratorState.IDLE
        
        self.conversation_history: List[Dict[str, str]] = []
        self.change_history: List[Dict[str, str]] = []

        # Initialize services
        self.coder = AI(model=CODER, temperature=0.1)
        
        self.verification_service = VerificationService()
        self.file_operations_service = FileOperationsService(project_root=self.project_root)
        self.tool_service = ToolService(project_root=self.project_root, file_operations_service=self.file_operations_service)
        self.prompt_builder = PromptBuilder(project_root=project_root)
        self.total_token_usage = 0
        self.total_request_cost = 0.0

        # Append system prompt to conversation history
        self._init_conversation_history()

        logger.info(f"Orchestrator initialized with single coder agent for project root: {self.project_root}")

    # --- Memory Management ---
    def _init_conversation_history(self):
        system_prompt = self.prompt_builder.load_system_prompt(state=OrchestratorState.CODING)
        self.conversation_history.append({"role": "system", "content": system_prompt})

    def _trim_global_history(self) -> None:
         """Ensure global memory does not exceed the cap."""
         if len(self.conversation_history) > GLOBAL_HISTORY_MAX:
             self.conversation_history.pop(1)

    def update_conversation_history(self, role: str, content: Dict[str, Any]) -> None:
        """Persist one *condensed* turn to global memory."""     
        self.conversation_history.append({"role": role, "content": json.dumps(content)})
        self._trim_global_history()

    # --- Main Entry Point ---
    def handle_user_request(self, user_request: str):
        """
        Main entry point for a user request. Directly processes with Coder agent.
        """
        logger.info(f"--- New Request Received: '{user_request[:50]}...' ---")
        request_start_time = time.time()

        try:
            # === DIRECT CODING EXECUTION ===
            self.state = OrchestratorState.CODING
            
            logger.info(f"--- Executing coding task: {user_request[:50]}... ---")
            
            step_result, _ = self._execute_coding_task(user_request)
            
            if step_result["status"] == "failure":
                self.state = OrchestratorState.FAILED
                logger.error(f"Coding task failed. Aborting.")
                return {
                    "status": "failure", 
                    "reason": "Coding task failed", 
                    "details": step_result.get("details")
                }

            self.state = OrchestratorState.COMPLETED
            logger.info("--- Coding task completed successfully. ---")
            return {"status": "success", "report": "Task executed successfully."}
            
        finally:
            total_duration = time.time() - request_start_time
            coder_tokens = self.coder.get_total_token_usage()
            
            check_project_syntax()
            compile_react_src()
            check_project_lint()
            copy_src_to_exp_folder()

            log_data = {
                "request": user_request,
                "planner_tokens": 0,
                "coder_tokens": coder_tokens,
                "total_tokens": coder_tokens,
                "total_time": format_duration_hms(total_duration),
                "total_cost": self.total_request_cost
            }
            log_token_usage_final(log_data)
            logger.info("Final token usage and timing for the request have been logged.")

            # Reset token counters for the next request
            self.coder.total_tokens_used = 0

    # --- Coding Task Execution ---
    def _execute_coding_task(self, user_request: str) -> Tuple[Dict, Dict]:
        """
        Orchestrates the coder agent for the entire task with a reconstruction-based
        retry strategy:
        - Initial attempt: normal system + user request
        - On failure (file): rebuild memory to EDIT repair (only error files)
        - On failure (project): rebuild memory to BUILD repair (only tsc-error files)
        Returns: (final_report_dict, last_successful_parsed_json_or_None)
        """

        # --- Initial prompts for the task
        coder_system_prompt = self.prompt_builder.load_system_prompt(state=OrchestratorState.CODING)
        history_lines = format_history_lines(self.change_history)

        enhanced_prompt = self.prompt_builder.build_single_agent_prompt(base_prompt=user_request, change_history=history_lines)
        # --- Lightweight change ledger for this task (one-liners only)
        task_id = f"task-{1}"
    
        # --- Initialize memory for first attempt (normal coding)
        task_memory: List[Dict[str, str]] = [
            {"role": "system", "content": coder_system_prompt},
            {"role": "user", "content": enhanced_prompt},
        ]

        # ============================
        # OUTER LOOP: Self-correction
        # ============================
        for attempt_index in range(MAX_RETRIES + 1):
                logger.info(f"{task_id} - Attempt {attempt_index + 1}/{MAX_RETRIES + 1}")

                attempt_report, error_message_for_model, parsed_json = self._run_tool_use_loop(task_memory)

                if error_message_for_model:
                    logger.info("Retry due to invalid JSON tool call.")
                    task_memory.append({"role": "user", "content": error_message_for_model})
                    continue

                if not attempt_report:
                    logger.error(f"{task_id} failed without a final_report. Aborting.")
                    return {"status": "failure", "reason": "No final_report returned."}, None
                    
                if isinstance(attempt_report, str):
                    return {"status": "verification", "details": attempt_report}, None
                
                # Record last change summary to *global* change ledger
                self._append_change_summary_from_parsed_json(parsed_json, self.change_history)
                
                if attempt_report and attempt_report.get("status") == "success":
                    logger.info(f"{task_id} operations successful.")
                    return {"status": "success", "report": attempt_report}, parsed_json

                logger.error(f"{task_id} failed. scope={attempt_report.get('scope')} errors:\n{attempt_report.get('errors')}")

                if attempt_index >= MAX_RETRIES:
                    return {"status": "failure", "reason": "Max retries exceeded", "details": attempt_report.get('errors')}, None

                # Derive scope and generate EDIT/BUILD repair report
                results = attempt_report.get("results", []) or []
                scope = attempt_report.get("scope")
                error_files: List[str] = list(attempt_report.get("error_files", []) or [])
                errors_raw = attempt_report.get("errors")

                # Log coder errors
                data = {
                    "step": task_id,
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
                        step_id=task_id,
                        txn_id=f"{task_id}-txn-{attempt_index + 1}",
                        applied_paths=applied_paths,
                        failed_paths=scope_paths,
                        errors=errors_raw
                    )

                    # append error fixing prompt to the existing context
                    task_memory.append({"role": "user", "content": report})
                    continue

                elif scope == "project":
                    applied_paths = [r["path"] for r in results if r.get("path")]
                    scope_paths = sorted(set(error_files))
                    report = self.prompt_builder.build_orchestrator_report_build_repair(
                        step_id=task_id,
                        txn_id=f"{task_id}-txn-{attempt_index + 1}",
                        change_history=self.change_history,
                        applied_paths=applied_paths,
                        tsc_error_files=scope_paths,
                        tsc_errors=errors_raw,
                        file_blobs=self._get_current_file_blobs(scope_paths)
                    )
                    # Rebuild step memory minimal context
                    task_memory = [{"role": "system", "content": coder_system_prompt},
                                {"role": "user", "content": report}]

                    continue

                else:
                    return {"status": "failure", "reason": f"Unknown failure scope: {scope}", "details": errors_raw}, None

        return {"status": "failure", "reason": "Max retries exceeded without success."}, None

    def _run_tool_use_loop(self, task_memory: List[Dict[str, str]]):
        """
        The inner loop for iterative tool use until a completion is attempted.
        This modularizes the logic from the old implementation.
        """
        final_report = None
        error_message_for_model = None
        last_parsed_json = None

        while True: 
            response_text, token_usage, duration = self.stream_ai_response(messages=task_memory)
            task_memory.append({"role": "assistant", "content": response_text})
            save_conversation(
                messages=task_memory, 
                filename=f"{EXPERIMENT}/{VERSION}_task.md",
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
                if parsed_json.get("tool_name") == "fetch_files":
                    task_memory.append({"role": "user", "content": json.dumps(tool_result)})
                    continue
                elif parsed_json.get("tool_name") == "write_to_files":
                    final_report = tool_result.get("result")
                    break
                else:
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

        agent = self.coder
        agent_name = "Coder"
        
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
            logger.info(f"Total tokens used (Coder): {self.total_token_usage}")
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