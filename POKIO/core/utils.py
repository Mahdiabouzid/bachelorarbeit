import logging
import os
import shutil
from enum import Enum
from typing import List, Dict, Any
import json

logger = logging.getLogger(__name__)
class OrchestratorState(Enum):
    IDLE = "IDLE"
    PLANNING = "PLANNING"
    CODING = "CODING"
    FAILED = "FAILED"
    COMPLETED = "COMPLETED"
    REVIEWING = "REVIEWING"

def initiliaze_react_app(src: str, dest: str):
    """
    Copies the directory from src to dest.
    If the destination directory exists, it is removed before copying.
    """
    try:
        if not os.path.exists(src):
            raise FileNotFoundError(f"Source directory '{src}' does not exist.")

        if os.path.exists(dest):
            logger.info(f"Destination '{dest}' exists. Removing it...")
            shutil.rmtree(dest)

        shutil.copytree(src, dest)
        logger.info(f"Successfully copied '{src}' to '{dest}'.")

    except Exception as error:
        logger.exception(f"An error occurred: {error}")

def format_history_lines(history: List[Dict[str, str]], max_items: int = 5) -> str:
    if not history:
        return "(none)"
    items = history[-max_items:]
    lines = []
    for i, h in enumerate(items, 1):
        t = h.get("title") or ""
        s = h.get("summary") or ""
        im = h.get("implementation") or ""
        lines.append(f"{i}. {t}\n   - {s}\n   - {im}")
    return "\n".join(lines)

def format_file_blobs(blobs: List[Dict[str, str]]) -> str:
    if not blobs:
        return "(no files to display)"
    parts = []
    for b in blobs:
        parts.append(
            f"FILE: {b['path']}\n"
            f"```tsx\n{b['content']}\n```\n"
        )
    return "\n".join(parts)

def stringify_errors(errors: Any, max_chars: int = 5000) -> str:
    try:
        s = errors if isinstance(errors, str) else json.dumps(errors, indent=2, ensure_ascii=False)
    except Exception:
        s = str(errors)
    # keep prompts reasonable in size
    return s[:max_chars] + ("…(truncated)" if len(s) > max_chars else "")

def save_in_file(content: Any, filename: str):
    try:
        with open(filename, 'a', encoding='utf-8') as f:
            if isinstance(content, dict):
                f.write(json.dumps(content, indent=2, ensure_ascii=False) + "\n")
            else:
                    f.write(str(content) + "\n")
    except IOError as e:
        print(f"Error: Could not write to file {filename}. Reason: {e}")
        

def save_conversation(messages: List[Dict[str, str]], filename: str, token_usage: str = 0, duration: float = 0.0):
    try:
        with open(filename, 'a', encoding='utf-8') as f:
            f.write("\n# New turn:\n")
            for message in messages:
                # if isinstance(message, dict) and message.get("role", {}) == "system":
                #     continue
                f.write(f"\n```json\n{json.dumps(message, indent=2, ensure_ascii=False)}\n```\n")
            f.write(f"Tokens used: {token_usage}" + "\n")
            f.write(f"Time taken {duration:.2f}" + "\n")
    except IOError as e:
        print(f"Error: Could not write to file {filename}. Reason: {e}")

def format_duration_hms(seconds: float) -> str:
    """Format an elapsed duration in seconds as HH:MM:SS (no 24h wrap)."""
    if seconds < 0:
        seconds = 0
    total = int(round(seconds))
    hours, rem = divmod(total, 3600)
    minutes, secs = divmod(rem, 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"

def summarize_lint_and_syntax(lint_result: dict, syntax_result: dict) -> str:
    """
    Combine the results of check_project_lint() and check_project_syntax()
    into a single formatted string (Markdown-like), without writing to any file.
    """
    # Extract and normalize values
    lint_success = lint_result.get("success")
    lint_errors = lint_result.get("errors")
    lint_files = lint_result.get("files", [])
    lint_path = lint_result.get("path")

    syntax_summary = syntax_result.get("summary", "")
    syntax_errors = syntax_result.get("errors", [])
    syntax_files = syntax_result.get("error_files", [])

    # Normalize errors: if string, split into lines
    if isinstance(lint_errors, str):
        lint_errors_lines = [line for line in lint_errors.splitlines() if line.strip()]
    else:
        lint_errors_lines = lint_errors or []

    if isinstance(syntax_errors, str):
        syntax_errors_lines = [line for line in syntax_errors.splitlines() if line.strip()]
    else:
        syntax_errors_lines = syntax_errors or []

    # Build combined summary string
    summary = f"""
# Project Quality Report

## Lint Check
- **Success:** {lint_success}
- **Files with Issues:** {len(lint_files)}
- **Error Lines:** {len(lint_errors_lines)}

### Lint Errors:
{chr(10).join(f"- {line}" for line in lint_errors_lines[:10]) or "No lint errors detected."}
{'... (truncated)' if len(lint_errors_lines) > 10 else ''}

---

## TypeScript Syntax Check
- **Summary:** {syntax_summary}
- **Files with Errors:** {len(syntax_files)}
- **Error Lines:** {len(syntax_errors_lines)}

### Syntax Errors:
{chr(10).join(f"- {line}" for line in syntax_errors_lines[:10]) or "No syntax errors detected."}
{'... (truncated)' if len(syntax_errors_lines) > 10 else ''}
"""

    return summary.strip()