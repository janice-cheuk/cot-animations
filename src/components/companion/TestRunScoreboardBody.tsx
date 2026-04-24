/**
 * TestRunScoreboardBody
 * ─────────────────────
 * Scoreboard that continuously scrolls test run rows upward in a loop,
 * simulating a live feed of 10+ test runs.
 *
 * Sequence:
 *  1. Progress bars fill and counts tick up on mount (~1s)
 *  2. Container starts scrolling upward after a short pause
 *  3. Loops seamlessly (rows are triplicated for seamless repeat)
 *
 * Row layout follows Figma node-id=1216-17828:
 *  flask chip | name | agent tag  →  count / total  progress bar
 *
 * Replace RUNS with live data from `test-run list --summary` in production.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ── Mock data ─────────────────────────────────────────────────────────────────
const RUNS = [
  { id: "run-2847", name: "Billing Disputes",    agent: "Care AI Agent", agentV: "v80", pass: 44, fail:  5, total: 49 },
  { id: "run-2846", name: "Onboarding Flows",    agent: "Support Agent", agentV: "v71", pass: 48, fail:  0, total: 48 },
  { id: "run-2845", name: "Escalation Routing",  agent: "Triage Agent",  agentV: "v55", pass: 31, fail: 19, total: 50 },
  { id: "run-2844", name: "Account Management",  agent: "Care AI Agent", agentV: "v80", pass: 45, fail:  4, total: 49 },
  { id: "run-2843", name: "Fraud Detection",     agent: "Risk Agent",    agentV: "v42", pass: 38, fail: 11, total: 49 },
  { id: "run-2842", name: "Password Reset",      agent: "Auth Agent",    agentV: "v33", pass: 50, fail:  0, total: 50 },
  { id: "run-2841", name: "Refund Requests",     agent: "Care AI Agent", agentV: "v80", pass: 29, fail: 21, total: 50 },
  { id: "run-2840", name: "Identity Verify",     agent: "Risk Agent",    agentV: "v42", pass: 47, fail:  3, total: 50 },
];

// Triplicate so the scroll loop is seamless
const TAPE = [...RUNS, ...RUNS, ...RUNS];

// ── Layout constants ──────────────────────────────────────────────────────────
const ROW_H  = 44;  // px — row content height
const GAP    = 5;   // px — gap between rows
const SLOT   = ROW_H + GAP;
const CYCLE  = SLOT * RUNS.length; // total px for one full cycle
const VISIBLE_H = 160; // px — how many rows are visible at once

// ── Helpers ───────────────────────────────────────────────────────────────────
function pct(pass: number, total: number) {
  return Math.round((pass / total) * 100);
}
function barColor(p: number) {
  if (p === 100) return "#2f9e44";
  if (p >= 80)   return "#3b5bdb";
  return "#e8590c";
}

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, durationMs = 700) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function FlaskIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
      <path d="M5 1h4M5.5 1v4.5L2 11.5a1 1 0 00.93 1.5h8.14a1 1 0 00.93-1.5L8.5 5.5V1"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="5.5" cy="9.5" r="0.7" fill="currentColor"/>
      <circle cx="8.5" cy="8.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

// ── Single row ────────────────────────────────────────────────────────────────
function RunRow({ run }: { run: typeof RUNS[number] }) {
  const p       = pct(run.pass, run.total);
  const color   = barColor(p);
  const passVal = useCountUp(run.pass);
  const pctVal  = useCountUp(p, 650);

  return (
    <div style={{
      height: ROW_H,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 10px",
      borderRadius: 7,
      background: "white",
      border: "1px solid #e9ecef",
      flexShrink: 0,
      gap: 8,
      boxSizing: "border-box",
    }}>
      {/* ── Left ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: 1 }}>
        {/* Flask icon chip */}
        <div style={{
          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
          background: "#f8f9fa",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#5d666f",
        }}>
          <FlaskIcon />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          {/* Name + agent tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#205ae3", whiteSpace: "nowrap", flexShrink: 0 }}>
              {run.name}
            </span>
            <div style={{
              display: "flex", alignItems: "center", gap: 2,
              background: "#f3f2fc", borderRadius: 4, padding: "1px 5px", flexShrink: 0,
            }}>
              <span style={{ color: "#5f51f5", display: "flex" }}><RobotIcon /></span>
              <span style={{ fontSize: 9, fontWeight: 600, color: "#5f51f5", whiteSpace: "nowrap" }}>
                {run.agent}
              </span>
              <span style={{ fontSize: 8.5, color: "#5d666f", fontStyle: "italic" }}>{run.agentV}</span>
            </div>
          </div>
          {/* Run ID */}
          <span style={{ fontSize: 9.5, color: "#9ca3af", fontFamily: "monospace" }}>{run.id}</span>
        </div>
      </div>

      {/* ── Right: count + bar ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0, width: 76 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#25252a", lineHeight: 1 }}>{passVal}</span>
          <span style={{ fontSize: 9, color: "#9ca3af" }}>/{run.total}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color, marginLeft: 1 }}>{pctVal}%</span>
        </div>
        {/* Progress bar */}
        <div style={{ width: "100%", height: 4, borderRadius: 99, background: "#f3f4f6", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p}%` }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{ height: "100%", borderRadius: 99, background: color }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function TestRunScoreboardBody({ sceneKey }: { sceneKey: number }) {
  return (
    <div
      key={sceneKey}
      style={{
        width: "100%",
        maxWidth: 400,
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "10px 10px 0",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingBottom: 8, borderBottom: "1px solid #e5e7eb", marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>Test Runs</span>
        <span style={{ fontSize: 10, color: "#9ca3af" }}>{RUNS.length}+ runs</span>
      </motion.div>

      {/* Scroll window */}
      <div style={{ height: VISIBLE_H, overflow: "hidden", position: "relative" }}>
        {/* Fade mask — top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 28, zIndex: 1,
          background: "linear-gradient(to bottom, #f9fafb 30%, transparent)",
          pointerEvents: "none",
        }} />
        {/* Fade mask — bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 28, zIndex: 1,
          background: "linear-gradient(to top, #f9fafb 30%, transparent)",
          pointerEvents: "none",
        }} />

        {/* Scrolling tape */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -CYCLE }}
          transition={{
            delay: 1.4,
            duration: RUNS.length * 0.9,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{ display: "flex", flexDirection: "column", gap: GAP }}
        >
          {TAPE.map((run, i) => (
            <RunRow key={`${sceneKey}-${i}`} run={run} />
          ))}
        </motion.div>
      </div>

      {/* Bottom padding inside card */}
      <div style={{ height: 10 }} />
    </div>
  );
}
