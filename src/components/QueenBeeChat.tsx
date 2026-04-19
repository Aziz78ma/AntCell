import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, LoaderCircle, SendHorizontal, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { createHiveSocket, parseHivePayload, sendHivePrompt } from "@/lib/hive-client";
import { formatClock } from "@/lib/utils";
import type { ChatMessage } from "@/types/studio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type ConnectionState = "connecting" | "connected" | "disconnected";

function newMessage(
  role: ChatMessage["role"],
  content: string,
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    role,
    content,
    timestamp: formatClock(),
  };
}

export function QueenBeeChat({
  projectName,
  defaultPrompt,
}: {
  projectName: string;
  defaultPrompt: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    newMessage(
      "assistant",
      "Queen Bee online. Connected to the premium orchestration console. Send a prompt to shape the next cinematic direction.",
    ),
  ]);
  const [input, setInput] = useState(defaultPrompt);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [isSending, setIsSending] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const streamTargetId = useRef<string | null>(null);

  useEffect(() => {
    const connect = () => {
      setConnection("connecting");
      const socket = createHiveSocket();
      socketRef.current = socket;

      socket.addEventListener("open", () => {
        setConnection("connected");
      });

      socket.addEventListener("message", (event) => {
        const payload = parseHivePayload(event.data);
        const content =
          typeof payload === "string"
            ? payload
            : payload.type === "done"
              ? ""
              : payload.content ?? payload.message ?? payload.status ?? "";

        if (!content) {
          return;
        }

        setMessages((current) => {
          if (!streamTargetId.current) {
            const assistantMessage = newMessage("assistant", content);
            streamTargetId.current = assistantMessage.id;
            return [...current, assistantMessage];
          }

          return current.map((message) =>
            message.id === streamTargetId.current
              ? { ...message, content: `${message.content}${content}` }
              : message,
          );
        });

        if (
          typeof payload !== "string" &&
          (payload.type === "done" || payload.type === "error")
        ) {
          streamTargetId.current = null;
          setIsSending(false);
        }
      });

      socket.addEventListener("close", () => {
        setConnection("disconnected");
        socketRef.current = null;
        if (reconnectTimer.current) {
          window.clearTimeout(reconnectTimer.current);
        }
        reconnectTimer.current = window.setTimeout(connect, 2800);
      });

      socket.addEventListener("error", () => {
        setConnection("disconnected");
      });
    };

    connect();

    return () => {
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
      }
      socketRef.current?.close();
    };
  }, []);

  const connectionBadge = useMemo(() => {
    if (connection === "connected") {
      return (
        <Badge variant="success" className="gap-1">
          <Wifi className="h-3.5 w-3.5" />
          Hive Stream Live
        </Badge>
      );
    }

    if (connection === "connecting") {
      return (
        <Badge variant="gold" className="gap-1">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Connecting
        </Badge>
      );
    }

    return (
      <Badge variant="ghost" className="gap-1">
        <WifiOff className="h-3.5 w-3.5" />
        Backend Offline
      </Badge>
    );
  }, [connection]);

  async function handleSend() {
    const prompt = input.trim();
    if (!prompt || isSending) {
      return;
    }

    const userMessage = newMessage("user", prompt);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);
    streamTargetId.current = null;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "prompt",
          prompt,
          project: projectName,
        }),
      );
      return;
    }

    try {
      const response = await sendHivePrompt({
        prompt,
        mode: "queen-bee-chat",
      });
      const text =
        response.message ??
        response.plan ??
        "Hive backend acknowledged the request but returned no visible response.";
      setMessages((current) => [...current, newMessage("assistant", text)]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        newMessage(
          "system",
          "Unable to reach the Python Hive bridge on localhost. Start the backend server described in the README, then retry.",
        ),
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Queen Bee Live Chat</CardTitle>
            <p className="mt-2 text-sm text-foreground/55">
              Streaming direction channel to the Python Hive over localhost HTTP/WebSocket.
            </p>
          </div>
          {connectionBadge}
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="rounded-[22px] border border-border/70 bg-white/5 px-4 py-3">
          <div className="text-xs uppercase tracking-[0.2em] text-foreground/45">
            Active Brief
          </div>
          <div className="mt-2 text-sm text-foreground/82">{projectName}</div>
        </div>

        <ScrollArea className="min-h-0 flex-1 pr-1">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className={
                    message.role === "user"
                      ? "ml-10 rounded-[22px] border border-gold/25 bg-gold/10 px-4 py-3"
                      : message.role === "assistant"
                        ? "mr-10 rounded-[22px] border border-cyan/20 bg-cyan/10 px-4 py-3"
                        : "rounded-[22px] border border-border/60 bg-white/5 px-4 py-3"
                  }
                >
                  <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-foreground/45">
                    {message.role === "assistant" ? (
                      <Bot className="h-3.5 w-3.5 text-cyan-bright" />
                    ) : null}
                    {message.role}
                    <span className="text-foreground/25">{message.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/82">
                    {message.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Queen Bee to choreograph a scene, refine the emotional arc, or generate the next shot package..."
            className="min-h-[130px]"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/38">
              Endpoint: localhost HTTP / WS bridge
            </p>
            <Button className="gap-2 rounded-2xl" onClick={handleSend}>
              {isSending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
              Stream to Hive
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
