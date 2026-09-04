import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n";

/**
 * Locale lives in the path: /en/... and /hi/.... Anything without a known
 * locale prefix is redirected, honouring Accept-Language where we have that
 * language and falling back to English. The locale list comes from the registry
 * in `src/i18n`, so adding a language still touches only that one file.
 */
function preferredLocale(header: string | null): string {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.split("=")[1]) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (LOCALES.includes(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = preferredLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Public static assets (the masthead logo plus the usual suspects) are
  // served straight from /public and must not be locale-redirected, or the
  // request lands on /en/<file> and 404s.
  matcher: ["/((?!_next/|icon.svg|favicon.ico|robots.txt|RTO_3_logo.png|indian-emblam-white.png).*)"],
};
