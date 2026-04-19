import asyncio
import json
import os
from datetime import datetime

from aiohttp import WSMsgType, web
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_ollama import ChatOllama

from config import AGENT_MODELS, TEMPERATURE
from utils.memory import add_to_memory, get_memory


HOST = os.getenv("ANTCELL_HOST", "127.0.0.1")
PORT = int(os.getenv("ANTCELL_PORT", "8000"))
QUEEN_MODEL = AGENT_MODELS.get("queen_bee", "llama3.1:8b")

queen_llm = ChatOllama(
    model=QUEEN_MODEL,
    temperature=TEMPERATURE,
    num_ctx=16384,
)

QUEEN_CHAT_SYSTEM_PROMPT = """You are the Queen Bee, the live creative director of Antcell Studio.
Respond with premium, concise, cinematic guidance suitable for a desktop production tool.
Use previous project memory when it helps maintain continuity across the Antcell universe.
If the user requests a plan, structure it into:
PLAN SUMMARY:
CREATIVE DIRECTION:
PRODUCTION STEPS:
Keep answers polished, clear, and practical."""


@web.middleware
async def cors_middleware(request, handler):
    if request.method == "OPTIONS":
        response = web.Response(status=204)
    else:
        response = await handler(request)

    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


def recall_memory(query: str, k: int = 4) -> str:
    try:
        store = get_memory()
        documents = store.similarity_search(query, k=k)
        return "\n\n".join(document.page_content for document in documents)
    except Exception:
        return ""


def build_messages(prompt: str):
    memory = recall_memory(prompt)
    user_payload = (
        f"Relevant Antcell memory:\n{memory or 'No relevant memory yet.'}\n\n"
        f"Current request:\n{prompt}"
    )
    return [
        SystemMessage(content=QUEEN_CHAT_SYSTEM_PROMPT),
        HumanMessage(content=user_payload),
    ]


def generate_response(prompt: str) -> str:
    messages = build_messages(prompt)
    response = queen_llm.invoke(messages)
    output = response.content
    add_to_memory(
        f"Queen Bee chat response at {datetime.now().isoformat()}:\nPrompt: {prompt}\n\n{output}",
        {"channel": "queen_bee_chat"},
    )
    return output


async def health_check(_request: web.Request):
    return web.json_response(
        {
            "status": "ok",
            "model": QUEEN_MODEL,
            "ws": "/ws/queen-bee",
            "http": "/api/hive/prompt",
        }
    )


async def prompt_handler(request: web.Request):
    payload = await request.json()
    prompt = payload.get("prompt", "").strip()

    if not prompt:
        return web.json_response(
            {"status": "error", "message": "Prompt is required."},
            status=400,
        )

    response_text = await asyncio.to_thread(generate_response, prompt)
    return web.json_response({"status": "ok", "message": response_text})


async def queen_bee_socket(request: web.Request):
    socket = web.WebSocketResponse(heartbeat=20)
    await socket.prepare(request)

    await socket.send_json({"type": "status", "status": "connected"})

    async for message in socket:
        if message.type == WSMsgType.TEXT:
            try:
                payload = json.loads(message.data)
            except json.JSONDecodeError:
                payload = {"prompt": message.data}

            prompt = payload.get("prompt", "").strip()
            if not prompt:
                await socket.send_json(
                    {"type": "error", "message": "Prompt payload was empty."}
                )
                continue

            try:
                messages = build_messages(prompt)
                streamed_response = []

                for chunk in queen_llm.stream(messages):
                    content = chunk.content
                    if not content:
                        continue
                    streamed_response.append(content)
                    await socket.send_json({"type": "chunk", "content": content})
                    await asyncio.sleep(0)

                final_text = "".join(streamed_response)
                add_to_memory(
                    f"Queen Bee streamed response at {datetime.now().isoformat()}:\nPrompt: {prompt}\n\n{final_text}",
                    {"channel": "queen_bee_socket"},
                )
                await socket.send_json({"type": "done", "message": final_text})
            except Exception as exc:
                await socket.send_json({"type": "error", "message": str(exc)})
        elif message.type == WSMsgType.ERROR:
            break

    return socket


def create_app():
    app = web.Application(middlewares=[cors_middleware])
    app.router.add_get("/api/health", health_check)
    app.router.add_post("/api/hive/prompt", prompt_handler)
    app.router.add_get("/ws/queen-bee", queen_bee_socket)
    app.router.add_options("/api/hive/prompt", lambda _: web.Response(status=204))
    return app


if __name__ == "__main__":
    web.run_app(create_app(), host=HOST, port=PORT)
