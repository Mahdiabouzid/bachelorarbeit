import os
import sys
import logging
import argparse
from dotenv import load_dotenv
import utils

# Import the central component of the application
from orchestrator2 import Orchestrator

# --- ANSI Color Codes for Better CLI Output ---
COLOR_GREEN = '\033[92m'
COLOR_YELLOW = '\033[93m'
COLOR_RED = '\033[91m'
COLOR_BLUE = '\033[94m'
COLOR_RESET = '\033[0m'

def setup_logging():
    """Configures the logging for the application."""
    logging.basicConfig(
        level=logging.INFO, 
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        stream=sys.stdout  # Ensure logs go to standard output
    )
    # Silence overly verbose libraries if necessary
    # logging.getLogger("some_library").setLevel(logging.WARNING)
    logging.getLogger(__name__).info("Logging configured.")

def print_welcome_message():
    """Prints a stylized welcome message to the console."""
    print(f"{COLOR_BLUE}###############################################{COLOR_RESET}")
    print(f"{COLOR_BLUE}#                                             #{COLOR_RESET}")
    print(f"{COLOR_BLUE}#        Welcome to POKIO AI Agent            #{COLOR_RESET}")
    print(f"{COLOR_BLUE}#   Your React Frontend Generation Assistant  #{COLOR_RESET}")
    print(f"{COLOR_BLUE}#                                             #{COLOR_RESET}")
    print(f"{COLOR_BLUE}###############################################{COLOR_RESET}")
    print("\nI am ready to help you build your React application.")
    print(f"Type your request, or enter '{COLOR_YELLOW}exit{COLOR_RESET}' or '{COLOR_YELLOW}quit{COLOR_RESET}' to close the application.\n")

def main():
    """
    Main entry point for the POKIO application.

    This function initializes the system, parses arguments, creates the
    Orchestrator, and runs the main user interaction loop.
    """
    load_dotenv()
    setup_logging()
    
    parser = argparse.ArgumentParser(description="POKIO: An AI agent for generating React frontend code.")
    parser.add_argument(
        "--project-root",
        type=str,
        default=os.getenv("PROJECT_ROOT"),
        help="The absolute path to the root of the React project. Defaults to the PROJECT_ROOT environment variable."
    )
    args = parser.parse_args()

    if not args.project_root:
        logging.error("Error: Project root directory is not specified.")
        print(f"{COLOR_RED}Please specify the project root via the --project-root argument or the PROJECT_ROOT environment variable.{COLOR_RESET}")
        sys.exit(1)

    if not os.path.isdir(args.project_root):
        logging.error(f"Error: The specified project root does not exist or is not a directory: {args.project_root}")
        sys.exit(1)

    try:
        # --- Initialization ---
        # The main application's primary job is to create and configure the orchestrator.
        utils.initiliaze_react_app(src="../app_template/src", dest="../app_template/react-app/src")

        orchestrator = Orchestrator(project_root=args.project_root)
        print_welcome_message()

        # --- Main Interaction Loop ---
        while True:
            try:
                user_request = input(f"{COLOR_GREEN}>>> {COLOR_RESET}")

                if not user_request.strip():
                    continue

                if user_request.lower() in ["exit", "quit"]:
                    print(f"{COLOR_YELLOW}Thank you for using POKIO. Goodbye!{COLOR_RESET}")
                    break
                
                # --- Delegation ---
                # The main app hands off control to the orchestrator and waits for a final report.
                # It does not need to know about the internal steps (verification, retries, etc.).
                print(f"{COLOR_BLUE}Processing your request...{COLOR_RESET}")
                report = orchestrator.handle_user_request(user_request)

                # --- Reporting ---
                # Display the results to the user in a clean format.
                if report and report.get("status") == "success":
                    print(f"\n{COLOR_GREEN}✔ Request completed successfully!{COLOR_RESET}")
                    print(f"Report: {report}")
                
                elif report:
                    print(f"\n{COLOR_RED}✘ Request failed.{COLOR_RESET}")
                    reason = report.get('reason', 'No reason provided.')
                    details = report.get('details', 'No details provided.')
                    print(f"  Reason: {reason}")
                    print(f"  Details: {details}")

                else:
                    print(f"\n{COLOR_YELLOW}⚠ Request completed with an unknown state.{COLOR_RESET}")

                print("-" * 50)


            except KeyboardInterrupt:
                print(f"\n{COLOR_YELLOW}Operation cancelled by user. Goodbye!{COLOR_RESET}")
                break
            except Exception as e:
                logging.error(f"An unexpected error occurred in the main loop: {e}", exc_info=True)
                print(f"{COLOR_RED}An unexpected critical error occurred. Please check the logs.{COLOR_RESET}")

    except Exception as e:
        logging.critical(f"Failed to initialize the Orchestrator: {e}", exc_info=True)
        print(f"{COLOR_RED}A critical error occurred during startup. The application cannot continue.{COLOR_RESET}")
        sys.exit(1)


if __name__ == "__main__":
    main()