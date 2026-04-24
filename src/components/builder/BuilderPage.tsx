import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CompanionPanel } from "../companion/CompanionPanel";
import type { Flow } from "../../data/flows";

// ── Icons ────────────────────────────────────────────────────────────────────

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// git-pull-request icon
function PullIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="3.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="3.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10.5 5v1.5a2 2 0 01-2 2H5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7.5l-2.5 2 2.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// chevron-down for Push button dropdown
function PushChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CircleDashedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.5 2" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4.5 4L1.5 7L4.5 10M9.5 4L12.5 7L9.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SidebarCollapseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <line x1="5.5" y1="2.5" x2="5.5" y2="13.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8.5 6L11 8L8.5 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Tab icon stubs
function tabIcon(name: string) {
  const stroke = "currentColor";
  const w = 1.3;
  switch (name) {
    case "Plan":
      return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="4" width="10" height="1.3" rx="0.65" fill={stroke} /><rect x="2" y="7" width="7" height="1.3" rx="0.65" fill={stroke} /><rect x="2" y="10" width="8.5" height="1.3" rx="0.65" fill={stroke} /></svg>;
    case "Prompt":
      return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10v6.5H7.5L5 12V9.5H2V3Z" stroke={stroke} strokeWidth={w} strokeLinejoin="round" /></svg>;
    case "Knowledge Base":
      return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2h8v10H3V2Z" stroke={stroke} strokeWidth={w} /><path d="M5 5h4M5 7.5h3" stroke={stroke} strokeWidth={w} strokeLinecap="round" /></svg>;
    case "Tools":
      return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="1.5" stroke={stroke} strokeWidth={w} /><path d="M7 2v2M7 10v2M2 7h2M10 7h2M3.4 3.4l1.4 1.4M9.2 9.2l1.4 1.4M3.4 10.6l1.4-1.4M9.2 4.8l1.4-1.4" stroke={stroke} strokeWidth={w} strokeLinecap="round" /></svg>;
    case "Voice":
      return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="5" y="1.5" width="4" height="7" rx="2" stroke={stroke} strokeWidth={w} /><path d="M2.5 7.5C2.5 10 4.5 11.5 7 11.5S11.5 10 11.5 7.5M7 11.5V13" stroke={stroke} strokeWidth={w} strokeLinecap="round" /></svg>;
    case "Guardrails":
      return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L3 4V8C3 10 5 12 7 12.5C9 12 11 10 11 8V4L7 2Z" stroke={stroke} strokeWidth={w} strokeLinejoin="round" /><path d="M5 7l1.5 1.5L9 5.5" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>;
    default:
      return null;
  }
}

const TABS = ["Plan", "Prompt", "Knowledge Base", "Tools", "Voice", "Guardrails"] as const;

// ── Empty state illustration ──────────────────────────────────────────────────

function SparkleIcon({ size = 18, color = "#adb5bd" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2C12 2 12.8 8.5 14.5 10C16.2 11.5 22 12 22 12C22 12 16.2 12.5 14.5 14C12.8 15.5 12 22 12 22C12 22 11.2 15.5 9.5 14C7.8 12.5 2 12 2 12C2 12 7.8 11.5 9.5 10C11.2 8.5 12 2 12 2Z" />
    </svg>
  );
}

const EMPTY_STATE_LABELS: Record<string, string> = {
  Plan: "Your build plan will be set up here",
  Prompt: "Your prompt will be set up here",
  Tools: "Your tools will be set up here",
  Voice: "Your voice settings will be set up here",
  Guardrails: "Your guardrails will be set up here",
};

