/**
 * CustomerDiscoveryBody
 * ─────────────────────
 * Self-contained animation that visualises progressive customer discovery:
 *   Cluster → Customer → Profile → Usecase
 *
 * Uses Framer Motion for all transitions. All data is mocked inline.
 * Not connected to any backend.
 *
 * ── DATA NOTES FOR ENGINEERS ─────────────────────────────────────────────────
 * The Cluster and Customer stages are intentionally abstract (dot nodes and
 * initials) because they represent broad population-level scanning where
 * individual identity is not yet resolved.
 *
 * The Profile and Usecase stages should display REAL data in production:
 *
 *   PROFILES  — real environment/deployment profiles that exist under the
 *               selected customer (e.g. "Enterprise – Production", "SMB –
 *               Staging"). These should come from the agent's customer context
 *               or a CRM/config API. The current values (Enterprise, SMB,
 *               Startup, Mid-Market) are filler placeholders only.
 *
 *   USECASES  — real agent use-cases or workflows scoped to the selected
 *               profile (e.g. "Dispute Resolution", "Onboarding Flow"). These
 *               should be populated from the agent registry or knowledge base
 *               at runtime. The current values are filler placeholders only.
 *
 * To wire up live data, replace the PROFILES and USECASES constants below
 * with props or a data-fetching hook, and pass SEL_PROFILE / SEL_USECASE in
 * as the agent's resolved selection.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
type Stage = 0 | 1 | 2 | 3;

// ── Constants ─────────────────────────────────────────────────────────────────
const STAGE_NAMES: readonly string[] = ["Cluster", "Customer", "Profile", "Usecase"];
const HELPERS: readonly string[] = [
  "Scanning cluster…",
  "Narrowing to customer…",
  "Inspecting profiles…",
  "Selecting usecase…",
];
const AUTO_MS = 3400; // ms before auto-advancing to next stage

// ── Mock data ─────────────────────────────────────────────────────────────────
const NODES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  inCluster: [6, 7, 11, 12, 16, 17].includes(i),
}));

const CUSTOMERS = [
  { id: "c1",  initials: "AP", color: "#7c3aed" },
  { id: "c2",  initials: "BL", color: "#0891b2" },
  { id: "c3",  initials: "CR", color: "#205ae3" }, // ← selected
  { id: "c4",  initials: "DN", color: "#d97706" },
  { id: "c5",  initials: "EV", color: "#dc2626" },
  { id: "c6",  initials: "FT", color: "#059669" },
  { id: "c7",  initials: "GM", color: "#9333ea" },
  { id: "c8",  initials: "HZ", color: "#0891b2" },
  { id: "c9",  initials: "IN", color: "#d97706" },
  { id: "c10", initials: "JV", color: "#059669" },
  { id: "c11", initials: "KI", color: "#7c3aed" },
  { id: "c12", initials: "LM", color: "#dc2626" },
];
const SEL_CUSTOMER = "c3";

const PROFILES = [
  { id: "p1", name: "Enterprise",  env: "Production" },
  { id: "p2", name: "SMB",         env: "Staging"    },
  { id: "p3", name: "Startup",     env: "Dev"        },
  { id: "p4", name: "Mid-Market",  env: "Production" },
];
const SEL_PROFILE = "p1";

const USECASES = [
  { id: "u1", name: "Dispute Resolution",  tag: "Support" },
  { id: "u2", name: "Onboarding Flow",     tag: "Growth"  },
  { id: "u3", name: "Billing Queries",     tag: "Finance" },
  { id: "u4", name: "Account Management",  tag: "Ops"     },
  { id: "u5", name: "Escalation Routing",  tag: "Support" },
];
const SEL_USECASE = "u1";

// ── Shared hook: fires selection highlight after a delay ──────────────────────
function useReveal(delayMs: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delayMs);
    return () => clearTimeout(t);
  }, []);
  return on;
}

// ── Stage views ───────────────────────────────────────────────────────────────

function ClusterView() {
  const hl = useReveal(1100);
  return (
    <div style={{
      width: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 5,
      padding: "2px 0",
    }}>
      {NODES.map((n, i) => (
        <div key={n.id} style={{ display: "flex", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: hl ? (n.inCluster ? 1 : 0.14) : 1,
              scale:   hl && n.inCluster ? 1.14 : 1,
            }}
            transition={{
              delay: i * 0.04,
              duration: 0.35,
              ease: "easeOut",
              opacity: { duration: hl ? 0.55 : 0.35 },
            }}
            style={{
              width: 20, height: 20, borderRadius: "50%",
              background: hl && n.inCluster ? "#c7d2fe" : "#e2e8f0",
              border: `1.5px solid ${hl && n.inCluster ? "#818cf8" : "transparent"}`,
              boxShadow: hl && n.inCluster ? "0 0 0 3px rgba(129,140,248,0.18)" : "none",
              transition: "background 0.55s, border-color 0.55s, box-shadow 0.55s",
              flexShrink: 0,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function CustomerView() {
  const hl = useReveal(1000);
  return (
    <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
      {CUSTOMERS.map((c, i) => {
        const sel = c.id === SEL_CUSTOMER;
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{
              opacity: hl ? (sel ? 1 : 0.18) : 1,
              y: 0,
              scale: hl && sel ? 1.06 : 1,
            }}
            transition={{ delay: i * 0.055, duration: 0.3, ease: "easeOut" }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "5px 3px 4px",
              borderRadius: 7,
              background: hl && sel ? "#eff6ff" : "#f8f9fb",
              border: `1.5px solid ${hl && sel ? "#3b82f6" : "#e5e7eb"}`,
              boxShadow: hl && sel ? "0 0 0 2px rgba(59,130,246,0.12)" : "none",
              transition: "all 0.45s ease",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: c.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 6.5, fontWeight: 700, color: "white", lineHeight: 1 }}>
                {c.initials}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ProfileView() {
  const hl = useReveal(900);
  return (
    <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      {PROFILES.map((p, i) => {
        const sel = p.id === SEL_PROFILE;
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: hl ? (sel ? 1 : 0.22) : 1,
              y: 0,
            }}
            transition={{ delay: i * 0.1, duration: 0.38, ease: "easeOut" }}
            style={{
              padding: "7px 10px",
              borderRadius: 8,
              background: hl && sel ? "#eff6ff" : "white",
              border: `1px solid ${hl && sel ? "#3b82f6" : "#e5e7eb"}`,
              boxShadow: hl && sel
                ? "0 0 0 2px rgba(59,130,246,0.12), 0 1px 4px rgba(0,0,0,0.06)"
                : "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.45s ease",
            }}
          >
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#1e293b", lineHeight: 1.4 }}>
              {p.name}
            </p>
            <span style={{
              display: "inline-block", marginTop: 3,
              fontSize: 10, color: "#64748b", fontWeight: 500,
              background: "#f1f5f9", borderRadius: 4, padding: "1px 6px",
            }}>
              {p.env}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function UsecaseView() {
  const hl = useReveal(900);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      {USECASES.map((u, i) => {
        const sel = u.id === SEL_USECASE;
        return (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: hl ? (sel ? 1 : 0.25) : 1,
              x: 0,
            }}
            transition={{ delay: i * 0.09, duration: 0.32, ease: "easeOut" }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "5px 8px 5px 7px",
              borderRadius: 7,
              background: hl && sel ? "#eff6ff" : "white",
              border:     `1px solid ${hl && sel ? "#bfdbfe" : "#e5e7eb"}`,
              borderLeft: `${hl && sel ? 3 : 1}px solid ${hl && sel ? "#3b82f6" : "#e5e7eb"}`,
              boxShadow: hl && sel ? "0 1px 4px rgba(59,130,246,0.1)" : "0 1px 2px rgba(0,0,0,0.04)",
              transition: "all 0.45s ease",
            }}
          >
            <span style={{
              fontSize: 11,
              fontWeight: sel && hl ? 600 : 400,
              color: hl && sel ? "#1e40af" : "#374151",
            }}>
              {u.name}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 500, color: "#64748b",
              background: "#f1f5f9", borderRadius: 4, padding: "1px 6px",
              flexShrink: 0,
            }}>
              {u.tag}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Progress stepper ──────────────────────────────────────────────────────────
function ProgressStepper({ stage }: { stage: Stage }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {/* Dots + connecting lines */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {STAGE_NAMES.flatMap((_, i) => {
          const dot = (
            <motion.div
              key={`dot-${i}`}
              animate={{
                background: i <= stage ? "#3b82f6" : "#e2e8f0",
                boxShadow: i === stage ? "0 0 0 2px rgba(59,130,246,0.22)" : "0 0 0 0px transparent",
              }}
              transition={{ duration: 0.35 }}
              style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0 }}
            />
          );
          if (i < STAGE_NAMES.length - 1) {
            return [
              dot,
              <motion.div
                key={`line-${i}`}
                animate={{ background: i < stage ? "#3b82f6" : "#e2e8f0" }}
                transition={{ duration: 0.35 }}
                style={{ flex: 1, height: 1 }}
              />,
            ];
          }
          return [dot];
        })}
      </div>
      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {STAGE_NAMES.map((name, i) => (
          <motion.span
            key={name}
            animate={{ color: i === stage ? "#3b82f6" : "#9ca3af" }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: 10, fontWeight: i === stage ? 600 : 400 }}
          >
            {name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function CustomerDiscoveryBody({ sceneKey }: { sceneKey: number }) {
  const [stage, setStage]       = useState<Stage>(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [dir, setDir]           = useState(1);

  useEffect(() => {
    setStage(0);
    setAutoPlay(true);
    setDir(1);
  }, [sceneKey]);

  useEffect(() => {
    if (!autoPlay || stage >= 3) return;
    const t = setTimeout(() => {
      setDir(1);
      setStage(s => (s + 1) as Stage);
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [stage, autoPlay]);

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d * 14, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (d: number) => ({ opacity: 0, x: d * -14, scale: 0.98 }),
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 320,
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "10px 14px 8px",
      overflow: "hidden",
    }}>
      {/* Progress stepper */}
      <ProgressStepper stage={stage} />

      {/* Stage content — motion.div must be full width so all stages share the same layout width */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={stage}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%" }}
        >
          {stage === 0 && <ClusterView  />}
          {stage === 1 && <CustomerView />}
          {stage === 2 && <ProfileView  />}
          {stage === 3 && <UsecaseView  />}
        </motion.div>
      </AnimatePresence>

      {/* Helper text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`h-${stage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            margin: "6px 0 0",
            fontSize: 11, color: "#9ca3af",
            fontStyle: "italic", textAlign: "center",
          }}
        >
          {HELPERS[stage]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
