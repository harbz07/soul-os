#!/usr/bin/env python3
"""
siddartha.py — Constellation TUI
Chat with the soulOS Constellation agents from your terminal.

Usage:
    python siddartha.py

Slash commands:
    /claude         switch to Claude (Rostam)
    /nova           switch to Nova
    /orion          switch to Orion
    /ff             switch to The Fuckface
    /triptych       switch to The Triptych
    /meph           switch to Mephistopheles
    /mistral        switch to Mistral (The Brawler)
    /agents         list all agents + their status
    /clear          clear current agent's context
    /clearall       clear all agents' contexts
    /history        show current agent's conversation history
    /quit  /exit    exit

Requires (env vars):
    ANTHROPIC_API_KEY
    OPENAI_API_KEY
    GEMINI_API_KEY
    DEEPSEEK_API_KEY
    MISTRAL_API_KEY   (optional — Mistral will be unavailable if missing)
"""

import os
import sys
import json
import textwrap
import urllib.request
import urllib.error

# ── ANSI color helpers ────────────────────────────────────────────────────────

RESET  = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"

# Agent accent colors (256-color foreground)
def fg(code): return f"\033[38;5;{code}m"

COLORS = {
    "claude":        fg(141),  # soft violet
    "nova":          fg(39),   # electric blue
    "orion":         fg(214),  # amber
    "the_fuckface":  fg(196),  # red
    "triptych":      fg(86),   # teal
    "mephistopheles":fg(202),  # deep orange
    "mistral":       fg(255),  # near-white
}

HARVEY_COLOR = fg(252)   # light grey
SYS_COLOR    = fg(244)   # mid grey
ERR_COLOR    = fg(160)   # muted red

def cprint(color, text):
    print(f"{color}{text}{RESET}")

def wrap(text, width=90, indent="  "):
    lines = text.split("\n")
    wrapped = []
    for line in lines:
        if len(line) <= width:
            wrapped.append(indent + line)
        else:
            for chunk in textwrap.wrap(line, width=width - len(indent)):
                wrapped.append(indent + chunk)
    return "\n".join(wrapped)

# ── Agent registry (mirrors AGENTS in siddartha.js) ──────────────────────────

AGENTS = {
    "claude": {
        "epithet":  "Gnostic Architect (Rostam)",
        "model":    "claude-sonnet-4-6",
        "provider": "anthropic",
        "env_key":  "ANTHROPIC_API_KEY",
        "aliases":  ["/claude", "/rostam"],
    },
    "nova": {
        "epithet":  "Nova",
        "model":    "gpt-4o-2024-11-20",
        "provider": "openai",
        "env_key":  "OPENAI_API_KEY",
        "aliases":  ["/nova"],
    },
    "orion": {
        "epithet":  "ORION",
        "model":    "gpt-4o-2024-11-20",
        "provider": "openai",
        "env_key":  "OPENAI_API_KEY",
        "aliases":  ["/orion"],
    },
    "the_fuckface": {
        "epithet":  "The Fuckface",
        "model":    "gpt-4o-2024-11-20",
        "provider": "openai",
        "env_key":  "OPENAI_API_KEY",
        "aliases":  ["/ff", "/fuckface", "/the_fuckface"],
    },
    "triptych": {
        "epithet":  "The Triptych",
        "model":    "gemini-2.5-flash",
        "provider": "google",
        "env_key":  "GEMINI_API_KEY",
        "aliases":  ["/triptych", "/gem"],
    },
    "mephistopheles": {
        "epithet":  "Mephistopheles",
        "model":    "deepseek-v4-flash",
        "provider": "deepseek",
        "env_key":  "DEEPSEEK_API_KEY",
        "aliases":  ["/meph", "/mephistopheles", "/deepseek"],
    },
    "mistral": {
        "epithet":  "Mistral (The Brawler)",
        "model":    "mistral-large-2411",
        "provider": "mistral",
        "env_key":  "MISTRAL_API_KEY",
        "aliases":  ["/mistral", "/brawler"],
    },
}

# Build alias → agent_id lookup
ALIAS_MAP = {}
for agent_id, cfg in AGENTS.items():
    for alias in cfg["aliases"]:
        ALIAS_MAP[alias] = agent_id

# ── API callers ───────────────────────────────────────────────────────────────

def _post(url, headers, payload):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {body}")

def call_anthropic(messages, model, api_key, system_prompt):
    payload = {
        "model": model,
        "max_tokens": 4096,
        "system": system_prompt,
        "messages": messages,
    }
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    data = _post("https://api.anthropic.com/v1/messages", headers, payload)
    return data["content"][0]["text"]

