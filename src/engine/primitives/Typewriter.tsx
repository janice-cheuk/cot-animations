import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  speedMs?: number;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speedMs = 22,
  delayMs = 0,
  className,
  style,
  onComplete,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    const start = setTimeout(() => {
      const tick = () => {
        if (indexRef.current < text.length) {
          indexRef.current += 1;
          setDisplayed(text.slice(0, indexRef.current));
          timerRef.current = setTimeout(tick, speedMs);
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
  }, [text, speedMs, delayMs]);

  return (
    <span className={className} style={style}>
      {displayed}
      {!done && (
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
      )}
    </span>
  );
}
