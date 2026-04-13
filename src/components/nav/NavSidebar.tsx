function CrestaLogo() {
  return (
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: "var(--content-primary)",
      }}
    >
      CRESTA
    </span>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.25 7.5L9 2.25L15.75 7.5V15.75H11.25V11.25H6.75V15.75H2.25V7.5Z"
        stroke="#25252a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuilderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.75 3H4.5C3.672 3 3 3.672 3 4.5V13.5C3 14.328 3.672 15 4.5 15H13.5C14.328 15 15 14.328 15 13.5V8.25"
        stroke="#5d666f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 2.25L15.75 4.5L9 11.25H6.75V9L13.5 2.25Z"
        stroke="#5d666f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 6.75L16.5 9"
        stroke="#5d666f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.25 13.5L6.75 9L11.25 4.5"
        stroke="#5d666f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NavSidebar() {
  return (
    <div
      className="relative flex flex-col items-start shrink-0"
      style={{
        width: 137,
        height: "100vh",
        background: "var(--background-surface)",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      {/* Logo */}
      <div style={{ padding: 20 }} className="shrink-0">
        <CrestaLogo />
      </div>

      {/* Home */}
      <div
        className="flex items-center shrink-0 cursor-pointer"
        style={{
          gap: 12,
          height: 58,
          width: "100%",
          padding: "10px 12px",
          background: "var(--background-surface)",
          borderRight: "1px solid var(--border-default)",
        }}
      >
        <HomeIcon />
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "var(--content-primary)",
            whiteSpace: "nowrap",
          }}
        >
          Home
        </p>
      </div>

      {/* Builder — active */}
      <div
        className="flex items-center shrink-0 cursor-pointer"
        style={{
          gap: 12,
          height: 58,
          width: "100%",
          padding: "10px 12px",
          background: "var(--background-elevation)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <BuilderIcon />
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "var(--content-secondary)",
            whiteSpace: "nowrap",
          }}
        >
          Builder
        </p>
      </div>

      {/* Collapse chevron — pinned to bottom */}
      <div
        className="flex items-center justify-center cursor-pointer"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 56,
          padding: "10px 12px",
          background: "var(--background-elevation)",
          borderTop: "1px solid var(--border-default)",
        }}
      >
        <ChevronLeftIcon />
      </div>
    </div>
  );
}
