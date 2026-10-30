"""Compile all three projects and compare the errors with the recorded measurement for this ref.

Ref `pr/<ID>`: errors must equal the line for <ID> in prs/measured-errors.txt.
Any other ref (main, feature branches): errors must be none.

Usage: FIXTURE_REF=<branch> python3 tools/check_pr.py
"""
import os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from measure_prs import compile_all  # noqa: E402


def recorded(pr_id):
    for line in (ROOT / "prs" / "measured-errors.txt").read_text().splitlines():
        if re.match(rf"^{re.escape(pr_id)}\s", line):
            return sorted(re.findall(r"\S+:\d+ TS\d+", line))
    return None


def main():
    os.chdir(ROOT)
    ref = os.environ.get("FIXTURE_REF", "")
    m = re.fullmatch(r"pr/([A-Z]+[0-9]+)", ref)
    if m:
        label, expected = m.group(1), recorded(m.group(1))
        if expected is None:
            print(f"{label}: no recorded measurement in prs/measured-errors.txt")
            return 1
    else:
        label, expected = ref or "(no ref)", []
    found, raw = compile_all(ROOT, str(ROOT / "node_modules" / ".bin" / "tsc"))
    got = sorted(f"{f}:{l} {c}" for f, l, c in found)
    ok = got == expected and raw == len(found)
    print(f"{label}: expected {', '.join(expected) or 'none'}")
    print(f"{label}: got      {', '.join(got) or 'none'} (raw error count {raw})")
    print(f"{label}: {'match' if ok else 'MISMATCH'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
