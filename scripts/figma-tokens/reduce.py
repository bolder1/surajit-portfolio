#!/usr/bin/env python3
"""
reduce.py — turn a Figma metadata dump into lib/designSystem/figmaData.ts.

The design system case study quotes a lot of numbers. None of them are typed
by hand; they come out of the published Figma files and through this script,
so re-running it after the system changes updates the prose instead of leaving
the page describing a system that no longer exists.

    Stage 1 (manual, needs Figma auth)
        Call the Figma MCP `get_metadata` on each documentation page and save
        the raw result. The tool returns JSON of the form
        [{"type": "text", "text": "<canvas …>…</canvas>"}].

          Tokens file  V2qdpU2nsj5VnWIN2EJXkH   node 80:1065
          Components   AUdlDvbPYr1eMPM6SM7IPT   nodes 0:1 (Button), 129:1052 (icons)

    Stage 2 (this script)
        python3 scripts/figma-tokens/reduce.py parse  <dump.json>  > variables.json
        python3 scripts/figma-tokens/reduce.py emit   variables.json > \\
            lib/designSystem/figmaData.ts

`variables.json` is checked in alongside this file as the snapshot the current
page was built from, so `emit` can be re-run without Figma access and a diff
against a fresh `parse` shows exactly what drifted.

Why parse the *documentation frames* rather than call the variables REST API:
the documentation frames are what the team actually reads, so anything this
script can see is something a designer can see too. If the two ever disagree,
the page is wrong in the same way the team's shared understanding is wrong —
which is the more useful failure.
"""

import collections
import json
import re
import sys

# The five documentation frames, keyed by node id. Names are the collection
# names as they appear in Figma, misspellings included.
FRAMES = {
    "526:182": "global-tokens-A",
    "526:5289": "global-tokens-B",
    "526:8075": "global-extra",
    "501:21114": "Theme",
    "502:22929": "Mode",
}

# Every documentation row renders the same way; these are the layer names the
# generator plugin emits, and they are what the parser keys on.
VALUE_PREFIX = "Value Container-"
ALIAS_ARROW = "↖︎"  # the ↖︎ in the alias badge
NOISE = {
    "Simple Color Container",
    "Color Swatch",
    "Alias Badge",
    "Alias Text Container",
}


def load(path):
    """Flatten the MCP tool result into one XML-ish string."""
    blob = json.load(open(path))
    return "".join(x["text"] for x in blob if x.get("type") == "text")


def rows_by_frame(text):
    """Group every named layer under the documentation frame that contains it."""
    out = {label: [] for label in FRAMES.values()}
    current = None
    for line in text.split("\n"):
        indent = len(line) - len(line.lstrip())
        ident = re.search(r'id="([^"]+)"', line)
        # Depth 2 is a direct child of the canvas — one of the doc frames.
        if indent == 2 and ident:
            current = FRAMES.get(ident.group(1))
            continue
        if current is None:
            continue
        name = re.search(r'name="([^"]+)"', line)
        if name:
            out[current].append((indent, name.group(1)))
    return out


def split_rows(layers):
    """Cut a frame's layer list into `Row-<token>` groups."""
    grouped, token, leaves = [], None, []
    for _indent, name in layers:
        if name.startswith("Row-"):
            if token is not None:
                grouped.append((token, leaves))
            token, leaves = name[4:], []
        elif token is not None:
            leaves.append(name)
    if token is not None:
        grouped.append((token, leaves))
    return grouped


def parse_modes(leaves):
    """Read one row's per-mode value, following the alias badge when present."""
    marks = [(i, n) for i, n in enumerate(leaves) if n.startswith(VALUE_PREFIX)]
    modes = {}
    for j, (i, name) in enumerate(marks):
        mode = name[len(VALUE_PREFIX) :]
        end = marks[j + 1][0] if j + 1 < len(marks) else len(leaves)
        segment = leaves[i + 1 : end]
        alias = value = None
        if "Alias Badge" in segment:
            # ['Alias Badge', ('Color Swatch')?, 'Alias Text Container',
            #  '↖︎', <alias>, '•', <resolved value>]
            if ALIAS_ARROW in segment:
                k = segment.index(ALIAS_ARROW)
                alias = segment[k + 1]
                if "•" in segment[k:]:
                    dot = segment.index("•", k)
                    value = segment[dot + 1] if dot + 1 < len(segment) else None
        else:
            plain = [s for s in segment if s not in NOISE]
            value = plain[-1] if plain else None
        modes[mode] = {"alias": alias, "value": value}
    return modes


