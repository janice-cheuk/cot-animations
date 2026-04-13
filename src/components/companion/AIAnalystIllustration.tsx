// Recreated from Figma node 266:12613 — animated for CoT "analyzing" loading state.
//
// Rotation uses SVG <animateTransform type="rotate" values="angle cx cy"> which
// operates in SVG user-unit space. This avoids the CSS-pixel / viewBox mismatch
// that caused inner dots to drift outside their parent bubble.
//
// Gear ratios (all loops seamlessly — end positions are exact ×360°):
//   Bubble A  (r=48): CW  ×2 rotations  = 720°  over 20s  (base speed)
//   Bubble B  (r=32): CCW ×3 rotations  = −1080° over 20s  (1.5× — ratio 48/32)
//   Satellite (r=26): CW  ×4 rotations  = 1440°  over 20s  (2× — rounded from 48/26)
//
// Three shared stutter moments (catch-and-release, all bubbles hit them together):
//   t=33%, t=65%, t=88% → each reverses ~40° then continues forward.

import { motion } from 'framer-motion';

// ── Shared gear timing ──────────────────────────────────────────────────────
const DUR   = '20s';
const TIMES = '0;0.33;0.38;0.65;0.70;0.88;0.93;1';
// Per-segment cubic beziers: forward=smooth easeInOut, catch=sharp snap
const SPLINES = [
  '0.4 0 0.6 1',   // forward
  '0.8 0 1 0.5',   // catch
  '0.4 0 0.6 1',   // forward
  '0.8 0 1 0.5',   // catch
  '0.4 0 0.6 1',   // forward
  '0.8 0 1 0.5',   // catch
  '0.4 0 0.6 1',   // forward
].join(';');

// Base angles for Bubble A (CW, 720° = 2 full rotations → seamless loop)
const BASE      = [0, 260, 220, 500, 460, 680, 640, 720];
const ANGLES_A   = BASE;
const ANGLES_B   = BASE.map(v => Math.round(-v * 1.5));   // CCW, 3 rotations
const ANGLES_SAT = BASE.map(v => v * 2);                   // CW,  4 rotations

// Build the `values` string for animateTransform, pivoting at (cx, cy)
const gearVals = (angles: number[], cx: number, cy: number) =>
  angles.map(a => `${a} ${cx} ${cy}`).join(';');

const breathe = (duration: number, delay = 0) => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut' as const,
  repeatType: 'loop' as const,
  delay,
});

// ──────────────────────────────────────────────────────────────────────────

