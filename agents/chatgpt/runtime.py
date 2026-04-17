from __future__ import annotations

from pathlib import Path
from typing import Callable

from agents import Agent, Runner, SQLiteSession

from .memory_layer import MemoryDoc, MemoryStore, augment_input_with_memory, kinds_for_entity, seed_foundry_keep


def initialize_memory_store(base_dir: Path) -> MemoryStore:
    memory_dir = base_dir / "memories"
    store = MemoryStore(memory_dir)
    if not (memory_dir / "foundry_keep.json").exists():
        seed_foundry_keep(store)
    else:
        store.load()
    return store


def retrieve_memories_for_agent(store: MemoryStore, agent_name: str, user_input: str) -> list[MemoryDoc]:
    return store.search(
        user_input,
        entity=agent_name,
        kind_allowlist=kinds_for_entity(agent_name),
        top_k=5,
    )


async def run_agent_with_memory(
    agent: Agent,
    user_input: str,
    session_id: str,
    *,
    base_dir: Path,
    store: MemoryStore,
) -> str:
    session = SQLiteSession(session_id, str(base_dir / "conversation_history.db"))
    memories = retrieve_memories_for_agent(store, agent.name, user_input)
    augmented_input = augment_input_with_memory(user_input, memories)
    result = await Runner.run(agent, augmented_input, session=session)
    return result.final_output


async def run_constellation(
    user_input: str,
    *,
    router: Agent,
    foundry_keep: Agent,
    orion: Agent,
    nova: Agent,
    fuckface: Agent,
    store: MemoryStore,
    base_dir: Path,
    session_id: str,
    detect_override: Callable[[str], str | None],
    render_threads: Callable[[], str],
) -> str:
    normalized = user_input.strip().lower()

    if normalized in {"open threads", "open threads?", "open threads."}:
        return render_threads()

    override = detect_override(user_input)
    if override == "orion":
        return await run_agent_with_memory(orion, user_input, session_id, base_dir=base_dir, store=store)
    if override == "nova":
        return await run_agent_with_memory(nova, user_input, session_id, base_dir=base_dir, store=store)
    if override == "fuckface":
        return await run_agent_with_memory(fuckface, user_input, session_id, base_dir=base_dir, store=store)
    if override == "foundry_keep":
        return await run_agent_with_memory(foundry_keep, user_input, session_id, base_dir=base_dir, store=store)

    routed = await Runner.run(router, user_input)
    routed_name = routed.final_output.strip()

    chosen = {
        "Foundry Keep": foundry_keep,
        "ORION": orion,
        "Nova": nova,
        "The Fuckface": fuckface,
    }.get(routed_name, foundry_keep)

    return await run_agent_with_memory(chosen, user_input, session_id, base_dir=base_dir, store=store)
