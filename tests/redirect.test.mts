import test from "node:test";
import assert from "node:assert/strict";
import { safeNext, safeOffset } from "../src/lib/redirect.ts";

/**
 * The `next` field on the preference forms is attacker-controllable, so it gets
 * the same treatment as any other untrusted input.
 */

test("an ordinary internal path is kept", () => {
  assert.equal(safeNext("/en/track/abc", "en"), "/en/track/abc");
  assert.equal(safeNext("/hi/authorities?scope=central", "hi"), "/hi/authorities?scope=central");
});

test("anything that leaves this site is discarded", () => {
  for (const hostile of [
    "//evil.example",
    "/\\evil.example", // browsers normalise the backslash, making it scheme-relative
    "/\\/evil.example",
    "https://evil.example",
    "javascript:alert(1)",
    "en/track",
    "",
  ]) {
    assert.equal(safeNext(hostile, "en"), "/en", `should have rejected ${hostile}`);
  }
});

test("the demo clock offset is a bounded integer", () => {
  assert.equal(safeOffset("7"), 7);
  assert.equal(safeOffset("-3"), -3);
  assert.equal(safeOffset("not a number"), 0);
  assert.equal(safeOffset(""), 0);
  assert.equal(safeOffset("Infinity"), 0);
  assert.equal(safeOffset("99999"), 365);
  assert.equal(safeOffset("-99999"), -365);
});
