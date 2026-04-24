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
│   │   ├── TopicDiscoveryBody (inline)     ← shimmer header + gear illustration
│   │   ├── FilesExploredBody (inline)      ← staggered file list + spinner
│   │   ├── TodoTasksBody (inline)          ← tasks → nav pill → KB tab → questions
│   │   ├── GenericReasoningBody (inline)   ← phrase typewriter
│   │   ├── AgentSectionsBody (inline)      ← staggered reference cards
│   │   ├── TrendsAnomaliesBody (inline)    ← animated SVG line chart
│   │   ├── ClosedConversationsBody (inline)← fading document rows
│   │   ├── AutomationDiscoveryBody (inline)← spinner → icon timeline
│   │   ├── CustomerDiscoveryBody.tsx       ← progressive cluster → usecase reveal
│   │   ├── TestRunScoreboardBody.tsx       ← infinite-scroll test run rows
│   │   ├── KBSearchBody.tsx               ← infinite-scroll KB articles + scan beam
│   │   ├── WebhookInvocationBody.tsx      ← progressive webhook chain (icon-only)
│   │   └── VirtualAgentBody.tsx           ← VA roster + channel deployment pips
│   ├── builder/           ← Main builder area (tabs, plan, prompt, tools, voice)
│   └── nav/               ← Static nav sidebar
├── data/
│   └── flows.ts           ← Scene catalogue + flow definitions
└── App.tsx
```

**Rule of thumb:**
- Changing timing or easing → edit `engine/timing.ts`
- Changing what a CoT step looks like → edit the matching body component
- Adding a new scene → see *Adding or editing a scene* below
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

Each component maps to one chain-of-thought scene. Scenes 1–8 are implemented as named functions inside `CompanionPanel.tsx`. Scenes 9–13 are self-contained files in `src/components/companion/`.

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

> **Spinner convention:** All active/loading states use the `AISpinner` component (a 12 × 12 rotating SVG arc). Scene 8 uses `ADSpinner` (16 × 16) to match its larger icon container. Both use `#205ae3` arc on a light grey track.

> **Icon convention:** All robot/agent icons use the official **Tabler `icon-tabler-robot`** SVG paths. All other icons (webhook, phone, chat, email, code brackets, server) use their respective Tabler outline equivalents.

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

Once inside the builder, use **arrow keys** to step through all 13 CoT scenes in the Companion panel:

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

### 4. Switching flows with the Demo Controller

A floating overlay in the **bottom-left corner** (dark badge with a ⚡ icon) lets you switch between pre-defined demo flows without reloading the page.

> **This widget is not part of the product UI.** It is a demo-only tool. Remove the `<DemoController />` line from `src/App.tsx` to hide it from any build you share externally.

Click the badge to expand the flow picker, then select a flow. The companion panel resets to scene 1 of the new flow automatically.

Available flows (defined in `src/data/flows.ts`):

| Flow | Description |
|---|---|
| **CoT animations** | All 13 CoT scenes in order |
| **Full demo** | End to end flow |
| **Build flow** | Companion generating a build plan |
| **Completed states** | Completed tab states across the builder (Plan, Prompt, Tools, Voice) |

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
