import { AnimatedPromptCycler } from "./AnimatedPromptCycler";

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" opacity={0.2}>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 8.25V12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="5.625" r="0.75" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 13.5V4.5M9 4.5L5.25 8.25M9 4.5L12.75 8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="5.5"
        width="12"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="5.5" cy="9" r="1" fill="currentColor" />
      <circle cx="10.5" cy="9" r="1" fill="currentColor" />
      <path
        d="M6.5 11.5C6.5 11.5 7 12 8 12C9 12 9.5 11.5 9.5 11.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M8 5.5V3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="8" cy="2.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 11L6 7L9 10L14 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 14H14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const MOCK_AGENTS = [
  {
    id: 1,
    name: "Customer Support Agent",
    createdBy: "Janice Cheuk",
    lastEdited: "Apr 10, 2026",
  },
  {
    id: 2,
    name: "Sales Coaching Assistant",
    createdBy: "Alex Rivera",
    lastEdited: "Apr 8, 2026",
  },
  {
    id: 3,
    name: "Onboarding Guide",
    createdBy: "Sam Lee",
    lastEdited: "Apr 5, 2026",
  },
];

export function StartingFrame() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ padding: 8 }}>
      {/* Rounded card frame */}
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          background: "var(--background-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-base)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center shrink-0"
          style={{ padding: "12px 24px 12px 16px" }}
        >
          <div className="flex items-center gap-3">
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--content-primary)",
                lineHeight: 1,
              }}
            >
              Companion
            </span>
            <span style={{ color: "var(--content-primary)" }}>
              <InfoIcon />
            </span>
          </div>
        </div>

        {/* Main content */}
        <div
          className="flex flex-col"
          style={{ gap: 16, padding: "0 26px", paddingTop: 10 }}
        >
          {/* Hero heading */}
          <div className="shrink-0">
            <h1
              style={{
                fontSize: "var(--title-page)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--content-primary)",
                lineHeight: 1.4,
              }}
            >
              Start building from{" "}
              <AnimatedPromptCycler />
            </h1>
          </div>

          {/* Input bar */}
          <div
            className="flex flex-col shrink-0"
            style={{
              background: "var(--background-surface)",
              border: "1.8px solid var(--border-default)",
              borderRadius: 24,
              padding: "var(--spacing-base)",
              paddingLeft: "var(--spacing-xl)",
              gap: "var(--spacing-base)",
              minHeight: 81,
            }}
          >
            <div className="flex items-center flex-1">
              <span
                style={{
                  fontSize: "var(--font-size-base)",
                  color: "var(--content-placeholder)",
                  lineHeight: 1.55,
                }}
              >
                Ask anything
              </span>
            </div>
            <div className="flex items-end justify-end">
              <button
                disabled
                className="flex items-center justify-center"
                style={{
                  background: "var(--background-disabled)",
                  borderRadius: 32,
                  padding: 8,
                  border: "none",
                  cursor: "not-allowed",
                  color: "var(--content-placeholder)",
                }}
              >
                <SendIcon />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex shrink-0"
            style={{
              borderBottom: "1px solid var(--border-default)",
              gap: 32,
              paddingLeft: 16,
            }}
          >
            {/* Agents tab — active */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              style={{
                borderBottom: "2px solid var(--border-action)",
                padding: "16px 0",
                color: "var(--content-action)",
              }}
            >
              <RobotIcon />
              <span
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: 550,
                  lineHeight: 1.55,
                }}
              >
                Agents
              </span>
            </div>

            {/* Insights tab — inactive */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              style={{
                padding: "16px 0",
                color: "var(--content-secondary)",
              }}
            >
              <GraphIcon />
              <span
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: 550,
                  lineHeight: 1.55,
                }}
              >
                Insights
              </span>
            </div>
          </div>
        </div>

        {/* Agents section */}
        <div
          className="flex flex-col"
          style={{ padding: "24px 10px 10px 26px" }}
        >
          {/* Section title */}
          <div
            className="flex items-center gap-2 shrink-0"
            style={{ marginBottom: 12 }}
          >
            <span
              style={{
                fontSize: "var(--font-size-large)",
                fontWeight: 550,
                color: "var(--content-secondary)",
              }}
            >
              Agents
            </span>
            <InfoIcon />
          </div>

          {/* Table */}
          <div
            className="overflow-hidden"
            style={{
              background: "white",
              borderRadius: "var(--radius-base)",
            }}
          >
            {/* Table header */}
            <div
              className="flex"
              style={{ borderBottom: "1px solid var(--border-default)" }}
            >
              <div style={{ flex: "1 0 0", padding: "8px 16px 8px 16px" }}>
                <span
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: 550,
                    color: "var(--content-primary)",
                  }}
                >
                  Name
                </span>
              </div>
              <div style={{ width: 280, padding: "8px 16px" }}>
                <span
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: 550,
                    color: "var(--content-primary)",
                  }}
                >
                  Created by
                </span>
              </div>
              <div style={{ width: 180, padding: "8px 16px" }}>
                <span
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: 550,
                    color: "var(--content-primary)",
                  }}
                >
                  Last Edited
                </span>
              </div>
            </div>

            {/* Table rows */}
            {MOCK_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center cursor-pointer"
                style={{
                  borderBottom: "1px solid var(--border-default)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "var(--background-elevation)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "transparent";
                }}
              >
                <div style={{ flex: "1 0 0", padding: "10px 16px" }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 550,
                      color: "var(--content-action)",
                    }}
                  >
                    {agent.name}
                  </span>
                </div>
                <div style={{ width: 280, padding: "10px 16px" }}>
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--content-secondary)",
                    }}
                  >
                    {agent.createdBy}
                  </span>
                </div>
                <div style={{ width: 180, padding: "10px 16px" }}>
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--content-secondary)",
                    }}
                  >
                    {agent.lastEdited}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
