/**
 * A very small set of line icons.
 *
 * Inline SVG, one stroke weight, `currentColor`, sized in `em` so they scale
 * with the text-size control. They are decorative: every one sits beside a
 * label that carries the meaning, so they are all `aria-hidden` and nothing is
 * ever an icon alone. No icon font, no sprite sheet, no network request.
 */
export type IconName =
  | "search"
  | "appeal"
  | "act"
  | "clock"
  | "rupee"
  | "no-reason"
  | "building"
  | "archive"
  | "help"
  | "check"
  | "alert"
  | "chat"
  | "user"
  | "grid"
  | "plus"
  | "history"
  | "id"
  | "exit";

const PATHS: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  appeal: (
    <>
      <path d="M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
      <path d="M14 3v5h5" />
      <path d="m9 14 2.5 2.5L16 12" />
    </>
  ),
  act: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />
      <path d="M8.5 7.5h7M8.5 11h5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  rupee: (
    <>
      <path d="M7 4h10M7 8.5h10M7 4c5 0 6.5 1.5 6.5 4S12 12.5 7 12.5h2L16 20" />
    </>
  ),
  "no-reason": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.4" />
      <path d="M12 17h.01" />
    </>
  ),
  building: (
    <>
      <path d="M3 20h18" />
      <path d="M5 20V9.5L12 5l7 4.5V20" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  archive: (
    <>
      <rect x="3.5" y="4.5" width="17" height="4" rx="1" />
      <path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5" />
      <path d="M10 12.5h4" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.4A2.5 2.5 0 1 1 12.7 12c-.5.2-.7.6-.7 1.1v.4" />
      <path d="M12 17h.01" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 4.5 21 20H3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 12.5c0 3.9-3.8 7-8.5 7-1 0-2-.1-2.9-.4L4 21l1.3-3.6C4.2 16.1 3.5 14.4 3.5 12.5c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  plus: (
    <>
      <path d="M6 3.5h8L19 8v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V8H19" />
      <path d="M12 11.5v6M9 14.5h6" />
    </>
  ),
  history: (
    <>
      <path d="M3.8 12a8.2 8.2 0 1 0 2.5-5.9" />
      <path d="M3.5 4.5V10h5.5" />
      <path d="M12 8v4.4l3 1.8" />
    </>
  ),
  id: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <circle cx="8.5" cy="11" r="2.2" />
      <path d="M5 16.2a3.8 3.8 0 0 1 7 0" />
      <path d="M14.5 10h4M14.5 13.5h4" />
    </>
  ),
  exit: (
    <>
      <path d="M14.5 4.5h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3" />
      <path d="M10 8.5 6.5 12 10 15.5" />
      <path d="M6.5 12h8" />
    </>
  ),
};

export default function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
