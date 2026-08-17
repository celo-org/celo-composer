<!--
TITLE = the commit on main (squash-merge, PR title). Conventional Commits, scoped, imperative, OUTCOME:
  fix(buy): block buying ocean pixels via long-press inspect path   ✅     fix buy bug   ❌
One concern per PR. Every sentence below is a claim that will be checked against the code.
Rules: .claude/shared/engineering-rules.md §2–3.  Tip: /write-pr fills this in for you.
-->

## The hole, and the fix

<!-- What was wrong, what this changes, and the trade-off that picked the design
     ("a missing file fails loudly at once, a missing var misbehaves silently").
     Say what the PR ACTUALLY does — if it does more than the ticket, say so here. -->

## What this does NOT do / residual risk

<!-- Plainly, with numbers where possible ("blocks repeats, not first submissions — ~190 of 225").
     Known accepted limitations are PINNED IN A TEST, not just stated here.
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
     - Tests run on THIS head (not CI's cached result)
     - Mutation count: "disabling <the fix> turns N red"  (N=0 ⇒ the test that would catch this is missing)
     - Build of the real artifact / click-through of the changed surface
     - At least one test THROUGH the seam this touches (route in → response out; CLI as subprocess; component render)
     - Every guarantee stated above has a test on its FAILURE path
     - Touched CI? link one green run AND one deliberately red run
     - Money/security paths: money-path-checklist.md items checked
     Never delete a wrong claim from this body — strike it through with a pointer to the correcting commit. -->

## Remaining ops steps

<!-- Anything code can't close: rotate credential, run migration, purge captures. As checkboxes. -->
- [ ] none

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
- [ ] Money/security path → `money-path-checklist.md` run; payout logic compared against the other side
- [ ] No secrets in the diff
- [ ] Questions for the maintainer marked clearly at the end (or "none")

<!-- Agent co-author trailers stay (Co-Authored-By: …) — honest and free.
     MERGER: after merge, run /post-merge <PR#> — check what closed, file successors, record nits as issues. -->
