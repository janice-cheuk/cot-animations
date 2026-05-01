# Agent Builder Companion — Chain-of-Thought Animation Demo

A UI-only, deterministic prototype that demonstrates the animated chain-of-thought (CoT) experience for the AI Agent Builder Companion. No backend required — every scene is a pre-scripted animation that engineers can lift directly into the real repo.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (port may increment if in use).

---

## Architecture

The animation system has three layers. Engineers should only need to work in the layer that matches their task.

```
src/
├── engine/
│   ├── primitives/        ← Layer 1: raw reusable motion components
│   ├── timing.ts          ← Single source of truth for all durations + easings
│   └── types.ts           ← TypeScript types for CoT steps and scenarios
├── components/
│   ├── companion/         ← Layer 2: CoT body components + shell UI
│   │   ├── CompanionPanel.tsx              ← scene orchestrator + keyboard nav
│   │   ├── ParallelLanesSection (inline)   ← collapsible parallel-tasks accordion
│   │   ├── ParallelLanesBody (inline)      ← lane list with auto-expand + user toggle
│   │   ├── SceneBody (inline)              ← shared scene router used by both modes
│   │   ├── GradientSpinner (inline)        ← CSS conic-gradient spinner (brand palette)
│   │   ├── TopicDiscoveryBody (inline)     ← shimmer header + gear illustration
│   │   ├── FilesExploredBody (inline)      ← staggered file list + spinner
│   │   ├── TodoTasksBody (inline)          ← tasks → nav pill → KB tab → questions
│   │   ├── GenericReasoningBody (inline)   ← phrase typewriter
│   │   ├── AgentSectionsBody (inline)      ← staggered reference cards
│   │   ├── TrendsAnomaliesBody (inline)    ← animated SVG line chart
│   │   ├── ClosedConversationsBody (inline)← fading document rows
│   │   ├── AutomationDiscoveryBody (inline)← spinner → icon timeline
│   │   ├── CitationsDirectorBody (inline)  ← citation checklist with blue link labels
│   │   ├── CustomerDiscoveryBody.tsx       ← progressive cluster → usecase reveal
│   │   ├── TestRunScoreboardBody.tsx       ← infinite-scroll test run rows
│   │   ├── KBSearchBody.tsx               ← infinite-scroll KB articles + scan beam
│   │   ├── WebhookInvocationBody.tsx      ← progressive webhook chain (icon-only)
│   │   └── VirtualAgentBody.tsx           ← VA roster + channel deployment pips
│   ├── builder/           ← Main builder area (tabs, plan, prompt, tools, voice)
│   └── nav/               ← Static nav sidebar
├── data/
│   └── flows.ts           ← Scene catalogue, flow definitions, and Lane definitions
└── App.tsx
```

**Rule of thumb:**
- Changing timing or easing → edit `engine/timing.ts`
- Changing what a CoT step looks like → edit the matching body component
- Adding a new scene → see *Adding or editing a scene* below
- Adding a parallel flow → see *Multi-task parallel lanes* below
- Building a new animation primitive → add to `engine/primitives/`

---

## Animation sizing guidelines

All body components should follow these constraints to stay consistent within the companion panel:

| Property | Recommended value |
|---|---|
| `maxWidth` | `360px` |
| Scroll window / bounded animation height | `160–180px` |
| Total component height (unbounded layouts) | `≤ 220px` |

These values ensure the animation graphic fits cleanly alongside the CoT header, typewriter text, and navigation elements without overflowing the companion panel viewport.

---

## Multi-task parallel lanes

This is the primary way individual animations compose into a complete experience. Rather than showing one CoT scene at a time, the parallel lanes mode surfaces multiple concurrent tool calls as a live accordion — each lane is one running task that activates, expands its full animation body, and completes independently.

### What it looks like

```
▼ Running tasks in parallel          ← collapsible header (click to toggle)
│
│  ◉  Searching knowledge base       ← GradientSpinner + expanded body below
│  │   ┌────────────────────────┐
│  │   │  [KBSearchBody anim]   │    ← full scene animation visible
│  │   └────────────────────────┘
│
│  ◉  Running customer discovery     ← spinner only (collapsed, lower priority)
│  ◉  Analyzing trends & anomalies   ← spinner only (collapsed)
│  ○  Evaluating test run results    ← pending (not yet active)
│  ○  Invoking webhook connections   ← pending
│  ...
│
│  ✓  Exploring KB files             ← done (green check, collapsed)
```

