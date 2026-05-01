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
  | "virtual-agent"
  | "citations-director";

export interface SceneDef {
  id: SceneId;
  /** Text shown in the animated CoT header bar */
  header: string;
}

export interface Lane {
  id: string;
  /** Row label shown in the collapsed lane list */
  label: string;
  /** Which CoT scene body to render when this lane is expanded */
  sceneId: SceneId;
  /** ms after mount when this lane transitions from "pending" → "active" */
  activateAt: number;
  /** ms after mount when this lane transitions from "active" → "done" */
  completeAt: number;
  /** Higher = auto-expanded first when multiple lanes are simultaneously active */
  priority: number;
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
  /**
   * When present, CompanionPanel renders in parallel-lanes mode — a live list of
   * concurrent tasks that activate, expand their animation, and complete in waves.
   * scenes[] is unused when lanes is provided.
   */
  lanes?: Lane[];
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
  "citations-director":   { id: "citations-director",   header: "Citing relevant sources into director" },
};

// ── Flow definitions ─────────────────────────────────────────────────────────

export const FLOWS: Flow[] = [
  {
    id: "cot-animations",
    label: "CoT animations",
    description: "All 14 CoT scenes in order",
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
  {
    id: "parallel-build",
    label: "Parallel build",
    description: "10 concurrent agent tasks running in waves",
    scenes: [],
    lanes: [
      // Wave 1 — activate immediately, staggered 400 ms apart
      { id: "kb",         label: "Searching knowledge base",        sceneId: "kb-search",            activateAt: 0,    completeAt: 5000,  priority: 9 },
      { id: "customer",   label: "Running customer discovery",      sceneId: "customer-discovery",   activateAt: 800,  completeAt: 9500,  priority: 7 },
      { id: "trends",     label: "Analyzing trends & anomalies",    sceneId: "trends-anomalies",     activateAt: 1200, completeAt: 6500,  priority: 6 },
      // Wave 2 — activate ~2 s in
      { id: "test-run",   label: "Evaluating test run results",     sceneId: "test-run-scoreboard",  activateAt: 2000, completeAt: 8000,  priority: 5 },
      { id: "webhook",    label: "Invoking webhook connections",    sceneId: "webhook-invocation",   activateAt: 2400, completeAt: 10500, priority: 4 },
      { id: "virtual",    label: "Listing virtual agents",          sceneId: "virtual-agent",        activateAt: 2800, completeAt: 12000, priority: 3 },
      // Wave 3 — activate ~3–4 s in
      { id: "automation", label: "Discovering automations",         sceneId: "automation-discovery", activateAt: 3400, completeAt: 7500,  priority: 2 },
      { id: "files",      label: "Exploring knowledge base files",  sceneId: "files-explored",       activateAt: 3800, completeAt: 6000,  priority: 1 },
      { id: "topic",      label: "Analyzing topic discovery",       sceneId: "topic-discovery",      activateAt: 4200, completeAt: 8500,  priority: 0 },
    ],
  },
];

export const DEFAULT_FLOW = FLOWS[0];
