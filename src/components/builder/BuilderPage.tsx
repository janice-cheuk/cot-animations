import { CompanionPanel } from "../companion/CompanionPanel";

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
      <path d="M3.5 8.5L5 10l-1.5 1.5" stroke="currentColor" strokeWidth="0" />
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

// ── Build plan empty state illustration ─────────────────────────────────────

function BuildPlanEmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Stacked photos illustration */}
      <div style={{ position: "relative", width: 176, height: 176 }}>
        {/* Back photo rotated */}
        <div style={{
          position: "absolute", top: 20, left: 30, width: 100, height: 90,
          background: "#f1f3f5", border: "2px solid #ced4da", borderRadius: 4,
          transform: "rotate(8deg)",
        }} />
        {/* Front photo */}
        <div style={{
          position: "absolute", top: 28, left: 18, width: 110, height: 90,
          background: "#dee2e6", borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 8V28M8 18H28" stroke="#adb5bd" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M26 10L28 8M10 26L8 28M26 26L28 28M10 10L8 8" stroke="#adb5bd" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        {/* Stars */}
        {[{ top: 14, left: 12 }, { top: 8, left: 105 }, { top: 95, left: 120 }].map((pos, i) => (
          <svg key={i} style={{ position: "absolute", top: pos.top, left: pos.left }} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L7.2 4.8H11L7.9 7.2L9.1 11L6 8.6L2.9 11L4.1 7.2L1 4.8H4.8L6 1Z" fill="#adb5bd" />
          </svg>
        ))}
      </div>
      <p style={{ fontSize: 14, color: "var(--content-secondary)", textAlign: "center", margin: 0, letterSpacing: 0.25 }}>
        Your build plan will be set up here
      </p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface BuilderPageProps {
  prompt: string;
}

export function BuilderPage({ prompt }: BuilderPageProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ padding: 8 }}>
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          background: "var(--background-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-base)",
        }}
      >
        {/* Top header: agent name + Pull/Push */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px 0 16px",
            flexShrink: 0,
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
          <div style={{ display: "flex", gap: 8 }}>
            {/* Pull — pill shaped, border, icon right */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 9999, border: "1px solid var(--border-default)",
              background: "white", cursor: "pointer", fontSize: 12, fontWeight: 550, color: "var(--content-primary)",
            }}>
              Pull <PullIcon />
            </button>
            {/* Push — pill shaped, blue, chevron-down right */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 9999, border: "none",
              background: "var(--content-action)", cursor: "pointer", fontSize: 12, fontWeight: 550, color: "white",
            }}>
              Push <PushChevronIcon />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-default)",
            padding: "0 16px",
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            {TABS.map((tab) => (
              <div
                key={tab}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 0",
                  borderBottom: tab === "Plan" ? "2px solid var(--border-action)" : "2px solid transparent",
                  color: tab === "Plan" ? "var(--content-action)" : "var(--content-secondary)",
                  cursor: "pointer",
                }}
              >
                {tabIcon(tab)}
                <span style={{ fontSize: 12, fontWeight: 550 }}>{tab}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, paddingBottom: 6 }}>
            {/* System Checks — icon on LEFT, standard 6px radius */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
              borderRadius: 6, border: "1px solid var(--border-default)", background: "white",
              cursor: "pointer", fontSize: 12, fontWeight: 550, color: "var(--content-primary)",
            }}>
              <CircleDashedIcon /> System Checks
            </button>
            {/* Advanced Settings — icon on RIGHT, standard 6px radius */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
              borderRadius: 6, border: "1px solid var(--border-default)", background: "white",
              cursor: "pointer", fontSize: 12, fontWeight: 550, color: "var(--content-primary)",
            }}>
              Advanced Settings <CodeIcon />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, display: "flex", gap: 16, padding: 16, overflow: "hidden", minHeight: 0 }}>
          {/* Build plan area */}
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <BuildPlanEmptyState />
          </div>

          {/* Companion panel */}
          <CompanionPanel userPrompt={prompt} />
        </div>
      </div>
    </div>
  );
}