def cmd_parse(path):
    text = load(path)
    frames = rows_by_frame(text)
    data = {}
    for label, layers in frames.items():
        data[label] = [
            {"token": token, "modes": parse_modes(leaves)}
            for token, leaves in split_rows(layers)
        ]
    for label, rows in data.items():
        missing = [
            r["token"]
            for r in rows
            if not r["modes"] or any(m["value"] is None for m in r["modes"].values())
        ]
        print(
            f"{label:18} rows={len(rows):4} unresolved={len(missing)}",
            file=sys.stderr,
        )
        if missing:
            print(f"    {missing[:5]}", file=sys.stderr)
    json.dump(data, sys.stdout, indent=1)


def q(s):
    return json.dumps(s, ensure_ascii=False)


def step_key(entry):
    """Sort a ramp: solid steps ascending, then the alpha steps."""
    step = entry[0]
    m = re.match(r"a?(\d+)", step)
    return (step.startswith("a"), int(m.group(1)) if m else 0)


def cmd_emit(path):
    v = json.load(open(path))
    theme = {r["token"]: r["modes"] for r in v["Theme"]}

    palette = collections.defaultdict(list)
    for row in v["global-tokens-A"]:
        parts = row["token"].split("/")  # _global-colors/Group/Family/Step
        if len(parts) == 4:
            palette[f"{parts[1]}/{parts[2]}"].append(
                (parts[3], row["modes"]["Mode 1"]["value"])
            )
    for fam in palette:
        palette[fam].sort(key=step_key)

    scales = collections.defaultdict(list)
    for row in v["global-extra"]:
        group, rest = row["token"].split("/", 1)
        m = row["modes"]["Mode 1"]
        scales[group].append((rest, m["alias"], m["value"]))

    routed, direct, raw = [], [], []
    for row in v["Mode"]:
        alias = row["modes"]["onLight"]["alias"]
        if alias is None:
            raw.append(row["token"])
        elif alias in theme:
            routed.append(row["token"])
        else:
            direct.append(row["token"])

    w = sys.stdout.write
    w(HEADER)

    w("/** The five variable collections, with the mode axis each one owns. */\n")
    w("export const COLLECTIONS = [\n")
    for name, label, key, note, order in COLLECTION_META:
        seen = {m for r in v[key] for m in r["modes"]}
        # Declared order, not alphabetical: `onLight` before `onDark` is the
        # reading order of the whole page, and a generator that reorders the
        # modes on every run makes the diff useless.
        modes = [m for m in order if m in seen] + sorted(seen - set(order))
        w(
            f"  {{ name: {q(name)}, label: {q(label)}, count: {len(v[key])}, "
            f"modes: {json.dumps(modes)}, note: {q(note)} }},\n"
        )
    w("] as const;\n\n")

    w("/** All primitive colour families, every step, exactly as published. */\n")
    w(
        "export const PALETTE: { family: string; steps: { step: string; hex: string }[] }[] = [\n"
    )
    for fam in sorted(palette):
        steps = "".join(
            f"{{ step: {q(s)}, hex: {q(h)} }}, " for s, h in palette[fam]
        )
        w(f"  {{ family: {q(fam)}, steps: [{steps}] }},\n")
    w("];\n\n")

    w("/** The Theme collection in full — brand roles across both brands. */\n")
    w("export const THEME_ROWS: ThemeRow[] = [\n")
    for row in v["Theme"]:
        b, o = row["modes"]["Blue"], row["modes"]["Orange"]
        w(
            f"  {{ token: {q(row['token'])}, "
            f"Blue: {{ alias: {q(b['alias'])}, value: {q(b['value'])} }}, "
            f"Orange: {{ alias: {q(o['alias'])}, value: {q(o['value'])} }} }},\n"
        )
    w("];\n\n")

    w("/** The Mode tokens that route through Theme — the entire brand surface. */\n")
    w("export const ROUTED_TOKENS: ModeRow[] = [\n")
    for row in v["Mode"]:
        if row["token"] not in routed:
            continue
        l, d = row["modes"]["onLight"], row["modes"]["onDark"]
        w(
            f"  {{ token: {q(row['token'])}, "
            f"onLight: {{ alias: {q(l['alias'])}, value: {q(l['value'])} }}, "
            f"onDark: {{ alias: {q(d['alias'])}, value: {q(d['value'])} }} }},\n"
        )
    w("];\n\n")

    w(f"""/** How the {len(v['Mode'])} bindable tokens resolve. Computed, not asserted. */
export const RESOLUTION = {{
  total: {len(v['Mode'])},
  routed: {len(routed)},
  direct: {len(direct)},
  raw: {len(raw)},
  rawTokens: {json.dumps(raw)},
}} as const;

""")

    row = next(
        r for r in v["Mode"] if r["token"] == "interactive/background/primary/default"
    )
    w(CHAIN_DOC)
    w("export const CHAIN = {\n")
    w(f"  binding: {q(row['token'])},\n")
    w("  resolutions: [\n")
    for mode in ("onLight", "onDark"):
        mid = row["modes"][mode]["alias"]
        for brand in ("Blue", "Orange"):
            leaf = theme[mid][brand]
            w(
                f"    {{ mode: {q(mode)}, brand: {q(brand)}, via: {q(mid)}, "
                f"primitive: {q(leaf['alias'])}, hex: {q(leaf['value'])} }},\n"
            )
    w("  ],\n} as const;\n\n")

    w("/** The aliased scales — named steps pointing at size primitives. */\n")
    w(
        "export const SCALES: { group: string; items: { name: string; "
        "alias: string | null; value: string }[] }[] = [\n"
    )
    for group in ["spacing", "borderRadius", "borderWidth", "iconSize", "opacity"]:
        items = "".join(
            f"{{ name: {q(n)}, alias: {q(a)}, value: {q(val)} }}, "
            for n, a, val in scales[group]
        )
        w(f"  {{ group: {q(group)}, items: [{items}] }},\n")
    w("];\n")


