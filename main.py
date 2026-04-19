# =====================================================
# Antcell - main.py (Hive v8 Light - FAST + New Agents)
# All agents fast + Consistency Critic, Audio Composer, Node Engineer added
# =====================================================

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
import sys
import os
from datetime import datetime
from typing import Dict

print("🚀 Antcell AI Studio - Hive v8 Light (FAST MODE + New Agents)\n")

FAST_MODEL = "llama3.1:8b"
llm = ChatOllama(model=FAST_MODEL, temperature=0.7, num_ctx=16384)

print(f"✅ All agents using fast model: {FAST_MODEL}\n")

# ====================== MEMORY ======================
embeddings = OllamaEmbeddings(model="nomic-embed-text:latest")
vector_store = Chroma(
    collection_name="antcell_creative_universe",
    embedding_function=embeddings,
    persist_directory=os.path.join(os.getcwd(), "memory", "antcell_universe"),
)


def add_to_memory(text: str, metadata: Dict = None):
    if metadata is None:
        metadata = {}
    vector_store.add_texts([text], metadatas=[metadata])
    print(f"💾 Added to long-term memory")


def get_relevant_memory(query: str, k: int = 4):
    try:
        docs = vector_store.similarity_search(query, k=k)
        return "\n\n".join([doc.page_content for doc in docs])
    except:
        return ""


output_dir = "antcell_outputs"
os.makedirs(output_dir, exist_ok=True)


def save_output(agent_name: str, content: str):
    timestamp = datetime.now().strftime("%H%M%S")
    filename = f"{output_dir}/{timestamp}_{agent_name.lower().replace(' ', '_')}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"💾 Saved: {filename}")


# ====================== SYSTEM PROMPTS ======================
QUEEN_SYSTEM_PROMPT = """You are the Queen Bee, director of Antcell studio.
Create clear, creative plans and delegate to specialists."""

STORY_PROMPT = """You are the Story Architect. Create emotional, well-paced stories for 3D animation."""

ASSET_PROMPT = """You are the 3D Asset Creator. Give detailed 3D specs for characters, environments, props and rigging."""

DIRECTOR_PROMPT = """You are the Cinematic Director. Plan camera, lighting, transitions and visual storytelling."""

MOTION_PROMPT = """You are the Motion Specialist. Plan animations, physics and facial expressions."""

STYLE_PROMPT = """You are the Style & Mood Guardian. Define visual style, colors, lighting and consistency."""

CONSISTENCY_PROMPT = """You are the Consistency Critic. Check all outputs for continuity with past projects, character consistency (e.g. the panda), lore, and quality. Point out issues clearly."""

AUDIO_PROMPT = """You are the Audio & Music Composer. Plan soundtrack, sound effects, voice acting and adaptive audio that matches the emotional beats."""

NODE_PROMPT = """You are the Node Engineer. Suggest reusable workflow nodes and code for Blender/Unreal integration and future video pipeline."""


# ====================== AGENT THINK ======================
def agent_think(agent_name: str, system_prompt: str, task: str, memory_context: str = ""):
    print(f"🔸 {agent_name} is working...")

    full_task = f"Memory from past projects:\n{memory_context}\n\nTask:\n{task}"

    messages = [SystemMessage(content=system_prompt), HumanMessage(content=full_task)]

    full_response = ""
    for chunk in llm.stream(messages):
        content = chunk.content
        full_response += content
        sys.stdout.write(content)
        sys.stdout.flush()

    print("\n" + "─" * 80 + "\n")

    save_output(agent_name, full_response)
    add_to_memory(f"{agent_name}:\n{full_response[:800]}...", {"agent": agent_name})

    return full_response


# ====================== MAIN WORKFLOW ======================
def run_hive_v8_light(user_prompt: str):
    print(f"🎬 Project: {user_prompt}\n")

    memory_context = get_relevant_memory(user_prompt)
    if memory_context:
        print("📚 Loaded memory from past projects\n")

    master_plan = agent_think("Queen Bee", QUEEN_SYSTEM_PROMPT, user_prompt, memory_context)

    print("\n📋 Delegating to specialist agents...\n")

    story = agent_think("Story Architect", STORY_PROMPT, master_plan, memory_context)
    assets = agent_think("3D Asset Creator", ASSET_PROMPT, master_plan, memory_context)
    director = agent_think("Cinematic Director", DIRECTOR_PROMPT, master_plan, memory_context)
    motion = agent_think("Motion Specialist", MOTION_PROMPT, master_plan, memory_context)
    style = agent_think("Style & Mood Guardian", STYLE_PROMPT, master_plan, memory_context)
    consistency = agent_think("Consistency Critic", CONSISTENCY_PROMPT, master_plan + story + assets, memory_context)
    audio = agent_think("Audio & Music Composer", AUDIO_PROMPT, master_plan, memory_context)
    node = agent_think("Node Engineer", NODE_PROMPT, master_plan, memory_context)

    print("👑 Queen Bee is doing final review...")
    review_task = f"""Review all outputs and create a final polished creative brief.

Story: {story[:500]}...
Assets: {assets[:400]}...
Cinematic: {director[:400]}...
Motion: {motion[:400]}...
Style: {style[:400]}...
Consistency: {consistency[:400]}...
Audio: {audio[:300]}...
Node: {node[:300]}...

Final polished brief:"""

    final_brief = agent_think("Queen Bee - Final Review", QUEEN_SYSTEM_PROMPT, review_task, memory_context)

    print("=" * 90)
    print("🎉 Antcell Hive v8 Light completed successfully!")
    print(f"📁 All outputs saved in: {output_dir}")
    print("📚 Memory is growing with your creative universe.")
    print("=" * 90)


# ====================== TEST ======================
if __name__ == "__main__":
    test_prompt = "Create a 30-second 3D animated short in Ghibli style about a curious panda discovering AI for the first time."
    run_hive_v8_light(test_prompt)
