# soulOS Copilot Instructions

soulOS is a constellation-based operating system for AI agents. Multiple models, tools, and memory systems act as collaborators instead of isolated endpoints.

## Architecture & Tech Stack
- **Primary Runtime:** JavaScript (Node.js) for core orchestration, API layers, and UI.
- **AI/ML Layer:** Python for specific model interactions and heavy data processing.
- **Design Philosophy:** Keep backend code simple, highly modular, and well-documented.

## Custom Agent Implementation Guidelines
When generating code or designing architecture for soulOS, adhere to these minimal agent patterns:

### 1. Orchestrator Agents (The Conductors)
- **Role:** Route messages, delegate tasks, and manage the lifecycle of other agents.
- **Rule:** Keep them lightweight. They should not do heavy processing, only decision-making and routing.
- **Communication:** Use standardized JSON message payloads for all inter-agent communication.

### 2. Memory Agents (The Context Keepers)
- **Role:** Handle short-term (episodic) and long-term (semantic) memory.
- **Rule:** Start minimal. Use basic JSON files or simple embedded databases (like SQLite) for storage before scaling to vector databases.
- **Code Style:** Ensure all memory retrieval functions are asynchronous (`async/await`).

### 3. Adapter / Tool Agents (The Hands)
- **Role:** Interface with external APIs, execute scripts, or run specialized Python tasks.
- **Rule:** Always wrap external calls in robust `try/catch` blocks. Fail gracefully and report errors back to the Orchestrator.

## Coding Standards for Backend
- **Simplicity First:** Since the backend is not the primary maintainer's strongest suit, prioritize readable code over clever one-liners.
- **Comments:** Include generous inline comments explaining *what* the code does and *why*.
- **Error Handling:** Never swallow errors. Always log them clearly to help with debugging.
