import type { Translate } from "@/i18n";

/**
 * The citizen's own words that caused a match. Deterministic keyword scoring
 * makes this possible: there is always an answer to "why am I being shown this?"
 * that does not require trusting a model.
 */
export default function MatchedTokens({
  t,
  matched,
}: {
  t: Translate;
  matched: string[];
}) {
  if (!matched.length) return null;
  return (
    <div className="small">
      <span className="muted">{t("common.matchedOn")}</span>
      <ul className="tokens">
        {matched.slice(0, 6).map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
