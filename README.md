# typescript-construct-classifier

Test fixture for tools that analyse TypeScript and JavaScript pull requests: which declarations a PR adds,
deletes, modifies, renames or moves; what kind of construct each one is; where it sits; and what the change
affects.

- `FIXTURES.md` — toolchain, documentation conventions, classification rules, base files.
- `PRS.md` — every fixture PR with its expected output and measured compiler errors.
- `prs/` — each PR's edit as data, expected output (`expect.json`), measured errors.
- `tools/` — `measure_prs.py` (apply edits, compile, report new errors), `check_pr.py` (compile a checked-out branch and
  compare with the recorded errors), `render_prs.py` (index and PR descriptions).
- `.github/workflows/fixture-errors.yml` — runs `check_pr.py` on every PR head and on `main`.

Requirements: Node.js. `npm ci --ignore-scripts` installs TypeScript 7.0.2 and the React packages; compile with
`npx tsc -p .`, `npx tsc -p legacy`, `npx tsc -p packages/web`.
