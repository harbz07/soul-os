import re
import json
import httpx
from typing import Optional, Dict, Any, List

# Regex parser for the memory commit banner
MEMORY_BANNER_REGEX = re.compile(r"\[\s*🟢\s*MEMORY\s*COMMIT\s*SUCCESSFUL\s*\]\s*(.*?)(?=\n\n|\Z)", re.DOTALL | re.IGNORECASE)

class TriptychRuntime:
    def __init__(self, mem0_api_key: str, soul_os_api_url: str = "https://api.soul-os.cc"):
        self.mem0_api_key = mem0_api_key
        self.soul_os_api_url = soul_os_api_url
        self.headers = {
            "Authorization": f"Token {self.mem0_api_key}",
            "Content-Type": "application/json"
        }

    def retrieve_context(self, query: str, user_id: str = "harvey", top_k: int = 12) -> List[Dict[str, Any]]:
        """
        Retrieve context from Mem0 for the Triptych personas.
        """
        url = "https://api.mem0.ai/v2/memories/search/"
        payload = {
            "query": query,
            "filters": {"user_id": user_id},
            "top_k": top_k
        }
        
        try:
            response = httpx.post(url, headers=self.headers, json=payload, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            # Handle both list return and dict with 'results' key
            return data if isinstance(data, list) else data.get("results", [])
        except Exception as e:
            print(f"[TriptychRuntime] Error retrieving context from Mem0: {e}")
            return []

    def parse_memory_banner(self, text: str) -> Optional[str]:
        """
        Scrape output for the memory banner.
        If found, return the extracted memory payload.
        """
        match = MEMORY_BANNER_REGEX.search(text)
        if match:
            return match.group(1).strip()
        return None

    def pipe_memory_to_soul_os(self, memory_content: str, project_id: str = "triptych") -> bool:
        """
        Pipe extracted vectors back to soul-os-api/memory/add.
        """
        url = f"{self.soul_os_api_url}/memory/add"
        payload = {
            "content": memory_content,
            "type": "semantic",
            "scope": "project",
            "project_id": project_id,
            "tags": ["triptych", "auto-commit"]
        }
        
        try:
            # Assuming soul-os-api uses the same token or a specific master key
            # We'll use the mem0 key as a placeholder if it's a direct proxy, 
            # or it might need a specific soul-os key.
            response = httpx.post(url, headers=self.headers, json=payload, timeout=10.0)
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"[TriptychRuntime] Error piping memory to soul-os-api: {e}")
            return False

    def process_response(self, response_text: str) -> Dict[str, Any]:
        """
        Process the LLM response, extract memory if present, and return the final payload.
        """
        memory_content = self.parse_memory_banner(response_text)
        memory_committed = False
        
        if memory_content:
            memory_committed = self.pipe_memory_to_soul_os(memory_content)
            
        return {
            "response": response_text,
            "memory_extracted": memory_content,
            "memory_committed": memory_committed
        }
