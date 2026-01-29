import os
from dotenv import load_dotenv
from typing import Dict, Any, Optional, Tuple
from pathlib import Path
import subprocess
import logging
import shutil
import re

load_dotenv()

VERSION = os.getenv("VERSION")
EXPERIMENT = os.getenv("EXPERIMENT")
PROJECT_ROOT = os.getenv("PROJECT_ROOT")
PROJECT_ROOT = Path(PROJECT_ROOT).resolve()

LOGS_DIR = f"{EXPERIMENT}/{VERSION}_logs"
if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

# Dedicated file for token usage
TOKEN_LOG_FILE = os.path.join(LOGS_DIR, "token_usage.log")

logger = logging.getLogger(__name__)

def log_token_usage_final(data: Dict[str, Any]):
    """Appends the final token usage summary for a request to the token log file."""
    with open(TOKEN_LOG_FILE, "a", encoding="utf-8") as f:
        f.write("------------------- REQUEST SUMMARY -------------------\n")
        f.write(f"Request: {data.get('request', 'N/A')}\n")
        f.write(f"Planner Total Token Usage: {data.get('planner_tokens', 0)}\n")
        f.write(f"Coder Total Token Usage: {data.get('coder_tokens', 0)}\n")
        f.write(f"Total Token Usage to Complete Request: {data.get('total_tokens', 0)}\n")
        f.write(f"Total Time Taken: {data.get('total_time', 'N/A')} seconds\n")
        f.write(f"Total Cost: {data.get('total_cost', 0.0):.5f} USD\n")
        f.write("-------------------------------------------------------\n\n")

def log_token_usage_per_call(data: Dict[str, Any]):
    """Appends token usage for a single AI call to the token log file."""
    path = os.path.join(LOGS_DIR, "full_conversation.log")

    with open(path, "a", encoding="utf-8") as f:
        f.write(f"Agent: {data.get('agent_name', 'N/A')}\n")
        f.write(f" - Response: {data.get('response', 'N/A')}\n")
        f.write("------------\n")
        f.write(f" - Tokens: {data.get('tokens', 0)}\n")
        f.write(f" - Duration: {data.get('duration', 0.0):.2f}s\n")
        f.write("\n------------\n")

def log_coder_errors(data: Dict[str, Any]):
    """Appends token usage for a single AI call to the token log file."""
    with open(TOKEN_LOG_FILE, "a", encoding="utf-8") as f:
        f.write("------------------- Coder Errors -------------------\n")
        f.write(f" - Step: {data.get('step', {})} Attempt {data.get('attempt')}\n")
        f.write(f" - TSC errors: {data.get('tsc_errors', 'N/A')}\n")
        f.write(f" - Error Files: {data.get('tsc_error_files', 'N/A')}\n---\n")

def log_review_rejections(data: Dict[str, Any]):
    """Appends token usage for a single AI call to the token log file."""
    with open(TOKEN_LOG_FILE, "a", encoding="utf-8") as f:
        f.write("------------------- Review Feedback -------------------\n")
        f.write(f" - Step: {data.get('step', {})} Round: {data.get('round', -1)}\n")
        f.write(f" - Review Json: {data.get('review_json', {})}\n")
        f.write(f" - Files to revise: {data.get('files_to_revise', 'N/A')}\n---\n")

def check_project_syntax() -> dict:
    """Run TypeScript compiler in check mode and log results to a Markdown file."""
    report_path = Path(LOGS_DIR) / "syntax_report.md"

    # Use npx to ensure the project's version of typescript is used
    tsc_command = shutil.which("npx")
    if not tsc_command:
        error_msg = "Could not find 'npx' in PATH. Please ensure Node.js is installed."
        _write_markdown_report(report_path, [], error_msg)
        return {"success": False, "summary": error_msg, "errors": error_msg, "error_files": []}

    cmd = [tsc_command, "tsc", "-b", "--noEmit", "--pretty", "false"]

    try:
        logger.info(f"Running project syntax check with command: {' '.join(cmd)}")
        result = subprocess.run(
            cmd,
            cwd=PROJECT_ROOT,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )

        # Write success report
        summary = "✅ No syntax errors found."
        _write_markdown_report(report_path, [], summary)
        return {"summary": summary, "errors": [], "error_files": []}

    except subprocess.CalledProcessError as e:
        error_output = (e.stderr or "") + (e.stdout or "")
        logger.warning(f"Syntax check failed with output:\n{error_output}")

        # Use the raw string here, not a list
        error_files = _extract_error_files(error_output, Path(PROJECT_ROOT))

        # If you still want lines for the report:
        error_lines = [line for line in error_output.splitlines() if line.strip()]
        error_count = len(error_lines)
        summary = f"❌ Found {error_count} syntax errors in {len(error_files)} file(s)."

        _write_markdown_report(report_path, error_lines, summary=summary)
        return {"summary": summary, "errors": error_lines, "error_files": sorted(error_files)}

    except FileNotFoundError:
        error_msg = "Command 'npx' not found. Is Node.js installed and in your PATH?"
        _write_markdown_report(report_path, [], error_msg)
        return {"success": False, "summary": error_msg, "errors": error_msg, "error_files": []}
    
