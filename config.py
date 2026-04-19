# Antcell - Core Configuration (Fully Local + Safe)
# Using only your installed local models to avoid cloud limits

from typing import Dict


# Updated model mappings - avoiding cloud models for now
MODEL_CONFIG = {
    "queen": "qwen3.5:27b",
    "story_architect": "qwen3.5:27b",
    "3d_asset_creator": "qwen3-coder:30b",
    "cinematic_director": "qwen3.5:35b-a3b",
    "motion_specialist": "gemma4:31b",
    "style_mood_guardian": "gemma4:31b",
    "consistency_critic": "qwen3.5:27b",
    "node_engineer": "qwen3-coder:30b",
    "fast_router": "qwen3.5:35b-a3b",
}

AGENT_MODELS = {
    "queen_bee": MODEL_CONFIG["queen"],
    "story_architect": MODEL_CONFIG["story_architect"],
    "3d_asset_creator": MODEL_CONFIG["3d_asset_creator"],
    "cinematic_director": MODEL_CONFIG["cinematic_director"],
    "motion_specialist": MODEL_CONFIG["motion_specialist"],
    "style_mood_guardian": MODEL_CONFIG["style_mood_guardian"],
    "consistency_critic": MODEL_CONFIG["consistency_critic"],
    "node_engineer": MODEL_CONFIG["node_engineer"],
}

TEMPERATURE = 0.65
MAX_TOKENS = 8192
CONTEXT_WINDOW = 128000

print("Antcell config loaded successfully (Fully Local Mode)")
print(f"Queen Bee using: {AGENT_MODELS['queen_bee']}")
