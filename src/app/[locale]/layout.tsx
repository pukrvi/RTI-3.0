import "../globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChromeGate from "@/components/ChromeGate";
import Icon from "@/components/Icon";
import TopActions from "@/components/TopActions";
import MainNav from "@/components/MainNav";
import SiteFooter from "@/components/SiteFooter";
import {
  LOCALES,
  getT,
  isLocale,
  isRtl,
  languageMenu,
  localeTag,
} from "@/i18n";
import { readPrefs } from "@/lib/prefs";
import { currentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(isLocale(locale) ? locale : "en");
  return {
    title: t("app.htmlTitle"),
    description: t("app.tagline"),
    // A prototype that resembles a public service should not turn up in search
    // results as though it were one.
    robots: { index: false, follow: false },
  };
}

/**
 * Tracking, history and appeals are not in this list: they belong to a person,
 * so they live behind the account link on the right. Both benchmark portals do
 * the same — FOIA.gov keeps `Agency login` off the end of the nav, and
 * WhatDoTheyKnow puts `Sign in or sign up` in the utility row.
 */
const RTI_ACT_URL = "https://rti.dopt.gov.in/rtiact.html";

const NAV: { section: string; href: string; key: string; external?: boolean }[] = [
  { section: "", href: "", key: "nav.home" },
  { section: "chat", href: "/chat", key: "nav.search" },
  { section: "authorities", href: "/authorities", key: "nav.pa" },
  { section: "published", href: "/published", key: "nav.published" },
  { section: "act", href: RTI_ACT_URL, key: "nav.act", external: true },
  { section: "help", href: "/help", key: "nav.helpFaq" },
  { section: "contact", href: "/contact", key: "nav.contact" },
];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getT(locale);
  const [prefs, session] = await Promise.all([
    readPrefs(),
    currentSession(),
  ]);

  const navItems = NAV.map(({ section, href, key, external }) => ({
    section,
    href,
    label: t(key),
    ...(external ? { external: true as const } : {}),
  }));

  return (
    <html
      lang={localeTag(locale)}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      data-text={prefs.text}
      data-contrast={prefs.contrast}
    >
      <body>
        <div className="shell">
          <ChromeGate hiddenOn="/chat">
          {/* One unified masthead: the mark anchors the left and spans both
              rows. To its right, on wide screens the utility controls
              (language, text size, contrast) sit top-right, with the task
              menu and the login button on the row below. On narrow screens
              the right side collapses to one stacked column. */}
          <header className="topbar">
            <div className="page">
              <Link className="brand" href={`/${locale}`}>
                <img
                  className="logo"
                  src="/RTO_3_logo.png"
                  alt={t("app.name")}
                  width={600}
                  height={300}
                />
              </Link>

              <div className="topbar-side">
                <TopActions
                  locale={locale}
                  languages={languageMenu()}
                  prefs={prefs}
                  labels={{
                    language: t("top.language"),
                    languageGo: t("top.languageGo"),
                    unavailable: t("top.languageUnavailable"),
                    textSize: t("top.textSize"),
                    smaller: t("top.textSmaller"),
                    normal: t("top.textNormal"),
                    larger: t("top.textLarger"),
                    status: t("top.textStatus"),
                    sizeNames: {
                      xs: t("top.sizeXs"),
                      sm: t("top.sizeSm"),
                      base: t("top.sizeBase"),
                      lg: t("top.sizeLg"),
                      xl: t("top.sizeXl"),
                    },
                    contrastOn: t("utility.contrastOn"),
                    contrastOff: t("utility.contrastOff"),
                  }}
                />
                <div className="topbar-navrow">
                  <MainNav
                    variant="desktop"
                    locale={locale}
                    navLabel={t("nav.label")}
                    menuLabel={t("nav.menu")}
                    currentLabel={t("nav.currentPage")}
                    items={navItems}
                  />
                  <Link className="btn btn-login" href={`/${locale}/${session ? "account" : "login"}`}>
                    <Icon name="user" />
                    {session ? t("auth.account") : t("auth.signIn")}
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* The same links as a disclosure menu, shown only below 60rem. */}
          <MainNav
            variant="mobile"
            locale={locale}
            navLabel={t("nav.label")}
            menuLabel={t("nav.menu")}
            currentLabel={t("nav.currentPage")}
            items={navItems}
          />
          </ChromeGate>

          {children}

          <ChromeGate hiddenOn="/chat">
            <SiteFooter t={t} locale={locale} />
          </ChromeGate>
        </div>
      </body>
    </html>
  );
}
