import { NavSidebar } from "./components/nav/NavSidebar";
import { StartingFrame } from "./components/companion/StartingFrame";

export default function App() {
  return (
    <div
      className="flex"
      style={{ height: "100vh", background: "var(--background-elevation)" }}
    >
      <NavSidebar />
      <StartingFrame />
    </div>
  );
}
