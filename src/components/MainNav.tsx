"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The citizen's tasks, and nothing else. On the live RTI portal login is the
 * sixth of ten items in the middle of this menu with nothing to say what it is
 * for, so citizens click it and get stuck; here it stays a button on the right.
 *
 * One row on a laptop: the links sit inline in the masthead, between the logo
 * and the login button (`variant="desktop"`). Below 60rem there is no room for
 * that, so the same links become a disclosure menu — a <details> element that
 * opens and closes with no JavaScript at all (`variant="mobile"`). The layout
 * renders both and lets the breakpoint show exactly one.
 *
 * On mobile the disclosure also carries `utility`: the masthead row has room
 * only for the marks and the hamburger, so the language, text-size, contrast,
 * Mitra and account controls render a second time inside the dropdown.
 */
export interface NavItem {
  section: string;
  href: string;
  label: string;
  external?: boolean;
}

export default function MainNav({
  locale,
  items,
  navLabel,
  menuLabel,
  currentLabel,
  variant,
  utility,
}: {
  locale: string;
  items: NavItem[];
  navLabel: string;
  menuLabel: string;
  currentLabel: string;
  variant: "desktop" | "mobile";
  utility?: React.ReactNode;
}) {
  const pathname = usePathname() || `/${locale}`;
  const active = pathname.split("/").filter(Boolean)[1] ?? "";

  const link = (item: NavItem, extraClass = "") => {
    if (item.external) {
      return (
        <li key={item.href} className={extraClass}>
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            {item.label}
          </a>
        </li>
      );
    }
    const current = item.section === active;
    return (
      <li key={item.href} className={extraClass}>
        <Link
          href={`/${locale}${item.href}`}
          {...(current ? { "aria-current": "page" as const } : {})}
        >
          {item.label}
          {current && <span className="visually-hidden"> — {currentLabel}</span>}
        </Link>
      </li>
    );
  };

  if (variant === "mobile") {
    return (
      <details className="navmenu navmenu-inline">
        <summary>
          <span className="bars" aria-hidden="true" />
          {menuLabel}
        </summary>
        <div className="navmenu-panel">
          <nav aria-label={navLabel}>
            <ul>{items.map((item) => link(item))}</ul>
          </nav>
          {utility ? <div className="navmenu-utility">{utility}</div> : null}
        </div>
      </details>
    );
  }

  return (
    <nav className="mainnav nav-desktop" aria-label={navLabel}>
      <ul>{items.map((item) => link(item))}</ul>
    </nav>
  );
}
