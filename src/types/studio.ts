export type QualityMode = "fast" | "selective-hq";

export type AssetCategory = "Characters" | "Environments" | "Props" | "Styles";

export interface AssetItem {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  tags: string[];
  status: "ready" | "generating" | "linked";
  accent: string;
}

export interface TimelineClip {
  id: string;
  track: string;
  label: string;
  start: number;
  length: number;
  accent: string;
}

export interface GraphNodeData {
  id: string;
  title: string;
  subtitle: string;
  status: "ready" | "processing" | "review" | "idle";
  accent: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
}

export interface SceneProperty {
  label: string;
  value: string;
  tone?: "cyan" | "gold";
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
  timestamp: string;
}
