"""
Tool service for POKIO system.
Handles execution of tools including file fetching and file operations.
"""
import os
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from file_operations_service import FileOperationsService

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

COLOR_GREEN = '\033[92m'
COLOR_RESET = '\033[0m'

class ToolService:
    """Service to execute POKIO tools and provide results."""
    
    def __init__(self, project_root: str, file_operations_service: FileOperationsService):
        """
        Initialize tool service.
        
        Args:
            project_root: Path to project root.
            file_operations_service: An instance of FileOperationsService.
        """
        self.project_root = project_root or os.getenv("PROJECT_ROOT")
        self.file_operations_service = file_operations_service
        if not self.file_operations_service:
            raise ValueError("ToolService requires an instance of FileOperationsService.")
    
    def to_string(self, data: Dict[str, Any]) -> str:
        """
        Convert a dictionary result to a formatted string representation.
        
        Args:
            data: Dictionary to convert to string
            
        Returns:
            Formatted string representation of the dictionary
        """
        if not isinstance(data, dict):
            return str(data)
        
        tool_name = data.get("tool", "unknown")
        result = data.get("result")
        
        if tool_name == "fetch_files":
            return self._format_fetch_files_result(data)
        elif tool_name == "write_to_files":
            return self._format_write_files_result(data)
        elif tool_name in ["ask_followup_question", "reply_to_message"]:
            return self._format_interaction_result(data)
        else:
            return self._format_generic_result(data)
    
    def _format_fetch_files_result(self, data: Dict[str, Any]) -> str:
        """Format fetch_files tool result."""
        result = data.get("result", [])
        lines = [f"Tool: {data.get('tool', 'fetch_files')}"]
        
        for file_result in result:
            file_path = file_result.get("filePath", "unknown")
            status = file_result.get("status", "unknown")
            
            lines.append(f"  File: {file_path}")
            lines.append(f"  Status: {status}")
            
            if status == "success":
                content = file_result.get("content", "")
                metadata = file_result.get("metadata", {})
                
                lines.append(f"  Content: {content}")
                if metadata:
                    lines.append(f"    File Size: {metadata.get('fileSize', 'unknown')} bytes")
                    lines.append(f"    Encoding: {metadata.get('encoding', 'unknown')}")
                    lines.append(f"    Last Modified: {metadata.get('lastModified', 'unknown')}")
            elif status == "error":
                error = file_result.get("error", "unknown error")
                lines.append(f"    Error: {error}")
        
        return "\n".join(lines)
    
    def _format_write_files_result(self, data: Dict[str, Any]) -> str:
        """Format write_to_files tool result."""
        result = data.get("result", "")
        return f"Tool: {data.get('tool', 'write_to_files')}\nResult: {result}"
    
    def _format_interaction_result(self, data: Dict[str, Any]) -> str:
        """Format ask_followup_question or reply_to_message tool result."""
        tool_name = data.get("tool", "interaction")
        result = data.get("result", {})
        
        lines = [f"Tool: {tool_name}"]
        
        if isinstance(result, dict):
            status = result.get("status", "unknown")
            answer = result.get("answer", "")
            
            lines.append(f"  Status: {status}")
            if answer:
                lines.append(f"  Answer: {answer}")
        else:
            lines.append(f"  Result: {result}")
        
        return "\n".join(lines)
    
    def _format_generic_result(self, data: Dict[str, Any]) -> str:
        """Format generic tool result or error response."""
        lines = []
        
        for key, value in data.items():
            if key == "result" and isinstance(value, list):
                lines.append(f"{key}:")
                for item in value:
                    if isinstance(item, dict):
                        for sub_key, sub_value in item.items():
                            lines.append(f"  {sub_key}: {sub_value}")
                    else:
                        lines.append(f"  {item}")
            else:
                lines.append(f"{key}: {value}")
        
        return "\n".join(lines)
        
    def execute_tool(self, tool_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the specified tool based on the tool_data.
        
        Args:
            tool_data: Dictionary containing tool name and parameters
            
        Returns:
            Dictionary with tool execution results
        """
        try:
            tool_name = tool_data.get("tool_name")
            parameters = tool_data.get("parameters", {})
            
            if not tool_name:
                return self._create_error_response("tool_execution", "Tool name not specified")
            
            logger.info(f"Executing tool: {tool_name}")
            if tool_name == "fetch_files":
                return self._fetch_files(parameters.get("filePaths", []))
            elif tool_name == "ask_followup_question":
                return self._ask_followup_question(parameters.get("question"))
            elif tool_name == "write_to_files":
                return self._write_to_files(parameters)
            else:
                return self._create_error_response("tool_execution", f"Unknown tool: {tool_name}")
                
        except Exception as e:
            logger.exception(f"Error executing tool: {str(e)}")
            return self._create_error_response("tool_execution", f"Tool execution error: {str(e)}")

    def _write_to_files(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Use the FileOperationsService to apply the requested code changes.
        
        Args:
            parameters: The parameters for the completion, including the changes list.
            
        Returns:
            A dictionary with the tool name and the report from the file operations.
        """
        changes = parameters.get("changes", [])
        
        if not changes:
            return {
            "tool": "write_to_files",
            "result": "No changes were provided."
        }

        logger.info(f"Writing to files with {len(changes)} changes.")
        
        # The core logic is now delegated to the file operations service
        report = self.file_operations_service.apply_changes(changes)
        
        # Return the report in the standard tool result format
        return {
            "tool": "write_to_files",
            "result": report
        }

    def _fetch_files(self, file_paths: List[str]) -> Dict[str, Any]:
        """
        Fetch the content of specified files.
        """
        if not file_paths:
            return self._create_error_response("fetch_files", "No file paths specified")
        
        results = []
        for file_path in file_paths:
            try:
                full_path = os.path.join(self.project_root, file_path)
                if not os.path.isfile(full_path):
                    results.append({"filePath": file_path, "status": "error", "error": "File not found"})
                    continue
                
                with open(full_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                file_size = os.path.getsize(full_path)
                results.append({
                    "filePath": file_path, "content": content, "status": "success",
                    "metadata": {
                        "fileSize": file_size, "encoding": "utf-8",
                        "lastModified": datetime.fromtimestamp(os.path.getmtime(full_path)).isoformat()
                    }
                })
            except Exception as e:
                logger.exception(f"Error fetching file {file_path}: {str(e)}")
                results.append({"filePath": file_path, "status": "error", "error": str(e)})
        
        return {"tool": "fetch_files", "result": results}
    
    def _ask_followup_question(self, question: Optional[str]) -> Dict[str, Any]:
        """
        Record a followup question for the user.
        """
        if not question:
            return self._create_error_response("ask_followup_question", "No question specified")

        print(f"{question}")
        answer = input(f"{COLOR_GREEN}>>> {COLOR_RESET}")

        return {"tool": "ask_followup_question", "result": {"status": "success", "answer": answer}}
    
    def _reply_to_message(self, message: Optional[str]) -> Dict[str, Any]:
        """
        Record a followup question for the user.
        """
        if not message:
            return self._create_error_response("ask_followup_question", "No question specified")

        print(f"{message}")
        answer = input(f"{COLOR_GREEN}>>> {COLOR_RESET}")

        return {"tool": "reply_to_message", "result": {"status": "success", "answer": answer}}
                
    def _create_error_response(self, tool_name: str, error_message: str) -> Dict[str, Any]:
        """
        Create a standardized error response.
        """
        return {
            "tool": tool_name,
            "result": [{"status": "error", "error": error_message, "timestamp": datetime.now().isoformat()}]
        }