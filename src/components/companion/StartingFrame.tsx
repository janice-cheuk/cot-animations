import { useState } from "react";
import { AnimatedPromptCycler } from "./AnimatedPromptCycler";

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" opacity={0.2}>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8.25V12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="5.625" r="0.75" fill="currentColor" />
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5.5" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5.5" cy="9" r="1" fill="currentColor" />
      <circle cx="10.5" cy="9" r="1" fill="currentColor" />
      <path d="M6.5 11.5C6.5 11.5 7 12 8 12C9 12 9.5 11.5 9.5 11.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M8 5.5V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="2.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 11L6 7L9 10L14 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 13.5V4.5M9 4.5L5.25 8.25M9 4.5L12.75 8.25"
        stroke={active ? "white" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MOCK_AGENTS = [
  { id: 1, name: "Customer Support Agent", createdBy: "Janice Cheuk", lastEdited: "Apr 10, 2026" },
  { id: 2, name: "Sales Coaching Assistant", createdBy: "Alex Rivera", lastEdited: "Apr 8, 2026" },
  { id: 3, name: "Onboarding Guide", createdBy: "Sam Lee", lastEdited: "Apr 5, 2026" },
];

interface StartingFrameProps {
  onSubmit: (prompt: string) => void;
}

export function StartingFrame({ onSubmit }: StartingFrameProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

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
        {/* Header */}
        <div className="flex items-center shrink-0" style={{ padding: "12px 24px 12px 16px" }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 18, fontWeight: 600, color: "var(--content-primary)" }}>
              Companion
            </span>
            <span style={{ color: "var(--content-primary)" }}>
              <InfoIcon />
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col" style={{ gap: 16, padding: "0 26px", paddingTop: 10 }}>
          {/* Hero heading */}
          <div className="shrink-0">
            <h1 style={{ fontSize: 24, fontWeight: 550, color: "var(--content-primary)", lineHeight: 1.4 }}>
              Start building from <AnimatedPromptCycler />
            </h1>
          </div>

          {/* Input bar */}
          <div
            className="flex flex-col shrink-0"
            style={{
              background: "var(--background-surface)",
              border: "1.8px solid var(--border-default)",
              borderRadius: 24,
              padding: "8px 8px 8px 24px",
              gap: 8,
              minHeight: 81,
            }}
          >
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              rows={1}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--content-primary)",
                background: "transparent",
                width: "100%",
                minHeight: 28,
              }}
            />
            <div className="flex items-end justify-end">
              <button
                onClick={handleSubmit}
                disabled={!value.trim()}
                style={{
                  background: value.trim() ? "var(--content-action)" : "var(--background-disabled)",
                  borderRadius: 32,
                  padding: 8,
                  border: "none",
                  cursor: value.trim() ? "pointer" : "not-allowed",
                  color: value.trim() ? "white" : "var(--content-placeholder)",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SendIcon active={!!value.trim()} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex shrink-0"
            style={{ borderBottom: "1px solid var(--border-default)", gap: 32, paddingLeft: 16 }}
          >
            <div
              className="flex items-center gap-2 cursor-pointer"
              style={{ borderBottom: "2px solid var(--border-action)", padding: "16px 0", color: "var(--content-action)" }}
            >
              <RobotIcon />
              <span style={{ fontSize: 14, fontWeight: 550, lineHeight: 1.55 }}>Agents</span>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              style={{ padding: "16px 0", color: "var(--content-secondary)" }}
            >
              <GraphIcon />
              <span style={{ fontSize: 14, fontWeight: 550, lineHeight: 1.55 }}>Insights</span>
            </div>
          </div>
        </div>

        {/* Agents table */}
        <div className="flex flex-col" style={{ padding: "24px 10px 10px 26px" }}>
          <div className="flex items-center gap-2 shrink-0" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 550, color: "var(--content-secondary)" }}>Agents</span>
            <InfoIcon />
          </div>
          <div className="overflow-hidden" style={{ background: "white", borderRadius: "var(--radius-base)" }}>
            <div className="flex" style={{ borderBottom: "1px solid var(--border-default)" }}>
              {["Name", "Created by", "Last Edited"].map((col, i) => (
                <div key={col} style={{ flex: i === 0 ? "1 0 0" : undefined, width: i === 1 ? 280 : i === 2 ? 180 : undefined, padding: "8px 16px" }}>
                  <span style={{ fontSize: 14, fontWeight: 550, color: "var(--content-primary)" }}>{col}</span>
                </div>
              ))}
            </div>
            {MOCK_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center cursor-pointer"
                style={{ borderBottom: "1px solid var(--border-default)", transition: "background 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--background-elevation)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <div style={{ flex: "1 0 0", padding: "10px 16px" }}>
                  <span style={{ fontSize: 14, fontWeight: 550, color: "var(--content-action)" }}>{agent.name}</span>
                </div>
                <div style={{ width: 280, padding: "10px 16px" }}>
                  <span style={{ fontSize: 14, color: "var(--content-secondary)" }}>{agent.createdBy}</span>
                </div>
                <div style={{ width: 180, padding: "10px 16px" }}>
                  <span style={{ fontSize: 14, color: "var(--content-secondary)" }}>{agent.lastEdited}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