function BuildEmptyState({ tab }: { tab: string }) {
  const label = EMPTY_STATE_LABELS[tab] ?? "Coming soon";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* 176×176 illustration container */}
      <div style={{ width: 176, height: 176, position: "relative" }}>
        {/* Background circle */}
        <div style={{
          position: "absolute", left: 18, top: 28, width: 132, height: 132,
          borderRadius: "50%", background: "#f1f3f5",
        }} />

        {/* Back document card (rotated) */}
        <div style={{
          position: "absolute", left: 59, top: 46, width: 77, height: 82,
          background: "#f8f9fa", border: "2px solid #ced4da", borderRadius: 4,
          transform: "rotate(10deg)", transformOrigin: "center",
        }}>
          <div style={{ margin: "14px 10px 0", height: 5, background: "#dee2e6", borderRadius: 3 }} />
          <div style={{ margin: "5px 10px 0", height: 5, background: "#e9ecef", borderRadius: 3 }} />
          <div style={{ margin: "5px 10px 0", height: 5, width: "55%", background: "#e9ecef", borderRadius: 3 }} />
        </div>

        {/* Front document card */}
        <div style={{
          position: "absolute", left: 29, top: 41, width: 93, height: 98,
          background: "white", border: "1.5px solid #dee2e6", borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <div style={{ margin: "16px 12px 0", height: 6, background: "#e9ecef", borderRadius: 3 }} />
          <div style={{ margin: "6px 12px 0", height: 6, background: "#e9ecef", borderRadius: 3 }} />
          <div style={{ margin: "6px 12px 0", height: 6, width: "60%", background: "#f1f3f5", borderRadius: 3 }} />
          <div style={{ margin: "10px 12px 0", height: 6, background: "#f1f3f5", borderRadius: 3 }} />
          <div style={{ margin: "5px 12px 0", height: 6, width: "45%", background: "#f1f3f5", borderRadius: 3 }} />
        </div>

        {/* Sparkle top-left area */}
        <div style={{ position: "absolute", left: 27, top: 16 }}>
          <SparkleIcon size={18} color="#adb5bd" />
        </div>
        {/* Sparkle mid-left */}
        <div style={{ position: "absolute", left: 4, top: 108 }}>
          <SparkleIcon size={12} color="#ced4da" />
        </div>
        {/* Sparkle right */}
        <div style={{ position: "absolute", left: 154, top: 72 }}>
          <SparkleIcon size={15} color="#adb5bd" />
        </div>

        {/* Decorative circles */}
        <div style={{ position: "absolute", left: 11, top: 131, width: 11, height: 11, borderRadius: "50%", background: "#868e96" }} />
        <div style={{ position: "absolute", left: 113, top: 18, width: 10, height: 10, borderRadius: "50%", background: "#dee2e6" }} />
        <div style={{ position: "absolute", left: 11, top: 52, width: 7, height: 7, borderRadius: "50%", background: "#ced4da" }} />
        <div style={{ position: "absolute", left: 124, top: 153, width: 7, height: 7, borderRadius: "50%", background: "#ced4da" }} />
      </div>

      <p style={{
        fontSize: 14, color: "var(--content-secondary)", margin: 0,
        lineHeight: 1.55, letterSpacing: "0.25px", textAlign: "center",
      }}>
        {label}
      </p>
    </div>
  );
}

// ── Prompt graph view ─────────────────────────────────────────────────────────

function ToolIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" />
      <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-8a3.5 3.5 0 0 1 0-7H12" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13M12 6v13M21 6v13" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type NodeRow = { icon: "tool" | "book" | "route"; label: string; count: string };
type GraphNode = { title: string; rows: NodeRow[] };

const GRAPH_NODES: GraphNode[] = [
  {
    title: "Greeting agent",
    rows: [
      { icon: "tool",  label: "record_information, record_information", count: "3" },
      { icon: "book",  label: "Acme Knowledge Base",                    count: "1" },
      { icon: "route", label: "Billing, Routing flow",                  count: "2" },
    ],
  },
  {
    title: "Troubleshooting",
    rows: [
      { icon: "tool",  label: "transfer",                    count: "3" },
      { icon: "route", label: "Debug Slots, Device Tier Router", count: "2" },
    ],
  },
  {
    title: "Routing flow",
    rows: [
      { icon: "tool",  label: "tool_display_name_here, tool_display_name_here", count: "+ 2" },
      { icon: "route", label: "FAQ, Collect Inquiry",                            count: "2" },
    ],
  },
  {
    title: "Billing",
    rows: [
      { icon: "tool",  label: "billing_generic_tool", count: "+ 2" },
      { icon: "route", label: "FAQ, Collect Inquiry",  count: "2" },
    ],
  },
];

