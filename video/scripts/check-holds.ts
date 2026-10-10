// The readability checker for KEY LIGHT (V6). Recomputes v6/V1-DIRECTION.md section 7 from the text manifest
// and the registry, without rendering a frame: minimum holds by kind and word count, units, the two-block rule,
// 15 f between units, settle before cuts, 30 f after hits, the eighth-note test, breath gaps, the quiet share,
// the character and line limits, the minimum sizes, the end card, the bed's silences, and two greps over src/v6
// (the company and product names; em dashes). Exits non-zero on any violation. Run: npm run check:v6
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { V6_SCENES } from "../src/v6/registry";
import { MANIFEST, actualHold, linesOf, minSize, requiredHold, unitOf, wordsOf, type BlockSpec } from "../src/v6/text-manifest";
import { V6_HITS, V6_SECTIONS, V6_SILENCES, V6_TOTAL, V6_CHORD, sectionOf } from "../src/v6/timeline";
import { MAX_CHARS, MAX_CHARS_TOKEN_PATH } from "../src/v6/tokens";

const here = path.dirname(fileURLToPath(import.meta.url));
const V6_DIR = path.resolve(here, "../src/v6");

const violations: string[] = [];
const notes: string[] = [];
const fail = (s: string) => violations.push(s);

type G = BlockSpec & { gEnter: number; gExit: number; gLandings: number[]; unitKey: string };
const blocks: G[] = [];
for (const s of V6_SECTIONS) {
  const ch = V6_SCENES[s.id];
  for (const b of ch.blocks) {
    if (b.chapter !== s.id) fail(`${s.id}: block ${b.id} is registered for ${b.chapter} but exported by ${s.id}`);
    blocks.push({
      ...b,
      gEnter: s.from + b.enterDone,
      gExit: s.from + b.exitStart,
      gLandings: (b.landings ?? []).map((l) => s.from + l),
      unitKey: unitOf(b),
    });
  }
  for (const m of MANIFEST.filter((m) => m.chapter === s.id)) {
    if (!ch.blocks.includes(m)) fail(`${s.id}: block ${m.id} is in the manifest but not in the chapter's exported blocks`);
  }
}

// 1. Holds, limits, sizes, the eighth-note test.
const rows: string[][] = [["block", "ch", "kind", "W", "min", "enter", "exit", "actual", "pass"]];
for (const b of blocks) {
  const w = wordsOf(b);
  const min = requiredHold(b);
  const act = actualHold(b);
  const ok = act >= min;
  if (!ok) fail(`${b.chapter} ${b.id} "${b.text.split("\n")[0]}": holds ${act} f, needs ${min} f (${b.kind}, ${w} words)`);
  rows.push([b.id, b.chapter, b.kind, String(w), String(min), String(b.gEnter), String(b.gExit), String(act), ok ? "yes" : "NO"]);

  const lines = linesOf(b);
  const multi = b.kind === "list" || b.kind === "contact";
  if (!multi && lines.length > 2) fail(`${b.chapter} ${b.id}: ${lines.length} lines (max 2)`);
  if (b.kind === "contact" && lines.length !== 4) fail(`${b.chapter} ${b.id}: the contact block has ${lines.length} lines (4)`);
  for (const l of lines) {
    const single = b.lineException && !/\s/.test(l.trim());
    const max = single ? MAX_CHARS_TOKEN_PATH : MAX_CHARS;
    if (l.length > max) fail(`${b.chapter} ${b.id}: line "${l}" is ${l.length} chars (max ${max})`);
  }
  if (b.size < minSize(b.kind)) fail(`${b.chapter} ${b.id}: ${b.size} px is under the ${b.kind} minimum of ${minSize(b.kind)} px`);
  for (const g of [b.gEnter, ...b.gLandings]) {
    if (g % 18 === 9) fail(`${b.chapter} ${b.id}: lands on global frame ${g}, an eighth (9 mod 18)`);
  }
  if (b.exitStart <= b.enterDone) fail(`${b.chapter} ${b.id}: exitStart ${b.exitStart} is not after enterDone ${b.enterDone}`);
  const dur = sectionOf(b.chapter).dur;
  if (b.enterDone < 0 || b.exitStart > dur) fail(`${b.chapter} ${b.id}: frames ${b.enterDone}..${b.exitStart} fall outside the chapter (0..${dur})`);
  if (/\u2014/.test(b.text)) fail(`${b.chapter} ${b.id}: em dash in the text`);
}

// 2. Units: the two-block rule per frame, and 15 f between landings of different units.
const unitsReadableAt = (g: number) => new Set(blocks.filter((b) => g >= b.gEnter && g < b.gExit).map((b) => b.unitKey));
{
  let worst = 0;
  let worstAt = -1;
  const edges = [...new Set(blocks.flatMap((b) => [b.gEnter, b.gExit]))].sort((a, b) => a - b);
  for (const g of edges) {
    const n = unitsReadableAt(g).size;
    if (n > worst) {
      worst = n;
      worstAt = g;
    }
    if (n > 2) fail(`frame ${g}: ${n} readable blocks (${[...unitsReadableAt(g)].join(", ")}); the limit is two`);
  }
  notes.push(`most blocks readable at once: ${worst}${worstAt >= 0 ? ` (at ${worstAt})` : ""}`);
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i];
      const b = blocks[j];
      if (a.unitKey === b.unitKey) continue;
      const gap = Math.abs(a.gEnter - b.gEnter);
      if (gap < 15) fail(`${a.chapter} ${a.id} and ${b.chapter} ${b.id} land ${gap} f apart (different units need 15 f)`);
    }
  }
}

