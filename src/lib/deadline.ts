/**
 * The statutory clock.
 *
 * Section 7(1) of the RTI Act, 2005 gives the CPIO 30 days to reply. Section 19(1)
 * gives the citizen 30 days from the decision — or from the date the reply was due,
 * where none came — to file a first appeal. Both dates are computable from data the
 * live portal already stores and neither is displayed anywhere on it.
 *
 * Every function here takes `now` explicitly so the demo clock, the server and the
 * tests all read the same code path. Nothing here reads the wall clock by itself.
 */

export const REPLY_DAYS = 30;
export const APPEAL_DAYS = 30;
/** Show the "running out" treatment at or below this many days left. */
export const DUE_SOON_DAYS = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Midnight IST for the calendar day an instant falls on, as a UTC timestamp. */
function startOfDayIST(iso: string | Date): number {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate());
}

export function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

/** Whole calendar days from `a` to `b`, IST. Negative when `b` is earlier. */
export function daysBetween(a: string | Date, b: string | Date): number {
  return Math.round((startOfDayIST(b) - startOfDayIST(a)) / DAY_MS);
}

/**
 * The date the demo is pretending it is. The stored timestamps never move; only
 * this does, and every screen that uses it says so out loud.
 */
export function effectiveNow(offsetDays = 0, realNow: Date = new Date()): Date {
  return new Date(realNow.getTime() + offsetDays * DAY_MS);
}

export type ReplyState = "waiting" | "due-soon" | "due-today" | "overdue" | "replied";

export interface ReplyClock {
  deadline: string;
  daysLeft: number;
  state: ReplyState;
}

export function replyClock(
  filedAt: string,
  now: Date,
  repliedAt?: string,
): ReplyClock {
  const deadline = addDays(filedAt, REPLY_DAYS);
  const daysLeft = daysBetween(now, deadline);
  if (repliedAt) return { deadline, daysLeft, state: "replied" };
  if (daysLeft < 0) return { deadline, daysLeft, state: "overdue" };
  if (daysLeft === 0) return { deadline, daysLeft, state: "due-today" };
  if (daysLeft <= DUE_SOON_DAYS) return { deadline, daysLeft, state: "due-soon" };
  return { deadline, daysLeft, state: "waiting" };
}

export interface AppealWindow {
  /** When the right to appeal arose: the reply date, or the missed deadline. */
  opened: string | null;
  closes: string | null;
  daysLeft: number;
  isOpen: boolean;
  /** Why the window is open — drives which ground is preselected. */
  reason: "none" | "overdue" | "replied";
}

export function appealWindow(
  filedAt: string,
  now: Date,
  repliedAt?: string,
): AppealWindow {
  const shut: AppealWindow = {
    opened: null,
    closes: null,
    daysLeft: 0,
    isOpen: false,
    reason: "none",
  };

  const opened = repliedAt ?? addDays(filedAt, REPLY_DAYS);
  const reason: AppealWindow["reason"] = repliedAt ? "replied" : "overdue";

  // A reply can be appealed the day it arrives. A silence cannot be appealed
  // until the CPIO's last day has actually run out — on the deadline date the
  // reply is still due, not late, so the window opens the following day.
  const gap = daysBetween(now, opened);
  if (repliedAt ? gap > 0 : gap >= 0) return shut;

  const closes = addDays(opened, APPEAL_DAYS);
  const daysLeft = daysBetween(now, closes);
  return { opened, closes, daysLeft, isOpen: daysLeft >= 0, reason };
}