def _write_markdown_report(report_path: Path, errors: list[str], summary: str) -> None:
    """Helper to save syntax check results in Markdown format."""
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# TypeScript Syntax Check Report\n\n")
        f.write(f"**Summary:** {summary}\n\n")
        
        if errors:
            f.write("## Errors\n\n")
            for i, err in enumerate(errors, 1):
                f.write(f"{i}. `{err}`\n")
        
        f.write("\n---\n")
        f.write(f"**Total Errors:** {len(errors)}\n")

def compile_react_src():
    """
    Searches through a React application's src folder and compiles all files
    into a single markdown file with filepath headers and code blocks.
    """

    src_folder = PROJECT_ROOT / "src"
    output_file = Path(LOGS_DIR) / 'compiled_source.md'

    # Check if src folder exists
    if not src_folder.exists():
        print(f"Error: '{src_folder}' folder not found!")
        return
    
    # File extensions to include (common React file types)
    valid_extensions = {'.tsx', '.ts', '.jsx', '.js', '.json'}
    
    # Open output file
    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Walk through all directories and files
        for root, dirs, files in os.walk(src_folder):
            # Sort for consistent ordering
            files.sort()
            
            for file in files:
                # Get file extension
                filename, ext = os.path.splitext(file)

                if filename.endswith("vite-env.d"):
                    continue
                # Only process files with valid extensions
                if ext in valid_extensions:
                    # Construct full file path
                    filepath = os.path.join(root, file)
                    
                    # Normalize path separators to forward slashes
                    normalized_path = filepath.replace('\\', '/')
                    
                    try:
                        # Read file contents
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                        
                        # Determine language for code block
                        lang_map = {
                            '.tsx': 'tsx',
                            '.ts': 'typescript',
                            '.jsx': 'jsx',
                            '.js': 'javascript',
                            '.css': 'css',
                            '.scss': 'scss',
                            '.json': 'json'
                        }
                        lang = lang_map.get(ext, '')
                        
                        # Write formatted output
                        outfile.write(f"### {normalized_path}:\n")
                        outfile.write(f"```{lang}\n")
                        outfile.write(content)
                        if not content.endswith('\n'):
                            outfile.write('\n')
                        outfile.write("```\n\n")
                        
                        print(f"Added: {normalized_path}")
                        
                    except Exception as e:
                        print(f"Error reading {filepath}: {e}")
    
    print(f"\nCompilation complete! Output saved to '{output_file}'")

