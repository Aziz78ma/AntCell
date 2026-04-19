import { Pause, Play, Sparkles, Workflow } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimelineClip } from "@/types/studio";

const TRACKS = ["Story", "Camera", "FX", "Audio"];

export function Timeline({
  clips,
  currentFrame,
  onScrub,
  nodeGraphOpen,
  onToggleNodeGraph,
}: {
  clips: TimelineClip[];
  currentFrame: number;
  onScrub: (value: number) => void;
  nodeGraphOpen: boolean;
  onToggleNodeGraph: () => void;
}) {
  return (
    <Card className="relative h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Non-Linear Timeline</CardTitle>
            <Badge variant="ghost">Scene 04 / Shot 03</Badge>
            <Badge variant="cyan">Frame {currentFrame}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="gap-2 rounded-xl">
              <Play className="h-4 w-4" />
              Playblast
            </Button>
            <Button size="sm" variant="ghost" className="gap-2 rounded-xl">
              <Pause className="h-4 w-4" />
              Hold
            </Button>
            <Button
              size="sm"
              variant={nodeGraphOpen ? "gold" : "outline"}
              className="gap-2 rounded-xl"
              onClick={onToggleNodeGraph}
            >
              <Workflow className="h-4 w-4" />
              {nodeGraphOpen ? "Hide Nodes" : "Show Nodes"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative h-[calc(100%-68px)]">
        <div className="mb-3 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={120}
            value={currentFrame}
            onChange={(event) => onScrub(Number(event.target.value))}
            className="w-full accent-cyan"
          />
          <Button size="sm" variant="ghost" className="gap-2 rounded-xl">
            <Sparkles className="h-4 w-4" />
            Auto Beat Sync
          </Button>
        </div>

        <div className="grid h-[calc(100%-48px)] grid-cols-[120px,1fr] gap-3">
          <div className="space-y-3">
            {TRACKS.map((track) => (
              <div
                key={track}
                className="flex h-12 items-center rounded-2xl border border-border/70 bg-white/5 px-3 text-xs uppercase tracking-[0.24em] text-foreground/55"
              >
                {track}
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-border/70 bg-black/25">
            <div className="absolute inset-0 grid grid-cols-12 gap-0">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="border-l border-border/40 first:border-l-0" />
              ))}
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between p-3">
              {TRACKS.map((track) => (
                <div key={track} className="relative h-12 rounded-2xl border border-white/5 bg-white/[0.03]">
                  {clips
                    .filter((clip) => clip.track === track)
                    .map((clip) => (
                      <motion.button
                        key={clip.id}
                        className={cn(
                          "absolute top-2 h-8 rounded-2xl border px-3 text-left text-xs font-medium tracking-[0.18em] text-white shadow-panel transition",
                          clip.accent === "gold"
                            ? "border-gold/35 bg-gold/14"
                            : "border-cyan/35 bg-cyan/14",
                        )}
                        style={{
                          left: `${(clip.start / 48) * 100}%`,
                          width: `${(clip.length / 48) * 100}%`,
                        }}
                        whileHover={{ scale: 1.02, y: -3 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ type: "spring", stiffness: 520, damping: 26 }}
                      >
                        {clip.label}
                      </motion.button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
