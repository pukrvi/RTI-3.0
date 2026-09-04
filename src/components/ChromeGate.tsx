"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the site chrome on the routes that are meant to be a tool rather than
 * a page — RTI Mitra runs full-screen, with its own bar and its own way out.
 *
 * A client component only because it has to know which route is showing, and
 * Next preserves a shared layout across client navigation without re-rendering
 * it. The children are server-rendered and passed straight through.
 */
export default function ChromeGate({
  hiddenOn,
  children,
}: {
  hiddenOn: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  if (pathname.includes(hiddenOn)) return null;
  return <>{children}</>;
}
