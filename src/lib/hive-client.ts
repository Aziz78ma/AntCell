export const HIVE_HTTP_URL =
  import.meta.env.VITE_HIVE_HTTP_URL ?? "http://127.0.0.1:8000";

export const HIVE_WS_URL =
  import.meta.env.VITE_HIVE_WS_URL ?? "ws://127.0.0.1:8000/ws/queen-bee";

export interface HivePromptPayload {
  prompt: string;
  mode?: string;
}

export interface HivePromptResponse {
  message?: string;
  plan?: string;
  status?: string;
}

export type HiveSocketPayload =
  | string
  | {
      type?: "chunk" | "message" | "status" | "done" | "error";
      content?: string;
      message?: string;
      status?: string;
    };

export async function sendHivePrompt(
  payload: HivePromptPayload,
): Promise<HivePromptResponse> {
  const response = await fetch(`${HIVE_HTTP_URL}/api/hive/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Hive backend error: ${response.status}`);
  }

  return (await response.json()) as HivePromptResponse;
}

export function createHiveSocket() {
  return new WebSocket(HIVE_WS_URL);
}

export function parseHivePayload(raw: string): HiveSocketPayload {
  try {
    return JSON.parse(raw) as HiveSocketPayload;
  } catch {
    return raw;
  }
}
