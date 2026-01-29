"""
Project analyzer service.
Scans project directory and returns existing file names, dependencies, and a 
module dependency graph using robust AST parsing.
"""
import json
import logging
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Set, Optional
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ProjectAnalyzerService:
    """Service to analyze project structure and file information using robust techniques."""

    def __init__(self, project_root: str):
        if not project_root or not os.path.exists(project_root):
            raise ValueError(f"Valid project root directory is required. Got: {project_root}")
        
        self.project_root = Path(project_root).resolve()
        self.parser_script_path = Path(__file__).parent / "AST_parser/parser.js"
        if not self.parser_script_path.exists():
            raise FileNotFoundError("Node.js parser script 'parser.js' not found.")
            
        # Baseline ignore patterns
        self.ignored_dirs = {'.git', 'node_modules', 'dist', 'build', '.vscode', '.idea', '__pycache__'}
        self.ignored_files = {'.DS_Store', 'package-lock.json', 'yarn.lock', 'eslint.config.js', 'vite-env.d.ts'}
        self.code_file_extensions = {'.ts', '.tsx', '.js', '.jsx'}
        
        logger.info(f"ProjectAnalyzerService initialized for {self.project_root}")

    def _is_path_ignored(self, path: Path) -> bool:
        """Checks if a path should be ignored by baseline rules."""
        if any(part in self.ignored_dirs for part in path.parts) or path.name in self.ignored_files:
            return True
        return False

    def _scan_project_files(self, base_dir: Path, extensions: Optional[Set[str]] = None) -> List[Path]:
        """
        Scans a directory recursively with performance optimizations, respecting ignore rules.
        """
        files: List[Path] = []
        
        # Use a custom recursive function for performance gain
        def recurse(current_dir: Path):
            if not current_dir.is_dir():
                return
            for path in current_dir.iterdir():
                if self._is_path_ignored(path):
                    continue
                if path.is_dir():
                    recurse(path)
                elif path.is_file():
                    if extensions is None or path.suffix in extensions:
                        files.append(path)

        recurse(base_dir)
        return sorted(files)

    def read_package_dependencies(self) -> Dict[str, Any]:
        """Reads package.json and returns its dependency information."""
        try:
            package_json_path = self.project_root / "package.json"
            if not package_json_path.is_file():
                return self._create_error_response("package.json not found.")

            with package_json_path.open("r", encoding="utf-8") as f:
                data = json.load(f)
            return {
                "tool": "project_analyzer",
                "result": {
                    "status": "success",
                    "dependencies": data.get("dependencies", {}),
                    "devDependencies": data.get("devDependencies", {})
                }
            }
        except Exception as e:
            return self._create_error_response(f"Error reading package.json: {e}")

    # ---------------- Helpers for markdown formatting ---------------- #

    def _tree_to_markdown(self, tree: Dict[str, Any], root_label: Optional[str] = None) -> str:
        """
        Convert a nested dict tree structure into a tree-like markdown string.

        Directories get a trailing slash:
        src/
          components/
            Button.tsx
        """
        lines: List[str] = []

        if root_label:
            lines.append(f"{root_label}/")
            base_indent = 2
        else:
            base_indent = 0

        def recurse(node: Dict[str, Any], indent: int) -> None:
            # Directories first, then files, both sorted
            dir_names = sorted(k for k, v in node.items() if isinstance(v, dict))
            file_names = sorted(k for k, v in node.items() if not isinstance(v, dict))

            for d in dir_names:
                lines.append(" " * indent + f"{d}/")
                recurse(node[d], indent + 2)

            for f in file_names:
                lines.append(" " * indent + f)

        recurse(tree, base_indent)
        return "\n".join(lines)

    def _dependency_graph_to_markdown(self, nodes: List[Dict[str, Any]]) -> str:
        """
        Convert a list of dependency graph nodes into a readable markdown format.

        Example:

        # Dependency Graph

        ## `src/components/Button.tsx`

        - **Imports**
          - `react`
          - `../Header`

        - **Exports**
          - `Button`
        """
        lines: List[str] = ["# Dependency Graph", ""]

        # Sort by file id for stable output
        nodes_sorted = sorted(nodes, key=lambda n: n["id"])

        for node in nodes_sorted:
            file_id = node["id"]
            imports = node.get("imports") or []
            exports = node.get("exports") or []

            lines.append(f"## `{file_id}`")
            lines.append("")

            if imports:
                lines.append("- **Imports**")
                for imp in imports:
                    lines.append(f"  - `{imp}`")
                lines.append("")

            if exports:
                lines.append("- **Exports**")
                for ex in exports:
                    lines.append(f"  - `{ex}`")
                lines.append("")

            # Separate files with a blank line
            lines.append("")

        # Strip trailing whitespace/newlines
        return "\n".join(lines).rstrip()

    # ---------------- Project tree: now markdown ---------------- #

    def get_project_tree(self, include_hidden: bool = False, max_depth: Optional[int] = None) -> Dict[str, Any]:
        """
        Generates a markdown representation of the entire project's directory tree,
        not just code files. Respects ignore rules and includes empty folders.

        Args:
            include_hidden: If True, include dot-files/dirs except those in ignore lists.
            max_depth: Optional depth limit (0 = only root, 1 = root's children, etc.).
        """
        try:
            root = self.project_root
            project_tree: Dict[str, Any] = {}

            # Helper to ensure a nested path exists in the tree and return its dict
            def ensure_dir_node(rel_parts: List[str]) -> Dict[str, Any]:
                node = project_tree
                for part in rel_parts:
                    node = node.setdefault(part, {})
                return node

            for dirpath, dirnames, filenames in os.walk(root):
                # Relativize and compute depth
                rel_dir = Path(dirpath).relative_to(root)
                depth = 0 if rel_dir == Path('.') else len(rel_dir.parts)
                if max_depth is not None and depth > max_depth:
                    # Stop descending further
                    dirnames[:] = []
                    continue

                # Prune ignored directories in-place so os.walk won't descend into them
                pruned: List[str] = []
                for d in list(dirnames):
                    # Skip hidden dirs unless include_hidden
                    if (not include_hidden and d.startswith('.')) or d in self.ignored_dirs:
                        pruned.append(d)
                for d in pruned:
                    dirnames.remove(d)

                # Create/ensure the current directory node
                current_node = ensure_dir_node([] if rel_dir == Path('.') else list(rel_dir.parts))

                # Ensure child directory nodes exist (so empty dirs show up)
                for d in sorted(dirnames):
                    if include_hidden or not d.startswith('.'):
                        current_node.setdefault(d, {})

                # Add files (skip ignored / hidden if requested)
                for f in sorted(filenames):
                    if f in self.ignored_files:
                        continue
                    if not include_hidden and f.startswith('.'):
                        continue
                    # Mark as file (could be replaced with metadata later)
                    current_node[f] = "file"

            # Convert dict-based tree to markdown
            markdown_tree = self._tree_to_markdown(
                project_tree
            )

            return {
                "tool": "project_analyzer",
                "result": {"status": "success", "tree_markdown": markdown_tree}
            }
        except Exception as e:
            return self._create_error_response(f"Error building project tree: {e}")

    # ---------------- Dependency graph: now markdown ---------------- #

    def build_dependency_graph(self) -> Dict[str, Any]:
        """
        Builds a dependency graph by parsing files with an AST parser
        and returns a markdown representation.
        """
        try:
            nodes: List[Dict[str, Any]] = []
            code_files = self._scan_project_files(self.project_root, self.code_file_extensions)

            for file_path in code_files:
                parsed_data = self._parse_file_with_node(file_path)
                if parsed_data:
                    nodes.append({
                        "id": file_path.relative_to(self.project_root).as_posix(),
                        "imports": sorted(parsed_data.get("imports", [])),
                        #"exports": sorted(parsed_data.get("exports", []))
                    })

            markdown_graph = self._dependency_graph_to_markdown(nodes)

            return {
                "tool": "project_analyzer",
                "result": {"status": "success", "graph_markdown": markdown_graph}
            }
        except Exception as e:
            return self._create_error_response(f"Error building dependency graph: {e}")
    
    def _parse_file_with_node(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Uses a Node.js subprocess for robust AST parsing."""
        try:
            command = ["node", str(self.parser_script_path), str(file_path)]
            result = subprocess.run(command, capture_output=True, text=True, check=True, encoding='utf-8')
            parsed_output = json.loads(result.stdout)
            if parsed_output.get("error"):
                logger.warning(f"AST parser error for {file_path}: {parsed_output['error']}")
                return None
            return parsed_output
        except FileNotFoundError:
            logger.error("`node` command not found. Please ensure Node.js is installed and in your PATH.")
            raise
        except subprocess.CalledProcessError as e:
            logger.error(f"Error running Node.js parser on {file_path}: {e.stderr}")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON from parser for {file_path}: {e}")
            return None

    def _create_error_response(self, message: str) -> Dict[str, Any]:
        return {"tool": "project_analyzer", "result": {"status": "error", "error": message}}

# --- Main execution block to demonstrate usage ---
if __name__ == "__main__":
    analyzer = ProjectAnalyzerService("../app_template/react-app")

    print("\n--- 1. Getting Project Tree (Markdown) ---")
    tree_result = analyzer.get_project_tree()
    if tree_result.get("result", {}).get("status") == "success":
        project_tree_str = tree_result["result"]["tree_markdown"]
        print(project_tree_str)
    else:
        logger.warning("Could not build project tree.")
        print(tree_result)

    print("\n--- 2. Reading package.json Dependencies ---")
    deps_result = analyzer.read_package_dependencies()
    print(json.dumps(deps_result["result"], indent=2))

    print("\n--- 3. Building Dependency Graph via AST Parsing (Markdown) ---")
    graph_result = analyzer.build_dependency_graph()
    if graph_result.get("result", {}).get("status") == "success":
        graph_markdown_str = graph_result["result"]["graph_markdown"]
        print(graph_markdown_str)
    else:
        logger.warning("Could not build dependency graph.")
        print(graph_result)