The **highest-priority active lane** auto-expands. All other active lanes show the gradient spinner and a chevron — clicking any active lane pins it open instead. Clicking the open lane collapses it back to auto. When a lane completes, focus shifts automatically to the next highest-priority active lane.

### How animations combine

Each lane uses an existing single-scene body component. The parallel mode is a **container** — it composes scenes, it does not duplicate them. The `SceneBody` router (inline in `CompanionPanel.tsx`) is the shared render switch used by both single-scene mode and parallel mode:

```tsx
// SceneBody is called identically whether rendering one scene or one lane
<SceneBody sceneId={lane.sceneId} sceneKey={0} />
```

This means every animation built for the single-scene flow — scan beams, infinite scrollers, SVG charts, webhook chains — works inside parallel lanes with zero modification.

### Demo flow — "Parallel build"

Defined in `src/data/flows.ts` under `id: "parallel-build"`. Uses 9 lanes across three activation waves:

| Wave | Lanes | Activates at |
|---|---|---|
| 1 | KB Search, Customer Discovery, Trends, Anomalies | t = 0–1.2s |
| 2 | Test Run, Webhook, Virtual Agents | t = 2.0–2.8s |
| 3 | Automation Discovery, Files, Topic Discovery | t = 3.4–4.2s |

Lanes complete staggered over 5–12s, creating a natural handoff sequence: KB → Customer Discovery → Webhook → Virtual Agents.

### Data model

```ts
// src/data/flows.ts
interface Lane {
  id: string;
  label: string;         // shown in the collapsed row
  sceneId: SceneId;      // which animation body to render when expanded
  activateAt: number;    // ms after mount → "pending" to "active"
  completeAt: number;    // ms after mount → "active" to "done"
  priority: number;      // higher = auto-expanded first (see priority model below)
}

interface Flow {
  // ...existing fields
  lanes?: Lane[];        // present → CompanionPanel renders parallel mode
}
```

A flow with `lanes` set renders `ParallelLanesSection`. `scenes[]` is unused in this mode. Flows without `lanes` behave exactly as before (single-scene + arrow-key navigation).

### Priority model — production spec

In the demo, `priority` is a static integer assigned at flow-definition time (higher = more visually interesting animation to show first). In production, **priority must be dynamic**, computed from streaming progress.

**Rule: the lane that has streamed the most tokens is expanded.**

The task furthest along has the richest partial result to show the user and is the most "alive" — it is the best proxy for "something worth seeing right now."

```ts
// Re-derive on every streaming event from the backend
const autoExpandedId = activeLanes
  .sort((a, b) => tokensStreamed[b.id] - tokensStreamed[a.id])[0]?.id ?? null;
```

**Required backend event shape:**

```ts
interface LaneStreamEvent {
  laneId: string;
  tokensStreamed: number;           // cumulative tokens for this tool call
  status: "active" | "done" | "error";
}
```

**Frontend state:**

```ts
const [tokensStreamed, setTokensStreamed] = useState<Record<string, number>>({});

function onStreamEvent(event: LaneStreamEvent) {
  setTokensStreamed(prev => ({ ...prev, [event.laneId]: event.tokensStreamed }));
  if (event.status !== "active") {
    setStatuses(prev => ({ ...prev, [event.laneId]: event.status }));
  }
}
```

**Why not other strategies:**

| Strategy | Problem |
|---|---|
| Recency (most recently activated) | Constantly shifts focus to newly spawned tasks — distracting |
| First-in (activation order) | Ignores which task is actually producing output |
| Static priority | Works for demos; not meaningful in production where task order isn't known ahead of time |
| Progress by tokens | Best proxy for "this lane has something to show right now" ✓ |

**Error handling:** Lanes that error transition to `"error"` status — show a red icon, no spinner, stay in the list, never compete for the expanded slot.

**User override:** The user can always click any active lane to pin it open. This overrides auto-priority and persists until that lane completes, at which point auto resumes.

### Adding a parallel flow

1. Define an array of `Lane` objects with `activateAt`, `completeAt`, and `priority` values
2. Add a `Flow` entry to `FLOWS` in `src/data/flows.ts` with `lanes` set and `scenes: []`
3. No changes to `CompanionPanel` needed — it detects `lanes?.length` and switches mode automatically

