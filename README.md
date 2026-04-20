# Agent Builder Companion — Chain-of-Thought Animation Demo

A UI-only, deterministic prototype that demonstrates the animated chain-of-thought (CoT) experience for the AI Agent Builder Companion. No backend required — every response is a pre-scripted JSON scenario that drives the animation engine.

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
│   ├── cot/               ← Layer 2: CoT pattern components (built from primitives)
│   ├── companion/         ← Layer 3: shell UI (chat frame, input bar, scenario picker)
│   └── nav/               ← Static nav sidebar
├── data/
│   └── scenarios/         ← JSON scenario scripts — one file per demo
└── App.tsx
```

**Rule of thumb:**
- Changing timing or easing → edit `engine/timing.ts`
- Changing what a CoT step looks like → edit `components/cot/`
- Changing the demo content → edit `data/scenarios/`
- Building a new animation primitive → add to `engine/primitives/`

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

**To change the gradient** — pass any CSS gradient string:

```tsx
<TextCycler
  items={["..."]}
  gradient="linear-gradient(135deg, #5a8fc4 0%, #6e5ea8 50%, #b87a7a 100%)"
/>
```

---

### `<Typewriter>`

Streams text character by character, like a live AI response. Used in the `GenericText` CoT step.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | required | Full string to type out |
| `speedMs` | `number` | `22` | Delay between each character (ms) |
| `onComplete` | `() => void` | — | Fired when the full string has been typed |
| `className` | `string` | — | Applied to the container |

**Usage**

```tsx
import { Typewriter } from "@/engine/primitives/Typewriter";

<Typewriter
  text="This agent handles customer refund requests automatically."
  speedMs={20}
  onComplete={() => console.log("done")}
/>
```

---

### `<StaggerList>`

Reveals a list of items one by one with a staggered entrance. Used in `FilesExploredStep` and `TodosStep`.

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

## Layer 2 — CoT pattern components

Each component maps to one chain-of-thought pattern. In this prototype they live as named functions inside `src/components/companion/CompanionPanel.tsx`. When integrating into the real repo, each should be extracted to its own file under `src/components/cot/<Name>.tsx` and connected to live backend data.

| Body component | Scene | Key animation technique |
|---|---|---|
| `TopicDiscoveryBody` | Analyzing topic discovery | CSS `@keyframes` shimmer gradient on the CoT header; SVG `animateTransform` gear rotation + Framer Motion `scaleY` breathing on the AI Analyst illustration |
| `FilesExploredBody` | Exploring knowledge base files | Framer Motion staggered list reveal; `motion.svg` spinner on the active file |
| `TodoTasksBody` | Thinking (tasks) | Staggered checklist; timed spinner → nav pill → tab navigation → clarifying questions card |
| `GenericReasoningBody` | Generating response strategy | `<Typewriter>` in `phrase` mode (3-word chunks) |
| `AgentSectionsBody` | Referencing agent patterns | Staggered `motion.div` reference cards with fade + slide entrance |
| `TrendsAnomaliesBody` | Analyzing trends & anomalies | Framer Motion `pathLength` on an SVG path to draw the trend line left-to-right; opacity-animated anomaly dots |
| `ClosedConversationsBody` | Analyzing closed conversations | Five `motion.div` document rows with a staggered `opacity` keyframe loop (`[0,0,1,1,0,0]`) — each fades in, holds, then fades out before the next cycle |
| `AutomationDiscoveryBody` | Utilizing automation discovery | Vertical timeline with timed spinner → icon swap (`AnimatePresence` cross-fade); continuous connector line for icon-less steps |

### Connecting to the backend

Each body component currently renders **hardcoded content**. When wiring to a real agent:

- Replace the static text in `<Typewriter text="...">` with the streamed string from the agent's reasoning output.
- Replace hardcoded file lists / task lists / reference arrays with data from the agent's tool-call responses.
- The `spinDone` / `navDone` state pattern (used in `FilesExploredBody` and `TodoTasksBody`) should be driven by real tool-call completion events rather than `setTimeout`.
- The tab navigation triggered by `onNavigateKB()` is already a callback prop — wire it to whatever routing/state system the real app uses.

> **Spinner convention:** All active/loading states use the `AISpinner` component (a 12 × 12 rotating SVG arc). Scene 8 uses a scaled-up variant `ADSpinner` (16 × 16) to match the 18 × 18 icon container. Both use the same blue `#205ae3` arc on a light grey track.

---

## Layer 3 — Timing constants

All durations and easing curves live in one file: `src/engine/timing.ts`. **Never hardcode animation values inside components** — always import from here.

```ts
// src/engine/timing.ts

export const TIMING = {
  // Gap between CoT steps
  stepGapMs: 500,

  // Thinking indicator shown before first step
  thinkingDelayMs: 900,

  // Default entrance duration for CoT cards
  cardEntranceMs: 280,

  // Typewriter character speed
  typewriterSpeedMs: 22,

  // TextCycler interval
  cyclerIntervalMs: 2800,

  // StaggerList item delay
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

### 2. Navigate between animation types

Once inside the builder, use the **arrow keys** to step through all five chain-of-thought animation scenes in the Companion panel:

| Key | Action |
|---|---|
| `→` Right arrow | Next animation scene |
| `←` Left arrow | Previous animation scene |

Dot indicators at the bottom of the Companion panel show which scene is active and are also **clickable**.

### 3. Animation scenes (in order)

| # | Scene header | What you'll see |
|---|---|---|
| 1 | **Analyzing topic discovery for relevant insights** | Shimmer gradient CoT header + AI Analyst illustration with three outer bubbles rotating like gears and inner bubbles breathing |
| 2 | **Exploring relevant knowledge base files** | Staggered file list, live spinner on the last file that settles to a done state |
| 3 | **Thinking** | Checklist of tasks with done / active / pending states → navigation pill → auto-switches the main panel to the Knowledge Base tab → clarifying questions card fades in |
| 4 | **Generating agent response strategy** | Phrase-by-phrase typewriter text streaming |
| 5 | **Referencing relevant agent patterns** | Staggered reference cards each showing a source file path and a quoted excerpt |
| 6 | **Analyzing trends and anomalies** | Typewriter text + line chart where the trend line animates left-to-right in a loop with two anomaly dots appearing at peaks |
| 7 | **Analyzing closed conversations** | Typewriter text + stacked document graphic where each row fades in sequentially, holds, then fades out in a loop |
| 8 | **Utilizing automation discovery** | Vertical timeline: each step fades in one by one with a spinning loader, then the loader resolves to the step's icon once complete; the last step keeps spinning to indicate work in progress |

### 4. Adding or editing a scene

All scene content is defined in the `SCENES` constant inside `src/components/companion/CompanionPanel.tsx`. Each entry has a `header` string and maps to a body component. To add a new scene:

1. Append an entry to the `SCENES` array — the `header` string becomes the animated CoT header text.
2. Create the body component (e.g. `MyNewBody`) anywhere in the file following the same pattern as the existing body components.
3. Add a `{cotIndex === N && <MyNewBody sceneKey={cotIndex} />}` case to the render block.
4. Update the `Math.min(i + 1, N)` cap in the keyboard handler to the new maximum index.

> **Note:** The `sceneKey` prop is passed to `Typewriter` and other stateful sub-components as a `key` prop so they reset cleanly on every scene transition.

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
