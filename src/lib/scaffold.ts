/**
 * Letter scaffolding.
 *
 * A malformed question is one of the three pre-filing failures this prototype
 * exists to catch. The citizen never has to accept any of this text — it is a
 * starting point, editable to the last character, and the interface says so.
 *
 * All wording comes from the dictionaries, so a new language needs no code here.
 */
import type { Translate } from "@/i18n";

function condense(question: string, max = 80): string {
  const flat = question.replace(/\s+/g, " ").replace(/[?।.!]+$/u, "").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + "…";
}

/**
 * The subject line is the citizen's own question, condensed. An earlier version
 * wrapped it in "Information about …", which produced "Information about How
 * many…" — a template showing through. Their words are already the right words.
 */
export function scaffoldSubject(question: string, _t: Translate): string {
  return condense(question);
}

export function scaffoldBody(question: string, t: Translate): string {
  return [
    t("scaffold.line1", { question: question.replace(/\s+/g, " ").trim() }),
    t("scaffold.line2"),
    t("scaffold.line3"),
    t("scaffold.line4"),
  ].join("\n\n");
}

export function appealScaffold(
  t: Translate,
  args: { ref: string; filed: string; deadline: string; replied?: string },
): string {
  return args.replied
    ? t("appealScaffold.refused", {
        ref: args.ref,
        filed: args.filed,
        replied: args.replied,
      })
    : t("appealScaffold.overdue", {
        ref: args.ref,
        filed: args.filed,
        deadline: args.deadline,
      });
}