```ts
// src/data/flows.ts
{
  id: "my-parallel-flow",
  label: "My parallel flow",
  description: "Description shown in the demo picker",
  scenes: [],
  lanes: [
    { id: "task-a", label: "Searching KB",       sceneId: "kb-search",       activateAt: 0,    completeAt: 5000, priority: 2 },
    { id: "task-b", label: "Analyzing trends",   sceneId: "trends-anomalies", activateAt: 800,  completeAt: 7000, priority: 1 },
    { id: "task-c", label: "Invoking webhooks",  sceneId: "webhook-invocation", activateAt: 1600, completeAt: 9000, priority: 0 },
  ],
}
```

---

## Layer 1 — Animation primitives

These are headless motion components. They handle the *how* of animation and accept content as children or props. They have no opinions about colour, layout, or CoT meaning.

Each primitive lives at `src/engine/primitives/<Name>.tsx`.

---

### `<TextCycler>`

Cycles through an array of strings with a slide-up/fade transition. Used in the heading: *"Start building from ___"*.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `string[]` | required | List of strings to cycle through |
| `intervalMs` | `number` | `2800` | Time each item is shown (ms) |
| `gradient` | `string` | AI gradient | CSS `background` value applied as a text gradient |
| `className` | `string` | — | Applied to the outer `<span>` |

**Usage**

```tsx
import { TextCycler } from "@/engine/primitives/TextCycler";

<TextCycler
  items={["product requirements", "real customer insights", "existing workflows"]}
  intervalMs={2800}
/>
```

---

### `<Typewriter>`

Streams text in configurable chunks — character, word, line, or phrase — like a live AI response. Used in `GenericReasoningBody`.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | required | Full string to type out |
| `speedMs` | `number` | `22` | Delay between each chunk (ms) |
| `mode` | `"char" \| "word" \| "line" \| "phrase"` | `"char"` | Chunking strategy |
| `phraseSize` | `number` | `3` | Words per chunk when `mode="phrase"` |
| `onComplete` | `() => void` | — | Fired when the full string has been typed |
| `className` | `string` | — | Applied to the container |

**Usage**

```tsx
import { Typewriter } from "@/engine/primitives/Typewriter";

<Typewriter
  text="This agent handles customer refund requests automatically."
  mode="phrase"
  phraseSize={3}
  speedMs={120}
  onComplete={() => console.log("done")}
/>
```

> **Backend note:** In production the `text` prop should be replaced with the live-streamed string from the agent's reasoning output. The `speedMs` becomes irrelevant once streaming is real-time.

---

### `<StaggerList>`

Reveals a list of items one by one with a staggered entrance. Used in `FilesExploredBody` and `TodoTasksBody`.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `ReactNode[]` | required | Items to stagger in |
| `staggerMs` | `number` | `80` | Delay between each item entrance (ms) |
| `initialDelayMs` | `number` | `0` | Delay before the first item appears |
| `direction` | `"up" \| "down"` | `"up"` | Slide direction on entrance |

**Usage**

```tsx
import { StaggerList } from "@/engine/primitives/StaggerList";

<StaggerList
  staggerMs={100}
  items={[
    <FileRow path="agent-config.yaml" />,
    <FileRow path="knowledge-base/faq.md" />,
  ]}
/>
```

---

### `<FadeSlideIn>`

Single-element entrance animation — fades in and slides up. Used as a wrapper for CoT step cards entering the chat.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Content to animate in |
| `delayMs` | `number` | `0` | Delay before entrance starts |
| `durationMs` | `number` | `280` | Entrance duration |
| `y` | `number` | `12` | Vertical offset to slide from (px) |

**Usage**

```tsx
import { FadeSlideIn } from "@/engine/primitives/FadeSlideIn";

<FadeSlideIn delayMs={400}>
  <TopicDiscoveryStep topics={["Billing", "Support"]} />
</FadeSlideIn>
```

---

### `<ThinkingDots>`

Animated three-dot breathing indicator shown between CoT steps.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md"` | `"md"` | Dot size |
| `color` | `string` | `var(--content-secondary)` | Dot colour |

**Usage**

```tsx
import { ThinkingDots } from "@/engine/primitives/ThinkingDots";

<ThinkingDots size="sm" />
```

---

## Layer 2 — CoT scene components

Each component maps to one chain-of-thought scene. Scenes 1–8 and scene 14 are implemented as named functions inside `CompanionPanel.tsx`. Scenes 9–13 are self-contained files in `src/components/companion/`.

