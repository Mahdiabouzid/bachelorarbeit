"""
Verification service for POKIO model responses.
Validates JSON responses and determines if it's a valid tool call, plan, or review.
Prioritizes actual tool calls over other code blocks.

Enhanced to support review responses and improved JSON blob extraction.
"""
import json
from typing import Dict, Any, Tuple, Optional
import logging
from json_repair import repair_json
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VerificationService:
    """Enhanced service to verify model output formatting and classification."""
    
    def __init__(self):
        """Initialize verification service."""
        self.required_tool_keys = ["tool_name", "parameters"]
        self.valid_tool_names = {
            "write_to_files", 
            "fetch_files", 
            "ask_followup_question"
        }
        self.required_plan_keys = ["plan_title", "overview", "steps"]
        self.required_review_keys = ["review_decision"]
        self.valid_review_decisions = {"approved", "rejected"}

    def fix_escape_sequences(self, json_string: str) -> str:
        """Fix invalid escape sequences while preserving valid ones."""
        # Valid JSON escapes: \", \\, \/, \b, \f, \n, \r, \t, \uXXXX
        # Replace invalid escapes like \` with \\`
        
        import re
        
        # Find all backslash sequences
        # Replace backslashes that aren't followed by valid escape characters
        def replace_invalid_escape(match):
            char_after = match.group(1)
            # These are valid JSON escape characters
            if char_after in ['"', '\\', '/', 'b', 'f', 'n', 'r', 't', 'u']:
                return match.group(0)  # Keep as is
            else:
                # Escape the backslash
                return '\\\\' + char_after
        
        # Pattern: backslash followed by any character
        fixed = re.sub(r'\\(.)', replace_invalid_escape, json_string)
        return fixed

    def verify_response(self, response_text: str) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """
        Verifies if the response is a valid JSON tool call, plan, or review. This is a strict
        process: if the original JSON is syntactically malformed, it is an
        immediate failure, even if it's repairable.
        
        Enhanced to prioritize actual tool calls over other code blocks and support review responses.
        """
        logger.info("Verifying model response...")
        
        is_repaired = False
        original_error = ""

        try:
            # Step 1: Extract JSON using the enhanced multi-strategy approach
            json_blob, remaining_text = self._extract_json_blob(response_text)
            
            if not json_blob:
                raise ValueError("No valid JSON blob found in response")

            # Step 2: Attempt to parse the blob. We no longer repair and continue.
            # We only parse to see if it's valid or not.
            try:
                parsed_json = json.loads(json_blob)
            except json.JSONDecodeError as e:
                # THIS IS THE KEY CHANGE: If parsing fails, it's an immediate error.
                # We log the attempt to repair for debugging, but we return the original error.
                logger.error(f"Original JSON is malformed. Failing verification. Original error: {e}")
                original_error = str(e)
                # We can try to repair it just for better logging if we want.
                # Try fixing specific escape sequence issues first
                try:
                    fixed_blob = self.fix_escape_sequences(json_blob)
                    logger.info("Attempting auto JSON repair.")
                    parsed_json = json.loads(repair_json(fixed_blob))
                    is_repaired = True
                    logger.info("Auto-repair succeeded.")
                except Exception:
                    logger.warning("Auto-repair also failed.")
                    # Return the original, more accurate error.
                    return False, "error", {"error": original_error}

            # Step 3: If we are here, the JSON was syntactically perfect.
            # Now, determine response type and perform semantic validation.
            response_type = self._determine_response_type(parsed_json)
            
            if response_type == "review":
                # Validate review structure
                #self._validate_review_structure(parsed_json)
                logger.info(f"Successfully verified review response: {parsed_json.get('review_decision')}")
                return True, "review", parsed_json
            
            if response_type == "tool":
                # Validate tool call structure
                if not all(key in parsed_json for key in self.required_tool_keys):
                    raise ValueError("JSON is valid but missing required keys for a tool call.")
                
                tool_name = parsed_json.get("tool_name")
                if tool_name not in self.valid_tool_names:
                    raise ValueError(f"Invalid tool name: {tool_name}")
                
                # Validate specific tool structures
                if tool_name == "write_to_files":
                    self._validate_write_to_files_structure(parsed_json.get("parameters", {}))
                elif tool_name == "fetch_files":
                    self._validate_fetch_files_structure(parsed_json.get("parameters", {}))
                elif tool_name == "ask_followup_question":
                    self._validate_ask_followup_question_structure(parsed_json.get("parameters", {}))
                elif tool_name == "reply_to_message":
                    self._validate_reply_to_message_structure(parsed_json.get("parameters", {}))
                
                logger.info(f"Successfully verified tool call: {tool_name}")
                return True, "tool", parsed_json
                
            elif response_type == "plan":
                # Validate plan structure
                self._validate_plan_structure(parsed_json)
                logger.info("Successfully verified plan structure")
                return True, "plan", parsed_json

        except ValueError as e:
            # This will now only catch blob-finding errors or semantic errors.
            logger.error(f"Verification failed: {e}")
            if is_repaired and original_error:
                error_msg = f"Original JSON error: {original_error}"
            else:
                error_msg = f"Verification failed: {e}"
            
            return False, "error", {"error": error_msg}
        except Exception as e:
            error_msg = f"An unexpected verification error occurred: {e}"
            logger.error(error_msg, exc_info=True)
            return False, "error", {"error": error_msg}

    def _determine_response_type(self, parsed_json: Dict[str, Any]) -> str:
        """Determines whether the response is a plan, tool call, or review."""
        if "tool_name" in parsed_json:
            return "tool"
        elif "needs_refinement" in parsed_json:
            return "review"
        elif "plan_title" in parsed_json:
            return "plan"
        else:
            raise ValueError(f"Cannot determine response type. Available keys: {list(parsed_json.keys())}")

    def _extract_json_blob(self, text: str) -> Tuple[str, str]:
        """
        Enhanced extraction using a prioritized multi-strategy approach:
        1. Look for JSON tool calls in markdown code fences (prioritized)
        2. Look for JSON plans in markdown code fences (prioritized)
        3. Look for JSON reviews in markdown code fences (prioritized)
        4. Find JSON object by its root key {"tool_name":, {"plan_title":, or {"review_decision": (prioritized)
        5. Look for any JSON in markdown code fences (fallback)
        6. Treat entire response as JSON blob (last resort)
        """
        
        # Strategy 1: Look specifically for tool call JSON in markdown
        tool_call_json = self._extract_tool_call_from_markdown(text)
        if tool_call_json:
            logger.info("Extracted tool call JSON from markdown code fence")
            remaining = self._remove_extracted_json_from_text(text, tool_call_json)
            return tool_call_json, remaining
            
        # Strategy 2: Look specifically for plan JSON in markdown
        plan_json = self._extract_plan_from_markdown(text)
        if plan_json:
            logger.info("Extracted plan JSON from markdown code fence")
            remaining = self._remove_extracted_json_from_text(text, plan_json)
            return plan_json, remaining

        # Strategy 3: Look specifically for review JSON in markdown
        review_json = self._extract_review_from_markdown(text)
        if review_json:
            logger.info("Extracted review JSON from markdown code fence")
            remaining = self._remove_extracted_json_from_text(text, review_json)
            return review_json, remaining
        
        # Strategy 4: Find JSON blob by root key (most reliable for tool calls, plans, and reviews)
        try:
            json_blob, remaining_text = self._find_json_blob(text)
            logger.info("Extracted JSON using root key pattern matching")
            return json_blob, remaining_text
        except ValueError:
            pass
        
        # Strategy 5: Extract any JSON from markdown (fallback)
        markdown_json = self._extract_from_markdown(text)
        if markdown_json:
            # Validate this is actually a tool call, plan, or review
            try:
                parsed = json.loads(markdown_json)
                if isinstance(parsed, dict) and ("tool_name" in parsed or "plan_title" in parsed or "review_decision" in parsed):
                    logger.info("Extracted valid tool call, plan, or review JSON from generic markdown code fence")
                    remaining = self._remove_extracted_json_from_text(text, markdown_json)
                    return markdown_json, remaining
            except:
                pass
        
        # Strategy 6: Treat entire text as JSON (last resort)
        logger.info("Treating entire response as JSON blob")
        return text.strip(), ""

    def _extract_tool_call_from_markdown(self, text: str) -> Optional[str]:
        """
        Extract JSON specifically containing tool calls from markdown code fences.
        Prioritizes blocks that contain tool_name.
        """
        # Find all JSON code blocks
        pattern = r"```(?:json)?\s*\n(.*?)\n```"
        matches = re.finditer(pattern, text, re.DOTALL)
        
        tool_call_candidates = []
        
        for match in matches:
            json_content = match.group(1).strip()
            
            # Quick check if this might be a tool call
            if '"tool_name"' in json_content:
                try:
                    # Try to parse to validate it's proper JSON
                    parsed = json.loads(json_content)
                    if isinstance(parsed, dict) and "tool_name" in parsed:
                        # Check if it's a valid tool name
                        tool_name = parsed.get("tool_name")
                        if tool_name in self.valid_tool_names:
                            tool_call_candidates.append((json_content, tool_name))
                except:
                    continue
        
        # Return the first valid tool call found
        if tool_call_candidates:
            return tool_call_candidates[0][0]
        
        return None

    def _extract_plan_from_markdown(self, text: str) -> Optional[str]:
        """
        Extract JSON specifically containing plans from markdown code fences.
        Prioritizes blocks that contain plan_title.
        """
        # Find all JSON code blocks
        pattern = r"```(?:json)?\s*\n(.*?)\n```"
        matches = re.finditer(pattern, text, re.DOTALL)
        
        plan_candidates = []
        
        for match in matches:
            json_content = match.group(1).strip()
            
            # Quick check if this might be a plan
            if '"plan_title"' in json_content:
                try:
                    # Try to parse to validate it's proper JSON
                    parsed = json.loads(json_content)
                    if isinstance(parsed, dict) and "plan_title" in parsed:
                        plan_candidates.append(json_content)
                except:
                    continue
        
        # Return the first valid plan found
        if plan_candidates:
            return plan_candidates[0]
        
        return None

    def _extract_review_from_markdown(self, text: str) -> Optional[str]:
        """
        Extract JSON specifically containing reviews from markdown code fences.
        Prioritizes blocks that contain review_decision.
        """
        # Find all JSON code blocks
        pattern = r"```(?:json)?\s*\n(.*?)\n```"
        matches = re.finditer(pattern, text, re.DOTALL)
        
        review_candidates = []
        
        for match in matches:
            json_content = match.group(1).strip()
            
            # Quick check if this might be a review
            if '"review_decision"' in json_content:
                try:
                    # Try to parse to validate it's proper JSON
                    parsed = json.loads(json_content)
                    if isinstance(parsed, dict) and "review_decision" in parsed:
                        # Check if it's a valid review decision
                        review_decision = parsed.get("review_decision")
                        if review_decision in self.valid_review_decisions:
                            review_candidates.append(json_content)
                except:
                    continue
        
        # Return the first valid review found
        if review_candidates:
            return review_candidates[0]
        
        return None

    def _extract_from_markdown(self, text: str) -> Optional[str]:
        """Extracts the first JSON string from a markdown code fence."""
        pattern = r"```(?:json)?\s*\n(.*?)\n```"
        match = re.search(pattern, text, re.DOTALL)
        return match.group(1).strip() if match else None

    def _remove_extracted_json_from_text(self, original_text: str, extracted_json: str) -> str:
        """Remove the extracted JSON block from the original text."""
        # Try to find and remove the exact markdown block
        patterns = [
            rf"```json\s*\n{re.escape(extracted_json)}\s*\n```",
            rf"```\s*\n{re.escape(extracted_json)}\s*\n```"
        ]
        
        for pattern in patterns:
            if re.search(pattern, original_text, re.DOTALL):
                return re.sub(pattern, "", original_text, flags=re.DOTALL).strip()
        
        # Fallback: just remove the JSON content itself
        return original_text.replace(extracted_json, "").strip()

    def _find_json_blob(self, text: str) -> Tuple[str, str]:
        """
        Extracts the first raw JSON string object starting with `{"tool_name":`, `{"plan_title":`, or `{"review_decision":` from a larger text.
        Enhanced to be more robust with whitespace and formatting and support review responses.
        """
        start_patterns = [
            r'\{\s*"tool_name"\s*:',
            r'\{\s*"plan_title"\s*:',
            r'\{\s*"review_decision"\s*:'
        ]
        
        for start_pattern in start_patterns:
            match = re.search(start_pattern, text)
            if match:
                start_index = match.start()
                brace_level = 0
                end_index = -1
                search_area = text[start_index:]
                in_string = False
                escape_next = False
                
                for i, char in enumerate(search_area):
                    if escape_next:
                        escape_next = False
                        continue
                        
                    if char == '\\' and in_string:
                        escape_next = True
                        continue
                        
                    if char == '"' and not escape_next:
                        in_string = not in_string
                        continue
                        
                    if not in_string:
                        if char == '{': 
                            brace_level += 1
                        elif char == '}': 
                            brace_level -= 1
                            
                        if brace_level == 0:
                            end_index = i + 1
                            break
                
                if end_index == -1:
                    json_blob = search_area
                    absolute_end_index = len(text)
                else:
                    json_blob = search_area[:end_index]
                    absolute_end_index = start_index + end_index
                
                remaining_text = text[:start_index] + text[absolute_end_index:]
                return json_blob, remaining_text.strip()
        
        raise ValueError("No JSON object with a 'tool_name', 'plan_title', or 'review_decision' key found.")

    def _validate_review_structure(self, parsed_json: Dict[str, Any]) -> None:
        """Validate review structure according to the specified format."""
        # Check required top-level keys
        if not all(key in parsed_json for key in self.required_review_keys):
            missing_keys = [key for key in self.required_review_keys if key not in parsed_json]
            raise ValueError(f"Review missing required keys: {missing_keys}")
        
        # Validate review_decision
        review_decision = parsed_json.get("review_decision")
        if not isinstance(review_decision, str) or review_decision not in self.valid_review_decisions:
            raise ValueError(f"review_decision must be one of: {self.valid_review_decisions}")
        
        # If rejected, validate additional required fields
        if review_decision == "rejected":
            if "feedback" not in parsed_json:
                raise ValueError("Rejected reviews must include 'feedback' field")
            
            feedback = parsed_json.get("feedback")
            if not isinstance(feedback, str) or not feedback.strip():
                raise ValueError("feedback must be a non-empty string")
            
            # files_to_revise is optional for rejected reviews
            if "files_to_revise" in parsed_json:
                files_to_revise = parsed_json.get("files_to_revise")
                if not isinstance(files_to_revise, list):
                    raise ValueError("files_to_revise must be a list")
                
                for i, file_path in enumerate(files_to_revise):
                    if not isinstance(file_path, str):
                        raise ValueError(f"files_to_revise[{i}] must be a string")

    def _validate_plan_structure(self, parsed_json: Dict[str, Any]) -> None:
        """Validate plan structure according to the specified format."""
        # Check required top-level keys
        if not all(key in parsed_json for key in self.required_plan_keys):
            missing_keys = [key for key in self.required_plan_keys if key not in parsed_json]
            raise ValueError(f"Plan missing required keys: {missing_keys}")
        
        # Validate plan_title
        plan_title = parsed_json.get("plan_title")
        if not isinstance(plan_title, str) or not plan_title.strip():
            raise ValueError("plan_title must be a non-empty string")
        
        # Validate overview
        overview = parsed_json.get("overview")
        if not isinstance(overview, str) or not overview.strip():
            raise ValueError("overview must be a non-empty string")
        
        # Validate steps
        steps = parsed_json.get("steps")
        if not isinstance(steps, list) or not steps:
            raise ValueError("steps must be a non-empty list")
        
        # Validate each step
        for i, step in enumerate(steps, start=1):
            if not isinstance(step, dict):
                raise ValueError(f"Step #{i} must be a dictionary")
            
            # Check required step keys
            required_step_keys = ["id", "title", "description", "expected_files", "requires"]
            for key in required_step_keys:
                if key not in step:
                    raise ValueError(f"Step #{i} missing required key: {key}")
            
            # Validate step id
            step_id = step.get("id")
            if not isinstance(step_id, int) or step_id < 1:
                raise ValueError(f"Step #{i} id must be a positive integer")
            
            # Validate step title
            step_title = step.get("title")
            if not isinstance(step_title, str) or not step_title.strip():
                raise ValueError(f"Step #{i} title must be a non-empty string")
            
            # Validate step description
            description = step.get("description")
            if not isinstance(description, str) or not description.strip():
                raise ValueError(f"Step #{i} description must be a non-empty string")
            
            # Validate expected_files
            expected_files = step.get("expected_files")
            if not isinstance(expected_files, list):
                raise ValueError(f"Step #{i} expected_files must be a list")
            
            for j, file_path in enumerate(expected_files):
                if not isinstance(file_path, str):
                    raise ValueError(f"Step #{i} expected_files[{j}] must be a string")
            
            # Validate requires
            requires = step.get("requires")
            if not isinstance(requires, list):
                raise ValueError(f"Step #{i} requires must be a list")
            
            for j, requirement in enumerate(requires):
                if not isinstance(requirement, str):
                    raise ValueError(f"Step #{i} requires[{j}] must be a string")
            
            # Validate optional notes field
            if "notes" in step:
                notes = step.get("notes")
                if not isinstance(notes, str):
                    raise ValueError(f"Step #{i} notes must be a string")

    def _validate_write_to_files_structure(self, parameters: Dict[str, Any]) -> None:
        """Validate write_to_files parameters structure."""
        required_keys = ["title", "summary", "implementation", "changes"]
        if not all(key in parameters for key in required_keys):
            missing_keys = [key for key in required_keys if key not in parameters]
            raise ValueError(f"write_to_files parameters missing required keys: {missing_keys}")

        changes = parameters.get("changes")
        if not changes:
            logger.warning("Coder provided empty changes array.")
            return

        if not isinstance(changes, list):
            raise ValueError("Changes must be a non-empty list.")

        for i, change in enumerate(changes, start=1):
            if not isinstance(change, dict) or "type" not in change or "path" not in change:
                raise ValueError(f"Change #{i} is malformed or missing 'type'/'path' field")

            change_type = change["type"]

            if change_type == "create":
                if "content" not in change:
                    raise ValueError(f"Create change #{i} must have content")
            elif change_type == "modify":
                if "differences" not in change:
                    raise ValueError(f"Modify change #{i} must have differences key")
                if not (isinstance(change.get("differences"), list) and all(isinstance(elem, str) for elem in change.get("differences"))):
                    raise ValueError(f"Modify change #{i}: Differences is not of type list of strings")
            elif change_type == "delete":
                pass  # type and path are enough
            else:
                raise ValueError(f"Change #{i} has invalid type: {change_type}")

    def _validate_fetch_files_structure(self, parameters: Dict[str, Any]) -> None:
        """Validate the structure of a 'fetch_files' tool's parameters."""
        if "filePaths" not in parameters:
            raise ValueError("fetch_files parameters missing 'filePaths' key.")
        
        file_paths = parameters["filePaths"]
        if not isinstance(file_paths, list) or not file_paths:
            raise ValueError("filePaths must be a non-empty list.")
        
        for path in file_paths:
            if not isinstance(path, str):
                raise ValueError("All filePaths must be strings.")

    def _validate_ask_followup_question_structure(self, parameters: Dict[str, Any]) -> None:
        """Validate the structure of an 'ask_followup_question' tool's parameters."""
        if "question" not in parameters:
            raise ValueError("ask_followup_question parameters missing 'question' key.")
        
        if not isinstance(parameters["question"], str) or not parameters["question"].strip():
            raise ValueError("question must be a non-empty string.")

    def _validate_reply_to_message_structure(self, parameters: Dict[str, Any]) -> None:
        """Validate the structure of a 'reply_to_message' tool's parameters."""
        if "message" not in parameters:
            raise ValueError("reply_to_message parameters missing 'message' key.")
        
        if not isinstance(parameters["message"], str) or not parameters["message"].strip():
            raise ValueError("message must be a non-empty string.")


