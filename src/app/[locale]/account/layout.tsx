import { redirect } from "next/navigation";
import AccountNav, { type AccountNavItem } from "@/components/AccountNav";
import Icon from "@/components/Icon";
import { getT } from "@/i18n";
import { loadAccount } from "@/lib/account";
import { currentSession } from "@/lib/session";
import { signOutAction } from "../actions";

/**
 * The signed-in shell: one menu down the side, one page beside it.
 *
 * Everything a citizen can do with a filing they have already made lives in
 * here. On the live portal the same jobs are five top-level menu items sitting
 * between `Home` and `FAQ`, each behind its own credential check, and none of
 * them links to any other — you cannot get from a status screen to the appeal
 * form for the request you are looking at.
 *
 * The `<main>` element lives here rather than in each page, so the skip link
 * lands past the account menu instead of in front of it.
 */
export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const session = await currentSession();
  if (!session) redirect(`/${locale}/login`);

  const { counts } = await loadAccount(session.contact, locale);

  const items: AccountNavItem[] = [
    { href: "", label: t("acct.dashboard"), icon: "grid" },
    { href: "/new", label: t("acct.new"), icon: "plus" },
    { href: "/track", label: t("acct.track"), icon: "clock", count: counts.requests.pending },
    { href: "/history", label: t("acct.history"), icon: "history" },
    { href: "/appeals", label: t("acct.appeals"), icon: "appeal" },
    { href: "/payments", label: t("acct.payments"), icon: "rupee" },
    { href: "/profile", label: t("acct.profile"), icon: "id" },
  ];

  return (
    <div className="acct">
      <div className="page acct-grid">
        <div className="acct-side">
          <div className="acct-who">
            <span className="acct-avatar" aria-hidden="true">
              <Icon name="user" />
            </span>
            <span className="who">{t("auth.signedInAs", { contact: session.contact })}</span>
          </div>

          <AccountNav
            locale={locale}
            items={items}
            label={t("acct.nav")}
            currentLabel={t("nav.currentPage")}
          />

          <form action={signOutAction} className="acct-out">
            <input type="hidden" name="locale" value={locale} />
            <button type="submit" className="btn btn-quiet btn-sm btn-block">
              <Icon name="exit" />
              {t("auth.signOut")}
            </button>
          </form>
        </div>

        <main id="main" className="acct-main stack-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
