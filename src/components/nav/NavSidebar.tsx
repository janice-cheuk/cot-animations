// Icons as inline SVGs matching the Figma design
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2.25 7.5L9 2.25L15.75 7.5V15.75H11.25V11.25H6.75V15.75H2.25V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuilderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M12.75 3H14.25C14.6478 3 15.0294 3.15804 15.3107 3.43934C15.592 3.72064 15.75 4.10218 15.75 4.5V6C15.75 6.39782 15.592 6.77936 15.3107 7.06066C15.0294 7.34196 14.6478 7.5 14.25 7.5H12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.25 3.75H12.75V12.75C12.75 13.1478 12.592 13.5294 12.3107 13.8107C12.0294 14.092 11.6478 14.25 11.25 14.25H3.75C3.35218 14.25 2.97064 14.092 2.68934 13.8107C2.40804 13.5294 2.25 13.1478 2.25 12.75V3.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 14.25V16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.25V16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 16.5H11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6.75H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9.75H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11.25 13.5L6.75 9L11.25 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrestaLogo() {
  return (
    <svg width="91" height="20" viewBox="0 0 91 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="24"
        y="14.5"
        fontFamily="Inter, sans-serif"
        fontSize="13"
        fontWeight="600"
        fill="currentColor"
      >
        CRESTA
      </text>
    </svg>
  );
}

export function NavSidebar() {
  return (
    <aside
      className="flex flex-col shrink-0 border-r"
      style={{
        width: 137,
        height: "100%",
        background: "var(--background-surface)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Logo */}
      <div className="p-5 shrink-0">
        <div style={{ color: "var(--content-primary)" }}>
          <CrestaLogo />
        </div>
      </div>

      {/* Home nav item */}
      <div
        className="flex items-center gap-3 px-3 py-[10px] shrink-0 border-r cursor-pointer"
        style={{
          height: 58,
          background: "var(--background-surface)",
          borderColor: "var(--border-default)",
          color: "var(--content-primary)",
        }}
      >
        <span style={{ color: "var(--content-primary)" }}>
          <HomeIcon />
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "var(--content-primary)",
          }}
        >
          Home
        </span>
      </div>

      {/* Builder nav item — active */}
      <div
        className="flex items-center gap-3 px-3 py-[10px] shrink-0 border-b cursor-pointer"
        style={{
          height: 58,
          background: "var(--background-elevation)",
          borderColor: "var(--border-default)",
          color: "var(--content-secondary)",
        }}
      >
        <span style={{ color: "var(--content-secondary)" }}>
          <BuilderIcon />
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "var(--content-secondary)",
          }}
        >
          Builder
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Collapse button */}
      <div
        className="flex items-center justify-center px-3 py-[10px] border-b cursor-pointer shrink-0"
        style={{
          height: 56,
          background: "var(--background-elevation)",
          borderColor: "var(--border-default)",
          color: "var(--content-secondary)",
        }}
      >
        <ChevronLeftIcon />
      </div>
    </aside>
  );
}
