# Antcell - Shared Persistent Memory
from pathlib import Path

from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings


BASE_DIR = Path(__file__).resolve().parents[1]
MEMORY_DIR = BASE_DIR / "memory" / "antcell_universe"

# Use the local embedding model that is already installed for stable vector search.
embeddings = OllamaEmbeddings(model="nomic-embed-text:latest")

vector_store = Chroma(
    collection_name="antcell_creative_universe",
    embedding_function=embeddings,
    persist_directory=str(MEMORY_DIR),
)


def get_memory():
    """Return the shared memory vector store."""
    return vector_store


def add_to_memory(text: str, metadata: dict | None = None):
    """Add important information to long-term memory."""
    metadata = metadata or {}
    vector_store.add_texts([text], metadatas=[metadata])
    print(f"Added to Antcell memory: {text[:100]}...")


print("Antcell shared memory initialized")