When integrating into the real repo, extract each body component to `src/components/cot/<Name>.tsx` and connect to live backend data.

| # | Scene header | Body component | File | Key animation technique |
|---|---|---|---|---|
| 1 | Analyzing topic discovery for relevant insights | `TopicDiscoveryBody` | `CompanionPanel.tsx` | CSS `@keyframes` shimmer gradient on CoT header; SVG `animateTransform` gear rotation + Framer Motion `scaleY` breathing on the AI Analyst illustration |
| 2 | Exploring relevant knowledge base files | `FilesExploredBody` | `CompanionPanel.tsx` | Framer Motion staggered list reveal; `motion.svg` spinner on the active file; spinner → static on completion |
| 3 | Thinking | `TodoTasksBody` | `CompanionPanel.tsx` | Staggered checklist with done/active/pending states; timed spinner → nav pill → tab navigation → clarifying questions card |
| 4 | Generating agent response strategy | `GenericReasoningBody` | `CompanionPanel.tsx` | `<Typewriter>` in `phrase` mode (3-word chunks) |
| 5 | Referencing relevant agent patterns | `AgentSectionsBody` | `CompanionPanel.tsx` | Staggered `motion.div` reference cards with fade + slide entrance |
| 6 | Analyzing trends and anomalies | `TrendsAnomaliesBody` | `CompanionPanel.tsx` | Framer Motion `pathLength` on SVG path to draw trend line left-to-right; opacity-animated anomaly dots |
| 7 | Analyzing closed conversations | `ClosedConversationsBody` | `CompanionPanel.tsx` | Five `motion.div` document rows with staggered `opacity` keyframe loop — each fades in, holds, then fades out |
| 8 | Utilizing automation discovery | `AutomationDiscoveryBody` | `CompanionPanel.tsx` | Vertical timeline: timed spinner → icon swap via `AnimatePresence` cross-fade; Tabler icons for each step type |
| 9 | Running customer discovery | `CustomerDiscoveryBody` | `CustomerDiscoveryBody.tsx` | 4-stage auto-advancing animation (Cluster → Customer → Profile → Usecase); `AnimatePresence` page-slide transitions; `useReveal` hook for delayed highlight; abstract bar placeholders in Profile/Usecase stages |
| 10 | Analyzing test run results | `TestRunScoreboardBody` | `TestRunScoreboardBody.tsx` | Infinite upward scroll via triplicated `TAPE` array + `motion.div` linear `y` animation; `useCountUp` for pass/percentage number animation; Framer Motion `width` for progress bars |
| 11 | Searching knowledge base articles | `KBSearchBody` | `KBSearchBody.tsx` | Infinite upward scroll; horizontal glowing scan beam via `x` transform on a gradient `div`; matched articles highlighted with relevance badges |
| 12 | Invoking webhook connections | `WebhookInvocationBody` | `WebhookInvocationBody.tsx` | 6-phase state machine (idle → agent → remote fn → webhook → API → response); animated gradient pulse traveling along connector lines; activation ripple rings on each node; icon-only nodes using Tabler icons |
| 13 | Listing virtual agents and channels | `VirtualAgentBody` | `VirtualAgentBody.tsx` | Staggered row entrance; 3-phase state machine highlighting selected VA; VOICE/CHAT/EMAIL channel pips light up sequentially with individual colour coding |
| 14 | Citing relevant sources into director | `CitationsDirectorBody` | `CompanionPanel.tsx` | Staggered checklist (same pattern as scene 3) with done/active/pending states; each item has a blue link-styled citation label (`#205ae3`); no section header |

### Connecting to the backend

Each body component renders **hardcoded/mocked content**. When wiring to a real agent:

- Replace `<Typewriter text="...">` with the live-streamed string from the agent's reasoning output.
- Replace hardcoded file/task/VA lists with data from the agent's tool-call responses.
- The `spinDone` / `navDone` state pattern (scenes 2 & 3) should be driven by real tool-call completion events rather than `setTimeout`.
- The tab navigation triggered by `onNavigateKB()` is already a callback prop — wire it to whatever routing/state system the real app uses.
- Scenes 10–13 use phase-based state machines driven by `setTimeout` loops. In production these phases should be driven by real streaming events (e.g. first result received → advance phase).
- `CustomerDiscoveryBody` — the `PROFILES` and `USECASES` constants are filler. Replace with live data from the agent's customer context or CRM API at runtime.
- `VirtualAgentBody` — the `VA_ROWS` constant is filler. Replace with the response from `virtual-agent list` + `virtual-agent get` (channels array per VA).
- `WebhookInvocationBody` — the slot names are illustrative. Replace with the actual slots returned by `webhook get`.

