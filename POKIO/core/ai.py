from openai import OpenAI
import os
from dotenv import load_dotenv
import time
import logging
from typing import List, Dict, Generator, Any
import requests

load_dotenv()

# Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Constants
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

try:
    INPUT_COST = float(os.getenv("INPUT_COST", "0.0"))
    OUTPUT_COST = float(os.getenv("OUTPUT_COST", "0.0"))
except ValueError as e:
    logger.error(f"Invalid INPUT_COST or OUTPUT_COST env values: {e}")
    INPUT_COST = 0.0
    OUTPUT_COST = 0.0


class AI:
    def __init__(self, model: str, temperature=0.1, stream=True, tools: List[Dict[str, Any]] = None, reasoning: bool = False):
        self.init_env()
        self.model = model
        self.temperature = temperature
        self.stream = stream
        self.tools = tools
        self.reasoning = reasoning

        self.total_tokens_used = 0
        self.total_input_tokens = 0
        self.total_output_tokens = 0

        self.last_call_tokens = 0
        self.last_input_tokens = 0
        self.last_output_tokens = 0
        self.last_call_duration = 0.0
        self.last_stop_reason = None

        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY")
        )

        logger.info(f"AI initialized with model: {model}, temperature: {temperature}")

    @classmethod
    def init_env(cls):
        if not OPENROUTER_API_KEY:
            logger.error("Missing OPENROUTER_API_KEY environment variable")
            raise EnvironmentError("Missing required environment variable OPENROUTER_API_KEY")

    def supports_tools(self) -> bool:
        url = "https://openrouter.ai/api/v1/models"
        headers = {"Authorization": f"Bearer {OPENROUTER_API_KEY}"}

        response = requests.get(url, headers=headers)
        response.raise_for_status()
        models = response.json().get("data", [])

        for model in models:
            if model.get("id") == self.model:
                logger.info(f"{self.model} supports tool use.")
                return model.get("tools", False)

        logger.info(f"{self.model} does not support tool use.")
        return False

    def set_tools(self, tools: List[Dict[str, Any]]):
        self.tools = tools

    def call_model(self, messages: List[Dict[str, str]]) -> Generator[str, None, None]:
        logger.info(f"Calling model: {self.model}")

        # Reset stats
        self.last_call_tokens = 0
        self.last_input_tokens = 0
        self.last_output_tokens = 0
        self.last_call_duration = 0.0
        self.last_stop_reason = None

        start_time = time.time()
        stall_timeout = 120  # seconds
        chunk_count = 0
        last_received = time.time()

        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                stream=self.stream,
                extra_body={
                    "provider": {"sort": 'throughput'},
                    "reasoning": {"enabled": True} if self.reasoning else None
                }
            )

            logger.info("Stream opened, awaiting response chunks...")

            for chunk in stream:
                now = time.time()
                chunk_count += 1

                if now - last_received > stall_timeout:
                    logger.warning(f"No data received for {stall_timeout}s, aborting.")
                    yield "\n[Error: No response received for too long]"
                    break

                # Log finish reason if present (non-null)
                if chunk.choices and chunk.choices[0].finish_reason:
                    self.last_stop_reason = chunk.choices[0].finish_reason
                    logger.info(f"⚙️ Stop reason: {self.last_stop_reason}")

                # Handle streamed text
                if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                    last_received = now
                    yield chunk.choices[0].delta.content

                # Capture usage stats (if available)
                if hasattr(chunk, "usage") and chunk.usage:
                    self.last_input_tokens = getattr(chunk.usage, "prompt_tokens", 0)
                    self.last_output_tokens = getattr(chunk.usage, "completion_tokens", 0)
                    self.last_call_tokens = getattr(chunk.usage, "total_tokens", 0)

            total_time = time.time() - start_time
            self.last_call_duration = total_time

            logger.info(f"Response complete: {chunk_count} chunks in {total_time:.2f}s")
            if self.last_stop_reason:
                logger.info(f"Final stop reason: {self.last_stop_reason}")
            else:
                logger.warning("No explicit stop reason received — possibly incomplete output.")

            self.total_tokens_used += self.last_call_tokens

        except Exception as e:
            self.last_call_duration = time.time() - start_time
            logger.exception(f"Error during model call: {e}")
            yield f"\n[Error: {str(e)}]"

    def get_total_token_usage(self):
        return self.total_tokens_used

    def get_call_token_usage(self):
        return self.last_call_tokens

    def get_call_duration(self):
        return self.last_call_duration

    def get_stop_reason(self):
        return self.last_stop_reason

    def calculate_token_cost(self) -> float:
        """Calculate the cost of token usage in USD."""
        input_cost = (self.last_input_tokens / 1_000_000) * INPUT_COST
        output_cost = (self.last_output_tokens / 1_000_000) * OUTPUT_COST
        return input_cost + output_cost
