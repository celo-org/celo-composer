<!--
TITLE = the commit on main (squash-merge, PR title). Conventional Commits, scoped, OUTCOME — ideally the behaviour after the change:
  fix(buy): block buying ocean pixels via long-press inspect path   ✅     fix buy bug   ❌
  fix(gateway): a failed settle releases the allowance it reserved  ✅     fix(gateway): handle settle error   ❌
One concern per PR. Every sentence below is a claim that will be checked against the code.
Rules: .claude/shared/engineering-rules.md §2–3.  Tip: /write-pr fills this in for you.
-->

## The hole, and the fix

<!-- What was wrong — with its impact in numbers (since when, how many calls, how much money) —
     what this changes, and the trade-off that picked the design
     ("a missing file fails loudly at once, a missing var misbehaves silently").
     If you did not take the obvious fix, say why it would have been wrong.
     Say what the PR ACTUALLY does — if it does more than the ticket, say so here.
     More than a few files? A table: file | what it does now.
     Cost, capacity, or fee change? Before/after per call and per hour, worst case included.
     Config change? Every place the value must agree, and the kill switch. -->

## What this does NOT do / not verified / residual risk

<!-- Plainly, with numbers where possible ("blocks repeats, not first submissions — ~190 of 225").
     Known accepted limitations are PINNED IN A TEST, not just stated here.
     Deliberately not done, and why. Differences from the issue, and why.
     Not verified: what you did not exercise ("no mainnet settlement was run", "Chromium only").
     Prevents "verified on chain"-style phrases from stopping questions. -->

## Judgement calls

<!-- Anything the issue left open that you decided: the decision, the reasoning, and how cheap it
     is to reverse ("named constant, one-line change"). Any PRODUCT change bundled with a fix is
     flagged here for the maintainer to keep or drop ("happy to drop it; the fix stands without it").
     Write "none" if none. -->

## Issues

<!-- Closes #N  — ONLY if every acceptance box of #N is met by this diff.
     Refs #M    — related / partial; list which boxes this closes and which stay open.
     ⚠ Development-sidebar links close issues on merge regardless of what's written here. -->
Closes #
Refs #

## Stacking / conflicts

<!-- "Branched off main, independent of my other open PRs."  OR
     "Stacked on #X — merge #X first; retargets cleanly."     AND
     shared files with other open PRs + proposed merge order + pre-written resolution if known.
     Breaking internal change (signature etc.)? Say so for whoever lands alongside. -->

## Verification evidence

<!-- Commands + output, not "tested ✓".
     - Tests run on THIS head (not CI's cached result); failures that predate this PR named and reproduced on main
     - Each new test: what it pins, and that it was seen failing before the fix
     - No UI? The changed route/script driven the way a caller would (curl, stubbed cloud CLI, N concurrent requests)
     - AI review pass run? What it found and how each finding was handled
     - Mutation count: "disabling <the fix> turns N red"  (N=0 ⇒ the test that would catch this is missing)
     - Build of the real artifact
     - UI touched → browser pass on THIS head: routes visited, actions, console errors = 0, screenshots (desktop + phone) attached
     - Payment path, bigger change → optional: one real small-amount tx from your own wallet — hash + receipt status (or say none was run)
     - At least one test THROUGH the seam this touches (route in → response out; CLI as subprocess; component render)
     - Every guarantee stated above has a test on its FAILURE path
     - Touched CI? link one green run AND one deliberately red run
     - Money/security paths: money-path-checklist.md items checked
     Never delete a wrong claim from this body — strike it through with a pointer to the correcting commit. -->

## After merge

<!-- Deploy state first: "Not deployed: production still runs <sha>" — merged is not deployed.
     Then numbered operator steps, specific enough to run without asking: tag, environment approval,
     which workflow at which SHA with which inputs, the log line that proves it booted, downstream syncs.
     Anything code can't close: rotate credential, run migration, purge captures. -->
1. none

## Checklist

- [ ] Title is the commit message I want on `main`
- [ ] Ships the test that fails on pre-fix code; fixtures are real captured data; fakes honour their arguments
- [ ] Covers the seam, not only pure functions; any stated guarantee tested on its failure path
- [ ] Error responses audited for what they leak; reads on write paths bounded at the query
- [ ] Judgement calls / bundled product changes flagged above (or "none")
- [ ] `lint` / `typecheck` / `test` pass locally on the current head
- [ ] Re-read acceptance criteria of every `Closes` issue — all met
- [ ] Development sidebar links match Closes/Refs above
- [ ] README / runbook / `.env.example` / examples / error strings updated for the world this creates
- [ ] Lockfile touched → rebased on current `main`, lockfile regenerated (never hand-resolved)
- [ ] Wallet/provider tree touched → loaded in a normal browser, not only MiniPay
- [ ] UI touched → browser pass run on this head, desktop + phone, screenshots attached; `e2e-smoke` green on the preview
- [ ] Money/security path → `money-path-checklist.md` run; payout logic compared against the other side; a second reviewer requested (no self-merge)
- [ ] Config/secret/flag changed → every place it must agree updated, each exists in the target environment, kill switch named
- [ ] No secrets in the diff
- [ ] Questions for the maintainer marked clearly at the end (or "none")

<!-- Agent co-author trailers stay (Co-Authored-By: …) — honest and free.
     MERGER: after merge, run /post-merge <PR#> — check what closed, file successors, add leftover nits to the repo's `Small fixes` issue (critical/high findings get their own issue). -->
