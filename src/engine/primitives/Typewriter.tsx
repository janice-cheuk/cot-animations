import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  /** "phrase" reveals N words at a time — rapid burst, closest to Cursor CoT streaming.
   *  "line"  reveals one \n-delimited line per tick.
   *  "word"  reveals one word per tick.
   *  "char"  reveals one character per tick. */
  mode?: "phrase" | "line" | "word" | "char";
  /** Number of words per burst in "phrase" mode (default 3). */
  phraseSize?: number;
  speedMs?: number;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  mode = "phrase",
  phraseSize = 3,
  speedMs,
  delayMs = 0,
  className,
  style,
  onComplete,
}: TypewriterProps) {
  const defaultSpeed =
    mode === "phrase" ? 90 :
    mode === "line"   ? 320 :
    mode === "word"   ? 55 : 22;
  const speed = speedMs ?? defaultSpeed;

  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // For phrase mode: chunk words into groups of phraseSize
  const tokens = (() => {
    if (mode === "phrase") {
      const words = text.split(" ");
      const chunks: string[] = [];
      for (let i = 0; i < words.length; i += phraseSize) {
        chunks.push(words.slice(i, i + phraseSize).join(" "));
      }
      return chunks;
    }
    if (mode === "line") return text.split("\n");
    if (mode === "word") return text.split(" ");
    return text.split("");
  })();

  useEffect(() => {
    indexRef.current = 0;
    setVisibleCount(0);
    setDone(false);

    const start = setTimeout(() => {
      const tick = () => {
        if (indexRef.current < tokens.length) {
          indexRef.current += 1;
          setVisibleCount(indexRef.current);
          timerRef.current = setTimeout(tick, speed);
        } else {
          setDone(true);
          onComplete?.();
        }
      };
      tick();
    }, delayMs);

    return () => {
      clearTimeout(start);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, mode, speed, delayMs]);

  const displayed = tokens.slice(0, visibleCount);

  const cursor = (
    <span
      style={{
        display: "inline-block",
        width: 1.5,
        height: "0.85em",
        background: "currentColor",
        marginLeft: 1,
        verticalAlign: "text-bottom",
        animation: "cot-cursor-blink 0.8s step-end infinite",
      }}
    />
  );

  return (
    <span className={className} style={{ ...style, whiteSpace: "pre-wrap" }}>
      {mode === "line"
        ? displayed.map((line, i) => (
            <span key={i} style={{ display: "block" }}>
              {line}
              {i === displayed.length - 1 && !done && cursor}
            </span>
          ))
        : (
          <>
            {mode === "char" ? displayed.join("") : displayed.join(" ")}
            {!done && cursor}
          </>
        )
      }
    </span>
  );
}
