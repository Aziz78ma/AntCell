import { Gauge, Settings2, Sparkles, Wand2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { QualityMode, SceneProperty } from "@/types/studio";

export function PropertiesPanel({
  wireframe,
  onWireframeChange,
  qualityMode,
  stylePreset,
  moodPreset,
  rows,
}: {
  wireframe: boolean;
  onWireframeChange: (checked: boolean) => void;
  qualityMode: QualityMode;
  stylePreset: string;
  moodPreset: string;
  rows: SceneProperty[];
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Properties + Live Controls</CardTitle>
          <Badge variant="cyan" className="gap-1">
            <Settings2 className="h-3.5 w-3.5" />
            Scene Stack
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-border/70 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground/45">
              <Sparkles className="h-3.5 w-3.5 text-cyan-bright" />
              Style DNA
            </div>
            <div className="text-sm font-medium text-foreground/92">{stylePreset}</div>
          </div>
          <div className="rounded-[22px] border border-border/70 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground/45">
              <Wand2 className="h-3.5 w-3.5 text-gold-bright" />
              Mood Engine
            </div>
            <div className="text-sm font-medium text-foreground/92">{moodPreset}</div>
          </div>
        </div>

        <div className="space-y-3 rounded-[24px] border border-border/70 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">
                Live Render Controls
              </p>
              <p className="mt-1 text-sm text-foreground/72">
                Tune visual fidelity without leaving the stage.
              </p>
            </div>
            <Badge variant={qualityMode === "fast" ? "ghost" : "gold"}>
              {qualityMode === "fast" ? "Fast" : "Selective HQ"}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/88">Wireframe Overlay</p>
              <p className="text-xs text-foreground/45">Reveal topology and spacing.</p>
            </div>
            <Switch checked={wireframe} onCheckedChange={onWireframeChange} />
          </div>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground/45">
            <Gauge className="h-3.5 w-3.5 text-cyan-bright" />
            Production Snapshot
          </div>
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-3 py-2"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                  {row.label}
                </span>
                <span
                  className={
                    row.tone === "gold"
                      ? "text-sm text-gold-bright"
                      : row.tone === "cyan"
                        ? "text-sm text-cyan-bright"
                        : "text-sm text-foreground/85"
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
