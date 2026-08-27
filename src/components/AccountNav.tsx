"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";

/**
 * The account's own navigation.
 *
 * On the live portal these six things are six unrelated front doors, each one
 * demanding its own credentials: `Submit Request` retypes every personal
 * detail, `View Status` wants a registration number plus an email plus a
 * captcha, `View History` wants an email plus a mobile plus a captcha plus an
 * emailed code, `Submit First Appeal` wants the registration number again, and
 * `Payment Reconciliation` exists only because the first door loses payments.
 * Same person, same filings, five sets of keys.
 *
 * Here they are one signed-in place with one menu down the side. A client
 * component only because it has to know which route is showing — Next keeps a
 * shared layout mounted across client navigation without re-rendering it, so a
 * server-rendered `aria-current` would go stale on the second click.
 *
 * Below 60rem it becomes a horizontal scrolling row above the content rather
 * than a drawer: a drawer is one more thing to learn, and the row is reachable
 * by keyboard and by thumb without any script running.
 */
export interface AccountNavItem {
  href: string;
  label: string;
  icon: IconName;
  /** Shown as a count pill — omitted when zero. */
  count?: number;
}

export default function AccountNav({
  locale,
  items,
  label,
  currentLabel,
}: {
  locale: string;
  items: AccountNavItem[];
  label: string;
  currentLabel: string;
}) {
  const pathname = usePathname() || "";
  const root = `/${locale}/account`;

  return (
    <nav className="acct-nav" aria-label={label}>
      <ul>
        {items.map((item) => {
          const href = `${root}${item.href}`;
          // The dashboard is the only exact match; the rest own their subtree.
          const current = item.href === "" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} {...(current ? { "aria-current": "page" as const } : {})}>
                <Icon name={item.icon} />
                <span className="lbl">{item.label}</span>
                {typeof item.count === "number" && item.count > 0 && (
                  <span className="count">{item.count}</span>
                )}
                {current && <span className="visually-hidden"> — {currentLabel}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