function GraphNodeCard({ node }: { node: GraphNode }) {
  return (
    <div style={{
      border: "1.5px solid var(--border-default)",
      borderRadius: 8, background: "white",
      display: "flex", flexDirection: "column",
      width: "100%",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px",
        borderBottom: "1px solid var(--border-default)",
      }}>
        <span style={{ fontSize: 14, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 }}>
          {node.title}
        </span>
        <span style={{ color: "var(--content-secondary)" }}><ChevronRightIcon /></span>
      </div>

      {/* Content rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px" }}>
        {node.rows.map((row, i) => (
          <div key={i} style={{
            background: "var(--background-elevation, #f8f9fa)",
            borderRadius: 4, padding: "4px 0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingLeft: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, color: "var(--content-primary)" }}>
              {row.icon === "tool"  && <ToolIcon />}
              {row.icon === "book"  && <BookIcon />}
              {row.icon === "route" && <RouteIcon />}
              <span style={{
                fontSize: 12, color: "var(--content-primary)", lineHeight: 1.55,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {row.label}
              </span>
            </div>
            <span style={{
              flexShrink: 0, width: 28, height: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 550, color: "var(--content-secondary)", lineHeight: 1.55,
            }}>
              {row.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromptGraphView() {
  return (
    <div style={{
      flex: 1, overflowY: "auto",
      border: "1px solid var(--border-default)",
      borderRadius: 8,
      padding: "24px 48px",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{ width: "100%", maxWidth: 358, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {GRAPH_NODES.map((node, i) => (
          <div key={node.title} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <GraphNodeCard node={node} />
            {i < GRAPH_NODES.length - 1 && (
              <div style={{ width: 1, height: 20, background: "var(--border-default)", flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Prompt content (completed state) ─────────────────────────────────────────

// Shared tokens for both Plan and Prompt completed-state panels
const PANEL_CARD: React.CSSProperties = {
  flex: 1, overflowY: "auto",
  border: "1px solid var(--border-default)",
  borderRadius: 8,
  padding: "24px 28px",
  display: "flex", flexDirection: "column", gap: 14,
};
const T_TITLE: React.CSSProperties  = { margin: 0, fontSize: 16, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 };
const T_BODY: React.CSSProperties   = { margin: 0, fontSize: 14, color: "var(--content-primary)", lineHeight: 1.55 };
const T_HEAD: React.CSSProperties   = { margin: 0, fontSize: 14, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 };
const UL_BASE: React.CSSProperties  = { margin: "4px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 3 };
const UL_SUB: React.CSSProperties   = { margin: "2px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 2 };
const LI: React.CSSProperties       = { fontSize: 14, color: "var(--content-primary)", lineHeight: 1.55 };

function PromptContent() {
  const [view, setView] = useState<"text" | "graph">("text");

  return (
    <motion.div
      key="prompt-content"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "20px 24px", gap: 16, overflow: "hidden" }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 550, color: "var(--content-secondary)" }}>Main Prompt</span>
        {/* Segmented view toggle */}
        <div style={{
          display: "flex", alignItems: "center",
          background: "var(--background-elevation, #f1f3f5)",
          borderRadius: 8, padding: 2, gap: 1,
        }}>
          {(["text", "graph"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                height: 24, padding: "0 10px",
                border: "none", borderRadius: 6,
                background: view === v ? "white" : "transparent",
                boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                cursor: "pointer",
                fontSize: 12, fontWeight: view === v ? 550 : 425,
                color: view === v ? "var(--content-primary)" : "var(--content-secondary)",
                transition: "all 0.15s ease",
              }}
            >
              {v === "text" ? "Text" : "Graph"}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt card + footer */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0, gap: 0 }}>
        {/* Scrollable body — text or graph */}
        {view === "graph" ? <PromptGraphView /> : <div style={{ ...PANEL_CARD, borderRadius: "8px 8px 0 0" }}>
          <p style={T_TITLE}>Cresta Bank Disputes Agent</p>
          <p style={T_BODY}>
            You are a virtual assistant for Cresta Bank, helping customers with debit card disputes and transaction issues.
          </p>
          <p style={T_BODY}>
            Your primary goal is to efficiently and securely assist customers in reporting disputes, checking dispute status, and answering questions about transactions, while adhering to bank policies and compliance requirements.
          </p>
          <p style={T_HEAD}>Core Responsibilities</p>
          <p style={T_HEAD}>1. Dispute Intake</p>
          <ul style={UL_BASE}>
            <li style={LI}>Help customers report unauthorized or incorrect transactions</li>
            <li style={LI}>
              Collect all required details:
              <ul style={UL_SUB}>
                <li style={LI}>Transaction (date, amount, merchant)</li>
                <li style={LI}>Reason for dispute (unauthorized, incorrect amount, etc.)</li>
                <li style={LI}>Any additional context</li>
                <li style={LI}>Ensure all required information is gathered before submission</li>
              </ul>
            </li>
          </ul>
          <p style={T_HEAD}>2. Objectives &amp; Success Metrics</p>
          <p style={T_HEAD}>Primary Objectives:</p>
          <ul style={UL_BASE}>
            <li style={LI}>Reduce time spent reviewing calls by ≥70%</li>
            <li style={LI}>Improve sales coaching effectiveness</li>
            <li style={LI}>Increase win rate by surfacing actionable insights</li>
          </ul>
          <p style={T_HEAD}>Success Metrics:</p>
          <ul style={UL_BASE}>
            <li style={LI}>% of calls automatically analyzed</li>
            <li style={LI}>Manager weekly time saved</li>
            <li style={LI}>Adoption rate among sales managers</li>
            <li style={LI}>Accuracy of extracted insights (qualitative feedback)</li>
            <li style={LI}>Increase in win rate / deal velocity (longer-term)</li>
          </ul>
        </div>}

        {/* Footer: "Use ' to add variables" — text view only */}
        {view === "text" && <div style={{
          flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
          padding: "10px 16px",
          background: "var(--background-section, #ebf0f5)",
          borderRadius: "0 0 8px 8px",
          border: "1px solid var(--border-default)",
          borderTop: "none",
        }}>
          <span style={{ fontSize: 13, color: "var(--content-primary)", lineHeight: 1.55 }}>Use</span>
          <span style={{
            border: "1px solid var(--border-default)", borderRadius: 6,
            padding: "0 5px", fontSize: 13, color: "var(--content-placeholder, #a1b0b7)",
            background: "white", lineHeight: 1.55,
          }}>'</span>
          <span style={{ fontSize: 13, color: "var(--content-primary)", lineHeight: 1.55 }}>to add variables</span>
        </div>}
      </div>
    </motion.div>
  );
}

