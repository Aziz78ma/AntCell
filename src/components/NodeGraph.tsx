import { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GraphEdge, GraphNodeData } from "@/types/studio";

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
}

export function NodeGraph({
  initialNodes,
  edges,
}: {
  initialNodes: GraphNodeData[];
  edges: GraphEdge[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [dragging, setDragging] = useState<DragState | null>(null);

  useEffect(() => {
    if (!dragging) {
      return undefined;
    }

    const handleMove = (event: MouseEvent) => {
      const bounds = panelRef.current?.getBoundingClientRect();
      if (!bounds) {
        return;
      }

      setNodes((current) =>
        current.map((node) =>
          node.id === dragging.id
            ? {
                ...node,
                x: Math.max(8, Math.min(bounds.width - 150, event.clientX - bounds.left - dragging.offsetX)),
                y: Math.max(8, Math.min(bounds.height - 88, event.clientY - bounds.top - dragging.offsetY)),
              }
            : node,
        ),
      );
    };

    const stopDrag = () => setDragging(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging]);

  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])),
    [nodes],
  );

  return (
    <div
      ref={panelRef}
      className="glass-panel relative h-full rounded-[26px] border border-cyan/14 bg-[#061019]/90"
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {edges.map((edge) => {
          const source = nodeMap[edge.from];
          const target = nodeMap[edge.to];
          if (!source || !target) {
            return null;
          }

          const x1 = source.x + 124;
          const y1 = source.y + 34;
          const x2 = target.x + 8;
          const y2 = target.y + 34;
          const mid = (x1 + x2) / 2;

          return (
            <path
              key={edge.id}
              d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke="rgba(110,242,255,0.55)"
              strokeWidth="2"
              strokeDasharray="6 5"
            />
          );
        })}
      </svg>

      <div className="absolute left-4 top-4 flex items-center gap-2">
        <Badge variant="gold">AI Node Graph Overlay</Badge>
        <Badge variant="ghost">Drag any node</Badge>
      </div>
      {nodes.map((node) => (
        <motion.button
          key={node.id}
          type="button"
          className={cn(
            "absolute flex w-32 cursor-grab flex-col rounded-2xl border px-3 py-3 text-left shadow-panel transition",
            node.accent === "gold"
              ? "border-gold/35 bg-gold/12"
              : "border-cyan/35 bg-cyan/12",
          )}
          style={{ left: node.x, top: node.y }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.995 }}
          transition={{ type: "spring", stiffness: 600, damping: 28 }}
          onMouseDown={(event) =>
            setDragging({
              id: node.id,
              offsetX: event.clientX - event.currentTarget.getBoundingClientRect().left,
              offsetY: event.clientY - event.currentTarget.getBoundingClientRect().top,
            })
          }
        >
          <div className="mb-2 flex items-center justify-between">
            <Badge
              variant={
                node.status === "processing"
                  ? "gold"
                  : node.status === "ready"
                    ? "cyan"
                    : "ghost"
              }
            >
              {node.status}
            </Badge>
            <GripVertical className="h-4 w-4 text-foreground/45" />
          </div>
          <div className="text-sm font-semibold text-foreground/92">{node.title}</div>
          <div className="mt-1 text-xs text-foreground/55">{node.subtitle}</div>
        </motion.button>
      ))}
    </div>
  );
}
