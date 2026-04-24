/**
 * VirtualAgentBody
 * ────────────────
 * Conceptual animation for `virtual-agent list` + `virtual-agent get`.
 *
 * Shows a roster of VAs loading in, then focuses one and lights up its
 * deployed channels: VOICE, CHAT, EMAIL — purely iconic, no real data.
 *
 * Phases:
 *   0 – rows stagger in
 *   1 – selected VA highlights, channels activate one by one
 *   2 – full detail settled
 *   → loops
 *
 * In production: replace VA_ROWS with live `virtual-agent list` output
 * and light up only the channels returned by `virtual-agent get`.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Channel definitions ───────────────────────────────────────────────────────
const CHANNELS = {
  voice: { color: "#2f9e44", bg: "#f0fdf4", border: "#86efac" },
  chat:  { color: "#205ae3", bg: "#eff6ff", border: "#93c5fd" },
  email: { color: "#7048e8", bg: "#f3f0ff", border: "#c4b5fd" },
} as const;
type Channel = keyof typeof CHANNELS;

// ── VA roster (abstract — bars represent name/description) ───────────────────
const VA_ROWS: { channels: Channel[]; sel: boolean; bars: [number, number] }[] = [
  { channels: ["voice", "chat", "email"], sel: true,  bars: [68, 44] },
  { channels: ["voice", "chat"],          sel: false, bars: [54, 38] },
  { channels: ["chat", "email"],          sel: false, bars: [62, 41] },
  { channels: ["voice"],                  sel: false, bars: [50, 34] },
];

const ALL_CHANNELS: Channel[] = ["voice", "chat", "email"];

// ── Icons ─────────────────────────────────────────────────────────────────────
function VoiceIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/>
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8 9h8M8 13h6"/>
      <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"/>
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M3 7l9 6l9 -6"/>
    </svg>
  );
}
function BotIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

const CHANNEL_ICONS: Record<Channel, () => JSX.Element> = {
  voice: VoiceIcon,
  chat:  ChatIcon,
  email: EmailIcon,
};

// ── Channel pip ───────────────────────────────────────────────────────────────
function ChannelPip({
  ch, active, delay,
}: { ch: Channel; active: boolean; delay: number }) {
  const cfg = CHANNELS[ch];
  const Icon = CHANNEL_ICONS[ch];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: active ? 1 : 0.18, scale: 1 }}
      transition={{ delay, duration: 0.25, ease: "easeOut" }}
      style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? cfg.bg : "#f3f4f6",
        border: `1px solid ${active ? cfg.border : "#e5e7eb"}`,
        color: active ? cfg.color : "#d1d5db",
        transition: "background 0.35s, border-color 0.35s, color 0.35s",
      }}
    >
      <Icon />
    </motion.div>
  );
}

// ── VA row ────────────────────────────────────────────────────────────────────
function VARow({
  row, rowIndex, phase,
}: {
  row: typeof VA_ROWS[number];
  rowIndex: number;
  phase: number;
}) {
  const { sel, bars, channels } = row;
  const highlighted = sel && phase >= 1;

  // Which channels are active on this row
  // Selected row: channels light up one by one (phase 1 = 1st, phase 1.33 = 2nd, etc.)
  // Other rows: all channels fade in together at phase 2
  const channelActive = (ch: Channel) => {
    if (!channels.includes(ch)) return false;
    if (sel) {
      const idx = ALL_CHANNELS.indexOf(ch);
      return phase >= 1 + idx * 0.4; // fractional phases drive timing via delay
    }
    return phase >= 2;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{
        opacity: 1, x: 0,
        background: highlighted ? "#eff6ff" : "white",
        borderColor: highlighted ? "#93c5fd" : "#e5e7eb",
      }}
      transition={{
        delay: rowIndex * 0.09,
        duration: 0.3, ease: "easeOut",
        background: { duration: 0.4 },
        borderColor: { duration: 0.4 },
      }}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 10px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        boxShadow: highlighted ? "0 0 0 2px rgba(59,130,246,0.1)" : "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Bot avatar */}
      <div style={{
        width: 26, height: 26, borderRadius: 7, flexShrink: 0,
        background: highlighted ? "#dbeafe" : "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.4s",
      }}>
        <BotIcon color={highlighted ? "#205ae3" : "#9ca3af"} />
      </div>

      {/* Abstract content bars */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div style={{ height: 6, width: `${bars[0]}%`, borderRadius: 99, background: highlighted ? "#bfdbfe" : "#e2e8f0", transition: "background 0.4s" }} />
        <div style={{ height: 5, width: `${bars[1]}%`, borderRadius: 99, background: highlighted ? "#dbeafe" : "#f1f5f9", transition: "background 0.4s" }} />
      </div>

      {/* Channel pips */}
      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        {ALL_CHANNELS.map((ch, ci) => (
          channels.includes(ch) ? (
            <ChannelPip
              key={ch}
              ch={ch}
              active={channelActive(ch)}
              delay={sel && phase >= 1 ? ci * 0.18 : 0}
            />
          ) : (
            // placeholder space so rows stay aligned
            <div key={ch} style={{ width: 20, height: 20, flexShrink: 0 }} />
          )
        ))}
      </div>
    </motion.div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────
function Legend({ phase }: { phase: number }) {
  return (
    <AnimatePresence>
      {phase >= 1 && (
        <motion.div
          key="legend"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.25 }}
          style={{ display: "flex", gap: 10, paddingTop: 2 }}
        >
          {ALL_CHANNELS.map(ch => {
            const cfg = CHANNELS[ch];
            const Icon = CHANNEL_ICONS[ch];
            return (
              <div key={ch} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ color: cfg.color, display: "flex" }}><Icon /></div>
                <span style={{ fontSize: 8.5, fontWeight: 600, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {ch}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
const PHASE_MS = [900, 1400, 2200];

export function VirtualAgentBody({ sceneKey }: { sceneKey: number }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => { setPhase(0); }, [sceneKey]);

  useEffect(() => {
    if (phase >= PHASE_MS.length) {
      const t = setTimeout(() => setPhase(0), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase(p => p + 1), PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div style={{
      width: "100%", maxWidth: 370,
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "12px 14px 10px",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      {VA_ROWS.map((row, i) => (
        <VARow key={i} row={row} rowIndex={i} phase={phase} />
      ))}
    </div>
  );
}
