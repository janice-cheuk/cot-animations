/**
 * KBSearchBody
 * ────────────
 * Animates an AI scanning through knowledge base articles.
 *
 * Visual layers:
 *  1. Abstract article cards scroll upward in an infinite loop
 *  2. A glowing scan beam sweeps left → right continuously, simulating "reading"
 *  3. Articles flagged as matched show a relevance badge + blue left accent
 *
 * Content is fully conceptual — no real article text is shown.
 * In production, wire ARTICLES to live KB search results.
 */

import { motion } from "framer-motion";

// ── Mock data ─────────────────────────────────────────────────────────────────
// titleW / lines represent abstract content bars (% widths), not real text.
// matched + relevance drive the visual highlight state.
const ARTICLES = [
  { id: 1, category: "Policy",   color: "#3b5bdb", bg: "#eef2ff", titleW: 68, lines: [52, 36], matched: true,  relevance: 94 },
  { id: 2, category: "Guide",    color: "#2f9e44", bg: "#ebfbee", titleW: 55, lines: [60, 44], matched: false, relevance: 0  },
  { id: 3, category: "Process",  color: "#7048e8", bg: "#f3f0ff", titleW: 72, lines: [48, 34], matched: true,  relevance: 87 },
  { id: 4, category: "FAQ",      color: "#e8590c", bg: "#fff4e6", titleW: 45, lines: [56, 40], matched: false, relevance: 0  },
  { id: 5, category: "Template", color: "#0ca678", bg: "#e6fcf5", titleW: 62, lines: [50, 37], matched: true,  relevance: 91 },
  { id: 6, category: "Policy",   color: "#3b5bdb", bg: "#eef2ff", titleW: 58, lines: [65, 45], matched: false, relevance: 0  },
  { id: 7, category: "Guide",    color: "#2f9e44", bg: "#ebfbee", titleW: 74, lines: [42, 31], matched: true,  relevance: 78 },
  { id: 8, category: "Process",  color: "#7048e8", bg: "#f3f0ff", titleW: 50, lines: [58, 42], matched: false, relevance: 0  },
];

const TAPE = [...ARTICLES, ...ARTICLES, ...ARTICLES];

// ── Layout ────────────────────────────────────────────────────────────────────
const ROW_H    = 60;
const GAP      = 5;
const SLOT     = ROW_H + GAP;
const CYCLE    = SLOT * ARTICLES.length;
const VISIBLE_H = 168;

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: typeof ARTICLES[number] }) {
  const { category, color, bg, titleW, lines, matched, relevance } = article;

  return (
    <div style={{
      height: ROW_H,
      borderRadius: 8,
      background: matched ? `${bg}88` : "white",
      border: "1px solid #e9ecef",
      borderLeft: matched ? `3px solid ${color}` : "1px solid #e9ecef",
      padding: "8px 10px 8px 9px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      flexShrink: 0,
      boxSizing: "border-box",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Top row: category + relevance */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: `${color}18`, borderRadius: 4,
          padding: "1px 6px",
        }}>
          <span style={{ fontSize: 9, fontWeight: 600, color, lineHeight: 1.5 }}>{category}</span>
        </div>

        {matched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.25 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              background: `${color}18`, borderRadius: 4, padding: "1px 6px",
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 9, fontWeight: 600, color, lineHeight: 1.5 }}>
              {relevance}% match
            </span>
          </motion.div>
        )}
      </div>

      {/* Abstract content bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {/* Title bar — thicker, darker */}
        <div style={{
          height: 7, borderRadius: 3,
          width: `${titleW}%`,
          background: matched ? `${color}40` : "#d1d5db",
        }} />
        {/* Content lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {lines.map((w, i) => (
            <div key={i} style={{
              height: 5, borderRadius: 3,
              width: `${w}%`,
              background: matched ? `${color}22` : "#e5e7eb",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function KBSearchBody({ sceneKey }: { sceneKey: number }) {
  const matchCount = ARTICLES.filter(a => a.matched).length;

  return (
    <div
      key={sceneKey}
      style={{
        width: "100%",
        maxWidth: 380,
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
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>Knowledge Base</span>
          {/* Pulsing scan indicator */}
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#eef2ff", borderRadius: 99, padding: "2px 7px",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b5bdb" }}
            />
            <span style={{ fontSize: 9, fontWeight: 600, color: "#3b5bdb" }}>scanning</span>
          </motion.div>
        </div>
        <span style={{ fontSize: 10, color: "#9ca3af" }}>
          {matchCount} matched
        </span>
      </motion.div>

      {/* Scroll window */}
      <div style={{ height: VISIBLE_H, overflow: "hidden", position: "relative" }}>

        {/* Scan beam — sweeps left → right continuously */}
        <motion.div
          style={{
            position: "absolute", top: 0, bottom: 0,
            width: "45%", zIndex: 3, pointerEvents: "none",
            background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.07) 40%, rgba(59,130,246,0.13) 50%, rgba(59,130,246,0.07) 60%, transparent 100%)",
          }}
          animate={{ x: ["-45%", "145%"] }}
          transition={{ duration: 2.0, ease: "linear", repeat: Infinity, repeatDelay: 0.6 }}
        />

        {/* Fade mask — top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 32, zIndex: 4,
          background: "linear-gradient(to bottom, #f9fafb 20%, transparent)",
          pointerEvents: "none",
        }} />
        {/* Fade mask — bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 32, zIndex: 4,
          background: "linear-gradient(to top, #f9fafb 20%, transparent)",
          pointerEvents: "none",
        }} />

        {/* Scrolling tape */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -CYCLE }}
          transition={{
            delay: 0.6,
            duration: ARTICLES.length * 1.1,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{ display: "flex", flexDirection: "column", gap: GAP }}
        >
          {TAPE.map((article, i) => (
            <ArticleCard key={`${sceneKey}-${i}`} article={article} />
          ))}
        </motion.div>
      </div>

      <div style={{ height: 10 }} />
    </div>
  );
}
