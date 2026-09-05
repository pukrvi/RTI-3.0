"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

/**
 * The AI assistant's way in: a gradient call-to-action pinned before the
 * login button, not another item in the task menu. It shares the login
 * button's `.btn` box, so the two always stand the same height.
 */
export default function MitraCta({
  locale,
  href,
  label,
  currentLabel,
}: {
  locale: string;
  href: string;
  label: string;
  currentLabel: string;
}) {
  const pathname = usePathname() || `/${locale}`;
  const active = pathname.split("/").filter(Boolean)[1] ?? "";
  const current = active === "chat";

  return (
    <Link
      href={`/${locale}${href}`}
      className="btn mitra-cta"
      {...(current ? { "aria-current": "page" as const } : {})}
    >
      <Icon name="chat" />
      {label}
      {current && <span className="visually-hidden"> — {currentLabel}</span>}
    </Link>
  );
}