# --- Example Usage and Tests ---
if __name__ == "__main__":
    service = VerificationService()

    print("\n--- Test Case 1: Original Malformed JSON Example ---")
    # This is the problematic case from the original example
    sample_malformed = '''
Okay, I have the content of `src/pages/BuilderPage.tsx`. Now I can proceed with refactoring the drag-and-drop logic into a custom hook.

Here's the updated plan:

1.  **Analyze `src/pages/BuilderPage.tsx`:** (Completed) I have examined the file and identified the following relevant parts:
    *   `handleDragStart`: This function is responsible for setting the data being dragged.
    *   `handleDrop`: This function is responsible for handling the drop event and adding a new block to the canvas.
    *   `handleDragOver`: This function prevents the default drag-over behavior.
2.  **Create `src/hooks/useDragDrop.tsx`:** I will create a new file to house the custom hook. This hook will encapsulate the `handleDragStart`, `handleDrop`, and `handleDragOver` logic extracted 
from `src/pages/BuilderPage.tsx`. The hook will need to accept a callback function to add a block to the state.
3.  **Modify `src/pages/BuilderPage.tsx`:** I will modify this file to use the `useDragDrop` hook. This will involve removing the extracted drag-and-drop logic and replacing it with calls to the hook.

Here's the code for the new hook `src/hooks/useDragDrop.tsx`:

```typescript
import { useCallback } from 'react';

interface UseDragDropProps {
  onBlockAdd: (blockType: string) => void;
}

export const useDragDrop = ({ onBlockAdd }: UseDragDropProps) => {
  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, blockType: string) => {
    event.dataTransfer.setData('blockType', blockType);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const blockType = event.dataTransfer.getData('blockType');
    if (blockType) {
      onBlockAdd(blockType);
    }
  }, [onBlockAdd]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return { handleDragStart, handleDrop, handleDragOver };
};
```

Now, I will modify `src/pages/BuilderPage.tsx` to use this hook.

```json
{
  "tool_name": "write_to_files",
  "parameters": {
    "title": "Refactor drag-and-drop logic into a custom hook",
    "summary": "Refactored the drag-and-drop logic from BuilderPage.tsx into a reusable custom hook useDragDrop.tsx.",
    "implementation": "Created a new hook `useDragDrop` in `src/hooks/useDragDrop.tsx` to encapsulate the drag-and-drop logic. Modified `src/pages/BuilderPage.tsx` to use the new hook, making the code cleaner and more reusable.",
    "changes": [
      {
        "type": "create",
        "path": "src/hooks/useDragDrop.tsx",
        "content": "import { useCallback } from 'react';\\n\\ninterface UseDragDropProps {\\n  onBlockAdd: (blockType: string) => void;\\n}\\n\\nexport const useDragDrop = ({ onBlockAdd }: UseDragDropProps) => {\\n  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, blockType: string) => {\\n    event.dataTransfer.setData('blockType', blockType);\\n  }, []);\\n\\n  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {\\n    event.preventDefault();\\n    const blockType = event.dataTransfer.getData('blockType');\\n    if (blockType) {\\n      onBlockAdd(blockType);\\n    }\\n  }, [onBlockAdd]);\\n\\n  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {\\n    event.preventDefault();\\n  }, []);\\n\\n  return { handleDragStart, handleDrop, handleDragOver };\\n};\\n",
        "differences": null
      },
      {
        "type": "modify",
        "path": "src/pages/BuilderPage.tsx",
        "content": null,
        "differences": [
          "<<<<<<< SEARCH\\nimport Testimonial from '../components/Testimonial';\\n\\ninterface Block {\\n=========\\nimport { useDragDrop } from '../hooks/useDragDrop';\\nimport Testimonial from '../components/Testimonial';\\n\\ninterface Block {\\n>>>>>>> REPLACE",
          "<<<<<<< SEARCH\\n    localStorage.setItem('pageBlocks', JSON.stringify(blocks));\\n  }, [blocks]);\\n\\n  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, blockType: string) => {\\n    event.dataTransfer.setData('blockType', blockType);\\n  };\\n\\n  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {\\n    event.preventDefault();\\n    const blockType = event.dataTransfer.getData('blockType');\\n    if (blockType) {\\n      addBlock(blockType);\\n    }\\n  };\\n\\n  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {\\n    event.preventDefault();\\n  };\\n=========\\n    localStorage.setItem('pageBlocks', JSON.stringify(blocks));\\n  }, [blocks]);\\n\\n  const { handleDragStart, handleDrop, handleDragOver } = useDragDrop({ onBlockAdd: addBlock });\\n\\n>>>>>>> REPLACE",
          "<<<<<<< SEARCH\\n        ref={canvasRef}\\n        onDrop={handleDrop}\\n        onDragOver={handleDragOver}\\n      >\\n        <h2 className=\\"text-lg font-bold mb-4\\">Canvas</h2>\\n=========\\n        ref={canvasRef}\\n        onDrop={handleDrop}\\n        onDragOver={handleDragOver}\\n      >\\n        <h2 className=\\"text-lg font-bold mb-4\\">Canvas</h2>\\n>>>>>>> REPLACE"
        ]
      }
    ]
  }
}
```
'''
    
    is_valid, v_type, data = service.verify_response(sample_malformed)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if is_valid:
        print(f"Tool Name: {data['tool_name']}")
        print("SUCCESS: Enhanced service correctly extracted the tool call!")
    else:
        print("Resulting Error:", data['error'])
    print("-" * 50)

    print("\n--- Test Case 2: Valid Plan Example ---")
    sample_plan = '''
Here's the implementation plan:


'''
    
    is_valid, v_type, data = service.verify_response(sample_plan)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if is_valid:
        print(f"refinement_plan: {data['refinement_plan']}")
    else:
        print("Resulting Error:", data['error'])
    print("-" * 50)

    print("\n--- Test Case 3: Valid Review - Approved ---")
    sample_approved_review = '''
The code looks good! All requirements are met and the implementation is solid.

```json
{
  "review_decision": "approved"
}
```
'''
    
    is_valid, v_type, data = service.verify_response(sample_approved_review)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if is_valid:
        print(f"Review Decision: {data['review_decision']}")
        print("SUCCESS: Approved review validation working correctly!")
    else:
        print("Resulting Error:", data['error'])
    print("-" * 50)

    print("\n--- Test Case 4: Valid Review - Rejected ---")
    sample_rejected_review = '''
The implementation needs some improvements before we can proceed.

```json
{
  "review_decision": "rejected",
  "feedback": "The implementation doesn't handle error cases properly. Please add proper error handling and validation before proceeding.",
  "files_to_revise": ["src/components/ErrorHandler.tsx", "src/utils/validation.ts"]
}
```
'''
    
    is_valid, v_type, data = service.verify_response(sample_rejected_review)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if is_valid:
        print(f"Review Decision: {data['review_decision']}")
        print(f"Feedback: {data['feedback']}")
        print(f"Files to revise: {data['files_to_revise']}")
        print("SUCCESS: Rejected review validation working correctly!")
    else:
        print("Resulting Error:", data['error'])
    print("-" * 50)

    print("\n--- Test Case 5: Invalid Review - Missing feedback for rejection ---")
    sample_invalid_rejected = '''
```json
{
  "review_decision": "rejected"
}
```
'''
    
    is_valid, v_type, data = service.verify_response(sample_invalid_rejected)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if not is_valid:
        print("Resulting Error:", data['error'])
        print("SUCCESS: Correctly identified invalid rejected review!")
    else:
        print("ERROR: Should have failed validation!")
    print("-" * 50)

    print("\n--- Test Case 6: Invalid Plan (Missing Required Keys) ---")
    sample_invalid_plan = '''
```json
{
  "plan_title": "Incomplete Plan",
  "overview": "This plan is missing the steps array"
}
```
'''
    
    is_valid, v_type, data = service.verify_response(sample_invalid_plan)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if not is_valid:
        print("Resulting Error:", data['error'])
        print("SUCCESS: Correctly identified invalid plan!")
    else:
        print("ERROR: Should have failed validation!")
    print("-" * 50)

    print("\n--- Test Case 7: Multiple JSON blocks with review at end ---")
    sample_multiple_with_review = '''
Here's some configuration:

```json
{
  "config": "value",
  "settings": true
}
```

And here's the actual review:

```json
{
  "review_decision": "approved"
}
```
'''
    
    is_valid, v_type, data = service.verify_response(sample_multiple_with_review)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if is_valid:
        print(f"Review Decision: {data['review_decision']}")
        print("SUCCESS: Correctly identified review among multiple JSON blocks!")
    else:
        print("Resulting Error:", data['error'])
    print("-" * 50)

    print("\n--- Test Case 8: Invalid Review Decision ---")
    sample_invalid_decision = '''
```json
{
  "review_decision": "maybe"
}
```
'''
    
    is_valid, v_type, data = service.verify_response(sample_invalid_decision)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if not is_valid:
        print("Resulting Error:", data['error'])
        print("SUCCESS: Correctly identified invalid review decision!")
    else:
        print("ERROR: Should have failed validation!")
    print("-" * 50)

    print("\n--- Test Case 9: Review with raw JSON (no markdown) ---")
    sample_raw_review = '''{"review_decision": "approved"}'''
    
    is_valid, v_type, data = service.verify_response(sample_raw_review)
    print(f"Is Valid: {is_valid}, Type: {v_type}")
    if is_valid:
        print(f"Review Decision: {data['review_decision']}")
        print("SUCCESS: Correctly identified raw JSON review!")
    else:
        print("Resulting Error:", data['error'])
    print("-" * 50)