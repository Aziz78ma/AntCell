import { useMemo, useState } from "react";
import {
  AudioLines,
  Bot,
  Mic,
  PanelsTopLeft,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { AssetLibrary } from "@/components/AssetLibrary";
import { NodeGraph } from "@/components/NodeGraph";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { QueenBeeChat } from "@/components/QueenBeeChat";
import { Timeline } from "@/components/Timeline";
import { Toolbar } from "@/components/Toolbar";
import { Viewport } from "@/components/Viewport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  AssetItem,
  GraphEdge,
  GraphNodeData,
  QualityMode,
  SceneProperty,
  TimelineClip,
} from "@/types/studio";

const ASSETS: AssetItem[] = [
  {
    id: "panda-hero",
    name: "Curious Panda Hero",
    category: "Characters",
    description: "Primary protagonist rig with expressive face blendshapes and robe variations.",
    tags: ["hero", "rigged", "ghibli"],
    status: "ready",
    accent: "cyan",
  },
  {
    id: "bamboo-sanctuary",
    name: "Bamboo Sanctuary",
    category: "Environments",
    description: "Cinematic forest valley with mist cards, pond caustics, and twilight fog.",
    tags: ["forest", "nature", "fog"],
    status: "linked",
    accent: "gold",
  },
  {
    id: "floating-orb",
    name: "AI Lantern Orb",
    category: "Props",
    description: "Holographic knowledge orb prop with reactive emissive animation.",
    tags: ["hero-prop", "glow", "fx"],
    status: "ready",
    accent: "cyan",
  },
  {
    id: "ghibli-dream",
    name: "Ghibli Dreamwash",
    category: "Styles",
    description: "Painterly atmosphere preset tuned for soft highlights and warm nocturne grading.",
    tags: ["style", "grade", "premium"],
    status: "ready",
    accent: "gold",
  },
];

const CLIPS: TimelineClip[] = [
  { id: "c1", track: "Story", label: "Wonder Beat", start: 4, length: 18, accent: "cyan" },
  { id: "c2", track: "Camera", label: "Orbit Reveal", start: 16, length: 14, accent: "gold" },
  { id: "c3", track: "FX", label: "Hologram Pulse", start: 28, length: 12, accent: "cyan" },
  { id: "c4", track: "Audio", label: "String Bloom", start: 22, length: 20, accent: "gold" },
];

const NODES: GraphNodeData[] = [
  { id: "n1", title: "Prompt Intake", subtitle: "Director brief", status: "ready", accent: "cyan", x: 32, y: 22 },
  { id: "n2", title: "Queen Bee", subtitle: "Narrative orchestration", status: "processing", accent: "gold", x: 220, y: 38 },
  { id: "n3", title: "Style Engine", subtitle: "Ghibli holographic fusion", status: "ready", accent: "cyan", x: 420, y: 28 },
  { id: "n4", title: "Scene Forge", subtitle: "Asset + layout synthesis", status: "review", accent: "gold", x: 198, y: 170 },
  { id: "n5", title: "8K Preview", subtitle: "Realtime cinema viewport", status: "idle", accent: "cyan", x: 452, y: 182 },
];

const EDGES: GraphEdge[] = [
  { id: "e1", from: "n1", to: "n2" },
  { id: "e2", from: "n2", to: "n3" },
  { id: "e3", from: "n2", to: "n4" },
  { id: "e4", from: "n4", to: "n5" },
];

const PROPERTY_ROWS: SceneProperty[] = [
  { label: "Output", value: "8K Cinematic EXR", tone: "gold" },
  { label: "Render Budget", value: "Realtime Preview / Final Path Trace", tone: "cyan" },
  { label: "Style DNA", value: "Ghibli Dreamwash + Holographic Luxe", tone: "cyan" },
  { label: "Hive Status", value: "Python LangGraph bridge listening on localhost", tone: "gold" },
];