export function AIAnalystIllustration() {
  const modalX = 165.08;
  const modalY = 20.93;
  const modalW = 76.725;
  const modalH = 156.55;
  const modalCX = modalX + modalW / 2;
  const modalCY = modalY + modalH / 2;

  const fieldOffsets = [-42.24, -16.66, 8.91, 34.49, 60.06];
  const fieldW = 65.1;
  const fieldH = 22.475;
  const fieldX = modalCX - fieldW / 2;

  return (
    <svg
      width="210"
      height="158"
      viewBox="0 0 248 186"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 10, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="hdr" x1="0" y1="0" x2="248" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <clipPath id="win">
          <rect width="248" height="186" rx="12" />
        </clipPath>
        <filter id="blue-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="teal-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

      </defs>

      {/* Window base */}
      <rect width="248" height="186" rx="12" fill="white" />
      <rect y="15.5" width="248" height="170.5" fill="rgba(51,0,255,0.03)" clipPath="url(#win)" />

      {/* Header bar */}
      <rect width="248" height="15.5" fill="url(#hdr)" clipPath="url(#win)" />
      <circle cx="10" cy="7.75" r="2.5" fill="rgba(255,255,255,0.75)" />
      <circle cx="18" cy="7.75" r="2.5" fill="rgba(255,255,255,0.55)" />
      <circle cx="26" cy="7.75" r="2.5" fill="rgba(255,255,255,0.35)" />

      {/* ── Bubble A — CW, 2 full rotations (720°) ─────────────────── */}
      <motion.g
        animate={{ y: [0, -3, -1, -3, 0] }}
        transition={breathe(7)}
      >
        <circle cx="54" cy="68" r="48" fill="rgba(196,181,253,0.36)" />

        {/* animateTransform rotates in SVG user units — pivot is exact bubble center */}
        <g>
          <animateTransform
            attributeName="transform" type="rotate"
            values={gearVals(ANGLES_A, 54, 68)}
            keyTimes={TIMES} calcMode="spline" keySplines={SPLINES}
            dur={DUR} repeatCount="indefinite"
          />
          {/* Original absolute SVG positions — stay inside r=48 at all rotation angles */}
          <circle cx="40" cy="60" r="17" fill="rgba(139,92,246,0.28)" />
          <circle cx="68" cy="78" r="14" fill="rgba(109,40,217,0.24)" />
          <circle cx="24" cy="82" r="9"  fill="rgba(139,92,246,0.26)" />
          {/* Blue signal dot — opacity pulse while orbiting */}
          <motion.circle
            cx="48" cy="98" r="11"
            fill="rgba(96,165,250,0.65)" filter="url(#blue-glow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={breathe(3)}
          />
        </g>
      </motion.g>

      {/* ── Bubble B — CCW, 3 full rotations (−1080°) ──────────────── */}
      <motion.g
        animate={{ y: [0, -4, -1, -3, 0] }}
        transition={breathe(5.5, 1.4)}
      >
        <circle cx="52" cy="152" r="32" fill="rgba(196,181,253,0.42)" />

        <g>
          <animateTransform
            attributeName="transform" type="rotate"
            values={gearVals(ANGLES_B, 52, 152)}
            keyTimes={TIMES} calcMode="spline" keySplines={SPLINES}
            dur={DUR} repeatCount="indefinite"
          />
          {/* Original absolute SVG positions — stay inside r=32 at all angles */}
          <circle cx="38" cy="144" r="11" fill="rgba(139,92,246,0.28)" />
          <circle cx="36" cy="165" r="9"  fill="rgba(109,40,217,0.24)" />
          {/* Blue signal dot */}
          <motion.circle
            cx="62" cy="160" r="9"
            fill="rgba(96,165,250,0.65)" filter="url(#blue-glow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={breathe(2.8, 1.6)}
          />
        </g>
      </motion.g>

      {/* ── Satellite — CW, 4 full rotations (1440°) ───────────────── */}
      <motion.g
        animate={{ x: [0, 2, 0, -2, 0], y: [0, -2, -3, -1, 0] }}
        transition={breathe(9, 0.7)}
      >
        <circle cx="112" cy="126" r="26" fill="rgba(196,181,253,0.44)" />

        <g>
          <animateTransform
            attributeName="transform" type="rotate"
            values={gearVals(ANGLES_SAT, 112, 126)}
            keyTimes={TIMES} calcMode="spline" keySplines={SPLINES}
            dur={DUR} repeatCount="indefinite"
          />
          {/* Original absolute SVG positions — stay inside r=26 at all angles */}
          <circle cx="103" cy="120" r="9"  fill="rgba(139,92,246,0.28)" />
          <circle cx="118" cy="134" r="7"  fill="rgba(109,40,217,0.24)" />
          <circle cx="104" cy="138" r="5"  fill="rgba(139,92,246,0.26)" />
          <motion.circle
            cx="122" cy="120" r="4"
            fill="rgba(109,40,217,0.22)"
            animate={{ opacity: [0.22, 0.5, 0.22] }}
            transition={breathe(3.5, 0.6)}
          />
        </g>
      </motion.g>

      {/* ── Teal dot — free orbit, most active ───────────────────────── */}
      <motion.circle
        cx="124" cy="82" r="14"
        fill="rgba(96,165,250,0.70)" filter="url(#teal-glow)"
        animate={{
          cx: [124, 128, 126, 120, 122, 124],
          cy: [82,  78,  74,  76,  81,  82],
          r:  [14,  15.5, 13.5, 14.5, 13, 14],
        }}
        transition={breathe(5.5)}
      />

      {/* ── Modal panel ───────────────────────────────────────────────── */}
      <rect
        x={modalX} y={modalY}
        width={modalW} height={modalH}
        rx="9.3" fill="white"
        stroke="rgba(51,0,255,0.4)" strokeWidth="0.775"
      />
      {fieldOffsets.map((offset, i) => (
        <motion.rect
          key={i}
          x={fieldX}
          y={modalCY + offset - fieldH / 2}
          width={fieldW} height={fieldH}
          rx="6.2" fill="#e9ecef"
          animate={{ opacity: [0.9, 0.45, 0.9], scaleY: [1, 0.88, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          style={{ transformOrigin: `${(fieldX + fieldW / 2) * (210 / 248)}px ${(modalCY + offset) * (158 / 186)}px` }}
        />
      ))}

      {/* Window border */}
      <rect x="0.4" y="0.4" width="247.2" height="185.2" rx="11.6"
        stroke="rgba(51,0,255,0.4)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}