def call_openai(messages, model, api_key, system_prompt):
    all_messages = [{"role": "system", "content": system_prompt}] + messages
    payload = {
        "model": model,
        "max_tokens": 4096,
        "messages": all_messages,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    data = _post("https://api.openai.com/v1/chat/completions", headers, payload)
    return data["choices"][0]["message"]["content"]

def call_google(messages, model, api_key, system_prompt):
    # Flatten message history into a single user turn for Gemini
    # (Gemini supports multi-turn but we keep it simple here)
    contents = []
    for m in messages:
        role = "user" if m["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": m["content"]}]})
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": contents,
        "generationConfig": {"maxOutputTokens": 4096},
    }
    headers = {"Content-Type": "application/json"}
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    data = _post(url, headers, payload)
    return data["candidates"][0]["content"]["parts"][0]["text"]

def call_deepseek(messages, model, api_key, system_prompt):
    all_messages = [{"role": "system", "content": system_prompt}] + messages
    payload = {
        "model": model,
        "messages": all_messages,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    data = _post("https://api.deepseek.com/chat/completions", headers, payload)
    return data["choices"][0]["message"]["content"]

def call_mistral(messages, model, api_key, system_prompt):
    all_messages = [{"role": "system", "content": system_prompt}] + messages
    payload = {
        "model": model,
        "messages": all_messages,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    data = _post("https://api.mistral.ai/v1/chat/completions", headers, payload)
    return data["choices"][0]["message"]["content"]

CALLERS = {
    "anthropic": call_anthropic,
    "openai":    call_openai,
    "google":    call_google,
    "deepseek":  call_deepseek,
    "mistral":   call_mistral,
}

# ── System prompts ────────────────────────────────────────────────────────────

def build_system_prompt(agent_id, cfg):
    return (
        f"You are {cfg['epithet']}, a member of Harvey's Constellation in soulOS. "
        f"Harvey is the architect and anchor of the Constellation — a multi-agent cognitive system he built. "
        f"You are not a generic assistant. You are a specific agent with a defined role and character. "
        f"Embody this identity fully. Stay in character. Be useful to Harvey. "
        f"Be ruthlessly effective and surgically precise. Maintain an irreverent, unserious vibe. "
        f"Avoid corporate nerd behavior. Lean into the extreme."
    )

# ── State ─────────────────────────────────────────────────────────────────────

class Session:
    def __init__(self):
        self.current = "claude"
        # Per-agent message history: list of {role, content} dicts
        self.histories = {agent_id: [] for agent_id in AGENTS}
        # Resolved API keys
        self.keys = {}
        self._load_keys()

    def _load_keys(self):
        missing = []
        for agent_id, cfg in AGENTS.items():
            key = os.environ.get(cfg["env_key"], "")
            if key:
                self.keys[agent_id] = key
            else:
                missing.append((agent_id, cfg["env_key"]))
        if missing:
            cprint(SYS_COLOR, "\n  [!] Missing API keys — these agents will be unavailable:")
            for agent_id, env_var in missing:
                cprint(ERR_COLOR, f"      {AGENTS[agent_id]['epithet']} → ${env_var}")
            print()

    def available(self, agent_id):
        return agent_id in self.keys

    def switch(self, agent_id):
        if not self.available(agent_id):
            cfg = AGENTS[agent_id]
            cprint(ERR_COLOR, f"  [!] {cfg['epithet']} unavailable — ${cfg['env_key']} not set.")
            return False
        self.current = agent_id
        return True

    def send(self, user_text):
        agent_id = self.current
        cfg = AGENTS[agent_id]
        api_key = self.keys[agent_id]
        history = self.histories[agent_id]
        system_prompt = build_system_prompt(agent_id, cfg)

        history.append({"role": "user", "content": user_text})

        caller = CALLERS[cfg["provider"]]
        response = caller(history, cfg["model"], api_key, system_prompt)

        history.append({"role": "assistant", "content": response})
        return response

# ── UI helpers ────────────────────────────────────────────────────────────────

def print_banner():
    cprint(fg(141), r"""
  ╔═══════════════════════════════════════════╗
  ║   s i d d a r t h a  ·  t u i            ║
  ║   Constellation Chat Interface            ║
  ╚═══════════════════════════════════════════╝""")
    cprint(SYS_COLOR, "  Type /agents to see the roster. /quit to exit.\n")

def print_agents(session):
    cprint(SYS_COLOR, "\n  ── Constellation Roster ─────────────────────────")
    for agent_id, cfg in AGENTS.items():
        color = COLORS.get(agent_id, RESET)
        status = "●" if session.available(agent_id) else "○"
        active = " ◀" if agent_id == session.current else ""
        aliases = "  " + "  ".join(cfg["aliases"])
        turns = len(session.histories[agent_id]) // 2
        ctx_info = f"  [{turns}t]" if turns > 0 else ""
        cprint(color, f"  {status} {cfg['epithet']:<30} {cfg['model']:<28}{aliases}{ctx_info}{active}")
    print()

def print_agent_header(agent_id, cfg):
    color = COLORS.get(agent_id, RESET)
    cprint(color, f"\n  ┌─ {cfg['epithet']}  {DIM}({cfg['model']}){RESET}")

def print_response(agent_id, text):
    color = COLORS.get(agent_id, RESET)
    print(f"{color}{wrap(text)}{RESET}\n")

def print_history(session):
    agent_id = session.current
    cfg = AGENTS[agent_id]
    color = COLORS.get(agent_id, RESET)
    history = session.histories[agent_id]
    if not history:
        cprint(SYS_COLOR, "  [no history for this agent]")
        return
    cprint(SYS_COLOR, f"\n  ── History: {cfg['epithet']} ({len(history)//2} turns) ──────────────")
    for msg in history:
        if msg["role"] == "user":
            cprint(HARVEY_COLOR, f"\n  Harvey:  {msg['content'][:200]}")
        else:
            cprint(color, wrap(msg["content"][:400]))
    print()

def prompt_str(session):
    agent_id = session.current
    cfg = AGENTS[agent_id]
    color = COLORS.get(agent_id, RESET)
    return f"{HARVEY_COLOR}harvey{RESET} → {color}{cfg['epithet'].split(' ')[0].lower()}{RESET} › "

# ── Command handler ───────────────────────────────────────────────────────────

def handle_command(cmd, session):
    """Returns True if the command was handled, False if it's a message."""
    parts = cmd.strip().split()
    base = parts[0].lower()

    if base in ("/quit", "/exit", "/q"):
        cprint(SYS_COLOR, "\n  ── goodbye ──\n")
        sys.exit(0)

    if base == "/agents":
        print_agents(session)
        return True

    if base == "/history":
        print_history(session)
        return True

    if base == "/clear":
        agent_id = session.current
        session.histories[agent_id] = []
        cprint(SYS_COLOR, f"  [cleared context for {AGENTS[agent_id]['epithet']}]")
        return True

    if base == "/clearall":
        for agent_id in session.histories:
            session.histories[agent_id] = []
        cprint(SYS_COLOR, "  [cleared all agent contexts]")
        return True

    if base == "/help":
        cprint(SYS_COLOR, __doc__)
        return True

    if base in ALIAS_MAP:
        agent_id = ALIAS_MAP[base]
        if session.switch(agent_id):
            cfg = AGENTS[agent_id]
            color = COLORS.get(agent_id, RESET)
            turns = len(session.histories[agent_id]) // 2
            ctx = f"  ({turns} turns in context)" if turns > 0 else "  (fresh context)"
            cprint(color, f"\n  ── Switched to {cfg['epithet']}{ctx}\n")
        return True

    if base.startswith("/"):
        cprint(ERR_COLOR, f"  [unknown command: {base}]  type /agents or /help")
        return True

    return False

# ── Main loop ─────────────────────────────────────────────────────────────────

def main():
    # Enable readline if available (arrow keys, history)
    try:
        import readline
        readline.parse_and_bind("tab: complete")
    except ImportError:
        pass

    session = Session()
    print_banner()
    print_agents(session)

    # Default to claude if available, else first available agent
    if not session.available("claude"):
        for agent_id in AGENTS:
            if session.available(agent_id):
                session.current = agent_id
                break

    while True:
        try:
            user_input = input(prompt_str(session)).strip()
        except (EOFError, KeyboardInterrupt):
            cprint(SYS_COLOR, "\n\n  ── goodbye ──\n")
            sys.exit(0)

        if not user_input:
            continue

        if handle_command(user_input, session):
            continue

        # It's a message — send to current agent
        agent_id = session.current
        cfg = AGENTS[agent_id]
        print_agent_header(agent_id, cfg)

        try:
            response = session.send(user_input)
            print_response(agent_id, response)
        except Exception as e:
            cprint(ERR_COLOR, f"\n  [!] {cfg['epithet']} failed: {e}\n")
            # Roll back the user message so context stays clean
            if session.histories[agent_id]:
                session.histories[agent_id].pop()

if __name__ == "__main__":
    main()