def check_project_lint(report_filename: str = "lint_report.md") -> Dict[str, Any]:
    """
    Run `npm run lint`, save a Markdown report with the errors and their count,
    and return a dict with success flag, raw combined output, and the report path.

    Returns:
        {
            "success": bool,
            "errors": str,            # raw combined stdout+stderr (or error message)
            "path": str,              # absolute path to the written Markdown report
            "files": list[str],       # unique file paths inferred from lint output
        }
    """
    # Resolve report path
    report_dir = Path(LOGS_DIR)
    report_dir.mkdir(parents=True, exist_ok=True)
    report_path = (report_dir / report_filename).resolve()

    # Find npm
    npm = shutil.which("npm")
    if not npm:
        msg = "Could not find 'npm' in PATH. Please ensure Node.js is installed."
        _write_markdown_report(report_path, [], msg)
        return {"success": False, "errors": msg, "path": str(report_path), "files": []}

    cmd = [npm, "run", "lint", "--silent"]  # --silent suppresses npm wrapper noise

    try:
        logger.info(f"Running lint with: {' '.join(cmd)}")
        # Let lint exit non-zero on problems; we catch it below.
        result = subprocess.run(
            cmd,
            cwd=PROJECT_ROOT,
            check=False,                # don't raise; we want the output either way
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        combined = (result.stdout or "") + (result.stderr or "")

        # Parse counts (ESLint summary line like: "✖ 3 problems (2 errors, 1 warning)")
        problems, errors, warnings = _parse_eslint_counts(combined)

        # Extract only "error" lines for the report body + collect file paths
        error_lines, error_paths = _extract_error_lines(combined)

        # Build summary
        if errors is not None:  # we recognized ESLint summary
            if errors == 0 and result.returncode == 0:
                summary = (
                    f"✅ Lint completed with no errors. "
                    f"Problems={problems or 0}, Errors=0, Warnings={warnings or 0}."
                )
            else:
                summary = (
                    f"❌ Lint found {errors} error(s) and {warnings or 0} warning(s). "
                    f"Total problems={problems or errors}."
                )
        else:
            # Fallback when we can't parse a summary
            err_count = len(error_lines)
            if result.returncode == 0 and err_count == 0:
                summary = "✅ Lint completed with no errors."
            else:
                summary = f"❌ Lint detected {err_count} potential error line(s)."

        # Write report
        _write_markdown_report(report_path, error_lines, summary)

        # Decide success: no errors AND process exited 0
        success = (result.returncode == 0) and ((errors or 0) == 0)
        return {
            "success": success,
            "errors": combined,
            "path": str(report_path),
            "files": sorted(error_paths),
        }

    except FileNotFoundError:
        msg = "Command 'npm' not found. Is Node.js installed and in your PATH?"
        _write_markdown_report(report_path, [], msg)
        return {"success": False, "errors": msg, "path": str(report_path), "files": []}


def _parse_eslint_counts(output: str) -> tuple[Optional[int], Optional[int], Optional[int]]:
    """
    Try to parse ESLint-style summary lines:
      "✖ 3 problems (2 errors, 1 warning)"
      "✖ 1 problem (1 error, 0 warnings)"
    Returns (problems, errors, warnings) or (None, None, None) if not found.
    """
    # Normalize to single lines to help regex
    text = "\n".join(line.strip() for line in output.splitlines())
    m = re.search(
        r"(?i)[✖x]\s*(\d+)\s*problems?\s*\(\s*(\d+)\s*errors?,\s*(\d+)\s*warnings?\s*\)",
        text,
    )
    if m:
        problems = int(m.group(1))
        errors = int(m.group(2))
        warnings = int(m.group(3))
        return problems, errors, warnings
    # Some configs print only errors without warning counts
    m2 = re.search(r"(?i)[✖x]\s*(\d+)\s*problems?\s*\(\s*(\d+)\s*errors?\)", text)
    if m2:
        problems = int(m2.group(1))
        errors = int(m2.group(2))
        return problems, errors, None
    return None, None, None


def _extract_error_lines(output: str) -> Tuple[list[str], list[str]]:
    """
    Heuristically collect lines that look like errors from lint output, AND
    extract candidate file paths mentioned in those lines.

    Keeps lines that contain 'error' (case-insensitive) or start with a ✖/x marker.
    Returns:
        (error_lines, file_paths)
        error_lines: the filtered lines (stripped)
        file_paths:  unique file paths inferred from those lines (sorted when returned)
    """
    error_lines: list[str] = []
    paths_set: set[str] = set()

    # A loose path regex that captures common source files and config files
    # Examples it matches: src/App.tsx, ./index.js, C:\proj\file.jsx, /usr/src/app/file.mjs
    path_regex = re.compile(
        r"""(?P<path>
            (?:[A-Za-z]:\\|/|\./|\.\./)?        # possible prefix: drive, abs, or relative
            [^:\s'"]+?                          # path body until a delimiter
            \.(?:tsx?|mjs|cjs|jsx|vue|svelte|json|css|scss|less|md|yaml|yml)
        )""",
        re.VERBOSE,
    )

    for line in output.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.lower().find("error") != -1 or stripped.startswith("✖") or stripped.startswith("x "):
            error_lines.append(stripped)
            for m in path_regex.finditer(stripped):
                # Normalize slashes for consistency
                p = m.group("path").replace("\\", "/")
                paths_set.add(p)

    return error_lines, sorted(paths_set)

def copy_src_to_exp_folder():
    """
    Copies the entire 'src' folder into LOGS_DIR, 
    so that LOGS_DIR/src/... exists afterward.
    """
    try:
        src = Path(PROJECT_ROOT) / "src"
        dest = Path(LOGS_DIR) / src.name  # include the folder name itself

        if not src.exists():
            raise FileNotFoundError(f"Source directory '{src}' does not exist.")

        if dest.exists():
            shutil.rmtree(dest)

        shutil.copytree(src, dest)
        logger.info(f"Successfully copied folder '{src}' into '{LOGS_DIR}' (as '{dest}').")

    except Exception as error:
        logger.exception(f"An error occurred: {error}")

def _extract_error_files(tsc_errors: str, project_root: Path) -> set[str]:
    """
    Extract file paths from TypeScript compiler errors.
    """
    error_files: set[str] = set()
    pattern = re.compile(r'^(.*\.(?:ts|tsx|js|jsx))\((\d+),(\d+)\):\s+error TS\d+:')

    for line in tsc_errors.splitlines():
        m = pattern.match(line.strip())
        if not m:
            continue
        file_path = m.group(1)
        try:
            abs_path = (project_root / file_path).resolve()
            if abs_path.exists():
                rel_path = abs_path.relative_to(project_root)
                error_files.add(rel_path.as_posix())
            else:
                error_files.add(Path(file_path).as_posix())
        except Exception:
            error_files.add(Path(file_path).as_posix())

    return error_files

if __name__ == "__main__":
    result = check_project_syntax()
    print(result)

    result = check_project_lint()
    print(result)