COLLECTION_META = [
    (
        "_global-colors",
        "Primitives · colour",
        "global-tokens-A",
        "Raw hexes. No opinion about where they are used.",
        ["Mode 1"],
    ),
    (
        "_global-sizes",
        "Primitives · size",
        "global-tokens-B",
        "Raw numbers on a 2px grid. No opinion about what they measure.",
        ["Mode 1"],
    ),
    (
        "global-extra",
        "Aliased scales",
        "global-extra",
        "radius, spacing, borderWidth, iconSize, opacity, elevation — named steps pointing at size primitives.",
        ["Mode 1"],
    ),
    (
        "Theme",
        "Brand",
        "Theme",
        "The brand-owned roles. Two modes, one per brand.",
        ["Blue", "Orange"],
    ),
    (
        "Mode",
        "Appearance",
        "Mode",
        "What components actually bind to. Two modes, light and dark.",
        ["onLight", "onDark"],
    ),
]

HEADER = '''/**
 * figmaData — extracted from the live Figma libraries, not written by hand.
 *
 * GENERATED by scripts/figma-tokens/reduce.py. Do not edit; re-run the script.
 *
 * Every count, hex, alias and variant name in this file was read out of the
 * published files and reduced by script. Nothing here is illustrative. Where a
 * name is misspelled — `Aleart`, `Interective`, `Secondery`, `Tercery`,
 * `Netural` — it is misspelled in the library, and it is reproduced verbatim,
 * because a token name is an API and this case study is about what the system
 * actually is.
 *
 * Source files:
 *   Tokens            · V2qdpU2nsj5VnWIN2EJXkH
 *   Components        · AUdlDvbPYr1eMPM6SM7IPT
 *   IDP 1 Foundations · e9Y6cM1w7sQKrUifpOrPVZ
 *   IDP 2 Core        · nJkQ5zrJD6srYJLBnnfnIg
 *
 * Reduced from documentation frames dated 10/07/2025.
 */

export type Resolved = { alias: string | null; value: string };
export type ThemeRow = { token: string; Blue: Resolved; Orange: Resolved };
export type ModeRow = { token: string; onLight: Resolved; onDark: Resolved };

'''

CHAIN_DOC = '''/**
 * The multimapping, resolved end to end for one binding.
 *
 * A component binds ONE variable. Two independent collections then resolve it
 * against brand and appearance, so the single binding carries four values and
 * the component file contains none of them.
 */
'''


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ("parse", "emit"):
        print(__doc__, file=sys.stderr)
        return 2
    (cmd_parse if sys.argv[1] == "parse" else cmd_emit)(sys.argv[2])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