function App() {
  const [wireframe, setWireframe] = useState(false);
  const [nodeGraphOpen, setNodeGraphOpen] = useState(true);
  const [qualityMode, setQualityMode] = useState<QualityMode>("selective-hq");
  const [stylePreset, setStylePreset] = useState("Ghibli Dreamwash");
  const [moodPreset, setMoodPreset] = useState("Wonder / Discovery");
  const [currentFrame, setCurrentFrame] = useState(42);

  const selectedAsset = useMemo(() => ASSETS[0], []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-panel-grid bg-[size:72px_72px] opacity-[0.08]" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative z-10 flex h-screen flex-col gap-4 p-4">
        <Toolbar
          nodeGraphOpen={nodeGraphOpen}
          onToggleNodeGraph={() => setNodeGraphOpen((value) => !value)}
          qualityMode={qualityMode}
          onQualityModeChange={setQualityMode}
          stylePreset={stylePreset}
          onStylePresetChange={setStylePreset}
          moodPreset={moodPreset}
          onMoodPresetChange={setMoodPreset}
        />

        <div className="grid min-h-0 flex-1 grid-cols-[290px,minmax(0,1fr),360px] gap-4">
          <AssetLibrary assets={ASSETS} selectedAssetId={selectedAsset.id} />

          <div className="flex min-h-0 flex-col gap-4">
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4">
              <Viewport
                wireframe={wireframe}
                onWireframeChange={setWireframe}
                qualityMode={qualityMode}
                stylePreset={stylePreset}
              />
            </div>

            <div className="relative h-[290px] shrink-0">
              <Timeline
                clips={CLIPS}
                currentFrame={currentFrame}
                onScrub={setCurrentFrame}
                nodeGraphOpen={nodeGraphOpen}
                onToggleNodeGraph={() => setNodeGraphOpen((value) => !value)}
              />
              {nodeGraphOpen ? (
                <div className="absolute inset-4 top-14">
                  <NodeGraph initialNodes={NODES} edges={EDGES} />
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <PropertiesPanel
              wireframe={wireframe}
              onWireframeChange={setWireframe}
              qualityMode={qualityMode}
              stylePreset={stylePreset}
              moodPreset={moodPreset}
              rows={PROPERTY_ROWS}
            />
            <QueenBeeChat
              projectName="Panda Discovers AI"
              defaultPrompt="Shape a premium 30-second Ghibli-style proof-of-concept with a soft reveal, luminous AI orb, and emotionally grounded ending."
            />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border/70 bg-black/45 px-4 py-2 shadow-panel backdrop-blur-xl">
          <Badge variant="cyan" className="pointer-events-auto gap-1">
            <Bot className="h-3.5 w-3.5" />
            Hive Linked
          </Badge>
          <Badge variant="gold" className="pointer-events-auto gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            8K Preview Ready
          </Badge>
          <Badge variant="ghost" className="pointer-events-auto gap-1">
            <AudioLines className="h-3.5 w-3.5" />
            Audio Composer Armed
          </Badge>
          <Badge variant="ghost" className="pointer-events-auto gap-1">
            <PanelsTopLeft className="h-3.5 w-3.5" />
            Node Studio Overlay
          </Badge>
        </div>

        <Button
          size="icon"
          variant="gold"
          className="voice-fab absolute bottom-8 right-8 z-30 h-16 w-16 rounded-full shadow-gold"
        >
          <Mic className="h-6 w-6" />
        </Button>

        <div className="pointer-events-none absolute right-28 top-28 z-0 h-40 w-40 rounded-full bg-cyan/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 left-16 z-0 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[26%] top-[18%] z-0 h-32 w-32 rounded-full border border-cyan/20 bg-cyan/5 blur-2xl" />

        <div className="pointer-events-none absolute left-6 top-28 z-20 flex items-center gap-3 rounded-full border border-border/60 bg-black/35 px-4 py-2 backdrop-blur-md">
          <WandSparkles className="h-4 w-4 text-gold-bright" />
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/66">
            Premium Desktop Direction Layer
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
