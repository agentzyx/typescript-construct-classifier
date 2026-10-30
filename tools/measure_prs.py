"""Apply each PR's operations in place, compile every project with tsc, restore, report new errors.

Usage: python3 tools/measure_prs.py <repo> <path-to-tsc> [--scope-out prs/compiled-files.json] prs/<set>.json [more sets...]

With --scope-out, also records each project's compiled source files on the base and every PR's exact difference from them.

A PR is {"id", "title", "ops": [...]} or the short form {"id", "title", "file", "old", "new"}.
Operations:
  {"op": "replace", "file", "old", "new"}           old must occur exactly once
  {"op": "create",  "file", "content"}              text file
  {"op": "create",  "file", "content_b64"}          binary file
  {"op": "create",  "file", "generate": {"functions": N}}
  {"op": "delete",  "file"}
  {"op": "rename",  "from", "to"}
"""
import base64, json, pathlib, re, subprocess, sys

PROJECTS = [".", "legacy", "packages/web"]
LINE = re.compile(r"^(\S+?)\((\d+),\d+\): error (TS\d+)", re.M)


def generate(spec):
    n = spec["functions"]
    return "".join(f"export function f{i}(x: number): number {{\n  return x + {i};\n}}\n\n" for i in range(n))


def ops_of(pr):
    if "ops" in pr:
        return pr["ops"]
    return [{"op": "replace", "file": pr["file"], "old": pr["old"], "new": pr["new"]}]


def touched(root, ops):
    paths = set()
    for op in ops:
        for key in ("file", "from", "to"):
            if key in op:
                paths.add(root / op[key])
    return paths


def apply(root, pr):
    for op in ops_of(pr):
        kind = op["op"]
        if kind == "replace":
            p = root / op["file"]
            text = p.read_bytes().decode()
            count = text.count(op["old"])
            assert count == 1, f'{pr["id"]}: replace in {op["file"]} matched {count} times'
            p.write_bytes(text.replace(op["old"], op["new"], 1).encode())
        elif kind == "create":
            p = root / op["file"]
            assert not p.exists(), f'{pr["id"]}: create {op["file"]} but it exists'
            p.parent.mkdir(parents=True, exist_ok=True)
            if "content_b64" in op:
                p.write_bytes(base64.b64decode(op["content_b64"]))
            elif "generate" in op:
                p.write_bytes(generate(op["generate"]).encode())
            else:
                p.write_bytes(op["content"].encode())
        elif kind == "delete":
            p = root / op["file"]
            assert p.exists(), f'{pr["id"]}: delete {op["file"]} but it is missing'
            p.unlink()
        elif kind == "rename":
            src, dst = root / op["from"], root / op["to"]
            assert src.exists() and not dst.exists(), f'{pr["id"]}: bad rename {op["from"]} -> {op["to"]}'
            dst.parent.mkdir(parents=True, exist_ok=True)
            src.rename(dst)
        else:
            raise AssertionError(f'{pr["id"]}: unknown op {kind}')


def compile_all(root, tsc):
    out = "".join(subprocess.run([tsc, "-p", str(root / p)], capture_output=True, text=True).stdout for p in PROJECTS)
    found = []
    for m in LINE.finditer(out):
        path = pathlib.Path(m.group(1))
        rel = path.resolve().relative_to(root.resolve()).as_posix() if path.is_absolute() or m.group(1).startswith("..") else m.group(1)
        found.append((rel, int(m.group(2)), m.group(3)))
    return found, len(re.findall(r"error TS\d+", out))


def compiled_files(root, tsc):
    """Each project's compiled source files (repo-relative, node_modules excluded)."""
    prefix = str(root.resolve()) + "/"
    out = {}
    for p in PROJECTS:
        listed = subprocess.run([tsc, "-p", str(root / p), "--listFilesOnly"], capture_output=True, text=True).stdout.splitlines()
        out[p] = sorted(l[len(prefix):] for l in (str(pathlib.Path(x).resolve()) for x in listed) if l.startswith(prefix) and "/node_modules/" not in l and pathlib.Path(l).is_file())
    return out


def main():
    args = sys.argv[1:]
    scope_out = None
    if "--scope-out" in args:
        i = args.index("--scope-out"); scope_out = pathlib.Path(args[i + 1]); del args[i:i + 2]
    root, tsc = pathlib.Path(args[0]), args[1]
    prs = [pr for path in args[2:] for pr in json.loads(pathlib.Path(path).read_text())]
    base, raw = compile_all(root, tsc)
    assert not base and raw == 0, f"base not clean: {base}"
    base_scope = compiled_files(root, tsc) if scope_out else None
    if base_scope:
        assert all(base_scope.values()), f"a project compiles no files: {base_scope}"
    deltas = {}
    for pr in prs:
        saved = {p: (p.read_bytes() if p.exists() else None) for p in touched(root, ops_of(pr))}
        new_dirs = {p.parent for p, b in saved.items() if b is None and not p.parent.exists()}
        try:
            apply(root, pr)
            found, raw = compile_all(root, tsc)
            if base_scope:
                scope = compiled_files(root, tsc)
                delta = {p: {"add": sorted(set(scope[p]) - set(base_scope[p])), "remove": sorted(set(base_scope[p]) - set(scope[p]))} for p in PROJECTS}
                delta = {p: d for p, d in delta.items() if d["add"] or d["remove"]}
                if delta:
                    deltas[pr["id"]] = delta
        finally:
            for p, b in saved.items():
                if b is None:
                    p.unlink(missing_ok=True)
                else:
                    p.parent.mkdir(parents=True, exist_ok=True)
                    p.write_bytes(b)
            for d in sorted(new_dirs, key=lambda d: len(d.parts), reverse=True):
                if d.exists() and not any(d.iterdir()):
                    d.rmdir()
        errs = " ".join(f"{f}:{l} {c}" for f, l, c in found) or "none"
        flag = "" if raw == len(found) else f"  !! parsed {len(found)} of {raw} raw errors"
        print(f'{pr["id"]:5} {pr["title"][:60]:60} {errs}{flag}', flush=True)
    final, raw = compile_all(root, tsc)
    print("base clean after run:", not final and raw == 0)
    if scope_out:
        assert compiled_files(root, tsc) == base_scope, "base scope changed during the run"
        scope_out.write_text(json.dumps({"base": base_scope, "delta": deltas}, indent=1) + "\n")
        print(f"scope: {sum(len(v) for v in base_scope.values())} base files; {len(deltas)} PRs change the compiled set")


if __name__ == "__main__":
    main()
