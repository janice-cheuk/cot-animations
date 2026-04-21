import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Typewriter } from "../../engine/primitives/Typewriter";
import { AIAnalystIllustration } from "./AIAnalystIllustration";
import type { SceneDef } from "../../data/flows";

// ── Icon components ──────────────────────────────────────────────────────────

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8C2 4.686 4.686 2 8 2C11.314 2 14 4.686 14 8C14 11.314 11.314 14 8 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M2 5V2H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5V8.5L10.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CollapseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 2V14" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9.5 6.5L11.5 8L9.5 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 1.5H7.5L11 5V11.5H3V1.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M7.5 1.5V5H11" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function QuoteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M1 4.5C1 3.4 1.9 2.5 3 2.5H4.5V5.5H3C3 6.6 3.9 7.5 5 7.5V9.5C2.8 9.5 1 7.7 1 5.5V4.5Z" fill="currentColor" opacity="0.5" />
      <path d="M7 4.5C7 3.4 7.9 2.5 9 2.5H10.5V5.5H9C9 6.6 9.9 7.5 11 7.5V9.5C8.8 9.5 7 7.7 7 5.5V4.5Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

// Task list icons — match Figma node 553:5299
function ListCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 3h6M5 6h6M5 9h6" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M1.5 3.5l.7.7 1.3-1.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 6.5l.7.7 1.3-1.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 9.5l.7.7 1.3-1.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CircleCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="5" fill="#34d399" />
      <path d="M3.5 6.2l1.5 1.5 3.5-3.4" stroke="white" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CircleDashedIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.15" strokeDasharray="2.5 1.5" fill="none" />
    </svg>
  );
}
function CircleEmptyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.15" fill="none" />
    </svg>
  );
}

