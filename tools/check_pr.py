"""Compile all three projects and compare errors and compiled files with the recorded measurement for this ref.

Ref `pr/<ID>`: errors must equal the line for <ID> in prs/measured-errors.txt, and each project's compiled files
must equal the recorded base set plus the PR's recorded additions and removals (prs/compiled-files.json).
Any other ref (main, feature branches): no errors, and exactly the recorded base set.

The answer key is read from git ref FIXTURE_ANSWER_REF when set (CI uses origin/main, so a PR cannot change its own
expected result); otherwise from the working tree.

Usage: FIXTURE_REF=<branch> [FIXTURE_ANSWER_REF=origin/main] python3 tools/check_pr.py
"""
import json, os, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from measure_prs import PROJECTS, compile_all, compiled_files  # noqa: E402


def answer_key(path):
    ref = os.environ.get("FIXTURE_ANSWER_REF")
    if not ref:
        return (ROOT / path).read_text()
    return subprocess.run(["git", "-C", str(ROOT), "show", f"{ref}:{path}"], capture_output=True, text=True, check=True).stdout


def recorded_errors(pr_id):
    for line in answer_key("prs/measured-errors.txt").splitlines():
        if re.match(rf"^{re.escape(pr_id)}\s", line):
            return sorted(re.findall(r"\S+:\d+ TS\d+", line))
    return None


def expected_scope(pr_id):
    scope = json.loads(answer_key("prs/compiled-files.json"))
    expected = {p: set(files) for p, files in scope["base"].items()}
    for p, d in scope["delta"].get(pr_id, {}).items() if pr_id else []:
        expected[p] = (expected[p] | set(d["add"])) - set(d["remove"])
    return expected


def main():
    os.chdir(ROOT)
    ref = os.environ.get("FIXTURE_REF", "")
    m = re.fullmatch(r"pr/([A-Z]+[0-9]+)", ref)
    pr_id = m.group(1) if m else None
    label = pr_id or ref or "(no ref)"
    expected = recorded_errors(pr_id) if pr_id else []
    if expected is None:
        print(f"{label}: no recorded measurement in prs/measured-errors.txt")
        return 1
    tsc = str(ROOT / "node_modules" / ".bin" / "tsc")
    found, raw = compile_all(ROOT, tsc)
    got = sorted(f"{f}:{l} {c}" for f, l, c in found)
    scope, want_scope = compiled_files(ROOT, tsc), expected_scope(pr_id)
    for p in PROJECTS:
        if p not in want_scope:
            print(f"{label}: the answer key records no compiled files for project {p}")
            want_scope[p] = set()
    print(f"{label}: answer key from {os.environ.get('FIXTURE_ANSWER_REF') or 'working tree'}")
    print(f"{label}: compiled files " + ", ".join(f"{p} {len(scope[p])} (expected {len(want_scope[p])})" for p in PROJECTS))
    scope_ok = all(scope[p] and set(scope[p]) == want_scope[p] for p in PROJECTS)
    for p in PROJECTS:
        for f in sorted(want_scope[p] - set(scope[p])):
            print(f"{label}:   {p}: not compiled but expected: {f}")
        for f in sorted(set(scope[p]) - want_scope[p]):
            print(f"{label}:   {p}: compiled but not expected: {f}")
    errors_ok = got == expected and raw == len(found)
    print(f"{label}: expected errors {', '.join(expected) or 'none'}")
    print(f"{label}: got errors      {', '.join(got) or 'none'} (raw error count {raw})")
    ok = errors_ok and scope_ok
    print(f"{label}: {'match' if ok else 'MISMATCH'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