> **Spinner convention:** All active/loading states inside scene bodies use the `AISpinner` component (a 12 × 12 rotating SVG arc). Scene 8 uses `ADSpinner` (16 × 16). Both use `#205ae3` arc on a light grey track. The parallel lanes list uses `GradientSpinner` — a CSS `conic-gradient` ring using the brand gradient palette (`#5a8fc4 → #6e5ea8 → #966895 → #b87a7a → #d4a07a → #8a9db8`), matching the "Start building with ___" text cycler.

> **Icon convention:** All robot/agent icons use the official **Tabler `icon-tabler-robot`** SVG paths. All other icons (webhook, phone, chat, email, code brackets, server) use their respective Tabler outline equivalents.

---

### Scene 14 — Citations into Director

**Scene ID:** `citations-director`
**CoT header:** `"Citing relevant sources into director"`
**Component:** `CitationsDirectorBody` (inline in `CompanionPanel.tsx`)

#### What it shows

A progressive checklist where each row represents one source the agent is citing. Items stagger in from left with a 100 ms delay between each. The checklist has **no section header** (unlike scene 3 which has "Tasks to complete"). Each item has:

- A status icon on the left — green filled circle (done), animated dashed circle (active, pulsing), faded empty circle (pending)
- A short action phrase in `var(--content-secondary)`
- A **blue link label** (`color: #205ae3`) immediately following the phrase — this is the name of the cited section or document

#### Backend integration

Replace `CITATION_TASKS` with live data from the agent's citation tool-call responses. Each entry maps to one citation event emitted by the backend:

| Field | Backend source | Notes |
|---|---|---|
| `label` | Action verb from the citation event type (e.g. `"Referencing "`, `"Pulling in "`) | Keep trailing space — `linkLabel` is rendered inline |
| `linkLabel` | The `section_name` or `document_title` returned by the director citation API | Rendered in blue (`#205ae3`) |
| `status` | Derived from streaming event state: `"done"` = citation resolved, `"active"` = in-flight, `"pending"` = queued | Drive from real tool-call completion events, not `setTimeout` |

```ts
function onCitationEvent(event: CitationStreamEvent, tasks: CitationTask[]) {
  return tasks.map(t =>
    t.linkLabel === event.sectionName
      ? { ...t, status: event.resolved ? "done" : "active" }
      : t
  );
}
```

---

## Layer 3 — Timing constants

All durations and easing curves live in one file: `src/engine/timing.ts`. **Never hardcode animation values inside components** — always import from here.

```ts
// src/engine/timing.ts

export const TIMING = {
  stepGapMs: 500,
  thinkingDelayMs: 900,
  cardEntranceMs: 280,
  typewriterSpeedMs: 22,
  cyclerIntervalMs: 2800,
  staggerItemMs: 80,
} as const;

export const EASING = {
  enter: [0.22, 1, 0.36, 1],   // Smooth decelerate — elements entering
  exit:  [0.55, 0, 1, 0.45],   // Smooth accelerate — elements leaving
  inOut: [0.45, 0, 0.55, 1],   // Symmetric — state transitions within a step
} as const;
```

---

## Running the demo

### 1. Start the app

```bash
npm install
npm run dev
```

Type anything in the input bar on the start screen and press **Enter** (or click the send button) to enter the builder.

### 2. Navigate between animation scenes

Once inside the builder, use **arrow keys** to step through all 14 CoT scenes in the Companion panel:

| Key | Action |
|---|---|
| `→` Right arrow | Next animation scene |
| `←` Left arrow | Previous animation scene |

Dot indicators at the bottom of the Companion panel show which scene is active and are also **clickable**.

### 3. Animation scenes (in order)

