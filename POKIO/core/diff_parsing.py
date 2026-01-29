import logging
import re
from typing import List, Tuple, Union, Dict

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DiffParsingService:
    """Service to parse and apply diffs from SEARCH/REPLACE blocks."""

    # Block marker constants
    SEARCH_BLOCK_CHAR = '-'
    REPLACE_BLOCK_CHAR = '+'
    LEGACY_SEARCH_BLOCK_CHAR = '<'
    LEGACY_REPLACE_BLOCK_CHAR = '>'

    # Flexible regex patterns
    SEARCH_BLOCK_START_REGEX = re.compile(r"^\s*-{3,}\s*SEARCH\s*>?\s*$")
    LEGACY_SEARCH_BLOCK_START_REGEX = re.compile(r"^\s*<{3,}\s*SEARCH\s*>?\s*$")
    SEARCH_BLOCK_END_REGEX = re.compile(r"^\s*={3,}\s*$")
    REPLACE_BLOCK_END_REGEX = re.compile(r"^\s*\+{3,}\s*REPLACE\s*>?\s*$")
    LEGACY_REPLACE_BLOCK_END_REGEX = re.compile(r"^\s*>{3,}\s*REPLACE\s*>?\s*$")

    def __init__(self) -> None:
        logger.info("DiffParsingService initialized")

    def is_search_block_start(self, line: str) -> bool:
        return bool(self.SEARCH_BLOCK_START_REGEX.match(line) or
                    self.LEGACY_SEARCH_BLOCK_START_REGEX.match(line))

    def is_search_block_end(self, line: str) -> bool:
        return bool(self.SEARCH_BLOCK_END_REGEX.match(line))

    def is_replace_block_end(self, line: str) -> bool:
        return bool(self.REPLACE_BLOCK_END_REGEX.match(line) or
                    self.LEGACY_REPLACE_BLOCK_END_REGEX.match(line))

    def normalize_diff_markers(self, diff_content: str) -> str:
        """
        Normalizes SEARCH/REPLACE markers to ensure they appear on their own lines.
        Handles cases where markers are attached to code without proper newlines.
        """
        lines = diff_content.split("\n")
        new_lines = []
        
        for line in lines:
            # Legacy SEARCH start: "<<<<<<< SEARCH" with attached content
            if re.match(r'^<{3,} SEARCH>?[^\s]', line):
                m = re.match(r'^(<{3,} SEARCH>?)(\S.*)$', line)
                if m:
                    new_lines.append(m.group(1))
                    new_lines.append(m.group(2))
                    continue
                    
            # Standard SEARCH start: "--- SEARCH" with attached content
            if re.match(r'^-{3,} SEARCH>?[^\s]', line):
                m = re.match(r'^(-{3,} SEARCH>?)(\S.*)$', line)
                if m:
                    new_lines.append(m.group(1))
                    new_lines.append(m.group(2))
                    continue
            
            # Middle marker: "=======" with preceding content
            if re.search(r'[^\s]=+$', line) and not re.match(r'^=+$', line):
                m = re.match(r'^(.*[^\s=])(=+)$', line)
                if m:
                    new_lines.append(m.group(1))
                    new_lines.append(m.group(2))
                    continue
            
            # Legacy REPLACE end: ">>>>>>> REPLACE" with preceding content
            if re.search(r'[^\s]>+ REPLACE>?$', line):
                m = re.match(r'^(.*[^\s>])(>{3,} REPLACE>?)$', line)
                if m:
                    new_lines.append(m.group(1))
                    new_lines.append(m.group(2))
                    continue
                    
            # Standard REPLACE end: "+++ REPLACE" with preceding content
            if re.search(r'[^\s]\+{3,} REPLACE>?$', line):
                m = re.match(r'^(.*[^\s+])(\+{3,} REPLACE>?)$', line)
                if m:
                    new_lines.append(m.group(1))
                    new_lines.append(m.group(2))
                    continue
            
            # No changes needed
            new_lines.append(line)
            
        return "\n".join(new_lines)

    def line_trimmed_fallback_match(
        self,
        original_content: str,
        search_content: str,
        start_index: int
    ) -> Union[Tuple[int, int], bool]:
        original_lines = original_content.split("\n")
        search_lines = search_content.split("\n")

        if search_lines and search_lines[-1] == "":
            search_lines.pop()

        # Determine starting line based on character index
        start_line = 0
        cur_index = 0
        while cur_index < start_index and start_line < len(original_lines):
            cur_index += len(original_lines[start_line]) + 1
            start_line += 1

        # Try matching at each line
        for i in range(start_line, len(original_lines) - len(search_lines) + 1):
            matches = True
            for j, sline in enumerate(search_lines):
                if original_lines[i + j].strip() != sline.strip():
                    matches = False
                    break
            if matches:
                match_start = sum(len(l) + 1 for l in original_lines[:i])
                match_end = match_start + sum(len(l) + 1 for l in original_lines[i:i+len(search_lines)])
                return (match_start, match_end)

        return False

    def block_anchor_fallback_match(
        self,
        original_content: str,
        search_content: str,
        start_index: int
    ) -> Union[Tuple[int, int], bool]:
        original_lines = original_content.split("\n")
        search_lines = search_content.split("\n")

        if len(search_lines) < 3:
            return False
        if search_lines and search_lines[-1] == "":
            search_lines.pop()

        first_anchor = search_lines[0].strip()
        last_anchor = search_lines[-1].strip()
        block_size = len(search_lines)

        # Determine starting line
        start_line = 0
        cur_index = 0
        while cur_index < start_index and start_line < len(original_lines):
            cur_index += len(original_lines[start_line]) + 1
            start_line += 1

        for i in range(start_line, len(original_lines) - block_size + 1):
            if original_lines[i].strip() != first_anchor:
                continue
            if original_lines[i + block_size - 1].strip() != last_anchor:
                continue
            match_start = sum(len(l) + 1 for l in original_lines[:i])
            match_end = match_start + sum(len(l) + 1 for l in original_lines[i:i+block_size])
            return (match_start, match_end)

        return False

    def apply_diff_to_content(
        self,
        diff_content: str,
        original_content: str,
        is_final: bool = True
    ) -> Dict[str, Union[bool, str]]:
        """
        Apply SEARCH/REPLACE diffs to original_content.
        Returns {'success': True, 'content': new_content} or {'success': False, 'error_message': msg}.
        """
        try:
            # Normalize markers before processing
            diff_content = self.normalize_diff_markers(diff_content)

            # Do we have a valid SEARCH/REPLACE Block
            is_valid_diff = False

            result_parts: List[str] = []
            last_index = 0

            current_search: List[str] = []
            current_replace: List[str] = []
            in_search = False
            in_replace = False

            search_start = -1
            search_end = -1

            replacements: List[Dict[str, Union[int, str]]] = []
            out_of_order = False

            lines = diff_content.split("\n")
            # drop incomplete marker
            if lines and lines[-1].startswith((self.SEARCH_BLOCK_CHAR,
                                               self.LEGACY_SEARCH_BLOCK_CHAR,
                                               "=",
                                               self.REPLACE_BLOCK_CHAR,
                                               self.LEGACY_REPLACE_BLOCK_CHAR)) \
               and not (self.is_search_block_start(lines[-1]) or
                        self.is_search_block_end(lines[-1]) or
                        self.is_replace_block_end(lines[-1])):
                lines.pop()

            for line in lines:
                # SEARCH block start
                if self.is_search_block_start(line):
                    if in_search or in_replace:
                        # nested/overlapping blocks are malformed
                        raise ValueError("Malformed diff: found SEARCH block start while previous block not closed. Ensure '<<<<<<< SEARCH' and '=======' / '>>>>>>> REPLACE' markers are used correctly.")
                    is_valid_diff = True
                    in_search = True
                    in_replace = False
                    current_search = []
                    current_replace = []
                    continue

                # SEARCH block end (middle marker '=======')
                if self.is_search_block_end(line):
                    if not in_search:
                        raise ValueError("Malformed diff: found middle marker '=======' but no open SEARCH block. Missing '<<<<<<< SEARCH' before '======='.")

                    in_search = False
                    in_replace = True
                    search_text = "\n".join(current_search)

                    if not search_text:
                        if not original_content:
                            search_start, search_end = 0, 0
                        else:
                            raise ValueError("Empty SEARCH block on non-empty original content: SEARCH block must contain text to match in the original content.")
                    else:
                        # exact match
                        idx = original_content.find(search_text, last_index)
                        if idx != -1:
                            search_start, search_end = idx, idx + len(search_text)
                        else:
                            fallback = self.line_trimmed_fallback_match(original_content, search_text, last_index)
                            if fallback:
                                search_start, search_end = fallback  # type: ignore
                            else:
                                anchor = self.block_anchor_fallback_match(original_content, search_text, last_index)
                                if anchor:
                                    search_start, search_end = anchor  # type: ignore
                                else:
                                    full_idx = original_content.find(search_text)
                                    if full_idx != -1:
                                        search_start, search_end = full_idx, full_idx + len(search_text)
                                        out_of_order = (search_start < last_index)
                                    else:
                                        # Provide a short excerpt to help debugging
                                        excerpt = (search_text[:200] + '...') if len(search_text) > 200 else search_text
                                        raise ValueError(f"SEARCH block not found in original content. Excerpt: {excerpt}")

                    if search_start < last_index:
                        out_of_order = True
                    if not out_of_order:
                        result_parts.append(original_content[last_index:search_start])
                    continue

                # REPLACE block end ('+++ REPLACE' or '>>>>>>> REPLACE')
                if self.is_replace_block_end(line):
                    if not in_replace:
                        # If we haven't started a REPLACE block, this is malformed
                        raise ValueError("Malformed diff: found REPLACE end marker without an open REPLACE block. Ensure '=======' precedes '>>>>>>> REPLACE'.")

                    if search_start < 0:
                        raise ValueError("Malformed sequence: REPLACE without SEARCH. This is due to incorrect SEARCH/REPLACE format: Missing '=======' or '<<<<<<< SEARCH' before '>>>>>>> REPLACE'.")

                    # # if replace block is empty that's an error (empty REPLACE not allowed)
                    # if not current_replace:
                    #     raise ValueError("Empty REPLACE block: REPLACE must contain replacement content (non-empty).")

                    repl_text = "\n".join(current_replace) + "\n"
                    replacements.append({"start": search_start, "end": search_end, "content": repl_text})
                    if not out_of_order:
                        last_index = search_end
                        result_parts.append(repl_text)
                    in_search = in_replace = False
                    current_search = []
                    current_replace = []
                    search_start = search_end = -1
                    out_of_order = False
                    continue

                # accumulate
                if in_search:
                    current_search.append(line)
                elif in_replace:
                    current_replace.append(line)
                    if search_start >= 0 and not out_of_order:
                        result_parts.append(line + "\n")
                else:
                    # If a line looks like a marker but didn't match our patterns, it's malformed
                    if line and line[0] in (self.SEARCH_BLOCK_CHAR, self.LEGACY_SEARCH_BLOCK_CHAR, "=", self.REPLACE_BLOCK_CHAR, self.LEGACY_REPLACE_BLOCK_CHAR):
                        # give helpful hint about allowed markers
                        raise ValueError(f"Malformed marker or misplaced content: '{line}'. Expected markers are '<<<<<<< SEARCH', '=======', '>>>>>>> REPLACE' .")

            if diff_content.strip() and not is_valid_diff:
                raise ValueError("Malformed or empty diff provided; no valid SEARCH/REPLACE blocks found.")
            
            # final assembly
            if is_final:
                # If we ended still in a SEARCH (no middle marker seen)
                if in_search:
                    raise ValueError("Unterminated SEARCH block: missing middle marker '=======' and/or REPLACE block.")

                # flush any pending REPLACE block
                if in_replace and search_start >= 0:
                    # if replace block remained open but empty
                    if not current_replace:
                        raise ValueError("Unterminated REPLACE block at end of diff: REPLACE must contain content and be closed with '>>>>>>> REPLACE'.")
                    repl_text = "\n".join(current_replace) + "\n"
                    replacements.append({"start": search_start, "end": search_end, "content": repl_text})
                    if not out_of_order:
                        last_index = search_end
                        result_parts.append(repl_text)

                # rebuild full content
                new_parts: List[str] = []
                pos = 0
                replacements.sort(key=lambda r: r["start"])
                for rep in replacements:
                    new_parts.append(original_content[pos:rep["start"]])
                    new_parts.append(rep["content"])
                    pos = rep["end"]
                new_parts.append(original_content[pos:])
                new_content = "".join(new_parts)
                return {"success": True, "content": new_content}

            return {"success": True, "content": "".join(result_parts)}

        except Exception as e:
            logger.exception("Error applying diff")
            return {"success": False, "error_message": str(e)}
        
if __name__ == "__main__":
    service = DiffParsingService()
    original_content = """
import React from 'react';

export default function SecondPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">Second Page</h1>
      <p className="text-gray-600">You have successfully navigated to the second page!</p>
    </div>
  );
}
"""
    diff_content = """
<<<<<<<SEARCH
import React from 'react';

export default function SecondPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">Second Page</h1>
      <p className="text-gray-600">You have successfully navigated to the second page!</p>
    </div>
  );
}=======
import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function SecondPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">Second Page</h1>
        <p className="text-gray-600">You have successfully navigated to the second page!</p>
      </main>
      <Footer />
    </div>
  );
}
>>>>>>>REPLACE
"""
    result = service.apply_diff_to_content(diff_content=diff_content, original_content=original_content, is_final=True)
    print(result)