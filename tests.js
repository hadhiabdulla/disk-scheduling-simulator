"use strict";
/*
 * tests.js - unit tests for the disk scheduling algorithms in index.html
 *
 * Zero dependencies: run with Node 18+.
 *
 *     node tests.js
 *
 * The pure algorithm code lives between the === ALGOS START === and
 * === ALGOS END === markers in index.html. This file extracts that block
 * and exercises it directly, so the tests always run against the exact
 * code the browser runs.
 */

const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const block = html.match(/\/\* === ALGOS START === \*\/([\s\S]*?)\/\* === ALGOS END === \*\//);
if (!block) {
  console.error("FAIL: could not find the ALGOS markers in index.html");
  process.exit(1);
}
// Run the extracted block in a fresh function scope and take back what it defines.
const { fcfs, sstf, scan, cscan, look, clook, movement, narrate, ALGOS } =
  new Function(block[1] + "\nreturn { fcfs, sstf, scan, cscan, look, clook, movement, narrate, ALGOS };")();

/* ---------------- tiny test runner ---------------- */
let passed = 0, failed = 0;
function check(name, cond, detail) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL: " + name + (detail ? " -- " + detail : "")); }
}
function eq(name, got, want) {
  check(name, got === want, "got " + JSON.stringify(got) + ", want " + JSON.stringify(want));
}
function eqSeq(name, got, want) {
  check(name, JSON.stringify(got) === JSON.stringify(want),
    "got " + JSON.stringify(got) + ", want " + JSON.stringify(want));
}

/* The classic Silberschatz worked example:
   queue 98,183,37,122,14,124,65,67 - head at 53, disk 0..199 */
const Q = [98, 183, 37, 122, 14, 124, 65, 67];
const H = 53, M = 199;

/* ---------------- totals (both directions) ---------------- */
eq("FCFS total", fcfs(Q, H).total, 640);
eq("SSTF total", sstf(Q, H).total, 236);
eq("SCAN left total", scan(Q, H, M, "left").total, 236);
eq("SCAN right total", scan(Q, H, M, "right").total, 331);
eq("C-SCAN left total", cscan(Q, H, M, "left").total, 386);
eq("C-SCAN right total", cscan(Q, H, M, "right").total, 382);
eq("LOOK left total", look(Q, H, "left").total, 208);
eq("LOOK right total", look(Q, H, "right").total, 299);
eq("C-LOOK left total", clook(Q, H, "left").total, 326);
eq("C-LOOK right total", clook(Q, H, "right").total, 322);

/* ---------------- exact service orders ---------------- */
eqSeq("FCFS order", fcfs(Q, H).seq, [53, 98, 183, 37, 122, 14, 124, 65, 67]);
eqSeq("SSTF order", sstf(Q, H).seq, [53, 65, 67, 37, 14, 98, 122, 124, 183]);
eqSeq("SCAN left order", scan(Q, H, M, "left").seq, [53, 37, 14, 0, 65, 67, 98, 122, 124, 183]);
eqSeq("C-SCAN left order", cscan(Q, H, M, "left").seq, [53, 37, 14, 0, 199, 183, 124, 122, 98, 67, 65]);
eqSeq("LOOK left order", look(Q, H, "left").seq, [53, 37, 14, 65, 67, 98, 122, 124, 183]);
eqSeq("C-LOOK left order", clook(Q, H, "left").seq, [53, 37, 14, 183, 124, 122, 98, 67, 65]);

/* ---------------- every request served exactly once ---------------- */
const runners = {
  FCFS: (r, h) => fcfs(r, h),
  SSTF: (r, h) => sstf(r, h),
  SCAN: (r, h) => scan(r, h, M, "left"),
  "C-SCAN": (r, h) => cscan(r, h, M, "left"),
  LOOK: (r, h) => look(r, h, "left"),
  "C-LOOK": (r, h) => clook(r, h, "left"),
};
for (const [name, fn] of Object.entries(runners)) {
  const seq = fn(Q, H).seq;
  const served = seq.filter(c => Q.includes(c)).sort((a, b) => a - b);
  eqSeq(name + " serves every request exactly once", served, [...Q].sort((a, b) => a - b));
  check(name + " stays within the disk", seq.every(c => c >= 0 && c <= M),
    "seq out of range: " + JSON.stringify(seq));
  check(name + " starts at the head", seq[0] === H);
}

/* ---------------- edge cases ---------------- */
// A request sitting at a disk end must not create duplicate zero-distance steps.
eqSeq("SCAN: request at cylinder 0, no duplicate end step", scan([0, 50], 10, M, "left").seq, [10, 0, 50]);
eqSeq("SCAN: request at cylinder 199, no duplicate end step", scan([150, 199], 10, M, "right").seq, [10, 150, 199]);
eqSeq("C-SCAN: request at cylinder 0, no duplicate end step",
  cscan([0, 50], 10, M, "left").seq, [10, 0, 199, 50]);
// Empty queue: the head goes nowhere.
eqSeq("FCFS empty queue", fcfs([], H).seq, [H]);
eq("FCFS empty queue total", fcfs([], H).total, 0);
eq("SSTF empty queue total", sstf([], H).total, 0);
eq("LOOK empty queue total", look([], H, "left").total, 0);
// Duplicate requests are each served.
eqSeq("SSTF duplicate requests (nearest first)", sstf([10, 10, 12], H).seq.filter(c => c !== H), [12, 10, 10]);
// Single request.
eq("FCFS single request", fcfs([100], H).total, 47);
// movement() helper itself.
eq("movement basic", movement([53, 98, 37]), 106);

/* ---------------- narration smoke test ---------------- */
// No step of any algorithm may produce "undefined" or "NaN" text.
for (const [name, fn] of Object.entries(runners)) {
  const { seq } = fn(Q, H);
  let ok = true, bad = "";
  for (let i = 0; i < seq.length - 1; i++) {
    const s = narrate(name, Q, seq, M, i, "left");
    if (typeof s !== "string" || s.includes("undefined") || s.includes("NaN")) { ok = false; bad = s; break; }
  }
  check(name + " narration has no undefined/NaN", ok, bad);
}
// ALGOS table drives the UI: every entry must run.
for (const [name, a] of Object.entries(ALGOS)) {
  const r = a.fn(Q, H, M, "left");
  check("ALGOS[" + name + "] runs and returns a number total", typeof r.total === "number" && !Number.isNaN(r.total));
}

/* ---------------- summary ---------------- */
console.log(passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
