import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PROMPTS = [
  "product requirements",
  "real customer insights",
  "existing workflows",
  "customer problems",
];

export function AnimatedPromptCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % PROMPTS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="inline-flex items-center overflow-hidden"
      style={{ minWidth: 260, verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              "linear-gradient(135deg, #5a8fc4 0%, #6e5ea8 22%, #966895 35%, #b87a7a 55%, #d4a07a 78%, #8a9db8 91%, #5a8fc4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
          }}
        >
          {PROMPTS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