// 3. Settle before cuts (15 f) and after hits (30 f).
const landings = blocks.flatMap((b) => [b.gEnter, ...b.gLandings].map((g) => ({ g, who: `${b.chapter} ${b.id}` })));
const cuts = [...V6_SECTIONS.slice(1).map((s) => s.from), ...V6_HITS, V6_CHORD];
for (const cut of cuts) {
  for (const l of landings) {
    if (l.g >= cut - 15 && l.g < cut) fail(`${l.who} lands at ${l.g}, inside the 15 f settle before the cut at ${cut}`);
  }
}
for (const hit of V6_HITS) {
  for (const l of landings) {
    if (l.g >= hit && l.g < hit + 30) fail(`${l.who} lands at ${l.g}, inside the 30 f after hit ${hit}`);
  }
}

// 4. Quiet windows: nothing lands inside one; the quiet share; breaths and their gaps.
type Win = { from: number; to: number; ch: string };
const quiet: Win[] = [];
for (const s of V6_SECTIONS) {
  for (const [a, b] of V6_SCENES[s.id].quiet) {
    if (a < 0 || b > s.dur || b <= a) fail(`${s.id}: quiet window [${a}, ${b}) is not inside the chapter (0..${s.dur})`);
    quiet.push({ from: s.from + a, to: s.from + b, ch: s.id });
  }
}
quiet.sort((a, b) => a.from - b.from);
for (const q of quiet) {
  for (const l of landings) {
    if (l.g > q.from && l.g < q.to) fail(`${l.who} lands at ${l.g}, inside the quiet window ${q.from}..${q.to} (${q.ch})`);
  }
}
const quietTotal = quiet.reduce((n, q) => n + (q.to - q.from), 0);
const share = quietTotal / V6_TOTAL;
if (share < 0.2) fail(`quiet share ${(share * 100).toFixed(1)} percent is under 20 percent`);
notes.push(`quiet: ${quietTotal} f of ${V6_TOTAL} (${(share * 100).toFixed(1)} percent)`);

const breaths = quiet.filter((q) => q.to - q.from >= 60 && unitsReadableAt(q.from).size <= 1 && unitsReadableAt(q.to - 1).size <= 1);
{
  let prevEnd = 0;
  for (const b of breaths) {
    const gap = b.from - prevEnd;
    if (gap > 750) fail(`${(gap / 30).toFixed(1)} s without a breath between ${prevEnd} and ${b.from} (at most 25 s)`);
    prevEnd = Math.max(prevEnd, b.to);
  }
  if (V6_TOTAL - prevEnd > 750) fail(`${((V6_TOTAL - prevEnd) / 30).toFixed(1)} s without a breath after ${prevEnd}`);
  notes.push(`breaths: ${breaths.length} windows of 60 f or more with at most one block`);
}

// 5. The end card: the last display unit of chapter 8 holds 8 s or more.
{
  const c8 = blocks.filter((b) => b.chapter === "C8");
  if (c8.length === 0) notes.push("end card: chapter 8 has no blocks yet (stub)");
  else {
    const disp = c8.filter((b) => b.kind === "display").sort((a, b) => b.gEnter - a.gEnter)[0];
    if (!disp) fail("chapter 8 has no display block for the end card");
    else if (actualHold(disp) < 240) fail(`end card ${disp.id} holds ${actualHold(disp)} f (8 s = 240 f)`);
  }
}

// 6. Cues: silences stay silent; at most three SFX start on one frame.
{
  const cues = V6_SECTIONS.flatMap((s) => V6_SCENES[s.id].cues.map((c) => ({ ...c, g: s.from + c.f, ch: s.id })));
  for (const c of cues) {
    for (const [a, b] of V6_SILENCES) {
      if (c.g >= a && c.g < b) fail(`${c.ch}: cue ${c.sfx} at ${c.g} starts inside the silence ${a}..${b}`);
    }
    if (c.vol === undefined) fail(`${c.ch}: cue ${c.sfx} at ${c.g} has no vol (the default 0.7 is never used)`);
  }
  const perFrame = new Map<number, number>();
  for (const c of cues) perFrame.set(c.g, (perFrame.get(c.g) ?? 0) + 1);
  for (const [g, n] of perFrame) if (n > 3) fail(`frame ${g}: ${n} SFX start together (at most three)`);
  notes.push(`cues: ${cues.length}`);
}

// 7. Greps over src/v6: the company and product names; em dashes.
const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const NAME_RE = /miniorange|mods|xecurify|\bUEM\b|\bIAM\b|\bPAM\b|\bIGA\b|\bITDR\b/i;
for (const file of walk(V6_DIR)) {
  const rel = path.relative(path.resolve(here, ".."), file);
  if (NAME_RE.test(rel)) fail(`${rel}: the file name matches the banned-name regex`);
  const text = fs.readFileSync(file, "utf8");
  text.split("\n").forEach((line, i) => {
    if (NAME_RE.test(line)) fail(`${rel}:${i + 1}: banned name: ${line.trim().slice(0, 80)}`);
    if (/\u2014/.test(line)) fail(`${rel}:${i + 1}: em dash: ${line.trim().slice(0, 80)}`);
  });
}

// Report.
const widths = rows[0].map((_, c) => Math.max(...rows.map((r) => r[c].length)));
console.log(`KEY LIGHT check: ${blocks.length} blocks, ${V6_TOTAL} f\n`);
for (const r of rows) console.log(r.map((cell, c) => cell.padEnd(widths[c])).join("  "));
console.log("");
for (const n of notes) console.log(`note: ${n}`);
if (violations.length) {
  console.log(`\n${violations.length} violation${violations.length === 1 ? "" : "s"}:`);
  for (const v of violations) console.log(`  - ${v}`);
  process.exit(1);
}
console.log("\nno violations");