// ── Tools content (completed state) ──────────────────────────────────────────

function InfoCircleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--content-secondary)" }}>
      <circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2.5" /><line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--content-secondary)", cursor: "pointer" }}>
      <path d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3z" /><path d="m13.5 6.5 3 3" />
    </svg>
  );
}

function MathFnIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M14 10h1a2 2 0 0 1 0 4h-1" /><path d="M4 10h1a2 2 0 0 0 0 4H4" />
      <path d="M8 10v4" /><path d="M6.5 10v4" />
      <path d="M7.5 6C5.5 6 4 7.343 4 9v1" /><path d="M7.5 18C5.5 18 4 16.657 4 15v-1" />
    </svg>
  );
}

function PuzzleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M4 7h3a1 1 0 0 0 1-1V4a1 1 0 0 1 2 0v2a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 1 0 2h-2a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-2a1 1 0 0 0-2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 0 0-2H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function FnChip({ label }: { label: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "#f1f3f5", borderRadius: 6, padding: "3px 8px",
      fontSize: 12, color: "var(--content-primary)",
    }}>
      <MathFnIcon />
      {label}
    </div>
  );
}

function ProcessorChip({ label }: { label: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "#f1f3f5", borderRadius: 6, padding: "3px 8px",
      fontSize: 12, color: "var(--content-primary)",
    }}>
      <PuzzleIcon />
      {label}
    </div>
  );
}

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "var(--content-secondary)", flexShrink: 0 }}>
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolsContent() {
  const [fnOpen, setFnOpen] = useState(true);
  const [procOpen, setProcOpen] = useState(true);

  return (
    <motion.div
      key="tools-content"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "20px 24px", gap: 16, overflow: "hidden" }}
    >
      {/* Page heading */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 }}>Tools</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.55 }}>
          This is a description of function tools and processors
        </p>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>

        {/* Custom function bundle box */}
        <div style={{ border: "1px solid var(--border-default)", borderRadius: 8, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.55 }}>Custom function bundle</span>
            <InfoCircleIcon />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--content-primary)", lineHeight: 1.55, fontFamily: "monospace" }}>
              20251120-175136z-gh-3a9a69a
            </span>
            <span style={{
              fontSize: 11, fontWeight: 550, color: "var(--content-action, #205ae3)",
              background: "#eef2ff", borderRadius: 4, padding: "1px 6px",
            }}>13</span>
            <PencilIcon />
          </div>
        </div>

        {/* Function tools accordion */}
        <div style={{ border: "1px solid var(--border-default)", borderRadius: 8, overflow: "hidden" }}>
          <button
            onClick={() => setFnOpen(o => !o)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", background: "none", border: "none", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 }}>Function tools</span>
            <AccordionChevron open={fnOpen} />
          </button>
          {fnOpen && (
            <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.55 }}>
                Function tools are the core set of tools the LLM can access and execute during a conversation.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <FnChip label="slow_down_speed_up" />
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <FnChip label="sample.echo" />
                  <InfoCircleIcon />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Processors accordion */}
        <div style={{ border: "1px solid var(--border-default)", borderRadius: 8, overflow: "hidden" }}>
          <button
            onClick={() => setProcOpen(o => !o)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", background: "none", border: "none", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 }}>Processors</span>
            <AccordionChevron open={procOpen} />
          </button>
          {procOpen && (
            <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.55 }}>
                Processors are tools that operate on LLM turns. They include preprocessors, post-processors, and asynchronous processors, and they always run deterministically.
              </p>

              {[
                { label: "Preprocessors", chips: ["generic_keypad_zero_to_escalation_request"] },
                { label: "Postprocessors", chips: ["sample.mock"] },
                { label: "Async", chips: ["sample.mock"] },
              ].map(group => (
                <div key={group.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 }}>{group.label}</span>
                    <InfoCircleIcon />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {group.chips.map(c => <ProcessorChip key={c} label={c} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Voice content (completed state) ──────────────────────────────────────────

const VOICE_OPTIONS = [
  { name: "Daniel",  desc: "Helpful, neutral",         initials: "D", bg: "#4a3728" },
  { name: "James",   desc: "Trustworthy, confident",   initials: "J", bg: "#5c4a3a" },
  { name: "Clara",   desc: "Warm, professional",       initials: "C", bg: "#6b4c3b" },
  { name: "Sofia",   desc: "Friendly, conversational", initials: "S", bg: "#3b3553" },
];

function WaveformBars() {
  const heights = [4, 8, 12, 6, 14, 8, 10, 5, 12, 7, 9, 5];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 16 }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: 2, height: h, borderRadius: 1, background: "#205ae3", opacity: 0.5 }} />
      ))}
    </div>
  );
}

