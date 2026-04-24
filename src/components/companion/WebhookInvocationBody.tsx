/**
 * WebhookInvocationBody
 * ─────────────────────
 * Purely iconic, conceptual visualisation of an OUTGOING_SYNC webhook chain:
 *   AI Agent → Remote Function → Webhook → External API → Response → Slots
 *
 * No text labels on nodes — just icons, flows, and phase status.
 *
 * Phases:
 *   0 – idle / reset
 *   1 – Agent fires (pulse → Remote Fn)
 *   2 – Remote Fn triggers (pulse → Webhook)
 *   3 – Webhook dispatches (OUTGOING_SYNC badge, pulse → API)
 *   4 – API responds (200 OK)
 *   5 – Response maps back to slots
 *   → loops
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASE_MS = [500, 1000, 1000, 1000, 900, 2600];

// ── Icons ─────────────────────────────────────────────────────────────────────
function AgentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 6a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -4"/>
      <path d="M12 2v2"/>
      <path d="M9 12v9"/><path d="M15 12v9"/>
      <path d="M5 16l4 -2"/><path d="M15 14l4 2"/>
      <path d="M9 18h6"/>
      <path d="M10 8v.01"/><path d="M14 8v.01"/>
    </svg>
  );
}

function FnIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M7 5L3 11l4 6M15 5l4 6-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function WebhookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M4.876 13.61a4 4 0 1 0 6.124 3.39h6"/>
      <path d="M15.066 20.502a4 4 0 1 0 1.934 -7.502c-.706 0 -1.424 .179 -2 .5l-3 -5.5"/>
      <path d="M16 8a4 4 0 1 0 -8 0c0 1.506 .77 2.818 2 3.5l-3 5.5"/>
    </svg>
  );
}

function ApiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="5" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7 10h8M7 13.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="16" cy="7" r="1.5" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}


// ── Node data ─────────────────────────────────────────────────────────────────
const NODES = [
  { id: "agent",   Icon: AgentIcon,   color: "#205ae3", bg: "#eef2ff", ring: "#205ae344" },
  { id: "fn",      Icon: FnIcon,      color: "#7048e8", bg: "#f3f0ff", ring: "#7048e844" },
  { id: "webhook", Icon: WebhookIcon, color: "#e8590c", bg: "#fff4e6", ring: "#e8590c44" },
  { id: "api",     Icon: ApiIcon,     color: "#0ca678", bg: "#e6fcf5", ring: "#0ca67844" },
] as const;


// ── Node ──────────────────────────────────────────────────────────────────────
function Node({
  node, active,
}: {
  node: typeof NODES[number];
  active: boolean;
}) {
  const { Icon, color, bg, ring } = node;
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        animate={{
          background: active ? bg : "#f3f4f6",
          boxShadow: active ? `0 0 0 4px ${ring}` : "0 0 0 0px transparent",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          width: 48, height: 48, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          color: active ? color : "#c4cdd4",
          transition: "color 0.3s",
          position: "relative",
        }}
      >
        <Icon />

        {/* Activation ripple */}
        <AnimatePresence>
          {active && (
            <motion.div
              key="ripple"
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{
                position: "absolute", inset: 0, borderRadius: 12,
                border: `1.5px solid ${color}`,
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

// ── Connector ─────────────────────────────────────────────────────────────────
function Connector({
  active, pulsing, reverse, color,
}: {
  active: boolean; pulsing: boolean; reverse: boolean; color: string;
}) {
  return (
    <div style={{
      flex: 1, height: 2.5, borderRadius: 99,
      background: active ? color + "44" : "#e5e7eb",
      position: "relative", overflow: "hidden",
      transition: "background 0.35s",
    }}>
      {(pulsing || reverse) && (
        <motion.div
          key={reverse ? "rev" : "fwd"}
          style={{
            position: "absolute", top: 0, height: "100%", width: "60%",
            background: `linear-gradient(${reverse ? "270deg" : "90deg"}, transparent, ${color}dd, transparent)`,
          }}
          initial={{ x: reverse ? "160%" : "-60%" }}
          animate={{ x: reverse ? "-60%" : "160%" }}
          transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity }}
        />
      )}
    </div>
  );
}


// ── Main export ───────────────────────────────────────────────────────────────
export function WebhookInvocationBody({ sceneKey }: { sceneKey: number }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => { setPhase(0); }, [sceneKey]);

  useEffect(() => {
    const t = setTimeout(
      () => setPhase(p => (p >= 5 ? 0 : p + 1)),
      PHASE_MS[phase] ?? 1000,
    );
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div style={{
      width: "100%", maxWidth: 360,
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "14px 16px 12px",
      display: "flex", flexDirection: "column", gap: 12,
    }}>

      {/* Chain */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
        {NODES.map((node, i) => (
          <div key={node.id} style={{ display: "contents" }}>
            <Node
              node={node}
              active={phase >= i + 1}
            />
            {i < NODES.length - 1 && (
              <Connector
                active={phase >= i + 2}
                pulsing={phase === i + 2}
                reverse={phase === 5}
                color={node.color}
              />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
