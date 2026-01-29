"""
Orchestrator for POKIO system (Cycle 3: Planner/Coder/Review).
Coordinates between the Planner and Coder agents and their respective services.
"""
import logging
from typing import Dict, Any, List, Tuple, Optional, Set
import json
import os
import sys
import re
from dotenv import load_dotenv
import hashlib
import time

# Import services
from verification_service import VerificationService
from tool_service import ToolService
from file_operations_service import FileOperationsService
from prompt_builder import PromptBuilder
from ai import AI
from utils import OrchestratorState, format_history_lines, save_conversation, format_duration_hms
from logging_service import log_coder_errors, log_review_rejections, log_token_usage_final, log_token_usage_per_call, check_project_syntax, compile_react_src, check_project_lint, copy_src_to_exp_folder

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', stream=sys.stdout)
logger = logging.getLogger(__name__)

# Constants
CODER = os.getenv("CODER")
PLANNER = os.getenv("PLANNER")

VERSION = os.getenv("VERSION")
EXPERIMENT = os.getenv("EXPERIMENT")

MAX_RETRIES = 3
REVIEW_RETRY_LIMIT = 3
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

        # Initialize services
        self.coder = AI(model=CODER, temperature=0.1)
        self.planner = AI(model=PLANNER, temperature=0.1)
        
        self.verification_service = VerificationService()
        self.file_operations_service = FileOperationsService(project_root=self.project_root)
        self.tool_service = ToolService(project_root=self.project_root, file_operations_service=self.file_operations_service)
        self.prompt_builder = PromptBuilder(project_root=project_root)
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
            
            # === PHASE 2: CODING + REVIEW ===
            self.state = OrchestratorState.CODING
            all_steps = self.plan.get("steps", [])
            
            for i, step_details in enumerate(all_steps):
                coder_memory: List[Dict[str, Any]] = []
                reviewer_memory: List[Dict[str, Any]] = [{"role": "system", "content": self.prompt_builder.build_review_prompt(step_details, plan=self.plan)}]

                self.current_step_index = i
                logger.info(f"--- Executing Step {i+1}/{len(all_steps)}: {step_details.get('title')} ---")
                
                step_result, _ = self._execute_coding_step_with_review(step_details, coder_memory, reviewer_memory)
                
                if step_result["status"] == "failure":
                    self.state = OrchestratorState.FAILED
                    logger.error(f"Step {i+1} failed. Aborting.")

                    logger.info(f"Total tokens used to complete the request {self.total_token_usage}")

                    return {
                        "status": "failure", 
                        "reason": f"Failed at step {i+1}", 
                        "details": step_result.get("details") or step_result.get("reason")
                    }

                logger.info(f"--- Step {i+1} approved and completed successfully. ---")

            self.state = OrchestratorState.COMPLETED
            logger.info("--- All steps completed and approved. Workflow finished. ---")

            return {"status": "success", "report": "All planned steps were executed and approved successfully."}
        finally:
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

            # Reset token counters for the next request if the orchestrator is long-lived
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
    
    # -------------------------------------------------------------------------
    # Coding Step w/ Review Loop
    # -------------------------------------------------------------------------
    def _execute_coding_step_with_review(self, step_details: Dict, coder_memory: List[Dict[str, Any]], reviewer_memory: List[Dict[str, Any]]) -> Tuple[Dict, Optional[Dict]]:
        """
        Execute a single step with the existing coder self-correction loop.
        On success, enter a Planner Review loop (max REVIEW_RETRY_LIMIT rejections).
        Returns: (final_report_dict, last_successful_parsed_json_or_None)
        """
        # --- Initial coding ---
        initial_report, parsed_json_from_step = self._execute_coder_step_self_correcting(
                coder_memory=coder_memory,
                step_details=step_details
            )

        if initial_report.get("status") != "success":
            return initial_report, None

        # Prepare review artifacts based on changed files of this step
        initial_changed_paths = self._extract_paths_from_report(initial_report)
        logger.info(f"Extraced file paths from coder json: {initial_changed_paths}")

        all_step_paths: Set[str] = set(initial_changed_paths)

        # Add a compact summary of this successful application into the *review* history
        review_change_history: List[Dict[str, str]] = []
        self._append_change_summary_from_coder_report(initial_report, review_change_history)

        # --- Planner Review Loop ---
        rejections = 0
        review_feedback_history: List[Dict[str, Any]] = []  # scoped to this review cycle

        while True:
            # Collect current artifacts for *all* files modified in this step so far
            artifacts = self._collect_artifacts(sorted(all_step_paths))

            # Temporarily switch to planner to run the review
            prev_state = self.state
            self.state = OrchestratorState.REVIEWING
            review_json, review_raw = self._execute_review_phase(
                reviewer_memory=reviewer_memory, 
                artifacts=artifacts, 
                step_details=step_details, 
                rejection_index=rejections
                )
            
            self.state = prev_state

            if review_json is None:
                # Could not parse a valid review after retries
                return {"status": "failure", "reason": "Planner review returned invalid JSON."}, None

            decision = (review_json.get("review_decision") or "").lower().strip()
            if decision == "approved":
                return {"status": "success", "report": initial_report.get("report")}, parsed_json_from_step

            if decision != "rejected":
                return {"status": "failure", "reason": f"Unexpected review decision: {decision}", "details": review_raw}, None

            # Rejected path
            rejections += 1
            if rejections > REVIEW_RETRY_LIMIT:
                return {
                    "status": "failure",
                    "reason": f"Planner rejected implementation more than {REVIEW_RETRY_LIMIT} times"
                }, None

            # Update cumulative, scoped feedback history
            fb = {
                "round": rejections,
                "feedback": review_json.get("feedback", ""),
                "files_to_revise": review_json.get("files_to_revise", []) or []
            }
            review_feedback_history.append(fb)

            log_data = {
                "step": step_details.get("id"),
                "round": rejections,
                "feedback": review_json.get("feedback", ""),
                "files_to_revise": review_json.get("files_to_revise", []) or []
            }

            log_review_rejections(data=log_data)

            # Determine scope paths (fallback to all_step_paths if planner omitted)
            scope_paths: List[str] = review_json.get("files_to_revise", []) or []

            # Fetch current file contents for these paths
            file_blobs = self._get_current_file_blobs(scope_paths)

            # Build REPAIR prompt including scoped history (review cycle only)
            repair_prompt = self.prompt_builder.build_orchestrator_report_review_repair(
                file_blobs=file_blobs,
                review=review_json,
            )

            # Run coder repair with robust self-correction (EDIT/BUILD)
            repair_result_report, _ = self._execute_coder_step_self_correcting(
                coder_memory=coder_memory,
                step_details=step_details,
                prompt_override=repair_prompt
            )

            if repair_result_report.get("status") != "success":
                return {"status": "failure", "reason": "Repair phase failed", "details": repair_result_report.get("details")}, None

            # Track newly changed paths from repair and extend artifacts set
            repair_changed_paths = self._extract_paths_from_report(repair_result_report)
            for p in repair_changed_paths:
                all_step_paths.add(p)

            # Append compact commit summary to review-scoped history
            self._append_change_summary_from_coder_report(repair_result_report, review_change_history)

    # --- Existing inner tools loop (unchanged) ---
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
                filename=f"{EXPERIMENT}/{VERSION}_step_{self.current_step_index + 1}.md",
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
                    step_memory.append({"role": "user", "content": json.dumps(tool_result)})
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

        # Use planner for PLANNING (and also during review), otherwise coder
        if self.state == OrchestratorState.PLANNING or self.state == OrchestratorState.REVIEWING:
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

            # Get logging metrics
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
    def _append_change_summary_from_coder_report(
        self,
        coder_report: Optional[Dict[str, Any]],
        history: List[Dict[str, Any]]
    ) -> None:
        """Extract a compact, durable commit-like summary from the model's previous attempts."""
        if not coder_report:
            return

        for i, attempt in enumerate(coder_report.get("attempts", [])):
            history.append(attempt.get("change_summary", {}))

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

    # -------------------------------------------------------------------------
    # Internal helpers for new workflow
    # -------------------------------------------------------------------------

    def _execute_coder_step_self_correcting(self, coder_memory: List[Dict[str, Any]], step_details: Dict, prompt_override: Optional[str] = None) -> Tuple[Dict, Optional[Dict]]:
        """
        Orchestrates the coder agent for a single step with a reconstruction-based
        retry strategy:
        - Initial attempt: normal system + step context
        - On failure (file): rebuild memory to EDIT repair (only error files)
        - On failure (project): rebuild memory to BUILD repair (only tsc-error files)
        Returns: (final_report_dict, last_successful_parsed_json_or_None)
        """
        coder_system_prompt = self.prompt_builder.load_system_prompt(state=OrchestratorState.CODING)
        unique_files = step_details.get('requires', [])
        context = ""

        if prompt_override:
            current_task = prompt_override
        # First time executing the step
        else:
            coder_context_prompt, current_task = self.prompt_builder.build_coder_prompt_for_step(
                plan=self.plan,
                current_step=step_details,
                guidelines=context,
                file_blobs=self._get_current_file_blobs(unique_files)
            )
            coder_memory.append({"role": "system", "content": coder_system_prompt + "\n" + coder_context_prompt})

        # Final report containing all attempts changes
        final_report: Dict[str, Any] = {
            "status": "success",
            "attempts": []
        }

        step_id = f"step-{self.current_step_index + 1}"
        
        coder_memory.append({"role": "user", "content": current_task})
        error_fixing_memory = []

        for attempt_index in range(MAX_RETRIES + 1):
            current_memory = []
            if error_fixing_memory:
                current_memory = error_fixing_memory
            else:
                current_memory = coder_memory

            logger.info(f"{step_id} - Attempt {attempt_index + 1}/{MAX_RETRIES + 1}")

            attempt_report, error_message_for_model, parsed_json = self._run_tool_use_loop(current_memory)

            if error_message_for_model:
                logger.info("Retry due to invalid JSON tool call.")
                current_memory.append({"role": "user", "content": error_message_for_model})
                continue

            if not attempt_report:
                logger.error(f"{step_id} failed without a final_report. Aborting.")
                return {"status": "failure", "reason": "No final_report returned."}, None
                
            if isinstance(attempt_report, str):
                return {"status": "verification", "details": attempt_report}, None
            
            # Record last change summary to *global* change ledger
            self._append_change_summary_from_coder_report(parsed_json, self.change_history)
            
            summary = {
                "title": (parsed_json.get("parameters", {}) or {}).get("title", ""),
                "summary": (parsed_json.get("parameters", {}) or {}).get("summary", ""),
                "implementation": (parsed_json.get("parameters", {}) or {}).get("implementation", "")
            }
            
            attempt = {
                "attempt_index": attempt_index,
                "apply_result": attempt_report,
                "change_summary": summary
            }
            
            final_report["attempts"].append(attempt)

            if attempt_report and attempt_report.get("status") == "success":
                logger.info(f"{step_id} operations successful.")
                return final_report, parsed_json

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
                current_memory.append({"role": "user", "content": report})
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
                error_fixing_memory.append({"role": "system", "content": coder_system_prompt})
                error_fixing_memory.append({"role": "user", "content": report})
                continue

            else:
                return {"status": "failure", "reason": f"Unknown failure scope: {scope}", "details": errors_raw}, None

        return {"status": "failure", "reason": "Max retries exceeded without success."}, None

    def _execute_review_phase(self, reviewer_memory: List[Dict[str, Any]], artifacts: List[Dict[str, Any]], step_details: dict, rejection_index: int) -> Tuple[Optional[Dict], str]:
        """
        Execute the planner review with a strict JSON response requirement.
        Returns (parsed_json_or_None, raw_text).
        """
        def _files_block():
            if not artifacts:
                return "No files were created or modified."
            blocks = []
            for a in artifacts:
                blocks.append(
                    f"FILE: {a['path']}\n"
                    f"```\n{a['content']}\n```\n"
                )
            return "\n".join(blocks)

        files_text = _files_block()

        review_prompt = f"""
# Step Description:
{step_details.get('description', '')}

# Step acceptance criteria:
{step_details.get('acceptance_criteria', [])}

# Step expected files, as defined by POKIO-Planner:
{step_details.get('expected_files', [])}

# POKIO-Coder's implemented files for the current step:

{files_text}
"""
        reviewer_memory.append({"role": "user", "content": review_prompt})

        filename = f"{EXPERIMENT}/{VERSION}_review_step_{step_details.get('id')}_r{rejection_index}.md"

        for attempt in range(2):  # couple of tries to get valid JSON
            response_text, token_usage, duration = self.stream_ai_response(messages=reviewer_memory)
            reviewer_memory.append({"role": "assistant", "content": response_text})
            save_conversation(
                messages=reviewer_memory, 
                filename=filename,
                token_usage=token_usage,
                duration=duration
            )

            parsed = self._parse_json_safely(response_text)
            if parsed is not None and isinstance(parsed, dict):
                decision = (parsed.get("review_decision") or "").lower().strip()
                # basic shape check
                if decision in ("approved", "rejected"):
                    return parsed, response_text

            # Ask the planner to re-send strictly valid JSON
            fix_msg = (
                "Your previous message was not a single valid JSON object following the review schema. "
                "Please respond with ONLY one JSON object, no prose, using exactly one of:\n"
                '{"review_decision":"approved"}\n'
                'OR\n'
                '{"review_decision":"rejected","feedback":"...","files_to_revise":["path1","path2"]}'
            )
            #TODO change to euphemeral memory
            reviewer_memory.append({"role": "user", "content": fix_msg})

        return None, response_text

    def _build_planner_review_prompt_with_history(
        self,
        current_step: Dict[str, Any],
        artifacts: List[Dict[str, Any]],
        feedback_history: List[Dict[str, Any]],
        change_history: List[Dict[str, str]]
    ) -> str:
        """Augment the planner review prompt with scoped history (feedback + commits)."""
        base_prompt = self.prompt_builder.build_planner_review_prompt(current_step=current_step, artifacts=artifacts)

        # Build scoped history sections (review-only)
        fb_lines = []
        for f in feedback_history:
            fb_lines.append(f"- Round {f.get('round')}: files={f.get('files_to_revise', [])}\n  {f.get('feedback','').strip()}")

        ch_lines = []
        for i, ch in enumerate(change_history, start=1):
            t = ch.get("title", "")
            s = ch.get("summary", "")
            imp = ch.get("implementation", "")
            ch_lines.append(f"- Commit {i}: {t}\n  {s}\n  {imp[:200]}")

        scoped_block = "\n\n## Review Cycle Context (for reference)\n"
        if fb_lines:
            scoped_block += "### Prior Planner Feedback\n" + "\n".join(fb_lines) + "\n"
        if ch_lines:
            scoped_block += "### Commit Summaries (this review cycle)\n" + "\n".join(ch_lines) + "\n"

        return base_prompt + scoped_block

    def _collect_artifacts(self, paths: List[str]) -> List[Dict[str, Any]]:
        """Fetch current contents for given paths and shape them as artifacts for the planner review prompt."""
        blobs = self._get_current_file_blobs(paths)
        # Map to artifacts (path, sha256, content)
        artifacts = [{"path": b["path"], "content": b["content"]} for b in blobs]
        return artifacts

    @staticmethod
    def _extract_paths_from_report(report_dict: Optional[Dict[str, Any]]) -> List[str]:
        """
        From a final coding attempt report, collect all file paths that were touched.
        Expected shape:
        report_dict["attempts"] = [
            {
                "apply_result": {
                    "results": [{ "path": ..., "status": ...}, ...]
                }
            }, ...
        ]
        """
        if not report_dict:
            return []

        paths: Set[str] = set()

        for attempt in report_dict.get("attempts", []):
            apply_result = attempt.get("apply_result", {})
            for result in apply_result.get("results", []):
                if "path" in result:
                    paths.add(result["path"])

        return sorted(paths)


    @staticmethod
    def _format_cumulative_feedback(feedback_history: List[Dict[str, Any]]) -> str:
        """Join all previous feedback (including the latest) into a single cumulative block."""
        if not feedback_history:
            return ""
        lines = []
        for f in feedback_history:
            round_n = f.get("round")
            files = f.get("files_to_revise", [])
            fb = (f.get("feedback") or "").strip()
            files_line = f" (files: {', '.join(files)})" if files else ""
            lines.append(f"[Round {round_n}]{files_line}\n{fb}")
        return "\n\n".join(lines)

    @staticmethod
    def _parse_json_safely(text: str) -> Optional[Dict[str, Any]]:
        """Attempt to parse a single JSON object from arbitrary model text."""
        text = text.strip()
        # Common case: fenced code block
        fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL | re.IGNORECASE)
        if fence_match:
            try:
                return json.loads(fence_match.group(1))
            except Exception:
                pass
        # Fallback: take largest {...} span
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            candidate = text[start:end+1]
            try:
                return json.loads(candidate)
            except Exception:
                return None
        # Direct parse
        try:
            return json.loads(text)
        except Exception:
            return None
