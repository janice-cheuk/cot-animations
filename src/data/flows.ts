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
  | "automation-discovery"
  | "customer-discovery"
  | "test-run-scoreboard"
  | "kb-search"
  | "webhook-invocation"
  | "virtual-agent";

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
  /**
   * When true, the main builder area shows completed/filled tab states
   * (e.g. the Plan tab shows the generated build plan) instead of empty states.
   * This is for "Completed States" demo flows only — not production behaviour.
   */
  completedStates?: boolean;
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
  "customer-discovery":   { id: "customer-discovery",   header: "Running customer discovery" },
  "test-run-scoreboard":  { id: "test-run-scoreboard",  header: "Analyzing test run results"  },
  "kb-search":            { id: "kb-search",            header: "Searching knowledge base articles" },
  "webhook-invocation":   { id: "webhook-invocation",   header: "Invoking webhook connections"      },
  "virtual-agent":        { id: "virtual-agent",        header: "Listing virtual agents and channels" },
};

// ── Flow definitions ─────────────────────────────────────────────────────────

export const FLOWS: Flow[] = [
  {
    id: "cot-animations",
    label: "CoT animations",
    description: "All 13 CoT scenes in order",
    scenes: Object.values(S),
  },
  {
    id: "full-demo",
    label: "Full demo",
    description: "End to end flow",
    scenes: Object.values(S),
  },
  {
    id: "build-flow",
    label: "Build flow",
    description: "Companion generating a build plan",
    scenes: Object.values(S),
  },
  {
    id: "completed-states",
    label: "Completed states",
    description: "Completed tab states across the builder",
    scenes: Object.values(S),
    completedStates: true,
  },
];

export const DEFAULT_FLOW = FLOWS[0];
