import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavSidebar } from "./components/nav/NavSidebar";
import { StartingFrame } from "./components/companion/StartingFrame";
import { BuilderPage } from "./components/builder/BuilderPage";

type Page = "start" | "builder";

export default function App() {
  const [page, setPage] = useState<Page>("start");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (text: string) => {
    setPrompt(text);
    setPage("builder");
  };

  return (
    <div
      style={{ height: "100vh", display: "flex", background: "var(--background-elevation)" }}
    >
      <NavSidebar />

      <AnimatePresence mode="wait">
        {page === "start" ? (
          <motion.div
            key="start"
            style={{ flex: 1, display: "flex", minWidth: 0 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <StartingFrame onSubmit={handleSubmit} />
          </motion.div>
        ) : (
          <motion.div
            key="builder"
            style={{ flex: 1, display: "flex", minWidth: 0 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <BuilderPage prompt={prompt} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