// ── Spinner for "in progress" file ───────────────────────────────────────────
function Spinner() {
  return (
    <motion.svg
      width="13" height="13" viewBox="0 0 13 13" fill="none"
      style={{ flexShrink: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="6.5" cy="6.5" r="5" stroke="var(--border-default)" strokeWidth="1.5" />
      <path d="M6.5 1.5A5 5 0 0 1 11.5 6.5" stroke="var(--content-action)" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  );
}

// ── Scene visual components ──────────────────────────────────────────────────

const BODY_STYLE: React.CSSProperties = {
  fontSize: 12, fontWeight: 400, lineHeight: 1.55, color: "var(--content-secondary)",
};

// Scene 0 — Topic Discovery
function TopicDiscoveryBody({ sceneKey }: { sceneKey: number }) {
  return (
    <>
      <Typewriter
        key={sceneKey}
        text="Scanning knowledge base for relevant topic clusters. Cross-referencing historical conversation patterns. Identifying high-signal themes for agent configuration."
        mode="phrase" phraseSize={3} speedMs={90} delayMs={300}
        style={BODY_STYLE}
      />
      <AIAnalystIllustration />
    </>
  );
}

// Scene 1 — Files Explored
const EXPLORE_FILES = [
  { name: "customer_support_intents.md",  status: "done"    },
  { name: "escalation_playbook.json",     status: "done"    },
  { name: "tone_guidelines.md",           status: "done"    },
  { name: "billing_workflows.yaml",       status: "done"    },
  { name: "historical_conversations.db",  status: "active"  },
];

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 2.5C2 2.5 4 2 7 3.5C10 2 12 2.5 12 2.5V11.5C12 11.5 10 11 7 12.5C4 11 2 11.5 2 11.5V2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 3.5V12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AISpinner() {
  return (
    <motion.svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ flexShrink: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="6" cy="6" r="4.5" stroke="#dee5eb" strokeWidth="1.4" />
      <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="#205ae3" strokeWidth="1.4" strokeLinecap="round" />
    </motion.svg>
  );
}

const CLARIFYING_CHOICES = [
  { id: "A", text: "This is the first answer choice the user can select",  selected: true  },
  { id: "B", text: "This is the first answer choice the user can select",  selected: false },
  { id: "C", text: "This is the second answer choice the user can select", selected: false },
  { id: "D", text: "This is the third answer choice the user can select",  selected: false },
];

function ClarifyingQuestions() {
  const [selected, setSelected] = useState<string>("A");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        display: "flex", flexDirection: "column", gap: 10,
        background: "white",
        border: "1px solid var(--border-default)",
        borderRadius: 10,
        padding: "10px 12px",
      }}
    >
      {/* Question + subcopy */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, lineHeight: 1.5, color: "#000" }}>
          Here is a clarifying question the agent asks to ensure the prompt it's writing matches the user's expectations?
        </p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 425, lineHeight: 1.5, color: "var(--content-secondary)" }}>
          This is where there can be additional subcopy for additional context
        </p>
      </div>

      {/* Answer choices */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {CLARIFYING_CHOICES.map((choice, i) => {
          const isSelected = selected === choice.id;
          return (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.22, ease: "easeOut" }}
              onClick={() => setSelected(choice.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "3px 4px", borderRadius: 6, cursor: "pointer",
                background: isSelected ? "#f1f5ff" : "transparent",
                transition: "background 0.15s ease",
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isSelected ? "var(--content-action)" : "transparent",
                transition: "background 0.15s ease",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, lineHeight: 1,
                  color: isSelected ? "white" : "var(--content-secondary)",
                }}>
                  {choice.id}
                </span>
              </div>
              <span style={{ fontSize: 12, lineHeight: 1.5, color: "var(--content-secondary)" }}>
                {choice.text}
              </span>
            </motion.div>
          );
        })}

        {/* Other row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 4px" }}>
          <div style={{
            width: 18, height: 18, borderRadius: 999, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--content-secondary)" }}>…</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 550, lineHeight: 1.5, color: "var(--content-secondary)" }}>Other</span>
          <span style={{ fontSize: 12, lineHeight: 1.5, color: "#a1b0b7" }}>Provide a custom response</span>
        </div>
      </div>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavigationPill({ done }: { done: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "white",
        border: "1px solid var(--border-default)",
        borderRadius: 999,
        padding: "3px 8px 3px 5px",
        alignSelf: "flex-start",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <motion.div
          style={{ display: "flex", alignItems: "center" }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="wait">
            {done ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ color: "var(--content-action)", display: "flex" }}
              >
                <CheckIcon />
              </motion.span>
            ) : (
              <motion.span key="spinner" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <AISpinner />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        <span style={{ fontSize: 12, fontWeight: 550, lineHeight: 1.55, color: done ? "var(--content-secondary)" : "var(--content-primary)", whiteSpace: "nowrap" }}>
          {done ? "Navigated" : "Navigating"}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <div style={{ height: 20, display: "flex", alignItems: "center", padding: "0 6px", borderRadius: 999 }}>
          <span style={{ fontSize: 11, fontWeight: 550, color: "var(--content-secondary)", whiteSpace: "nowrap" }}>Agents</span>
        </div>
        <span style={{ color: "var(--content-secondary)", display: "flex", opacity: 0.6 }}><ArrowRightIcon /></span>
        <div style={{ height: 20, display: "flex", alignItems: "center", gap: 4, padding: "0 6px", borderRadius: 999 }}>
          <span style={{ color: "#205ae3", display: "flex" }}><BookIcon /></span>
          <span style={{ fontSize: 11, fontWeight: 550, color: "#205ae3", whiteSpace: "nowrap" }}>Knowledge Base</span>
        </div>
      </div>
    </motion.div>
  );
}

function FilesExploredBody() {
  const [fileDone, setFileDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFileDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {EXPLORE_FILES.map((f, i) => {
        const resolved = f.status === "active" && fileDone ? "done" : f.status;
        return (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: resolved === "pending" ? 0.35 : 1, x: 0 }}
            transition={{ delay: i * 0.13, duration: 0.28, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "center", gap: 7 }}
          >
            {resolved === "done"    && <span style={{ color: "var(--content-action)" }}><FileIcon /></span>}
            {resolved === "active"  && <Spinner />}
            {resolved === "pending" && <span style={{ color: "var(--border-default)" }}><FileIcon /></span>}
            <span style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 11.5,
              color: resolved === "active" ? "var(--content-primary)" : "var(--content-secondary)",
            }}>
              {f.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// Scene 2 — Tasks (Figma node 553:5299)
// States: circle-check (done, green), circle-dashed (active), circle (pending)
const COT_TASKS = [
  { label: "The agent is referencing the section ", linkLabel: "Knowledge Base", status: "done"    },
  { label: "This is the task the agent is working on",     status: "active"  },
  { label: "This is the next task the agent will work on", status: "pending" },
  { label: "This is the next task the agent will work on", status: "pending" },
  { label: "This is the next task the agent will work on", status: "pending" },
  { label: "This is the next task the agent will work on", status: "pending" },
];
function TodoTasksBody() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--content-secondary)" }}
      >
        <ListCheckIcon />
        <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.55 }}>Tasks to complete</span>
      </motion.div>

      {/* Task items — indented 24px, matching Figma pl-[24px] */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 0 }}>
        {COT_TASKS.map((t, i) => (
          <motion.div
            key={`${t.status}-${i}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.25, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {t.status === "done"    && <CircleCheckIcon />}
            {t.status === "active"  && (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <CircleDashedIcon />
              </motion.span>
            )}
            {t.status === "pending" && <span style={{ opacity: 0.4 }}><CircleEmptyIcon /></span>}
            <span style={{
              fontSize: 12, fontWeight: 400, lineHeight: 1.55,
              color: "var(--content-secondary)",
              opacity: t.status === "pending" ? 0.5 : 1,
            }}>
              {t.label}
              {t.linkLabel && (
                <span style={{ color: "#205ae3", cursor: "pointer" }}>{t.linkLabel}</span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Scene 3 — Generic reasoning text
function GenericReasoningBody({ sceneKey }: { sceneKey: number }) {
  return (
    <Typewriter
      key={sceneKey}
      text="Evaluating intent taxonomy against training data. Confidence threshold met for 9 of 12 intent categories. Flagging ambiguous cases for human review. Agent routing logic finalized with 3 escalation tiers."
      mode="phrase" phraseSize={3} speedMs={85} delayMs={300}
      style={BODY_STYLE}
    />
  );
}

// Scene 4 — Agent referencing relevant sections
const REFERENCES = [
  {
    title: "Escalation handling pattern",
    source: "cresta_agent_docs/billing_agent.md:45",
    excerpt: "\"Route to senior agent when sentiment score drops below 0.4 for two consecutive turns.\"",
  },
  {
    title: "Response tone guideline",
    source: "templates/customer_support.yaml:12",
    excerpt: "\"Acknowledge the issue first before presenting resolution options.\"",
  },
  {
    title: "Intent fallback config",
    source: "configs/fallback_intents.json:8",
    excerpt: "\"Trigger clarification prompt when confidence < 0.65.\"",
  },
];
// ── Scene 5 — Analyzing Trends & Anomalies ───────────────────────────────────

// Trend line path traced from Figma (viewBox 0 0 333 104)
const TREND_LINE = "M 0,84 L 48,63 L 88,75 L 134,50 L 180,66 L 226,40 L 270,46 L 306,26 L 333,30";
const TREND_AREA = `${TREND_LINE} L 333,104 L 0,104 Z`;

// Red dots appear at the two rightmost anomaly peaks
const ANOMALY_DOTS = [
  { cx: 226, cy: 40, appear: 0.6, disappear: 0.88 },
  { cx: 306, cy: 26, appear: 0.78, disappear: 0.88 },
];

function TrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
      style={{
        background: "white",
        border: "1px solid var(--border-default)",
        borderRadius: 8,
        padding: "10px 10px 6px",
        overflow: "hidden",
      }}
    >
      <svg width="100%" viewBox="0 0 333 104" fill="none" style={{ display: "block" }}>
        {/* Horizontal grid lines */}
        {[20, 52, 84].map(y => (
          <line key={y} x1="0" y1={y} x2="333" y2={y}
            stroke="#e9ecef" strokeWidth="1" />
        ))}

        {/* Shaded area beneath the line */}
        <path d={TREND_AREA} fill="rgba(90, 103, 216, 0.08)" />

        {/* Animated trend line — draws left to right, loops */}
        <motion.path
          d={TREND_LINE}
          stroke="#5a67d8"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{
            duration: 3.2,
            times: [0, 0.58, 0.84, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.3,
          }}
        />

        {/* Anomaly dots — pop in when line reaches them, fade before reset */}
        {ANOMALY_DOTS.map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx} cy={dot.cy} r="5"
            fill="#f03e3e"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0, 1, 1, 0],
              scale:   [0, 0, 1, 1, 0],
            }}
            transition={{
              duration: 3.2,
              times: [0, dot.appear - 0.02, dot.appear + 0.06, dot.disappear, 1],
              repeat: Infinity,
              repeatDelay: 0.3,
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// ── Scene 7 — Analyzing closed conversations ──────────────────────────────────

// Inset-to-pixel conversion for 195×183 container:
// G1  inset(0  -0.01% 88.33% -0.02%) → x=0,   y=0,   w=195, h=21
// G2  inset(15% -0.02% 63.33% 30.23%) → x=59,  y=27,  w=136, h=40
// G3  inset(40% 48.32% 48.33% -0.02%) → x=0,   y=73,  w=101, h=21
// G4  inset(55% -0.02% 23.33% 30.23%) → x=59,  y=101, w=136, h=40
// G5  inset(80% 30.23% 3.33%  -0.02%) → x=0,   y=146, w=136, h=31

// Staggered fade-in loop: 5 groups, each reveals in sequence then all fade out
const CC_TOTAL = 3.2;   // full cycle duration (s)
const CC_STAGGER = 0.18; // delay between each group appearing
const CC_HOLD = 2.2 / CC_TOTAL;     // fraction where all are visible → start fade
const CC_GONE = 2.8 / CC_TOTAL;     // fraction where all fade to 0

function ccAnim(index: number) {
  const fadeIn  = (index * CC_STAGGER) / CC_TOTAL;
  const visible = Math.min(fadeIn + 0.10, CC_HOLD - 0.02);
  return {
    animate: { opacity: [0, 0, 1, 1, 0, 0] as number[] },
    transition: {
      duration: CC_TOTAL,
      times: [0, fadeIn, visible, CC_HOLD, CC_GONE, 1],
      ease: "easeOut" as const,
      repeat: Infinity,
      repeatDelay: 0.4,
    },
  };
}

function ClosedConversationsGraphic() {
  return (
    <div style={{
      width: 195, height: 183,
      position: "relative",
      background: "#f8f9fa",
      borderRadius: 8,
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* G1 — grey block, 1 line, hugs content */}
      <motion.div {...ccAnim(0)} style={{
        position: "absolute", top: 4, left: 8,
        width: "fit-content", height: 18,
        background: "#CED4DA", borderRadius: 5,
        padding: "0 8px", display: "flex", alignItems: "center",
      }}>
        <div style={{ height: 5, background: "#ADB5BD", borderRadius: 2, width: 118 }} />
      </motion.div>

      {/* G2 — white card, 3 lines, hugs content */}
      <motion.div {...ccAnim(1)} style={{
        position: "absolute", top: 28, left: 57,
        width: "fit-content", height: 42,
        background: "white", borderRadius: 6,
        padding: "0 8px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4,
      }}>
        <div style={{ height: 6, background: "#DEE2E6", borderRadius: 3, width: 108 }} />
        <div style={{ height: 6, background: "#DEE2E6", borderRadius: 3, width: 88 }} />
        <div style={{ height: 6, background: "#DEE2E6", borderRadius: 3, width: 64 }} />
      </motion.div>

      {/* G3 — light-blue block, 1 line, hugs content */}
      <motion.div {...ccAnim(2)} style={{
        position: "absolute", top: 76, left: 8,
        width: "fit-content", height: 19,
        background: "#DBE4FF", borderRadius: 5,
        padding: "0 8px", display: "flex", alignItems: "center",
      }}>
        <div style={{ height: 5, background: "#BAC8FF", borderRadius: 2, width: 68 }} />
      </motion.div>

      {/* G4 — white card, 3 lines, hugs content */}
      <motion.div {...ccAnim(3)} style={{
        position: "absolute", top: 101, left: 57,
        width: "fit-content", height: 42,
        background: "white", borderRadius: 6,
        padding: "0 8px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4,
      }}>
        <div style={{ height: 6, background: "#DEE2E6", borderRadius: 3, width: 108 }} />
        <div style={{ height: 6, background: "#DEE2E6", borderRadius: 3, width: 94 }} />
        <div style={{ height: 6, background: "#DEE2E6", borderRadius: 3, width: 70 }} />
      </motion.div>

      {/* G5 — light blue block, 2 lines, hugs content */}
      <motion.div {...ccAnim(4)} style={{
        position: "absolute", top: 149, left: 8,
        width: "fit-content", height: 28,
        background: "#DBE4FF", borderRadius: 5,
        padding: "0 8px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4,
      }}>
        <div style={{ height: 5, background: "#BAC8FF", borderRadius: 2, width: 102 }} />
        <div style={{ height: 5, background: "#BAC8FF", borderRadius: 2, width: 72 }} />
      </motion.div>
    </div>
  );
}

function ClosedConversationsBody({ sceneKey }: { sceneKey: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Typewriter
        key={sceneKey}
        text="Reviewing closed dispute tickets and chat transcripts for resolution patterns. Extracting high-confidence handling sequences to inform agent behavior."
        mode="phrase" phraseSize={3} speedMs={85} delayMs={300}
        style={BODY_STYLE}
      />
      <ClosedConversationsGraphic />
    </div>
  );
}

function TrendsAnomaliesBody({ sceneKey }: { sceneKey: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Typewriter
        key={sceneKey}
        text="Scanning historical interaction data for usage spikes and drop-off patterns. Two anomalies detected in billing dispute flow. Flagging high-volume edge cases for prioritization."
        mode="phrase" phraseSize={3} speedMs={85} delayMs={300}
        style={BODY_STYLE}
      />
      <TrendChart />
    </div>
  );
}

// ── Scene 8 — Utilizing automation discovery ──────────────────────────────────

// Exact Tabler "writing" icon paths, scaled to 18×18
function WritingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2" />
      <path d="M16 7h4" />
      <path d="M18 19h-13a2 2 0 1 1 0 -4h4a2 2 0 1 0 0 -4h-3" />
    </svg>
  );
}

// Exact Tabler "analyze" icon paths, scaled to 18×18
function AnalyzeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 11a8.1 8.1 0 0 0 -6.986 -6.918a8.095 8.095 0 0 0 -8.019 3.918" />
      <path d="M4 13a8.1 8.1 0 0 0 15 3" />
      <path d="M18 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M4 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    </svg>
  );
}

// Exact Tabler "chart-pie" icon paths, scaled to 18×18
function ChartPieIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8" />
      <path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5" />
    </svg>
  );
}

// Spinner sized to match the 18×18 icon container
function ADSpinner() {
  return (
    <motion.svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="8" cy="8" r="6" stroke="#dee5eb" strokeWidth="1.6" />
      <path d="M8 2A6 6 0 0 1 14 8" stroke="#205ae3" strokeWidth="1.6" strokeLinecap="round" />
    </motion.svg>
  );
}

const AD_ROWS: Array<{
  label: string;
  icon: React.ReactNode | null;
  hasIcon: boolean;
  settleIndex: number | null;
}> = [
  { label: "Extracting the core flow",                                   icon: <WritingIcon />,  hasIcon: true,  settleIndex: 0    },
  { label: "Step 1 of 2: Loading and analyzing conversations",           icon: <AnalyzeIcon />,  hasIcon: true,  settleIndex: 1    },
  { label: "Step 2 of 2: Extracting phases and categorizing deviations", icon: null,             hasIcon: false, settleIndex: null },
  { label: "Computing deviations",                                        icon: <ChartPieIcon />, hasIcon: true,  settleIndex: null },
];

// (s) each row fades in after mount
const AD_APPEAR = [0.25, 1.5, 2.1, 3.0];

// Row height (px) used to size the connector lines so the icon center lines up with the text
const AD_ROW_H = 34;
const AD_ICON_H = 18;
const AD_CONNECTOR_H = (AD_ROW_H - AD_ICON_H) / 2 - 1; // ~7px each side

function AutomationDiscoveryBody({ sceneKey }: { sceneKey: number }) {
  const [settledStep, setSettledStep] = useState(-1);

  useEffect(() => {
    setSettledStep(-1);
    const t1 = setTimeout(() => setSettledStep(0), 1400);
    const t2 = setTimeout(() => setSettledStep(1), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [sceneKey]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Timeline rows */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {AD_ROWS.map((row, i) => {
          const isFirst = i === 0;
          const isLast  = i === AD_ROWS.length - 1;
          const settled = row.settleIndex !== null && settledStep >= row.settleIndex;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: AD_APPEAR[i], duration: 0.28, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "center" }}
            >
              {/* ── Left connector + icon column (32px wide) ── */}
              <div style={{
                width: 32, flexShrink: 0,
                display: "flex", flexDirection: "column", alignItems: "center",
                alignSelf: "stretch",
              }}>
                {row.hasIcon ? (
                  <>
                    {/* line above icon */}
                    <div style={{
                      width: 2, flexShrink: 0,
                      height: isFirst ? 0 : AD_CONNECTOR_H,
                      background: "#DEE2E6",
                    }} />
                    {/* 18×18 icon box — both spinner and icon are centred inside */}
                    <div style={{
                      width: 18, height: 18, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--content-secondary)",
                    }}>
                      <AnimatePresence mode="wait">
                        {settled ? (
                          <motion.span key="icon"
                            initial={{ opacity: 0, scale: 0.75 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.22 }}
                            style={{ display: "flex" }}
                          >
                            {row.icon}
                          </motion.span>
                        ) : (
                          <motion.span key="spin"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ display: "flex" }}
                          >
                            <ADSpinner />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* line below icon */}
                    {!isLast && (
                      <div style={{ width: 2, flex: 1, minHeight: AD_CONNECTOR_H, background: "#DEE2E6" }} />
                    )}
                  </>
                ) : (
                  /* no-icon row (Step 2 of 2): just a continuous connector */
                  <div style={{ width: 2, flex: 1, background: "#DEE2E6" }} />
                )}
              </div>

              {/* ── Text ── */}
              <div style={{
                paddingLeft: 8,
                paddingTop: row.hasIcon ? 6 : 2,
                paddingBottom: row.hasIcon ? 6 : 8,
                display: "flex", alignItems: "center",
              }}>
                <span style={{ fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.45 }}>
                  {row.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function AgentSectionsBody() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {REFERENCES.map((r, i) => (
        <motion.div
          key={r.source}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.18, duration: 0.3, ease: "easeOut" }}
          style={{
            background: "var(--background-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: 8, padding: "8px 10px",
            display: "flex", flexDirection: "column", gap: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: "var(--content-action)" }}><QuoteIcon /></span>
            <span style={{ fontSize: 11.5, fontWeight: 550, color: "var(--content-primary)" }}>{r.title}</span>
          </div>
          <span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 10.5, color: "var(--content-secondary)", opacity: 0.7 }}>
            {r.source}
          </span>
          <span style={{ fontSize: 11.5, lineHeight: 1.5, color: "var(--content-secondary)", fontStyle: "italic" }}>
            {r.excerpt}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface CompanionPanelProps {
  userPrompt: string;
  scenes: SceneDef[];
  onNavigateKB?: () => void;
}

export function CompanionPanel({ userPrompt, scenes, onNavigateKB }: CompanionPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [cotIndex, setCotIndex] = useState(0);
  const dirRef = useRef(1);
  const [spinDone, setSpinDone] = useState(false);
  const [navDone, setNavDone] = useState(false);

  // Keep a ref so the keyboard handler always sees the current scenes length
  // without needing to re-register the event listener on every render.
  const scenesRef = useRef(scenes);
  useEffect(() => { scenesRef.current = scenes; }, [scenes]);

  const currentId = scenes[cotIndex]?.id;

  // Reset and re-arm when the active scene changes
  useEffect(() => {
    setSpinDone(false);
    setNavDone(false);
    if (currentId === "todos-tasks") {
      const t = setTimeout(() => setSpinDone(true), 2500);
      return () => clearTimeout(t);
    }
  }, [cotIndex, currentId]);

  useEffect(() => {
    if (spinDone && currentId === "todos-tasks" && onNavigateKB) {
      const t = setTimeout(() => {
        onNavigateKB();
        setNavDone(true);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [spinDone, currentId, onNavigateKB]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        dirRef.current = 1;
        setCotIndex(i => Math.min(i + 1, scenesRef.current.length - 1));
      } else if (e.key === "ArrowLeft") {
        dirRef.current = -1;
        setCotIndex(i => Math.max(i - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 36, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir * -36, opacity: 0 }),
  };

  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        width: 380, height: "100%",
        background: "var(--background-elevation)",
        border: "1px solid var(--border-default)",
        borderRadius: 12, overflow: "hidden", flexShrink: 0,
      }}
    >
      {/* Panel header */}
      <div
        style={{
          background: "var(--background-surface)",
          borderBottom: "1px solid var(--border-default)",
          padding: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 550, color: "var(--content-secondary)" }}>Companion</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button style={{ padding: 4, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--content-secondary)", display: "flex" }}>
            <HistoryIcon />
          </button>
          <div style={{ width: 1, height: 16, background: "var(--border-default)" }} />
          <button style={{ padding: 4, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--content-secondary)", display: "flex" }}>
            <CollapseIcon />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          padding: 16,
          display: "flex", flexDirection: "column", gap: 12,
          justifyContent: "flex-start",
        }}
      >
        {/* User message */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              background: "#ebf0f5",
              borderRadius: "12px 12px 2px 12px",
              padding: "12px 16px", maxWidth: "100%",
              fontSize: 14, fontWeight: 425, lineHeight: 1.55,
              color: "var(--content-primary)",
              whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}
          >
            {userPrompt}
          </div>
        </div>

        {/* CoT block */}
        <AnimatePresence mode="wait" custom={dirRef.current}>
          <motion.div
            key={cotIndex}
            custom={dirRef.current}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {/* CoT header — freezes once the todos-tasks scene completes */}
            {(() => {
              const isDone = currentId === "todos-tasks" && spinDone;
              const header = scenes[cotIndex]?.header ?? "";
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {isDone ? (
                    <span style={{ fontSize: 14, fontWeight: 550, lineHeight: 1.55, color: "var(--content-secondary)" }}>
                      {header}
                    </span>
                  ) : (
                    <motion.span
                      animate={{ opacity: [1, 0.65, 1] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <span className="cot-shimmer-text" style={{ fontSize: 14, fontWeight: 550, lineHeight: 1.55 }}>
                        {header}
                      </span>
                    </motion.span>
                  )}
                  <span style={{ color: "var(--content-secondary)", flexShrink: 0 }}>
                    <ChevronDownIcon />
                  </span>
                </div>
              );
            })()}

            {/* CoT body */}
            <div style={{ display: "flex", gap: 12, paddingLeft: 6 }}>
              <div style={{ width: 1, background: "var(--border-default)", flexShrink: 0, borderRadius: 1 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
                {currentId === "topic-discovery"    && <TopicDiscoveryBody sceneKey={cotIndex} />}
                {currentId === "files-explored"     && <FilesExploredBody />}
                {currentId === "todos-tasks"         && <TodoTasksBody />}
                {currentId === "generic-text"        && <GenericReasoningBody sceneKey={cotIndex} />}
                {currentId === "agent-sections"      && <AgentSectionsBody />}
                {currentId === "trends-anomalies"    && <TrendsAnomaliesBody sceneKey={cotIndex} />}
                {currentId === "closed-conversations" && <ClosedConversationsBody sceneKey={cotIndex} />}
                {currentId === "automation-discovery" && <AutomationDiscoveryBody sceneKey={cotIndex} />}
              </div>
            </div>

            {/* Navigation pill — appears after todos-tasks scene completes */}
            {currentId === "todos-tasks" && spinDone && <NavigationPill done={navDone} />}

            {/* Clarifying questions — appears once navigation completes */}
            <AnimatePresence>
              {currentId === "todos-tasks" && navDone && <ClarifyingQuestions key="clarifying" />}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Scene indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 4 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {scenes.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { dirRef.current = i > cotIndex ? 1 : -1; setCotIndex(i); }}
                animate={{ opacity: i === cotIndex ? 1 : 0.3 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: i === cotIndex ? 16 : 6, height: 6,
                  borderRadius: 99, background: "var(--content-action)",
                  border: "none", padding: 0, cursor: "pointer",
                  transition: "width 0.2s ease",
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 10, color: "var(--content-secondary)", opacity: 0.5, letterSpacing: "0.02em" }}>
            ← → to navigate
          </span>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ background: "var(--background-elevation)", padding: 16, flexShrink: 0 }}>
        <div
          style={{
            background: "var(--background-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: 12, padding: "8px 12px",
            boxShadow: "0px 8px 28px -6px rgba(24,39,75,0.12)",
            display: "flex", flexDirection: "column", gap: 8,
          }}
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything" rows={1}
            style={{
              border: "none", outline: "none", resize: "none",
              fontFamily: "Inter, sans-serif", fontSize: 16,
              lineHeight: 1.55, color: "var(--content-primary)",
              background: "transparent", width: "100%", minHeight: 28,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", color: "var(--content-action)", display: "flex" }}>
              <PlusIcon />
            </button>
            <button
              style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "var(--content-action)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <ArrowUpIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
