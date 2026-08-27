#!/usr/bin/env python3
"""Merge translated part files into src/i18n/<locale>.json in en.json key order.

Usage: python3 scripts/merge-i18n.py <locale> <part-dir> [--partial]
Part files are named part1.json .. part4.json, or part.json for a single file.
Without --partial the merged result must cover exactly the en.json keys.
With --partial untranslated keys are simply omitted; getT falls back to English.
"""
import json, re, sys, os

app = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
en = json.load(open(os.path.join(app, "src/i18n/en.json")))
ph = lambda s: sorted(re.findall(r"\{\w+\}", s))

argv = [a for a in sys.argv[1:] if a != "--partial"]
partial = "--partial" in sys.argv
locale, part_dir = argv[0], argv[1]
merged = {}
names = ["part.json"] if os.path.isfile(os.path.join(part_dir, "part.json")) else [f"part{i}.json" for i in range(1, 5)]
for name in names:
    path = os.path.join(part_dir, name)
    if not os.path.isfile(path):
        continue
    part = json.load(open(path))
    dupes = set(part) & set(merged)
    if dupes:
        sys.exit(f"{locale}: duplicate keys across parts: {sorted(dupes)[:5]}")
    merged.update(part)

extra = [k for k in merged if k not in en]
if extra:
    sys.exit(f"{locale}: extra={extra[:8]}")
missing = [k for k in en if k not in merged]
if missing and not partial:
    sys.exit(f"{locale}: missing={missing[:8]}")

bad = []
for k, v in en.items():
    if k not in merged:
        continue
    if ph(v) != ph(merged[k]):
        bad.append(f"placeholder {k}")
    if (v == "") != (merged[k] == ""):
        bad.append(f"emptiness {k}")
if bad:
    sys.exit(f"{locale}: {bad[:12]}")

out = {k: merged[k] for k in en if k in merged}
path = os.path.join(app, "src/i18n", f"{locale}.json")
with open(path, "w") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"wrote {path} ({len(out)} keys)")
