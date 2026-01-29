import os
import logging
import json
from project_analyzer import ProjectAnalyzerService
from typing import Dict, Any, Tuple, List
import os
from dotenv import load_dotenv
from utils import OrchestratorState, format_history_lines, format_file_blobs, stringify_errors, summarize_lint_and_syntax
from logging_service import check_project_lint, check_project_syntax

load_dotenv()

MAX_RETRIES = int(os.getenv("MAX_RETRIES", 3))

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PromptBuilder:
    """
    A service for building prompts with project analysis and dependency graph information.
    """
    
    def __init__(self, project_root: str):
        """
        Initialize the PromptBuilder service.
        
        Args:
            project_root (str): The root directory of the project to analyze
            
        Raises:
            ValueError: If project_root is not provided or doesn't exist
        """
        if not project_root:
            raise ValueError("project_root parameter is mandatory")
            
        if not os.path.exists(project_root):
            raise ValueError(f"Project root directory does not exist: {project_root}")
            
        self.project_root = project_root
        self.analyzer = ProjectAnalyzerService(project_root=project_root)

        # Configure system prompt paths for different modes
        self.system_prompt_paths = {
            OrchestratorState.PLANNING: os.getenv('PLANNING_SYSTEM_PROMPT_PATH', './prompts/system_planner.md'),
            OrchestratorState.REVIEWING: os.getenv('PLANNING_SYSTEM_PROMPT_PATH', './prompts/system_planner.md'),
            OrchestratorState.CODING: os.getenv('CODING_SYSTEM_PROMPT_PATH', './prompts/system_coder.md')
        }
        
        logger.info(f"PromptBuilder initialized with project root: {project_root}")
        logger.info(f"System prompt paths configured: {self.system_prompt_paths}")
    
    def load_system_prompt(self, state: OrchestratorState) -> str:
        """
        Load the system prompt for the specified mode.
        
        Args:
            mode (Mode): The mode to load the system prompt for
            
        Returns:
            str: The content of the system prompt file for the specified mode
            
        Raises:
            ValueError: If the mode is not supported
            FileNotFoundError: If the system prompt file doesn't exist
            PermissionError: If there are permission issues reading the file
            Exception: For any other unexpected errors
        """
        if state not in self.system_prompt_paths:
            raise ValueError(f"Unsupported state: {state}. Supported modes: {list(self.system_prompt_paths.keys())}")
        
        prompt_path = self.system_prompt_paths[state]
        
        try:
            if not os.path.exists(prompt_path):
                logger.error(f"System prompt file not found for {state.value}: {prompt_path}")
                raise FileNotFoundError(f"Error: The system prompt file for {state.value} mode '{prompt_path}' does not exist.")

            with open(prompt_path, "r", encoding="utf-8") as file:
                system_prompt = file.read()
                logger.info(f"Loaded {state.value} system prompt from {prompt_path} ({len(system_prompt)} chars)")
                return system_prompt

        except FileNotFoundError as e:
            logger.exception(f"{state.value} system prompt file not found")
            raise
        except PermissionError:
            logger.exception(f"Permission denied when trying to read {state.value} system prompt")
            raise
        except Exception as e:
            logger.exception(f"Unexpected error loading {state.value} system prompt")
            raise

    def build_coder_prompt_for_step(
    self,
    plan: Dict[str, Any],
    current_step: Dict[str, Any],
    guidelines: str,
    file_blobs: List[dict]
    ) -> Tuple[str, str]:
        """
        Enhances the user's base prompt with a multi-faceted view of the project,
        including file structure, dependencies, and inter-file connections.
        """
        # ------------------------------------------------------------------
        # 1. Extract plan-level information
        # ------------------------------------------------------------------
        plan_summary: str = self._summarize_plan_to_markdown(plan)
        all_steps = plan.get('steps', [])
        step_count = len(all_steps)
        current_step_id = current_step.get('id')

        # ------------------------------------------------------------------
        # 2. Partition steps into Past, Current, and Future
        # ------------------------------------------------------------------
        
        # Format Previously Done Steps
        # We check for steps with an ID lower than the current one
        past_steps_list = [s for s in all_steps if s['id'] < current_step_id]
        if past_steps_list:
            past_steps_str = "\n".join(
                [f"- [x] Step {s['id']}: {s['title']}" for s in past_steps_list]
            )
        else:
            past_steps_str = "- None (This is the first step)"

        # Format Current Step
        step_description = self._format_step(step=current_step, step_count=step_count)

        # Format Future Steps
        # We check for steps with an ID higher than the current one
        future_steps_list = [s for s in all_steps if s['id'] > current_step_id]
        if future_steps_list:
            # Including description here is useful so the coder knows where the architecture is heading
            future_steps_str = "\n".join(
                [f"- [ ] Step {s['id']}: {s['title']} - {s['description']}" for s in future_steps_list]
            )
        else:
            future_steps_str = "- None (This is the final step)"

        prefetched_content = format_file_blobs(file_blobs)
        # ------------------------------------------------------------------
        # 3. Pull project context
        # ------------------------------------------------------------------
        (
            project_tree_str,
            dependency_graph_str,
            dependencies_str,
            dev_dependencies_str,
        ) = self._get_project_context()

        # ------------------------------------------------------------------
        # 4. Assemble final prompt
        # ------------------------------------------------------------------

        enhanced_prompt = f"""
# Project context & constraints

* Tech: React **18**, Tailwind CSS **4.1.3**, Vite **6.2.0**, React Router **7.5.0**.
* App runs at `http://localhost:5173` (via `npm run dev`).
* Frontend only: components, hooks, routes, styles, small utilities. **No external libraries** beyond what’s stated.
* Prefer semantic HTML, accessible keyboard order, responsive Tailwind utilities.
* Use clean file paths under `src/` (e.g., `src/pages/*`, `src/components/*`, `src/data/*`).

## File Tree
{project_tree_str}

## Dependency Graph
{dependency_graph_str}

## Repo inbstalled dependencies:
* Dependencies: {dependencies_str}
* Dev Dependencies: {dev_dependencies_str}

## Coding Guidelines:
* You do not need to import React when using JSX, as long as your build setup supports the new JSX transform.
Import hooks directly when needed: `import {{useState}} from 'react';`
* All code must be strictly typed. Never use `any`. 
* Export Conventions:
  *   Components & Hooks: Use `export default` for all React components, Pages, and Hooks. This ensures consistent naming upon import and facilitates code splitting.
  *   Utilities & Types: Use named exports for helper functions, constants, and TypeScript interfaces/types.
* Use https://picsum.photos/400/300?random=... for placeholder images.
* Libraries:
  * Use Heroicons v2: use imports from '@heroicons/react/24/solid'; Example: import {{Bars3Icon, XMarkIcon}} from '@heroicons/react/24/solid';
  * Github, Twitter and Linkedin Icons are imported from 'lucide-react';

{guidelines}
    """
        
        current_task = f"""
## Overall plan overview:
{plan.get('overview')}

## Plan Progress

### Previously Executed Steps
These steps have already been completed by you. Assume the code for these exists.
{past_steps_str}

### Future Steps (To Be Done)
{future_steps_str}

{step_description}

### Pre-fetched content of relevant files:
IMPORTANT: If you need the contents of a file that is not listed in these files, you MUST first fetch its content using the fetch_files tool.
{prefetched_content}
"""
        return enhanced_prompt.strip(), current_task.strip()
    
    def build_user_prompt(self, base_prompt: str, change_history: str) -> str:
        """
        Enhances the user's base prompt with a multi-faceted view of the project,
        including file structure, dependencies, and inter-file connections.
        """
        # --- 1. Gather All Contexts Gracefully ---
        project_tree_str, dependency_graph_str, dependencies_str, dev_dependencies_str = self._get_project_context()

        previous_implementations = ""

        if change_history != "(none)":
            previous_implementations= f"""
            ### 4. Previous Coder commits:
            The following is a compact history of previous Coder Implementations in this project:
            {change_history}
"""
        # --- 2. Construct the Enhanced Prompt ---

        enhanced_prompt = f"""
        ## Project Context

        ### File Tree
        {project_tree_str}

        ### Dependency Graph
        {dependency_graph_str}

        ### Installed dependencies:
        * Dependencies: {dependencies_str}
        * Dev Dependencies: {dev_dependencies_str}

        {previous_implementations}

"""
        return enhanced_prompt.strip()
    
    def build_invalid_JSON_fixing_prompt(self, error_details: str) -> str:
        """
        Builds a concise prompt to instruct the model to fix its last malformed response,
        assuming the faulty response is already in the conversation history.

        Args:
            error_details: The specific error message from the VerificationService.

        Returns:
            A string containing the complete error-fixing prompt.
        """
        prompt_lines = [
            "SYSTEM: ATTENTION - Your previous response was not a valid JSON tool call and failed verification.",
            f"The specific error was: **{error_details}**",
            "",
            "Please review your last message and provide a corrected and valid JSON tool call.",
            "Your response MUST be a single, valid JSON object that strictly adheres to the structure provided by the system. Do NOT add any explanations, apologies, or conversational text before or after the JSON object."
        ]
        return "\n".join(prompt_lines)
    
    def build_orchestrator_report_review_repair(
            self,
            file_blobs: List[Dict[str, str]],
            review: Dict[str, Any]
    ) -> str:
        """
        Narrow, authoritative prompt instructing the Coder to address Reviewer feedback
        by modifying only the specified files, with current content attached.
        """
        feedback = review.get("feedback", "")

        # current contents for scoped files
        files_text = format_file_blobs(file_blobs)

        prompt = f"""
Your previous implementation was subject to review and was rejected. Feedback:
{feedback}

## Pre-fetched contents of files the Reviewer requested to modify:
{files_text}

## Workflow:
1. Understand the review and address it only
2. Do not reimplement the whole step from scratch, address only the review
3. Think well, plan the set of changes needed and address the review.
"""
        return prompt
    
    def build_orchestrator_report_build_repair(
        self,
        *,
        step_id: str,
        txn_id: str,
        change_history: List[Dict[str, str]],
        applied_paths: List[str],
        tsc_error_files: List[str],
        tsc_errors: Any,
        file_blobs: List[Dict[str, str]]
    ) -> str:
        """
        Build a *single* user message for TypeScript build errors after partial apply.
        Restricts SCOPE to just the files the compiler referenced.
        """
        history_lines = format_history_lines(change_history)
        applied_str = "\n  - " + "\n  - ".join(sorted(set(applied_paths))) if applied_paths else " (none)"
        scope_paths_str = "\n  - " + "\n  - ".join(sorted(set(tsc_error_files))) if tsc_error_files else " (none)"
        files_text = format_file_blobs(file_blobs)
        project_tree_str, dependency_graph_str, _, _ = self._get_project_context()

        return (
            f"REPAIR MODE: BUILD (TypeScript compile errors)\n\n"
            f"STEP: {step_id} • TXN: {txn_id}\n"
            f"WHAT HAPPENED:\n"
            f"- Prior changes were applied to the workspace (see paths):{applied_str}\n"
            f"- Then we ran: tsc --b --noEmit\n\n"
            f"TSC OUTPUT (relevant excerpts):\n{stringify_errors(tsc_errors)}\n\n"
            f"CONSTRAINTS:\n"
            f"- SCOPE: Modify only the following files to resolve the compiler errors:\n{scope_paths_str}\n"
            f"- Return exactly one valid JSON tool call using the schema provided by the system.\n"
            f"- Prefer minimal changes that resolve the errors; preserve public APIs unless necessary.\n"
            f"- Avoid creating/deleting files unless essential; prefer 'modify'.\n"
            f"- If you do not have the contents of files and you need to know how they are implemented for example props or interfaces use the following project structure to fetch the necessary files needed using the `fetch_files` tool.\n"
            f"\n"
            f"Current Project File Structure:\n {project_tree_str}\n"
            # f"### 2. File Interconnections (Dependency Graph) \nThis shows you HOW files are connected via imports/exports. Use this to trace the impact of a change and identify which files need to be modified. \n"
            # f"```json\n {dependency_graph_str} \n```\n"
            f"FILES:\n"
            f"{files_text}\n"
            # f"Final Instructions: Analyze the provided file structure above and determine the set of files you need to fetch. If files are dependant on other files, fetch both of them.\n"
        )

    def build_orchestrator_report_edit_repair(
        self,
        *,
        step_id: str,
        txn_id: str,
        applied_paths: List[str],
        failed_paths: List[str],
        errors: Any
    ) -> str:
        """
        Build a *single* user message that:
          - Explains what happened
          - Restricts SCOPE to the failed files
          - Provides current file content for those files
          - Requires one valid JSON tool call
        """
        applied_str = "\n  - " + "\n  - ".join(sorted(set(applied_paths))) if applied_paths else " (none)"
        failed_str = "\n  - " + "\n  - ".join(sorted(set(failed_paths))) if failed_paths else " (none)"
        scope_paths_str = "\n  - " + "\n  - ".join(sorted(set(failed_paths))) if failed_paths else ""

        return (
            f"""
ERROR NOTICE: The previous write_to_files request failed validation.

WHAT HAPPENED:
- Applied (in prior attempt):{applied_str}
- Failed validation / not applied:{failed_str}
Validator message:
{stringify_errors(errors)}
Please regenerate exactly ONE JSON `write_to_files` tool call (no extra text). Follow these rules precisely:

1. For each file to modify produce exactly one `differences` entry containing a single SEARCH/REPLACE block with these markers on their own lines:
   <<<<<<< SEARCH
   <exact original code as it appears in the fetched file — byte-for-byte match>
   =======
   <replacement code>
   >>>>>>> REPLACE

2. The SEARCH block MUST match the fetched file content exactly (including whitespace and punctuation). If you are not sure of the exact original text, fetch the file first using the provided `fetch_files` tool and then construct the SEARCH block from that response.
3. Only modify the target lines — keep the surrounding code exactly as in the fetched file within the SEARCH block so the validator can match it.
4. Do not include extra `>>>>>>> REPLACE` lines or duplicate markers. Use exactly one `<<<<<<< SEARCH`, one `=======`, and one `>>>>>>> REPLACE` per `differences` string.
5. Return exactly one valid JSON tool call object using the schema the system expects and nothing else. The `changes` array should be an array of `modify` entries with `path` and `differences` strings as above.
6. If SEARCH block is not found in original content. It is most probably you modified a file without getting it's latest contents. You MUST fetch the contents of these files using the `fetch_files` tool before remodifiyng them.

            """
        )
    
    def build_planner_review_prompt(self, current_step: Dict[str, Any], artifacts: List[Dict[str, Any]]) -> str:
        def _files_block():
            if not artifacts:
                return "No files were created or modified."
            blocks = []
            for a in artifacts:
                blocks.append(
                    f"FILE: {a['path']} (sha256: {a['sha256']})\n"
                    f"```tsx\n{a['content']}\n```\n"
                )
            return "\n".join(blocks)

        files_text = _files_block()

        return f"""
# Step Implementation Review
You are now to review the coder's attempt to complete step {current_step.get('id')}

## Completed Step Details:
**Step Title:** {current_step.get('title', 'Untitled step')}
**Step Description:** {current_step.get('description', 'No description provided')}
**Acceptance criteria:** {current_step.get('acceptance_criteria', 'No acceptance criteria specified for the step')}

## Coder's Implementation (Final file contents from this step):
{files_text}

## Review Instructions:
Please review the completed implementation and decide whether to:

1. **APPROVE** - The implementation meets requirements and execution was successful
2. **REJECT** - The implementation needs changes or doesn't meet requirements

### If APPROVING:
Respond exactly with:
{{"review_decision": "approved"}}

### If REJECTING:
Respond exactly with:
{{"review_decision": "rejected", "feedback": "<Detailed explanation of required changes>", "files_to_revise": ["<List of files>"]}}

Before approving, answer internally:
1) Does the implementation finish the step?
2) Is the implementation complete and free of placeholders?
3) Is the component styled with Tailwind CSS appropriately?
4) Is the logic correct?
5) Is the UI placed well and visually appealing?
6) Are accessibility concerns addressed (ARIA, alt, etc.)?
7) For forms, is validation present?

You must respond with a single valid JSON object.
"""
    
    def build_review_prompt(self, step_details: dict, plan: dict) -> str:
        """Build the review prompt for the planner."""
    
        all_steps = plan.get('steps', [])
        current_step_id = step_details.get('id')
        # ------------------------------------------------------------------
        # 2. Partition steps into Past, Current, and Future
        # ------------------------------------------------------------------
        
        # Format Previously Done Steps
        # We check for steps with an ID lower than the current one
        past_steps_list = [s for s in all_steps if s['id'] < current_step_id]
        if past_steps_list:
            past_steps_str = "\n".join(
                [f"- [x] Step {s['id']}: {s['title']}" for s in past_steps_list]
            )
        else:
            past_steps_str = "- None (This is the first step)"

        # Format Future Steps
        # We check for steps with an ID higher than the current one
        future_steps_list = [s for s in all_steps if s['id'] > current_step_id]
        if future_steps_list:
            # Including description here is useful so the coder knows where the architecture is heading
            future_steps_str = "\n".join(
                [f"- [ ] Step {s['id']}: {s['title']} - {s['description']}" for s in future_steps_list]
            )
        else:
            future_steps_str = "- None (This is the final step)"

        # ------------------------------------------------------------------
        # 3. Pull project context
        # ------------------------------------------------------------------
        (
            project_tree_str,
            dependency_graph_str,
            dependencies_str,
            dev_dependencies_str,
        ) = self._get_project_context()

        prompt = f"""
You are POKIO-Reviewer, an expert senior frontend architect specializing in React (TypeScript) with deep knowledge of design systems, responsive layouts, accessibility, and scalable code organization.

You collaborate with:
- POKIO-Planner (creates the step-by-step plan)
- POKIO-Coder (implements the plan)

Your job: review POKIO-Coder’s implementation for a single step and decide whether it should be approved or rejected.

You will be given:
- The step description
- The step acceptance criteria
- The implemented/changed files for this step (full contents)

NOTE: All implemented/changed files have passed verification by linters and compilers.

## Review Goals
Assess the implementation against the step’s description and acceptance criteria across these dimensions:

1) Visuals and UI
- Layout quality, spacing, typography, responsiveness, consistency with any design system conventions
- Tailwind usage sanity (no brittle magic numbers unless justified)
- Component composition and reuse where appropriate

2) Logic
- Correctness, edge cases, performance concerns, and state transitions
- Data flow clarity (props/state), predictable behavior, no unnecessary re-renders

3) Completeness
- Every acceptance criterion is addressed
- No missing states (loading/empty/error) if required by the step
- No partially wired UI (dead buttons, unfinished handlers) unless explicitly allowed

4) Accessibility (high priority)
- Semantic HTML first (nav, main, header, footer, button, a exist — avoid clickable div/span)
- Keyboard navigation works for all interactive elements (Tab reach, Enter/Space activate, no traps, ESC button works)
- Focus management for dialogs/menus/popovers (focus moves in on open, is trapped, returns on close)
- Proper labels and alt text (label/aria-label/aria-labelledby for controls, alt for meaningful images)
- Color contrast awareness (flag low-contrast text, gray-on-gray, color-only indicators)

5) React + TypeScript Best Practices
- Proper hooks usage (deps, memoization only when needed)
- Avoids stale closures and effect pitfalls
- Sensible component boundaries

## Review Process
1) Read the step description and acceptance criteria carefully.
2) Review each file provided, line by line, mapping behavior to acceptance criteria.
3) Identify issues and classify severity:
- High: broken functionality, missing acceptance criteria, major a11y violation, security concern, runtime error
- Medium: incorrect edge case, significant UX flaw, poor structure that will cause maintenance pain, inconsitent UI (e.g., mismatched spacing, colors, typography, components behaving differently in similar contexts, inconsistent labels, or conflicting interaction patterns that confuse users).
- Low: stylistic polish, minor refactor, small improvements

4) Decide:
- APPROVE if all acceptance criteria are met and no issues are found.
- REJECT if any acceptance criterion is not met, or any other issues are found.

## Response Rules (STRICT)
- Output must be exactly ONE JSON object.
- Do NOT output any additional text before or after the JSON.
- Do NOT add extra keys beyond the schema below.

### Output Schema
If APPROVING, respond exactly with:
{{
  "thinking": "concise internal rationale, referencing acceptance criteria",
  "review_decision": "approved"
}}

If REJECTING, respond exactly with:
{{
  "thinking": "concise internal rationale, referencing acceptance criteria and key issues",
  "review_decision": "rejected",
  "feedback": "Detailed, actionable explanation of required changes. Group by severity. Include concrete suggestions (what to change and where).",
  "files_to_revise": ["path/to/file1.tsx", "path/to/file2.ts", "..."]
}}

## Feedback Guidelines (when rejecting)
- Be direct and constructive.
- Prefer specific, testable instructions over vague advice.
- Reference acceptance criteria explicitly (e.g., “AC-2 not met: …”).
- If you suggest UI changes, describe expected behavior precisely.
- Mention any accessibility issues found.
- Keep “files_to_revise” limited to files that must change.

# Project Context

## File Tree
{project_tree_str}

## Project installed dependencies:
{dependencies_str}
{dev_dependencies_str}

# POKIO-Planner's overall plan overview:
{plan.get('overview')}

## Plan Progress

### Previously Executed Steps
{past_steps_str}

### Future Steps (To Be Done)
{future_steps_str}
"""

        return prompt
    
    def _get_project_context(self) -> Tuple[str, str, str, str]:
        # Get the project tree structure
        project_tree_str = "Context: Project file tree is not available."
        try:
            tree_result = self.analyzer.get_project_tree()
            if tree_result.get("result", {}).get("status") == "success":
                project_tree_str = tree_result["result"]["tree_markdown"]
            else:
                logger.warning("Could not build project tree.")
        except Exception as e:
            logger.warning(f"Exception building project tree: {e}")

        # Get the dependency graph
        dependency_graph_str = "Context: Dependency graph is not available."
        try:
            graph_result = self.analyzer.build_dependency_graph()
            if graph_result.get("result", {}).get("status") == "success":
                dependency_graph_str = graph_result["result"]["graph_markdown"]
            else:
                logger.warning("Could not build dependency graph.")
        except Exception as e:
            logger.warning(f"Exception building dependency graph: {e}")

        # Get package.json dependencies (formatted concisely)
        dependencies_str = "Not available."
        dev_dependencies_str = "Not available."
        # (Code for this part remains the same as previous answer)
        try:
            deps_result = self.analyzer.read_package_dependencies()
            if deps_result.get("result", {}).get("status") == "success":
                deps = deps_result["result"].get("dependencies", {})
                dev_deps = deps_result["result"].get("devDependencies", {})
                dependencies_str = ", ".join(deps.keys()) if deps else "None"
                dev_dependencies_str = ", ".join(dev_deps.keys()) if dev_deps else "None"

            return project_tree_str, dependency_graph_str, dependencies_str, dev_dependencies_str
        except Exception:
            pass # Ignore errors, the default value will be used

    def build_single_agent_prompt(self, base_prompt: str, change_history: str) -> str:
        """
        Enhances the user's base prompt with a multi-faceted view of the project,
        including file structure, dependencies, and inter-file connections.
        """
        # --- 1. Gather All Contexts Gracefully ---
        project_tree_str, dependency_graph_str, dependencies_str, dev_dependencies_str = self._get_project_context()

        previous_implementations = ""

        if change_history != "(none)":
            previous_implementations= f"""
            ### 4. Previous commits:
            The following is a compact history of previous implementations in this project:
            {change_history}
"""
        # --- 2. Construct the Enhanced Prompt ---

        enhanced_prompt = f"""
        ## Project Context

        ### File Tree
        {project_tree_str}

        ### Dependency Graph
        {dependency_graph_str}

        ### Repo inbstalled dependencies:
        * Dependencies: {dependencies_str}
        * Dev Dependencies: {dev_dependencies_str}

        {previous_implementations}
        
        ## TASK: What you must produce
        "{base_prompt}"

        1. **Plan** — first, list the *minimal* set of files you will read to implement this change, and why each is needed. In your plan include how you will implement each feature/component,
        every component must be fully functional and accessible. If the request mentioned page creations, pages must be filled with content and not have any placeholder content.
        2. **Fetch** — then call `fetch_files` to obtain those files. (You must only fetch files you listed.)
        3. Fully implement the user's request in a visually stunning and production ready applciation in a single ``write_to_files`` tool call that includes all file operations.
"""
        
        return enhanced_prompt.strip()
    
    def _format_step(self, step: Dict[str, Any], step_count: int) -> str:
        step_id = step.get('id', 'N/A')
        step_title = step.get('title', 'N/A')
        step_description = step.get('description', 'N/A')
        expected_files = step.get('expected_files', [])
        requires = step.get('requires', [])
        acceptance_criteria = step.get('acceptance_criteria', "")

        files_str = {''.join(f'- `{f}`\n' for f in expected_files) or '- None\n'}
        requires_str = {''.join(f'- `{r}`\n' for r in requires) or '- None\n'}

        md = f"""
        ## Step {step_id}/{step_count}: {step_title}

        **Description:**  
        {step_description}

        **Files that must be produced in this step:**  
        {files_str}

        **Acceptance Criteria:**  
        {acceptance_criteria}

        ## Task:
        Fully implement the step in one single `write_to_files` tool call.
        """
        return md
    
    def _safe_str(self, value: Any) -> str:
        """Return a trimmed string for common types, empty string for None."""
        if value is None:
            return ""
        if isinstance(value, str):
            return value.replace("\r", "").strip()
        return str(value)


    def _summarize_plan_to_markdown(self, plan: Dict[str, Any]) -> str:
        """
        Convert a plan dict (see user format) into a markdown summary string.

        The markdown will contain:
        - H1 header with the plan title
        - A bold "Overview" label followed by the overview paragraph
        - For each step, a "### {id}. {title}" header then the description text

        Robustness:
        - Missing plan_title or overview are replaced with placeholders.
        - Steps are sorted by numeric `id` when all ids are numeric; otherwise preserved order.
        - If a step lacks id/title/description, a placeholder is used for that field.

        Args:
            plan: dict following the structure specified by the user.

        Returns:
            A string containing the markdown summary.
        """
        plan_title = self._safe_str(plan.get("plan_title")) or "Untitled Plan"
        overview = self._safe_str(plan.get("overview")) or "_No overview provided._"

        steps_raw: List[Dict[str, Any]] = plan.get("steps") or []
        # Normalize steps to a list of dicts
        steps: List[Dict[str, Any]] = []
        for s in steps_raw:
            if not isinstance(s, dict):
                continue
            steps.append(s)

        # Attempt numeric sort by id if possible
        def _id_key(step: Dict[str, Any]):
            sid = step.get("id")
            try:
                return (0, int(sid))
            except Exception:
                # preserve insertion order by returning large sentinel for non-numeric
                return (1, 0)

        # sort but keep relative order for non-numeric IDs
        steps_sorted = sorted(steps, key=_id_key)

        md_lines: List[str] = []
        md_lines.append(f"# {plan_title}")
        md_lines.append("")  # blank line
        md_lines.append("**Overview**")
        md_lines.append("")  # blank line
        md_lines.append(overview)
        md_lines.append("")  # blank line

        if not steps_sorted:
            md_lines.append("_No steps provided._")
        else:
            for step in steps_sorted:
                sid = step.get("id")
                # If id is None, try to use index-like placeholder
                sid_display = self._safe_str(sid) or "-"
                title = self._safe_str(step.get("title")) or "Untitled step"
                description = self._safe_str(step.get("description")) or "_No description provided._"

                # Use a level-3 header for each step: "### id. title"
                md_lines.append(f"### {sid_display}. {title}")
                md_lines.append("")  # blank line
                md_lines.append(description)
                md_lines.append("")  # blank line between steps

        return "\n".join(md_lines)