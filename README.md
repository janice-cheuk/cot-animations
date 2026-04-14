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

Each component maps to one chain-of-thought pattern. They are composed from the primitives above and accept typed `payload` props that match the scenario JSON schema.

| Component | Pattern | Primitives used |
|---|---|---|
| `<TopicDiscoveryStep>` | Analyzing Topic Discovery | `StaggerList`, `FadeSlideIn` |
| `<FilesExploredStep>` | Files Explored | `StaggerList`, `FadeSlideIn` |
| `<TodosStep>` | To-dos / Tasks | `StaggerList`, `FadeSlideIn` |
| `<GenericTextStep>` | Generic text | `Typewriter`, `FadeSlideIn` |
| `<SectionReferenceStep>` | Agent referencing sections | `FadeSlideIn` |

Each lives at `src/components/cot/<Name>.tsx`. Prop types are defined in `src/engine/types.ts`.

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

| # | Scene | What you'll see |
|---|---|---|
| 1 | **Analyzing Topic Discovery** | Shimmer gradient header + AI Analyst illustration with gear-rotation bubbles |
| 2 | **Exploring Knowledge Base Files** | Staggered file list with a live spinner on the last file, resolves to green |
| 3 | **Tasks to Complete** | Checklist with done / active / pending states → navigation pill → auto-switches to Knowledge Base tab → clarifying questions card |
| 4 | **Generic Reasoning** | Phrase-by-phrase typewriter text |
| 5 | **Agent Referencing Sections** | Animated reference cards with source + excerpt |

### 4. Adding or editing a scene

All scene content is defined in the `SCENES` constant inside `src/components/companion/CompanionPanel.tsx`. Each entry has a `header` string and maps to a body component (`TopicDiscoveryBody`, `FilesExploredBody`, etc.). To add a new scene, append an entry to `SCENES` and create the corresponding body component.

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
