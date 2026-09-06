import Link from "next/link";
import { getT } from "@/i18n";
import Icon, { type IconName } from "@/components/Icon";

/**
 * The filing front door, shown on `account/new`.
 *
 * Moved here from the dashboard top: five whole-card links in a 2 / 3 grid —
 * "File an RTI Manually" first and wide (straight to the one-page `/file`
 * form), "File with RTI Mitra AI" beside it (into the `/chat` assistant),
 * then the three helper routes in one row of three. "File an RTI Manually"
 * is the only primary card on the page. Each card is its own link — icon
 * beside a title over a one-line body — with no buttons here at all.
 *
 * Icons are this prototype's own set (`Icon.tsx`): `plus` for manual filing,
 * `chat` for RTI Mitra (same as the assistant), `help` for the process guide,
 * `act` for the Act/rights (same book as "Read the RTI Act"), and `building`
 * for the authority list (same as the finder). No Paper icon is reused.
 *
 * Titles and bodies live in the dictionary (`dashAct.*`), quoted from the
 * Paper frame in English — including its typos ("asnwerable though"); do not
 * tidy the English copy, it is owned there. The two filing titles are the
 * exception: renamed per board direction.
 */
interface DashboardAction {
  href: (locale: string) => string;
  icon: IconName;
  /** Dictionary keys — the English copy below lives in `dashAct.*`. Titles
   *  and bodies stay quoted from the Paper frame in English (including its
   *  typos); other locales translate the intended meaning. */
  titleKey: string;
  bodyKey: string;
  primary?: boolean;
  /** External links open in a new tab with opener protection. */
  external?: boolean;
}

const ACTIONS: DashboardAction[] = [
  {
    href: (locale) => `/${locale}/file`,
    icon: "plus",
    titleKey: "dashAct.t1",
    bodyKey: "dashAct.b1",
    primary: true,
  },
  {
    href: (locale) => `/${locale}/chat`,
    icon: "chat",
    titleKey: "dashAct.t2",
    bodyKey: "dashAct.b2",
  },
  {
    href: (locale) => `/${locale}/account/process`,
    icon: "help",
    titleKey: "dashAct.t3",
    bodyKey: "dashAct.b3",
  },
  {
    // The Act itself, on the DoPT site — the same destination as the
    // homepage's "Read the RTI Act, 2005" link.
    href: () => "https://rti.dopt.gov.in/rtiact.html",
    icon: "act",
    titleKey: "dashAct.t4",
    bodyKey: "dashAct.b4",
    external: true,
  },
  {
    href: (locale) => `/${locale}/authorities`,
    icon: "building",
    titleKey: "dashAct.t5",
    bodyKey: "dashAct.b5",
  },
];

export default function DashboardActions({ locale }: { locale: string }) {
  const t = getT(locale);
  const [first, second, ...rest] = ACTIONS;
  const top = [first, second];

  const renderCard = (action: DashboardAction) => {
    const title = t(action.titleKey);
    const body = t(action.bodyKey);
    const inner = (
      <>
        <span className="action-ic" aria-hidden="true">
          <Icon name={action.icon} />
        </span>
        <span className="action-tx">
          <span className="action-t">{title}</span>
          <span className="action-d">{body}</span>
        </span>
      </>
    );
    const className = `action-card${action.primary ? " action-card-primary" : ""}`;
    return action.external ? (
      <a
        key={title}
        className={className}
        href={action.href(locale)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    ) : (
      <Link key={title} className={className} href={action.href(locale)}>
        {inner}
      </Link>
    );
  };

  return (
    <nav className="dash-actions" aria-label={t("home.quick.title")}>
      <div className="dash-actions-top">{top.map(renderCard)}</div>
      <div className="card-grid card-grid-3">{rest.map(renderCard)}</div>
    </nav>
  );
}
