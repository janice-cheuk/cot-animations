import { useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "../../engine/primitives/Typewriter";
import { AIAnalystIllustration } from "./AIAnalystIllustration";

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


interface CompanionPanelProps {
  userPrompt: string;
}

export function CompanionPanel({ userPrompt }: CompanionPanelProps) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 380,
        height: "100%",
        background: "var(--background-elevation)",
        border: "1px solid var(--border-default)",
        borderRadius: 12,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Panel header */}
      <div
        style={{
          background: "var(--background-surface)",
          borderBottom: "1px solid var(--border-default)",
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 550, color: "var(--content-secondary)" }}>
          Companion
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            style={{ padding: 4, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--content-secondary)", display: "flex" }}
          >
            <HistoryIcon />
          </button>
          <div style={{ width: 1, height: 16, background: "var(--border-default)" }} />
          <button
            style={{ padding: 4, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--content-secondary)", display: "flex" }}
          >
            <CollapseIcon />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          justifyContent: "flex-start",
        }}
      >
        {/* User message bubble */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              background: "#ebf0f5",
              borderRadius: "12px 12px 2px 12px",
              padding: "12px 16px",
              maxWidth: "100%",
              fontSize: 14,
              fontWeight: 425,
              lineHeight: 1.55,
              color: "var(--content-primary)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {userPrompt}
          </div>
        </div>

        {/* CoT: Analyzing topic discovery */}
        <motion.div
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          {/* CoT header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Breathing pulse wrapper */}
            <motion.span
              animate={{ opacity: [1, 0.65, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span
                className="cot-shimmer-text"
                style={{ fontSize: 14, fontWeight: 550, lineHeight: 1.55 }}
              >
                Analyzing topic discovery for relevant insights
              </span>
            </motion.span>
            <span style={{ color: "var(--content-secondary)", flexShrink: 0 }}>
              <ChevronDownIcon />
            </span>
          </div>

          {/* CoT body */}
          <div style={{ display: "flex", gap: 12, paddingLeft: 6 }}>
            {/* Vertical line */}
            <div style={{ width: 1, background: "var(--border-default)", flexShrink: 0, borderRadius: 1 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* TODO: speedMs is a demo placeholder. In production, replace this
                  Typewriter with a streaming text component that consumes tokens
                  from the Claude backend as they arrive — the typing speed will
                  naturally match the LLM's output rate. */}
              <Typewriter
                text="This is a chain of thought that is live typed as the agent is generating a response. All relevant information here can be referenced later when the user expands the chain of thought accordion using the chevron."
                speedMs={8}
                delayMs={400}
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.55,
                  color: "var(--content-secondary)",
                }}
              />
              <AIAnalystIllustration />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Input bar */}
      <div
        style={{
          background: "var(--background-elevation)",
          padding: 16,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            background: "var(--background-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: 12,
            padding: "8px 12px",
            boxShadow: "0px 8px 28px -6px rgba(24,39,75,0.12)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything"
            rows={1}
            style={{
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              lineHeight: 1.55,
              color: "var(--content-primary)",
              background: "transparent",
              width: "100%",
              minHeight: 28,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", color: "var(--content-action)", display: "flex" }}
            >
              <PlusIcon />
            </button>
            <button
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "var(--content-action)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
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
