import Link from "next/link";
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
 * Titles and bodies are quoted VERBATIM from the Paper frame, including its
 * typos ("asnwerable though") — do not tidy them; the copy is owned there.
 * The two filing titles are the exception: renamed per board direction.
 */
interface DashboardAction {
  href: (locale: string) => string;
  icon: IconName;
  title: string;
  body: string;
  primary?: boolean;
  /** External links open in a new tab with opener protection. */
  external?: boolean;
}

const ACTIONS: DashboardAction[] = [
  {
    href: (locale) => `/${locale}/file`,
    icon: "plus",
    title: "File an RTI Manually",
    body: "Tell us what you want to know. We'll find who holds it and help you request it.",
    primary: true,
  },
  {
    href: (locale) => `/${locale}/chat`,
    icon: "chat",
    title: "File with RTI Mitra AI",
    body: "Use AI to find already published information and right authorities",
  },
  {
    href: (locale) => `/${locale}/account/process`,
    icon: "help",
    title: "Understand the process",
    body: "See how RTI works today and a proposed unified process.",
  },
  {
    // The Act itself, on the DoPT site — the same destination as the
    // homepage's "Read the RTI Act, 2005" link.
    href: () => "https://rti.dopt.gov.in/rtiact.html",
    icon: "act",
    title: "Learn about RTI",
    body: "Understand the process and your rights.",
    external: true,
  },
  {
    // Body verbatim from Paper, typos included ("asnwerable though").
    href: (locale) => `/${locale}/authorities`,
    icon: "building",
    title: "List of Authorities",
    body: "Search all the authorities that are asnwerable though this portal",
  },
];

export default function DashboardActions({ locale }: { locale: string }) {
  const [first, second, ...rest] = ACTIONS;
  const top = [first, second];

  const renderCard = (action: DashboardAction) => {
    const inner = (
      <>
        <span className="action-ic" aria-hidden="true">
          <Icon name={action.icon} />
        </span>
        <span className="action-tx">
          <span className="action-t">{action.title}</span>
          <span className="action-d">{action.body}</span>
        </span>
      </>
    );
    const className = `action-card${action.primary ? " action-card-primary" : ""}`;
    return action.external ? (
      <a
        key={action.title}
        className={className}
        href={action.href(locale)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    ) : (
      <Link key={action.title} className={className} href={action.href(locale)}>
        {inner}
      </Link>
    );
  };

  return (
    <nav className="dash-actions" aria-label="Common tasks">
      <div className="dash-actions-top">{top.map(renderCard)}</div>
      <div className="card-grid card-grid-3">{rest.map(renderCard)}</div>
    </nav>
  );
}
