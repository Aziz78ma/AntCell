import {
  Clapperboard,
  Film,
  ImageUp,
  Layers3,
  MoonStar,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QualityMode } from "@/types/studio";

interface ToolbarProps {
  nodeGraphOpen: boolean;
  onToggleNodeGraph: () => void;
  qualityMode: QualityMode;
  onQualityModeChange: (mode: QualityMode) => void;
  stylePreset: string;
  onStylePresetChange: (style: string) => void;
  moodPreset: string;
  onMoodPresetChange: (mood: string) => void;
}

const PRIMARY_ACTIONS = [
  { label: "New Project", icon: Clapperboard, variant: "default" as const },
  { label: "Generate from Prompt", icon: Sparkles, variant: "gold" as const },
  { label: "Upload Photo → Hero", icon: ImageUp, variant: "ghost" as const },
  { label: "AI Director", icon: Film, variant: "ghost" as const },
  { label: "Refine Scene", icon: WandSparkles, variant: "ghost" as const },
];

const EXPORT_ACTIONS = [
  "Style Switcher",
  "Mood Engine",
  "Export Menu",
  "Node Studio",
  "Preview in 8K",
];

export function Toolbar({
  nodeGraphOpen,
  onToggleNodeGraph,
  qualityMode,
  onQualityModeChange,
  stylePreset,
  onStylePresetChange,
  moodPreset,
  onMoodPresetChange,
}: ToolbarProps) {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="glass-panel relative flex shrink-0 items-center justify-between gap-4 rounded-[28px] border border-border/70 px-5 py-4"
    >
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-cyan/6 via-transparent to-gold/6" />

      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3 overflow-x-auto pb-1">
        <div className="mr-2 flex items-center gap-3 rounded-2xl border border-border/70 bg-white/5 px-4 py-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan/25 to-gold/25 p-2 text-cyan-bright shadow-cyan">
            <Layers3 className="h-full w-full" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm uppercase tracking-[0.34em] text-foreground/90">
              Antcell
            </p>
            <p className="text-xs text-foreground/45">
              Local AI Video &amp; 3D Cinema Studio
            </p>
          </div>
        </div>

        {PRIMARY_ACTIONS.map(({ label, icon: Icon, variant }) => (
          <Button
            key={label}
            variant={variant}
            className="glow-pill gap-2 rounded-2xl px-4"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}

        <Button
          variant={nodeGraphOpen ? "gold" : "ghost"}
          className="gap-2 rounded-2xl"
          onClick={onToggleNodeGraph}
        >
          <Layers3 className="h-4 w-4" />
          Node Studio
        </Button>
      </div>

      <div className="relative z-10 flex shrink-0 items-center gap-3">
        <Badge variant="ghost" className="hidden gap-2 lg:inline-flex">
          <Sparkles className="h-3.5 w-3.5" />
          Selective HQ
        </Badge>

        <select
          className={cn(
            "h-11 rounded-2xl border border-border/80 bg-white/5 px-4 text-sm text-foreground/75 outline-none transition focus:border-cyan/45 focus:bg-cyan/5",
          )}
          value={stylePreset}
          onChange={(event) => onStylePresetChange(event.target.value)}
        >
          <option>Ghibli Dreamwash</option>
          <option>Neo Noir Holography</option>
          <option>Solaris Mythic</option>
        </select>

        <select
          className="h-11 rounded-2xl border border-border/80 bg-white/5 px-4 text-sm text-foreground/75 outline-none transition focus:border-gold/45 focus:bg-gold/5"
          value={moodPreset}
          onChange={(event) => onMoodPresetChange(event.target.value)}
        >
          <option>Wonder / Discovery</option>
          <option>Quiet Awe</option>
          <option>Heroic Lift</option>
        </select>

        <select
          className="h-11 rounded-2xl border border-border/80 bg-white/5 px-4 text-sm text-foreground/75 outline-none transition focus:border-cyan/45 focus:bg-cyan/5"
          value={qualityMode}
          onChange={(event) =>
            onQualityModeChange(event.target.value as QualityMode)
          }
        >
          <option value="fast">Fast Development</option>
          <option value="selective-hq">Selective High Quality</option>
        </select>

        <div className="hidden items-center gap-2 xl:flex">
          {EXPORT_ACTIONS.map((label) => (
            <Badge key={label} variant="ghost">
              {label}
            </Badge>
          ))}
        </div>

        <Button variant="outline" className="rounded-2xl">
          <MoonStar className="mr-2 h-4 w-4 text-gold-bright" />
          Holo Theme
        </Button>
      </div>
    </header>
  );
}
