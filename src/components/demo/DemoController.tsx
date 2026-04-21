/**
 * DemoController — DEMO TOOL ONLY, NOT PART OF THE PRODUCT UI
 *
 * A floating flow-picker widget fixed to the bottom-left of the viewport.
 * It is intentionally styled to look like a developer overlay (dark bg,
 * monospace label) so it is never mistaken for product UI during demos.
 *
 * Usage: render once at the top level of App.tsx alongside the main layout.
 * It has no effect on production builds — simply remove the component from
 * App.tsx to hide it.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FLOWS, type Flow } from "../../data/flows";

interface DemoControllerProps {
  activeFlow: Flow;
  onFlowChange: (flow: Flow) => void;
}

export function DemoController({ activeFlow, onFlowChange }: DemoControllerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        pointerEvents: "none",
      }}
    >
      {/* Expanded flow list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 210,
              pointerEvents: "auto",
              boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
            }}
          >
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
              paddingBottom: 6, paddingLeft: 2,
            }}>
              Demo flows
            </span>

            {FLOWS.map(flow => {
              const isActive = flow.id === activeFlow.id;
              return (
                <button
                  key={flow.id}
                  onClick={() => { onFlowChange(flow); setOpen(false); }}
                  style={{
                    display: "flex", flexDirection: "column", gap: 1,
                    padding: "6px 8px", borderRadius: 6,
                    border: "none", cursor: "pointer", textAlign: "left",
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: 99, flexShrink: 0,
                      background: isActive ? "#60a5fa" : "rgba(255,255,255,0.25)",
                      transition: "background 0.15s",
                    }} />
                    <span style={{
                      fontSize: 12, fontWeight: isActive ? 600 : 400,
                      color: isActive ? "white" : "rgba(255,255,255,0.75)",
                      lineHeight: 1.3,
                    }}>
                      {flow.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10, color: "rgba(255,255,255,0.35)",
                    paddingLeft: 12, lineHeight: 1.4,
                  }}>
                    {flow.description}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle badge */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 10px 5px 8px",
          background: "#18181b",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8,
          cursor: "pointer",
          pointerEvents: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        {/* Lightning bolt — signals "demo tool" */}
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
          <path d="M6.5 1L2 6.5h3.5L4 10l5-5.5H6L6.5 1z"
            fill="#facc15" stroke="#facc15" strokeWidth="0.4"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
        }}>
          Demo
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 500, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {activeFlow.label}
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <path d="M2 3.5L5 6.5l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
