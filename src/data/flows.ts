/**
 * Flow data — demo controller only, NOT production code.
 *
 * A Flow is an ordered sequence of CoT scene IDs drawn from the eight
 * animation scenes implemented in CompanionPanel.tsx. Adding a new flow is
 * purely additive — just create another entry in FLOWS using any combination
 * of existing SceneIds.
 *
 * To add a brand-new scene type, first implement the body component in
 * CompanionPanel.tsx, register its SceneId here, then reference it in a flow.
 */

export type SceneId =
  | "topic-discovery"
  | "files-explored"
  | "todos-tasks"
  | "generic-text"
  | "agent-sections"
  | "trends-anomalies"
  | "closed-conversations"
  | "automation-discovery";

export interface SceneDef {
  id: SceneId;
  /** Text shown in the animated CoT header bar */
  header: string;
}

export interface Flow {
  id: string;
  /** Short label shown in the DemoController picker */
  label: string;
  /** One-liner shown as a subtitle in the picker */
  description: string;
  scenes: SceneDef[];
}

// ── Scene catalogue ──────────────────────────────────────────────────────────
// Single source of truth for scene header text.

const S: Record<SceneId, SceneDef> = {
  "topic-discovery":      { id: "topic-discovery",      header: "Analyzing topic discovery for relevant insights" },
  "files-explored":       { id: "files-explored",       header: "Exploring relevant knowledge base files" },
  "todos-tasks":          { id: "todos-tasks",          header: "Thinking" },
  "generic-text":         { id: "generic-text",         header: "Generating agent response strategy" },
  "agent-sections":       { id: "agent-sections",       header: "Referencing relevant agent patterns" },
  "trends-anomalies":     { id: "trends-anomalies",     header: "Analyzing trends and anomalies" },
  "closed-conversations": { id: "closed-conversations", header: "Analyzing closed conversations" },
  "automation-discovery": { id: "automation-discovery", header: "Utilizing automation discovery" },
};

// ── Flow definitions ─────────────────────────────────────────────────────────

export const FLOWS: Flow[] = [
  {
    id: "full-demo",
    label: "Full demo",
    description: "All 8 CoT scenes in order",
    scenes: Object.values(S),
  },
  {
    id: "dispute-resolution",
    label: "Dispute resolution",
    description: "Topic discovery → KB files → tasks → KB navigation",
    scenes: [
      S["topic-discovery"],
      S["files-explored"],
      S["todos-tasks"],
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Trends & anomalies + closed conversation analysis",
    scenes: [
      S["trends-anomalies"],
      S["closed-conversations"],
    ],
  },
  {
    id: "automation",
    label: "Automation discovery",
    description: "Topic discovery + automation flow extraction",
    scenes: [
      S["topic-discovery"],
      S["automation-discovery"],
    ],
  },
];

export const DEFAULT_FLOW = FLOWS[0];