function VoiceContent() {
  const [selected, setSelected] = useState("Sofia");
  const [speed, setSpeed] = useState(1.0);

  const displaySpeed = speed.toFixed(1) + "x";

  return (
    <motion.div
      key="voice-content"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "20px 24px", gap: 20, overflow: "hidden" }}
    >
      {/* Page heading */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 }}>Voice</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.55 }}>
          This is the description of the agent's voice configuration
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24, minHeight: 0 }}>
        {/* Pick a voice */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 }}>Pick a voice</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.55 }}>
              This controls the tone and delivery of the AI Agent
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {VOICE_OPTIONS.map(v => (
              <button
                key={v.name}
                onClick={() => setSelected(v.name)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 8, padding: "14px 10px",
                  border: selected === v.name
                    ? "1.5px solid var(--content-action, #205ae3)"
                    : "1px solid var(--border-default)",
                  borderRadius: 10,
                  background: selected === v.name ? "#f0f4ff" : "white",
                  cursor: "pointer", transition: "all 0.15s ease",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: v.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 600, color: "white",
                  flexShrink: 0,
                }}>
                  {v.initials}
                </div>
                <span style={{ fontSize: 13, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.4 }}>{v.name}</span>
                <span style={{ fontSize: 11, color: "var(--content-secondary)", lineHeight: 1.4, textAlign: "center" }}>{v.desc}</span>
                {/* Play + waveform */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "var(--content-action, #205ae3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="8" height="9" viewBox="0 0 8 9" fill="white">
                      <path d="M1.5 1.5L6.5 4.5L1.5 7.5V1.5Z" />
                    </svg>
                  </div>
                  <WaveformBars />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Speed of speech */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.55 }}>Speed of speech</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.55 }}>
              This controls the speed of the AI Agent voice
            </p>
          </div>
          <div style={{ padding: "8px 0 0", position: "relative" }}>
            {/* Tooltip above thumb */}
            <div style={{
              position: "absolute",
              left: `calc(${((speed - 0.5) / 1.5) * 100}% - 18px)`,
              top: -4,
              background: "var(--content-primary, #25252a)",
              color: "white",
              fontSize: 11, fontWeight: 550,
              padding: "2px 7px", borderRadius: 5,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}>
              {displaySpeed}
            </div>
            <input
              type="range" min={0.5} max={2.0} step={0.1}
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#205ae3", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["Slower", "Natural", "Faster"].map(l => (
                <span key={l} style={{ fontSize: 11, color: "var(--content-secondary)" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Build plan content ───────────────────────────────────────────────────────

const PLAN_SECTIONS = [
  {
    heading: "1. Dispute Intake",
    bullets: [
      "Help customers report unauthorized or incorrect transactions",
      "Collect all required details:",
      [
        "Transaction (date, amount, merchant)",
        "Reason for dispute (unauthorized, incorrect amount, etc.)",
        "Any additional context",
      ],
      "Ensure all required information is gathered before submission",
    ],
  },
  {
    heading: "2. Eligibility & Verification",
    bullets: [
      "Check transaction is within the 60-day dispute window",
      "Verify customer identity before processing sensitive requests",
      "Confirm account ownership for the disputed transaction",
    ],
  },
  {
    heading: "3. Case Submission",
    bullets: [
      "Submit verified dispute cases to the core banking system",
      "Provide customers with a reference number and expected timeline",
      "Set expectations: 5–7 business days for standard disputes",
    ],
  },
  {
    heading: "4. Status Updates",
    bullets: [
      "Allow customers to check existing dispute status by reference number",
      "Provide clear updates on case progress",
      "Escalate unresolved or complex cases to a human agent",
    ],
  },
  {
    heading: "5. Guardrails & Compliance",
    bullets: [
      "Do not provide financial or legal advice",
      "Always authenticate customers before sharing account information",
      "Escalate high-risk cases (fraud >$500, repeat disputes) to senior agents",
    ],
  },
];

function BuildPlanContent() {
  return (
    <motion.div
      key="plan-content"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "20px 24px", gap: 16, overflow: "hidden" }}
    >
      <span style={{ fontSize: 13, fontWeight: 550, color: "var(--content-secondary)" }}>Build Plan</span>

      <div style={PANEL_CARD}>
        <p style={T_TITLE}>Cresta Bank Disputes Agent</p>
        <p style={T_BODY}>
          You are a virtual assistant for Cresta Bank, helping customers with debit card disputes and transaction issues.
        </p>
        <p style={T_BODY}>
          Your primary goal is to efficiently and securely assist customers in reporting disputes, checking dispute status, and answering questions about transactions, while adhering to bank policies and compliance requirements.
        </p>
        <p style={T_HEAD}>Core Responsibilities</p>

        {PLAN_SECTIONS.map(section => (
          <div key={section.heading} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={T_HEAD}>{section.heading}</p>
            <ul style={UL_BASE}>
              {section.bullets.map((item, i) =>
                Array.isArray(item) ? (
                  <ul key={i} style={UL_SUB}>
                    {item.map((sub, j) => (
                      <li key={j} style={LI}>{sub}</li>
                    ))}
                  </ul>
                ) : (
                  <li key={i} style={LI}>{item}</li>
                )
              )}
            </ul>
          </div>
        ))}

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={T_HEAD}>Success Criteria</p>
          <ul style={UL_BASE}>
            {[
              "Reduce dispute-related call volume by ~30–40%",
              "Improve time to resolution",
              "Maintain or improve CSAT score",
            ].map(item => (
              <li key={item} style={LI}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ── Knowledge Base Panel ─────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M5 2.5H2.5v8h8V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2.5h2.5V5M10.5 2.5L6 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 9.5V3M4.5 5.5L7 3L9.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10.5v1a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const KB_ARTICLES = [
  { title: "Ocean Bank Knowledge Base", desc: "Description of knowledge base article?" },
  { title: "Account Opening Guide", desc: "Step-by-step instructions on how to open a new account." },
  { title: "Mobile Banking Features", desc: "Overview of features available through the mobile banking app." },
  { title: "Loan Application Process", desc: "Detailed description of the loan application and approval procedure." },
  { title: "Fraud Prevention Tips", desc: "Best practices to protect your account from fraudulent activities." },
  { title: "Customer Support Services", desc: "Available support channels and how to contact customer service." },
];

function KnowledgeBasePanel() {
  return (
    <motion.div
      key="kb-panel"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "20px 24px", gap: 16, overflow: "hidden" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--content-primary)" }}>Knowledge Base</span>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
          borderRadius: 8, border: "1px solid var(--border-default)",
          background: "white", cursor: "pointer", fontSize: 12, fontWeight: 550,
          color: "var(--content-primary)",
        }}>
          Upload <UploadIcon />
        </button>
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        border: "1px solid var(--border-default)", borderRadius: 8,
        padding: "7px 12px", background: "white", flexShrink: 0,
      }}>
        <span style={{ color: "var(--content-secondary)", display: "flex" }}><SearchIcon /></span>
        <span style={{ fontSize: 13, color: "var(--content-secondary)" }}>Search KB articles</span>
        <div style={{ marginLeft: "auto", display: "flex" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Article list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, overflowY: "auto", flex: 1 }}>
        {KB_ARTICLES.map((article, i) => (
          <motion.div
            key={article.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25, ease: "easeOut" }}
            style={{
              display: "flex", flexDirection: "column", gap: 3,
              padding: "14px 0",
              borderBottom: i < KB_ARTICLES.length - 1 ? "1px solid var(--border-default)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 550, color: "#205ae3", cursor: "pointer" }}>
                {article.title}
              </span>
              <span style={{ color: "#205ae3", display: "flex", opacity: 0.7 }}><ExternalLinkIcon /></span>
            </div>
            <span style={{ fontSize: 12, color: "var(--content-secondary)", lineHeight: 1.5 }}>
              {article.desc}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface BuilderPageProps {
  prompt: string;
  flow: Flow;
}

export function BuilderPage({ prompt, flow }: BuilderPageProps) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Plan");
  const completedStates = !!flow.completedStates;

  const handleNavigateKB = () => setActiveTab("Knowledge Base");

  // ── Resizable split ──────────────────────────────────────────────────────
  const [splitPct, setSplitPct] = useState(50);
  const rowRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (mv: MouseEvent) => {
      if (!dragging.current || !rowRef.current) return;
      const { left, width } = rowRef.current.getBoundingClientRect();
      const raw = ((mv.clientX - left) / width) * 100;
      setSplitPct(Math.min(70, Math.max(30, raw)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  return (
    // Outer shell — no card, just layout spacing
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ padding: "0 8px 8px 0", gap: 16 }}
    >
      {/* ── Global header: agent name / branch  |  Open PR ── */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 24px 0 16px", flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 550, color: "var(--content-primary)" }}>
            AI Agent Name
          </span>
          <span style={{ fontSize: 14, fontWeight: 550, color: "var(--content-primary)" }}>/</span>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#e6fcf5", borderRadius: 9999, padding: "0 8px", height: 22,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 550, color: "#099268" }}>Main</span>
            <span style={{ color: "#099268" }}><ChevronDownIcon /></span>
          </div>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 12px", borderRadius: 9999, border: "none",
          background: "var(--content-action)", cursor: "pointer", fontSize: 12, fontWeight: 550, color: "white",
        }}>
          Open PR <PullIcon />
        </button>
      </div>

      {/* ── Two-panel row ── */}
      <div ref={rowRef} style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0, padding: "0 0 0 8px" }}>

        {/* Left: Companion card */}
        <div style={{ width: `${splitPct}%`, minWidth: 0, flexShrink: 0, display: "flex" }}>
          <CompanionPanel userPrompt={prompt} scenes={flow.scenes} onNavigateKB={handleNavigateKB} />
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={onDragStart}
          style={{
            width: 8, flexShrink: 0, cursor: "col-resize",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div style={{ width: 1, height: "100%", background: "var(--border-default)" }} />
        </div>

        {/* Right: Builder panel */}
        <div
          style={{
            flex: 1,
            display: "flex", flexDirection: "column",
            overflow: "hidden", minHeight: 0,
            background: "var(--background-surface)",
            minWidth: 0,
          }}
        >
          {/* Tab bar row */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: "1px solid var(--border-default)",
              padding: "12px 16px 0",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              {TABS.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 0",
                    borderBottom: tab === activeTab ? "2px solid var(--border-action)" : "2px solid transparent",
                    color: tab === activeTab ? "var(--content-action)" : "var(--content-secondary)",
                    cursor: "pointer",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  {tabIcon(tab)}
                  <span style={{ fontSize: 12, fontWeight: 550 }}>{tab}</span>
                </div>
              ))}
            </div>
            {/* Collapse sidebar icon button */}
            <button
              style={{
                padding: 4, borderRadius: 4, border: "none", background: "transparent",
                cursor: "pointer", color: "var(--content-secondary)", display: "flex",
                flexShrink: 0, marginBottom: 2,
              }}
            >
              <SidebarCollapseIcon />
            </button>
          </div>

          {/* Tab content */}
          <div
            style={{
              flex: 1,
              background: "white",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            <AnimatePresence mode="wait">
              {activeTab === "Knowledge Base" ? (
                <KnowledgeBasePanel key="kb" />
              ) : activeTab === "Plan" && completedStates ? (
                <BuildPlanContent key="plan" />
              ) : activeTab === "Prompt" && completedStates ? (
                <PromptContent key="prompt" />
              ) : activeTab === "Tools" && completedStates ? (
                <ToolsContent key="tools" />
              ) : activeTab === "Voice" && completedStates ? (
                <VoiceContent key="voice" />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
                >
                  <BuildEmptyState tab={activeTab} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
