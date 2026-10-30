"""Render the PR index (PRS.md) and PR descriptions from prs/*.json, prs/expect.json, prs/measured-errors.txt.

Usage:
  python3 tools/render_prs.py index                                   -> writes PRS.md
  python3 tools/render_prs.py body <ID> --base <sha> --head <sha>     -> PR description on stdout
                                                                         (changed lines from `git diff` in this repo)
"""
import json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PRS = ROOT / "prs"
CATEGORIES = {"A": "Kinds of change", "B": "Every construct", "DOC": "Documentation", "C": "File level",
              "D": "Encoding and robustness", "M": "Multi-file changes", "S": "Semantic impact", "R": "React"}
PUBLISHED_AS = {"B02": "S8", "DOC03": "S11", "DOC18": "S9", "DOC19": "S10"}
TOOLCHAIN = "TypeScript 7.0.2 (`tsc -p .`, `tsc -p legacy`, `tsc -p packages/web`, `tsc -p packages/shared`)"


def load():
    specs = {}
    for f in sorted(PRS.glob("*.json")):
        data = json.loads(f.read_text())
        if isinstance(data, list):          # PR edit sets only (not expect.json / compiled-files.json)
            for pr in data:
                specs[pr["id"]] = dict(pr, source=f"prs/{f.name}")
    expect = json.loads((PRS / "expect.json").read_text())
    errors = {}
    for line in (PRS / "measured-errors.txt").read_text().splitlines():
        m = re.match(r"^(\S+)\s", line)
        if m and m.group(1) in specs:
            errors[m.group(1)] = re.findall(r"(\S+:\d+ TS\d+)", line)
    return specs, expect, errors


def category(pr_id):
    m = re.match(r"^[A-Z]+", pr_id)
    assert m, pr_id
    return m.group(0)


def ops_of(pr):
    return pr.get("ops") or [{"op": "replace", "file": pr["file"], "old": pr["old"], "new": pr["new"]}]


def code(s):
    return "`" + s.replace("`", "ˋ") + "`" if "`" in s else f"`{s}`"


def render_change(pr):
    out = []
    for op in ops_of(pr):
        kind = op["op"]
        if kind == "replace":
            out.append(f"`{op['file']}`")
            lines = [f"-{l}" for l in op["old"].rstrip("\n").split("\n")] if op["old"] else []
            lines += [f"+{l}" for l in op["new"].rstrip("\n").split("\n")] if op["new"] else []
            body = "\n".join(lines).replace("\r", "␍").replace("﻿", "<BOM>").replace("\t", "→   ")
            out.append("```diff\n" + body + "\n```")
        elif kind == "create" and "generate" in op:
            out.append(f"Create `{op['file']}` with {op['generate']['functions']:,} generated functions (`f0` … `f{op['generate']['functions'] - 1}`).")
        elif kind == "create" and "content_b64" in op:
            out.append(f"Create binary file `{op['file']}`.")
        elif kind == "create":
            content = op["content"]
            out.append(f"Create `{op['file']}`" + (" (empty file)." if not content else ":"))
            if content:
                out.append("```ts\n" + content.rstrip("\n") + "\n```")
        elif kind == "delete":
            out.append(f"Delete `{op['file']}`.")
        elif kind == "rename":
            out.append(f"Rename `{op['from']}` → `{op['to']}`.")
    return "\n\n".join(out)


def changed_lines(base, head):
    diff = subprocess.run(["git", "-C", str(ROOT), "diff", "--unified=0", "-M", "--no-color", base, head],
                          capture_output=True, text=True, check=True).stdout
    rows, current = [], {}
    for line in diff.splitlines():
        if line.startswith("diff --git"):
            current = {"file": line.split(" b/", 1)[1], "status": "modified", "removed": [], "added": [], "from": None}
            rows.append(current)
        elif line.startswith("new file mode"):
            current["status"] = "added"
        elif line.startswith("deleted file mode"):
            current["status"] = "deleted"
        elif line.startswith("rename from "):
            current["status"], current["from"] = "renamed", line[len("rename from "):]
        elif line.startswith("Binary files"):
            current["status"] += " (binary)"
        elif line.startswith("@@"):
            m = re.match(r"@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@", line)
            assert m, line
            a, b, c, d = int(m.group(1)), int(m.group(2) or 1), int(m.group(3)), int(m.group(4) or 1)
            if b:
                current["removed"].append((a, a + b - 1))
            if d:
                current["added"].append((c, c + d - 1))
    return rows


def ranges(rs):
    return ", ".join(f"{a}" if a == b else f"{a}–{b}" for a, b in rs) or "—"


