# file: file_operations_service.py

import os
import logging
import difflib
from typing import Dict, Any, List, Tuple
import subprocess
from pathlib import Path
import shutil
import re
from collections import namedtuple
import json

from diff_parsing import DiffParsingService

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

FileState = namedtuple('FileState', ['exists', 'content'])

class FileOperationsService:
    """
    Service to perform file operations like create, modify, and delete.

    This service is responsible for all interactions with the file system.
    It uses the DiffParsingService to handle the logic of applying modifications.
    """

    def __init__(self, project_root: str):
        """
        Initialize the service.

        Args:
            project_root: The absolute path to the project's root directory.
        """
        self.project_root = project_root
        self.diff_parser = DiffParsingService()
        if not self.project_root or not os.path.isdir(self.project_root):
            raise ValueError("A valid project_root directory must be provided.")

        logger.info(f"FileOperationsService initialized with project root: {self.project_root}")

    def apply_changes(self, changes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
    Applies a series of file changes (create, modify, delete) to the project and reports the results.

    Args:
        changes (List[Dict[str, Any]]): 
            A list of change specifications. 
            Each change dictionary should include:
                - "type" (str): The type of change ("create", "modify", or "delete").
                - "path" (str): The relative file path to apply the change.
                - Additional fields depending on the change type (e.g., "content" for create/modify).

    Returns:
        Dict[str, Any]: A dictionary containing the overall operation result. The structure is as follows:

            If no changes are provided:
                {
                    "status": "failure",
                    "errors": ["No changes were provided."],
                    "results": []
                }

            If some or all changes fail:
                {
                    "status": "failure",
                    "scope": "file",
                    "errors": str,            # Concatenated error messages
                    "error_files": List[str], # Unique list of file paths with errors
                    "results": List[Dict[str, Any]]  # Per-change result details
                }

            If all changes succeed:
                {
                    "status": "success",
                    "results": List[Dict[str, Any]]
                }

            Each element of "results" contains:
                {
                    "index": int,         # Index of the change in the input list
                    "path": str,          # File path associated with the change
                    "type": str,          # Change type ("create", "modify", "delete")
                    "status": str,        # "success", "failure", or "error"
                    "details": Optional[str]  # Error details if applicable
                }

    Raises:
        Exception: Logs and includes in the output if any unexpected errors occur during processing.
    """
        if not changes:
            return {"status": "failure", "errors": ["No changes were provided."], "results": []}

        results = []
        errors = []

        for i, change in enumerate(changes):
            change_type = change.get("type")
            rel_path = change.get("path")
            result_payload = {"index": i, "path": rel_path, "type": change_type}
            
            if not all([change_type, rel_path]):
                error_msg = f"Change #{i} is invalid: missing 'type' or 'path'."
                errors.append({"file_path": rel_path, "error": error_msg})
                results.append({**result_payload, "status": "error", "details": error_msg})
                continue
            
            try:
                full_path = Path(self.project_root) / rel_path
                if change_type == "create":
                    _, error = self._process_create(full_path, change)
                elif change_type == "modify":
                    _, error = self._process_modify(full_path, change, i)
                elif change_type == "delete":
                    _, error = self._process_delete(full_path)
                else:
                    error = f"Unknown change type: {change_type}"

                if error:
                    errors.append({"file_path": rel_path, "error": error})
                    results.append({**result_payload, "status": "failure", "details": error})
                else:
                    results.append({**result_payload, "status": "success"})

            except Exception as e:
                logger.exception(f"Unexpected error processing change #{i} for path {rel_path}")
                error_msg = f"System error: {str(e)}"
                errors.append({"file_path": rel_path, "error": error_msg})
                results.append({**result_payload, "status": "error", "details": error_msg})
        
        if errors:
            error_files: List[str] = [e.get("file_path") for e in errors if isinstance(e, dict) and e.get("file_path")]
            error_strings: str = "\n".join(e.get("error", "") for e in errors if isinstance(e, dict))
            return {
                "status": "failure",
                "scope": "file",
                "errors": error_strings, 
                "error_files": list(set(error_files)),
                "results": results
            }
        
        syntax_result = self._check_project_syntax()
        #return {"status": "success", "results": results}
        if syntax_result["success"]:
            return {"status": "success", "results": results}
        
        logger.warning("Project syntax check failed.")
        project_errors = syntax_result["errors"]
        syntax_error_files = self._extract_error_files(str(project_errors))

        for result in results:
            if result["status"] == "success" and result["path"] in syntax_error_files:
                result["status"] = "failure"
                result["details"] = "Change was applied but the file contains compilation errors. For fixing assume the previous changes were applied and treat the file contents as new."
        
        return {
            "status": "failure",
            "scope": "project",
            "errors": project_errors,
            "error_files": list(syntax_error_files),
            "results": results
        }
    
    def _capture_file_state(self, rel_path: str) -> FileState:
        """Capture current state of a file."""
        full_path = Path(self.project_root) / rel_path
        exists = full_path.exists()
        content = None
        if exists and full_path.is_file():
            try:
                content = full_path.read_text(encoding="utf-8")
            except Exception as e:
                logger.error(f"Error reading file {rel_path} for state capture: {e}")
                content = '' # Return empty content if read fails to avoid None issues
        return FileState(exists, content)

    def _restore_file_state(self, rel_path: str, state: FileState):
        """Restore a file to its captured original state."""
        full_path = Path(self.project_root) / rel_path
        logger.info(f"Restoring file: {rel_path} to original state (exists={state.exists})")
        try:
            if state.exists:
                # If the file originally existed, restore its content.
                full_path.parent.mkdir(parents=True, exist_ok=True)
                full_path.write_text(state.content or '', encoding="utf-8")
            elif full_path.exists():
                # If the file did NOT originally exist but was created, delete it.
                full_path.unlink()
            # If the file didn't exist and still doesn't, do nothing.
        except Exception as e:
            logger.error(f"Error restoring file {rel_path}: {e}")
            raise # Re-raise to be caught by the critical error handler

    def _extract_error_files(self, tsc_errors: str) -> set:
        """
        Extract file paths from TypeScript compiler errors.
        """
        error_files = set()
        pattern = re.compile(r'^(.*\.(?:ts|tsx|js|jsx))\((\d+),(\d+)\):\s+error TS\d+:')
        
        for line in tsc_errors.splitlines():
            match = pattern.match(line.strip())
            if match:
                # The first group is the file path.
                file_path = match.group(1)
                try:
                    # Normalize the path to be relative from the project root.
                    abs_path = Path(self.project_root) / file_path
                    if abs_path.exists():
                         # Make path relative to the project root for consistency
                        rel_path = abs_path.relative_to(self.project_root)
                        error_files.add(rel_path.as_posix())
                    else:
                        error_files.add(Path(file_path).as_posix()) # Add as is if path resolution is tricky
                except Exception:
                    error_files.add(Path(file_path).as_posix())
        
        return error_files

    def _process_create(self, path: Path, change: Dict) -> Tuple[Dict, str]:
        content = change.get("content")
        if content is None:
            return {}, "Create operation missing 'content' field."
        
        try:          
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
            return {}, ""
        except Exception as e:
            return {}, f"Failed to write file: {e}"

    def _process_modify(self, path: Path, change: Dict, change_number: int) -> Tuple[Dict, str]:
        diffs = change.get("differences")
        if not diffs:
            logger.warning(f"Modify operation {change_number + 1} missing 'differences' field.")
            # Instead of returning an error we will pass it as sucess because soemtimes the AI does a verification run without any changes.
            return {}, ""

        if not path.exists():
            return {}, "File to modify does not exist."

        try:
            original_content = path.read_text(encoding="utf-8")
            combined_diff = "\n".join(diffs)
            result = self.diff_parser.apply_diff_to_content(original_content=original_content, diff_content=combined_diff, is_final=True)
            
            if not result.get("success"):
                return {}, result.get("error_message")
            
            new_content = result.get("content")
            path.write_text(new_content, encoding="utf-8")
            self._write_diff_file(abs_path=str(path), original_content=original_content, new_content=new_content)
            return {}, ""
        except Exception as e:
            logger.exception(f"Failed to apply modification: {e}")
            return {}, f"Failed to apply modification for file {path.name}: {e}"
    
    def _write_diff_file(self, abs_path: str, original_content: str, new_content: str) -> str:
        original_lines = original_content.splitlines(keepends=True)
        new_lines = new_content.splitlines(keepends=True)
        diff_lines = difflib.unified_diff(
            original_lines, new_lines,
            fromfile=f"{abs_path} (original)", tofile=f"{abs_path} (modified)", lineterm='\n'
        )
        diff_text = "".join(diff_lines)
        diff_file_path = abs_path + ".diff"
        with open(diff_file_path, 'w', encoding="utf-8") as df:
            df.write(diff_text)
        logger.info(f"Diff file saved at: {diff_file_path}")
        return diff_file_path
    
    def _process_delete(self, path: Path) -> Tuple[Dict, str]:
        if not path.exists():
            logger.warning(f"Attempted to delete non-existent file: {path}")
            return {"details": "File did not exist, no action taken."}, ""
        try:
            os.remove(str(path))
            return {}, ""
        except Exception as e:
            return {}, f"Failed to delete file: {e}"
    
    def _check_project_syntax(self) -> dict:
        # Use npx to ensure the project's version of typescript is used
        tsc_command = shutil.which("npx")
        if not tsc_command:
            return {"success": False, "errors": "Could not find 'npx' in PATH. Please ensure Node.js is installed."}
        
        # Command arguments for running tsc via npx
        cmd = [tsc_command, "tsc", "-b", "--noEmit", "--pretty", "false"]
        
        try:
            logger.info(f"Running project syntax check with command: {' '.join(cmd)}")
            result = subprocess.run(cmd, cwd=self.project_root, check=True, capture_output=True, text=True, encoding='utf-8')
            return {"success": True, "errors": ""}
        except subprocess.CalledProcessError as e:
            # Combine stderr and stdout for a complete error picture
            error_output = (e.stderr or "") + (e.stdout or "")
            logger.warning(f"Syntax check failed with output:\n{error_output}")
            return {"success": False, "errors": error_output}
        except FileNotFoundError:
            return {"success": False, "errors": "Command 'npx' not found. Is Node.js installed and in your PATH?"}
        
if __name__ == "__main__":
    service = FileOperationsService(project_root="../app_template/react-app")
    result = service._check_project_syntax()
    print(json.dumps(result.get("errors"), indent=2, ensure_ascii=False))