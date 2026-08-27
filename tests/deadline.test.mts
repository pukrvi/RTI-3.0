import test from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  appealWindow,
  daysBetween,
  replyClock,
} from "../src/lib/deadline.ts";

/**
 * The statutory clock, in isolation. Run with `npm run test:clock`.
 *
 * These are the two dates the live portal could compute today and does not, so
 * they are worth pinning down rather than eyeballing on a screen.
 */

const FILED = "2026-08-22T09:00:00.000Z";
const at = (iso: string) => new Date(iso);

test("30 days to reply, counted in IST calendar days", () => {
  const clock = replyClock(FILED, at(FILED));
  assert.equal(clock.daysLeft, 30);
  assert.equal(clock.state, "waiting");
  assert.equal(daysBetween(FILED, clock.deadline), 30);
});

test("the last five days are flagged, and the deadline day is 'due today'", () => {
  assert.equal(replyClock(FILED, at(addDays(FILED, 25))).state, "due-soon");
  assert.equal(replyClock(FILED, at(addDays(FILED, 30))).state, "due-today");
  assert.equal(replyClock(FILED, at(addDays(FILED, 31))).state, "overdue");
  assert.equal(replyClock(FILED, at(addDays(FILED, 31))).daysLeft, -1);
});

test("a reply stops the clock whenever it arrives", () => {
  const clock = replyClock(FILED, at(addDays(FILED, 40)), addDays(FILED, 12));
  assert.equal(clock.state, "replied");
});

test("silence cannot be appealed until the CPIO's last day has run out", () => {
  // Day 29: still waiting.
  assert.equal(appealWindow(FILED, at(addDays(FILED, 29))).isOpen, false);
  // Day 30 is the deadline itself — the reply is due, not late.
  assert.equal(appealWindow(FILED, at(addDays(FILED, 30))).isOpen, false);
  // Day 31: deemed refusal, the window is open.
  const open = appealWindow(FILED, at(addDays(FILED, 31)));
  assert.equal(open.isOpen, true);
  assert.equal(open.reason, "overdue");
  assert.equal(open.daysLeft, 29);
});

test("a reply can be appealed the day it arrives, for 30 days", () => {
  const replied = addDays(FILED, 10);
  const sameDay = appealWindow(FILED, at(replied), replied);
  assert.equal(sameDay.isOpen, true);
  assert.equal(sameDay.reason, "replied");
  assert.equal(sameDay.daysLeft, 30);

  assert.equal(appealWindow(FILED, at(addDays(replied, 30)), replied).isOpen, true);
  assert.equal(appealWindow(FILED, at(addDays(replied, 31)), replied).isOpen, false);
});

test("a late-evening IST filing does not lose a day", () => {
  // 23:30 IST on 22 August is 18:00 UTC — the naive UTC date is still the 22nd,
  // but an IST-unaware calculation would drift for filings after 18:30 UTC.
  const lateIST = "2026-08-22T19:30:00.000Z"; // 01:00 IST on the 23rd
  assert.equal(daysBetween(lateIST, addDays(lateIST, 30)), 30);
  assert.equal(replyClock(lateIST, at(lateIST)).daysLeft, 30);
});