def render_body(pr_id, base, head):
    specs, expect, errors = load()
    pr, e = specs[pr_id], expect[pr_id]
    cat = category(pr_id)
    out = [f"**Category:** {cat} — {CATEGORIES[cat]} · **Primary file:** `{e['primaryFile']}`", ""]
    also = [k for k, v in PUBLISHED_AS.items() if v == pr_id]
    if also:
        out += [f"This PR also serves as fixture case {', '.join(also)} (identical edit).", ""]
    out += ["## What this PR tests", "", e["tests"], "", "**Focus:** " + "; ".join(e["rules"]) + ". Rule and flag definitions: `FIXTURES.md` → Classification rules.", ""]
    out += ["## The change", "", render_change(pr), ""]
    out += ["## Expected output", "", "**Summary an agent should receive**", "", e["optimal"], ""]
    if e["components"]:
        out += ["**Changed components**", "", "| Component | Kind | Container | File | Change | Flags | Detail |", "|---|---|---|---|---|---|---|"]
        for comp in e["components"]:
            cont = " › ".join(code(x) for x in comp["container"]) or "—"
            flags = ", ".join(comp["flags"]) or "—"
            out.append(f"| {code(comp['component'])} | {comp['kind']} | {cont} | `{comp['file']}` | {comp['change']} | {flags} | {comp['detail'] or '—'} |")
        out.append("")
    else:
        out += ["**Changed components:** none — this PR has only file-level changes.", ""]
    if e["unchanged"]:
        out += ["**Must not be reported as changed:** " + ", ".join(code(u) for u in e["unchanged"]), ""]
    if e["fileLevel"]:
        out += ["**File-level changes**", "", "| File | Change | Detail |", "|---|---|---|"]
        for f in e["fileLevel"]:
            out.append(f"| `{f['file']}` | {f['change']} | {f['detail'] or '—'} |")
        out.append("")
    errs = errors.get(pr_id, [])
    out += [f"**Compiler errors on this PR** — {TOOLCHAIN}, base has zero errors:", ""]
    out += [f"- `{x.split(' ')[0]}` {x.split(' ')[1]}" for x in errs] if errs else ["- none"]
    out.append("")
    if e["references"]:
        out += ["**References on the base** — measured with the TypeScript 7.0.2 API (`getReferencedSymbolsForNode`):", ""]
        for r in e["references"]:
            out.append(f"- {code(r['symbol'])}: " + "; ".join(r["measuredOnBase"]))
            if r.get("note"):
                out.append(f"  - {r['note']}")
        out.append("")
    if e["notes"]:
        out += ["**Notes**", ""] + [f"- {n}" for n in e["notes"]] + [""]
    out += ["## Changed lines", "", "| File | Status | Base lines removed | Head lines added |", "|---|---|---|---|"]
    for row in changed_lines(base, head):
        status = row["status"] + (f" from `{row['from']}`" if row["from"] else "")
        out.append(f"| `{row['file']}` | {status} | {ranges(row['removed'])} | {ranges(row['added'])} |")
    out += ["", "---", "",
            f"Base: `{base}` · Head: `{head}` · Fixture ID: `{pr_id}` · Edit: `{pr['source']}` · Expectations: `prs/expect.json`", "",
            f"Reproduce on this branch: `npm ci --ignore-scripts && FIXTURE_REF=pr/{pr_id} python3 tools/check_pr.py`", "",
            f"Ran: {TOOLCHAIN} on this head commit (`tools/check_pr.py`: errors match the list above); reference lists measured on the base with the TypeScript 7.0.2 API.",
            "Not run: the analysis pipeline under test. Expected components, flags and the summary follow the classification rules in `FIXTURES.md`; they are specifications, not measurements."]
    return "\n".join(out) + "\n"


def render_index():
    specs, expect, errors = load()
    out = ["# PR index", "", "Generated by `tools/render_prs.py index` from `prs/*.json`, `prs/expect.json` and `prs/measured-errors.txt`.", "",
           "Branch for each PR: `pr/<ID>`. Compiler errors: " + TOOLCHAIN + "; the base has zero errors.", "",
           "Not published separately (identical edits): " + ", ".join(f"{k} → {v}" for k, v in PUBLISHED_AS.items()) + ".", ""]
    for cat, name in CATEGORIES.items():
        ids = [i for i in expect if category(i) == cat]
        ids.sort(key=lambda i: int(re.sub(r"^[A-Z]+", "", i)))
        out += [f"## {cat} — {name} ({len(ids)})", "", "| ID | Change | Expected | Compiler errors |", "|---|---|---|---|"]
        for i in ids:
            errs = ", ".join(f"`{x.split(' ')[0]}` {x.split(' ')[1]}" for x in errors.get(i, [])) or "none"
            optimal = expect[i]["optimal"].replace("|", "\\|")
            out.append(f"| {i} | {specs[i]['title']} | {optimal} | {errs} |")
        out.append("")
    (ROOT / "PRS.md").write_text("\n".join(out))
    print("PRS.md:", sum(1 for _ in expect), "PRs")


if __name__ == "__main__":
    if sys.argv[1] == "index":
        render_index()
    else:
        args = sys.argv[2:]
        pr_id = args[0]
        base = args[args.index("--base") + 1]
        head = args[args.index("--head") + 1]
        sys.stdout.write(render_body(pr_id, base, head))