| # | Scene header | What you'll see |
|---|---|---|
| 1 | **Analyzing topic discovery for relevant insights** | Shimmer gradient CoT header + AI Analyst illustration with three outer bubbles rotating like gears and inner bubbles breathing |
| 2 | **Exploring relevant knowledge base files** | Staggered file list with a live spinner on the last file |
| 3 | **Thinking** | Task checklist → navigation pill → auto-switches the main panel to the Knowledge Base tab → clarifying questions card fades in |
| 4 | **Generating agent response strategy** | Phrase-by-phrase typewriter text streaming |
| 5 | **Referencing relevant agent patterns** | Staggered reference cards each showing a source file path and quoted excerpt |
| 6 | **Analyzing trends and anomalies** | Typewriter text + line chart where the trend line animates left-to-right in a loop |
| 7 | **Analyzing closed conversations** | Typewriter text + stacked document graphic where each row fades in sequentially |
| 8 | **Utilizing automation discovery** | Vertical timeline: each step loads with a spinner that resolves to its icon on completion |
| 9 | **Running customer discovery** | Auto-advancing 4-stage reveal: Cluster → Customer → Profile → Usecase; each stage uses abstract visual placeholders |
| 10 | **Analyzing test run results** | Infinite upward-scrolling test run scoreboard with animated progress bars and count-up numbers |
| 11 | **Searching knowledge base articles** | Infinite upward-scrolling abstract article cards with a horizontal glowing scan beam sweeping across |
| 12 | **Invoking webhook connections** | Progressive icon chain (Agent → Remote Fn → Webhook → API) with animated pulse flows traveling along connectors |
| 13 | **Listing virtual agents and channels** | VA roster loading in with staggered rows; selected agent highlights and VOICE / CHAT / EMAIL channel pips activate one by one |
| 14 | **Citing relevant sources into director** | Staggered citation checklist with blue link-styled source names; done/active/pending states; no section header |

### 4. Switching flows with the Demo Controller

A floating overlay in the **bottom-left corner** (dark badge with a ⚡ icon) lets you switch between pre-defined demo flows without reloading the page.

> **This widget is not part of the product UI.** It is a demo-only tool. Remove the `<DemoController />` line from `src/App.tsx` to hide it from any build you share externally.

Click the badge to expand the flow picker, then select a flow. The companion panel resets to scene 1 of the new flow automatically.

Available flows (defined in `src/data/flows.ts`):

| Flow | Description |
|---|---|
| **CoT animations** | All 14 CoT scenes in order |
| **Full demo** | End to end flow |
| **Build flow** | Companion generating a build plan |
| **Completed states** | Completed tab states across the builder (Plan, Prompt, Tools, Voice) |
| **Parallel build** | 9 concurrent agent tasks activating in waves — showcases parallel lanes mode |

To add a new flow, append an entry to the `FLOWS` array in `src/data/flows.ts` — no changes to any component are needed.

### 5. Adding or editing a scene

1. Add the new scene ID and header to the `S` catalogue in `src/data/flows.ts`, then reference it in your chosen `Flow`.
2. Create the body component (e.g. `MyNewBody.tsx`) in `src/components/companion/`.
3. Import it in `CompanionPanel.tsx` and add a `{currentId === "my-scene-id" && <MyNewBody sceneKey={cotIndex} />}` case to the render block.
4. No keyboard-nav cap change needed — the max is `scenes.length - 1` automatically.

> **`sceneKey` prop:** Always pass `sceneKey={cotIndex}` to body components and use it as a `key` on stateful sub-components (e.g. `<Typewriter key={sceneKey} ...>`) so they reset cleanly on every scene transition.

---

## Adding a new animation primitive

1. Create `src/engine/primitives/MyPrimitive.tsx`
2. Use `motion` from Framer Motion for all animated elements
3. Import all timing values from `src/engine/timing.ts` — no magic numbers
4. Export a typed props interface alongside the component
5. Document it in this README under **Layer 1**

```tsx
// src/engine/primitives/MyPrimitive.tsx
import { motion } from "framer-motion";
import { TIMING, EASING } from "../timing";

export interface MyPrimitiveProps {
  children: React.ReactNode;
  delayMs?: number;
}

export function MyPrimitive({ children, delayMs = 0 }: MyPrimitiveProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: TIMING.cardEntranceMs / 1000,
        delay: delayMs / 1000,
        ease: EASING.enter,
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Tech stack

| Tool | Version | Purpose |
|---|---|---|
| Vite | 6 | Dev server + build |
| React | 19 | UI framework |
| TypeScript | 5.8 | Type safety |
| Tailwind CSS | 4 | Utility styling |
| Framer Motion | 11 | All animations |
