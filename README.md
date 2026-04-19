# Antcell Studio

Antcell now contains two layers:

- The existing Python Hive and persistent memory system.
- A new premium Tauri desktop shell built with React, TypeScript, TailwindCSS, shadcn-style UI primitives, and Three.js.

## Project Structure

```text
Antcell/
├─ api_server.py                 # localhost HTTP/WebSocket bridge for Queen Bee chat
├─ config.py                     # Python Hive model configuration
├─ main.py                       # Existing Python Hive workflow
├─ src/                          # React + TypeScript desktop frontend
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  ├─ components/
│  │  ├─ AssetLibrary.tsx
│  │  ├─ NodeGraph.tsx
│  │  ├─ PropertiesPanel.tsx
│  │  ├─ QueenBeeChat.tsx
│  │  ├─ Timeline.tsx
│  │  ├─ Toolbar.tsx
│  │  ├─ Viewport.tsx
│  │  └─ ui/
│  ├─ lib/
│  └─ types/
├─ src-tauri/                    # Tauri native wrapper
│  ├─ Cargo.toml
│  ├─ tauri.conf.json
│  ├─ capabilities/default.json
│  └─ src/
├─ package.json
├─ tailwind.config.ts
└─ vite.config.ts
```

## Frontend Stack

- Tauri 2
- React + TypeScript + Vite
- TailwindCSS
- shadcn-style reusable UI components under `src/components/ui`
- Three.js via `@react-three/fiber` and `@react-three/drei`

## Local Backend Contract

The desktop app expects the Python bridge on localhost:

- `POST /api/hive/prompt`
- `GET /ws/queen-bee`
- `GET /api/health`

The included [`api_server.py`](./api_server.py) provides those endpoints and streams Queen Bee responses from your local Ollama-backed Hive environment.

## How To Run

### 1. Start the Python Hive bridge

From the repo root:

```powershell
.\venv\Scripts\python.exe .\api_server.py
```

By default it listens on `http://127.0.0.1:8000`.

### 2. Install the frontend dependencies

Node is available on this machine, but `npm` in PowerShell may be blocked by execution policy. If that happens, use `npm.cmd`:

```powershell
npm.cmd install
```

### 3. Install Rust + Tauri prerequisites

Rust is not currently installed in this environment, so install it before running the desktop shell:

- Install Rust via `rustup`
- Install the Tauri desktop prerequisites for Windows

### 4. Run the desktop UI in web mode

```powershell
npm.cmd run dev
```

### 5. Run the native desktop shell

After Rust is installed:

```powershell
npm.cmd run tauri:dev
```

## Backend Connection Notes

- Frontend URLs are configurable through `.env` using the values in [`.env.example`](./.env.example).
- `QueenBeeChat.tsx` will use WebSocket streaming when available and fall back to HTTP if the socket is offline.
- The desktop CSP already allows `localhost` and `127.0.0.1` HTTP/WebSocket connections.

## Design Direction

The UI is intentionally styled as a premium desktop production suite:

- deep-space black foundation
- neon cyan and warm gold highlights
- restrained glassmorphism
- subtle scanlines, aurora glow, and cinematic gradients
- orbit-enabled realtime hero viewport
- timeline + node graph overlay inspired by Blender and ComfyUI
