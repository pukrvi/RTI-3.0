/**
 * One reading of an account, shared by every screen inside it.
 *
 * The live portal's dashboard shows six numbers — Registered, Disposed of and
 * Pending, once for requests and once for appeals — and nothing else. No dates,
 * no ordering by urgency, no marker on the one filing that is about to breach
 * thirty days. Those buckets are kept here because citizens who have used the
 * portal know them, but a seventh number is computed alongside: how many
 * filings need the citizen to do something. That is the number the six do not
 * contain, and it is the only one worth looking at first.
 */
import { caseAuthorityLabel } from "@/lib/case";
import {
  appealWindow,
  effectiveNow,
  replyClock,
  type AppealWindow,
  type ReplyClock,
} from "@/lib/deadline";
import { listForAccount, type CaseFile } from "@/lib/store";

export type ItemState = "waiting" | "due-soon" | "due-today" | "overdue" | "replied";

export interface AccountItem {
  file: CaseFile;
  /** The public authority's display name in the citizen's language, if known. */
  authority: string;
  clock: ReplyClock;
  window: AppealWindow;
  state: ItemState;
  /**
   * Something is waiting on the citizen: a reply to read, a deadline that has
   * passed, or an appeal window running out. Never true while the CPIO still
   * has time on the clock.
   */
  needsAction: boolean;
}

export interface AccountCounts {
  requests: { registered: number; disposed: number; pending: number };
  appeals: { registered: number; disposed: number; pending: number };
  needsAction: number;
}

export interface AccountView {
  items: AccountItem[];
  counts: AccountCounts;
}

/** Filings that can still be appealed, newest first. Withdrawn requests can
 *  never be appealed. */
export function appealable(items: AccountItem[]): AccountItem[] {
  return items.filter((i) => i.window.isOpen && !i.file.appeal && !i.file.deleted);
}

export async function loadAccount(
  contact: string,
  locale: string,
): Promise<AccountView> {
  const files = (await listForAccount(contact)).filter((f) => f.filed);

  const items: AccountItem[] = files.map((file) => {
    const now = effectiveNow(file.clockOffsetDays);
    const clock = replyClock(file.filed!.at, now, file.reply?.at);
    const window = appealWindow(file.filed!.at, now, file.reply?.at);

    const state: ItemState = clock.state;
    const needsAction =
      !file.appeal &&
      !file.deleted &&
      (state === "replied" || state === "overdue" || window.isOpen);

    return {
      file,
      authority: caseAuthorityLabel(file, locale),
      clock,
      window,
      state,
      needsAction,
    };
  });

  // Most recently filed first. The portal sorts by receipt date too, but
  // ascending, so the thing you filed this morning is on page three.
  items.sort((a, b) => (a.file.filed!.at < b.file.filed!.at ? 1 : -1));

  const requests = items;
  const appeals = items.filter((i) => i.file.appeal);

  return {
    items,
    counts: {
      requests: {
        registered: requests.length,
        // "Disposed of" on the portal means the authority has finished with it:
        // a reply of any kind, including a refusal. A request the applicant
        // withdrew sits in Registered only, like a returned request.
        disposed: requests.filter((i) => i.state === "replied").length,
        pending: requests.filter((i) => i.state !== "replied" && !i.file.deleted).length,
      },
      appeals: {
        registered: appeals.length,
        disposed: 0,
        pending: appeals.length,
      },
      needsAction: items.filter((i) => i.needsAction).length,
    },
  };
}
