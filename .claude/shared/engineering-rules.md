# Engineering rules — issues, PRs, tests, reviews, merging, closing

One document, synced to every repo from `pm-kit`. Do not edit here — edit in `pm-kit/templates/.claude/shared/` and the sync opens PRs.

Merged from four sources: the Mondeto team guide (merges/tickets/closing), the celo-composer overhaul playbook (30+ issues → 30+ PRs in 4 days), the hardening playbook (PRs #49–#82, security/money paths), and the agent-assisted-development standards (recent PR/review rounds — cited `(agent-std)`). Every rule has an incident behind it — cited as `(mondeto #N)`, `(composer #N)`, `(hardening #N)`. Where sources disagreed, the resolution and reasoning is in §9.

**One-paragraph philosophy (agent-std):** treat the agent's output as claims to be verified, not results to be trusted. Measure instead of reason wherever possible, and pin the measurement in a test. State what the change does *not* do as clearly as what it does. When a guarantee appears in prose, a test must prove it on every path — narrative must never outrun code. When a reviewer pushes back, reproduce their finding before touching anything. The bugs that survive live at the seams (wiring, error paths, bounds), so verification means running the artifact, not just its units.

The two rules that hold everything else together:

1. **Evidence over assertion, at every stage.** Issues, PR bodies, reviews, and status comments are all claims. The only claims that survive unchanged are the ones somebody executed. State the *scope of your evidence*: "true of what I ran" is not "true of what a user gets" (composer).
2. **The record gets corrected, publicly, by whoever finds the error — including in their own work.** One uncorrected sentence in composer #423 caused three downstream fixes. Corrections are cheap; propagation is not.

---

## 1. Issues

**Verify before filing — "confirmed" means you ran it.** Distinguish "I ran this, here is the output" from "static reading suggests". Three exploration claims in the composer audit were wrong (a helper that "never returns true" worked; a "type-check failure" didn't exist; two "unwired" providers were wired) and one shipped into #423 and two docs PRs. Facts about the outside world get checked at the source: token addresses via `eth_call` not memory, package APIs against the installed package, advisories against the advisory API. Composer #388 contained fabricated contract addresses with correct-looking prefixes.

**Name the defect in the code path that serves users, not where you noticed it.** Mondeto #182 reported a fee bug in the log-scan route, which only runs when the subgraph is unconfigured — never in production. The production path had the identical defect. Ask: is the location I found it the location users hit?

**One fix-unit per issue, one priority per issue.** Cluster by *fix boundary*, not observation boundary: one ticket per thing one person fixes in one pass over one file-set, with a checklist inside. **Same-diff test:** if two tickets would be closed by the same diff, merge them (composer #416: one ticket, nine locations, one fix — right shape; four docs tickets closed by one PR — wrong shape). **Different-schedule test:** if two items in one issue would be scheduled or prioritised differently, split them — bundling a live defect with low-priority hardening makes the defect inherit the low priority (hardening #47 → #81). **One symptom is not one defect:** mondeto #196 conflated a blank map (parse failure) with a freeze (main-thread block); work on one looked like progress on the other. It became #225 + #196 + #226. AI makes finding cheap — findings outnumber fix-units ~4:1 — so cluster before filing, never map finding → ticket 1:1.

**Anatomy of a good issue:** what happens (exact commands + real output, or user steps + observed) → root cause (`file:line`) → impact (who hits this doing what; for security/money, what the attacker gets — hardening #54 said "quota theft, a DoS lever against settlement, lands in rotated container logs and pasted debug output", which is what got it prioritised) → suggested fix → version/commit tested. Use the issue forms in `.github/ISSUE_TEMPLATE/`.

**State non-goals, dependencies, and what is explicitly not a blocker.** Mondeto #201's single sentence "Explicitly not a blocker" kept it out of two sprint discussions. #215/#193 both name who owns the shared file. #216 says "Depends on #215" in the body so the ordering survives without memory.

**Acceptance criteria as checkboxes; separate code work from ops work.** Hardening #54 lists "rotate the credential / recreate the container / purge captures" as their own boxes, so a code PR can close its half while the ops half stays tracked (#72: "this stops the repo adding to the exposure; rotation actually closes it").

**Say how we'd know it's fixed.** Before asking a reporter to retest, have a way to answer yourself. Mondeto #196 couldn't be measured — a client that fails to parse never fires analytics — so two support reports were the entire evidence base. Instrument first (#226), then ask, or better, just look.

**Record negative results precisely or not at all.** Composer draft #204's "tried and did not work" table said `transpilePackages` doesn't work; it does — it was aimed at packages that don't publish the failing code. Record *why* it failed precisely enough to tell "doesn't work" from "applied wrong". When unsure, write *attempted, outcome unclear*, never *ruled out*.

**Write the defect as a mechanism, with measurements** ("225 of 574 responses were template output") — numbers in the issue become pinned tests in the fix (agent-std). **Mark open questions as open** ("number left to implementer") so the implementer surfaces the judgement call instead of guessing silently. **Pin prior art to a commit SHA**, not a branch — branch links rot. Acceptance checklists include documentation requirements so they can't be dropped silently. For audits, split into lettered fixes (A–G) mapping 1:1 to PRs, with a status table on the parent issue. A root cause found during unrelated work (a CI flake, an infra gap) gets its own issue "so it outlives the PR".

**When your issue turns out wrong, correct it in-thread:** what was wrong, what's true, and who downstream inherited it (composer #423 named the two PRs). Retitle when scope narrows (composer #463). One home per work item.

**Priority lives in labels** — `priority:critical|high|medium|low` — not board fields (the shared DevRel board's Priority field has zero options; it is impossible to mark anything high there). `priority:critical` = money correctness, security, or user-visible wrong data. Don't inflate it. Add every new issue to the board when filed, not in batches.

---

## 2. Pull requests

**Branch → PR → squash merge into `main`. Nothing goes straight to `main`.** Branch names: `<github-handle>/<issue>-<slug>`, slug naming the *problem, not your solution* (`lena/196-minipay-freeze`); bots keep their prefix (`renovate/...`). (Resolution of a three-way disagreement — see §9.)

**The PR title is the commit on `main`** (squash with PR title). Conventional Commits, scoped, imperative, stating the *outcome*: `fix(buy): block buying ocean pixels via long-press inspect path`, not `fix buy bug`.

**Smallest correct diff, one concern per PR.** Composer #427's two-line quote fix unblocked six PRs. Big mixed PRs stall behind their weakest part. If it builds on another PR, say so in the first line, name the base, give review order, offer to rebase (hardening #76: "Stacked on #75. Merge #75 first and this retargets cleanly."). Independent PRs say "branched off main, independent of my other open PRs" (#79). Keep stacks shallow (depth ≤ 2); with squash merges the second-lander rebases with `git rebase --onto main <base-branch>` after the base merges.

**Every sentence in the body is a claim that will be adversarially checked.** Composer bodies that overclaimed all got caught ("only one place interpolates the name" — a second in JS; "the suite would have caught #399" — its check was a no-op). Write bodies you'd bet on, with **verification evidence as commands + output**, not "tested ✓". Include the **mutation count** (§3).

**Surface judgement calls the spec left open as explicit, reversible decisions** ("named constant, one-line change if you want it more sensitive"). Never smuggle product decisions into bug fixes; if one is bundled, flag it for the maintainer to keep or drop ("happy to drop it; the fix stands without it"). Push back on the spec when the evidence disagrees, *with the evidence* — correcting an issue's overstatement is a contribution (agent-std).

**Say what the PR actually does, and what it does NOT do — with numbers where possible** ("blocks repeats, not first submissions — roughly 190 of the 225"). Known accepted limitations are pinned in a test, not left implicit, so a future change has to confront them. Mondeto #224 said "data layer only" and also retired a product tab, rewired `/ranks`, and rewrote FAQ answers — reviewed under a label that said it wasn't there. Hardening #75's "what this does not buy" section ("whoever controls the endpoint completely can forge the receipt too; the independent second source is the follow-up, and this is not it") prevents a phrase like "verified on chain" from stopping people asking questions.

**`Closes #N` is a contract: only when the entire issue's acceptance criteria are met. Otherwise `Refs #N`** and list which boxes this closes. Composer edited #448/#454 mid-flight for this; mondeto #209 got it right in prose and was overridden anyway (§6).

**Never delete a wrong claim from a PR body — strike it through with a pointer to the correcting commit.** The visible correction is the trust signal (agent-std). Because we squash-merge with PR title + body, the PR body *is* the commit message on `main`: rationale, verification performed, known limits, and `Closes`/`Refs` trailers all live there. Keep agent co-author trailers; they're honest and cost nothing.

**For a stack, verify the merged union:** merge all open branches into one tree locally and run the suite — each PR green individually says nothing about the combination. **When you touch CI, prove it in both directions:** link one green run and one deliberately red run.

**Reproduce before you fix, fix the root cause, collapse duplicated facts.** Hardening #77 wrote both attacks as tests, ran them red on main, then green. Composer's wallet-provider mess existed because one fact lived in four places and the copies drifted; #461 moved it to one module. If your fix restates a fact somewhere, ask where else it lives. State the trade-off that picked the design — "a missing file fails loudly at once, a missing variable misbehaves silently at runtime" (hardening #74) is the strongest one-line justification a PR can carry.

**Flag breaking internal changes for parallel work** (hardening #77's signature change broke #79 — the note made it expected). **Know your conflicts before the reviewer does:** when PRs touch shared files, say so, propose a merge order, pre-write the resolution hunk (composer #428/#450). Whoever merges second rebases.

**Runbooks, README, `.env.example`, examples, and error strings are part of the diff.** Grep for the old instructions (hardening #74's README still pointed at the old secret layout; stale docs "asserting the property an issue exists to create are worse than silence, because they stop anyone checking" — #76). Runbook steps get reviewed like code (#74's was missing `--build`).

**Ask before public or irreversible actions** — filing on external repos, posting from the org, force-pushing shared branches, deleting branches, anything outward-facing. Track the decision as an owned issue (hardening #80), not a PR thread. **This applies doubly to agents: propose, never execute, anything outward-facing.**

**Lockfile PRs — the rule that burned Mondeto twice (#162, #212):** never merge two lockfile-touching PRs without rebasing the second. Merge one → wait for `main` to update → rebase the next and **regenerate the lockfile, never hand-resolve** → wait for green on the rebased head → merge. Renovate only rebases when it next runs. (The ruleset's "require branch up to date" now enforces the rebase mechanically; the regenerate-don't-hand-resolve part is still yours.)

---

## 3. Tests & verification

**Every change ships with the test that would have caught the bug** — the assertion that fails on pre-fix code, not merely a test that passes. Composer #461 v1 broke every MiniPay scaffold while its tests stayed green because the fixture asserted components existed but not that the manifest kept their dependencies.

**Cover the seams, not just the units.** Pure-function tests are necessary, not sufficient — the bugs that survive live at the wiring: response bodies, query bounds, component props, error paths, config parsing. Every PR has at least one test *through* the seam it touches (route in → response out; CLI as subprocess; component render) (agent-std). **A stated guarantee needs a test on every path** — if prose says "the error response never reveals X", a test asserts it on the *rejected* path, not just the accepted one. **Measured over reasoned:** any threshold, constant, or "this can't happen" is justified by a measurement pinned in a test, never only in a comment. Edge classes to check every time: Unicode/non-Latin input; empty input; the band between two thresholds (clears one floor, misses another); exact boundary values (`>=` vs `>`); concurrent duplicate requests.

**Error paths are an attack surface.** Audit what every 4xx/5xx body leaks — exact scores are gradient oracles, flags are detection oracles. Decide per check whether it fails open or closed, write it down, verify the code matches. **Reads on write paths are bounded at the query** (`take(limit)`), never collect-then-slice — a fail-open catch around an unbounded read silently disables the check for exactly the heaviest users.

**Config safety:** no silent fallbacks for critical config — unset or unrecognised values are errors, not defaults (a quiet default has shipped the wrong environment to production). Env values compared exactly — set with `printf`, never `echo` (stray newline). Build-time-inlined vars (`NEXT_PUBLIC_*`) need a fresh build; dashboard edits alone do nothing. Never print secret values — check presence, not content; keys never in argv, shell history, or committed files.

**Mutation-test the fix and state the count** ("disabling receipt verification turns 5 red" — hardening). A suite equally green with and without the fix proves nothing.

**Pair every absence-assertion with a control.** "Nothing bad happened" must run beside "something happened at all", or it passes against code that never ran (hardening #75 caught four vacuous passes this way). **Check that "never happened" assertions can fail** — hardening #82 asserted `settleCalls() === 0` on a path where the counter can't increment. Make it fail by hand first.

**Fixtures are real captured data.** Mondeto #220's classifier tests asserted on `'execution reverted'` — a bare fragment that never occurs; real viem errors carry a `Docs: https://viem.sh/...` line, which the rule matched on `http`, so real reverts were filed as network errors. Green tests, wrong behaviour.

**Test doubles honour their inputs.** A fake `getLogs` that ignores the filter it's handed silently turns every test depending on that filter into a vacuous one (hardening #76, #78).

**Assert at the boundary where damage happens** — the recorded webhook POST body, not stdout, "because a leak that only reaches Slack never appears in the console" (hardening #72). **Verify deployment claims from inside the running system**, and test the existing-state case (populated DB, root-owned volume), not just fresh state (#74, #77).

**Paths that cannot be faked get run in production with a restricted audience — tester mode.** Staging proves code against a mock; it cannot prove real gas leaves the real treasury. Two DB flags (account capability + entity audience), server-side gating at every surface (listing, lookup → 404, join, in-flight reads, realtime, aggregates), and everything downstream flag-blind so the tester run is the identical pipeline with real (small) stakes. Mini-quiz's first native-CELO payout ran this way and surfaced three bugs (#19–#21) no offline test could reach. Verify at the source of truth, not the UI. Pattern and porting checklist: `tester-mode-pattern.md`.

**Anything that decides who gets paid gets compared byte-for-byte against the other side** — contract, on-chain read, the other route (mondeto #48, #224 where the comparator was identical but the block window wasn't; #223 checked fee arithmetic against `feeRate()` live on all eight map contracts). Money/security diffs additionally run `money-path-checklist.md`.

**We only test MiniPay, so browser regressions go unnoticed.** Mondeto #221 broke `mondeto.app` in every browser for four days. Wallet/provider tree changes get loaded in a normal browser too.

**A green check is only as good as what the check runs.** Composer's CI was secret-scanning only for days — every broken PR was green. A "TypeScript check" resolved to npm's placeholder package `tsc` and certified 21 syntax errors. Know what gates actually verify; the CI in `pm-kit` fails without lint/test scripts and uses `--no-install` for that reason. **A green check reflects the commit it ran on** — mondeto #206's green run predated the bump it needed to guard.

---

## 4. Reviewing

**Review by attempting to refute, with the code running.** Reading diffs catches style; running catches a fix that silently stripped a template's wallet stack, a tarball shipping the files a script existed to exclude, a `tsc` that wasn't TypeScript (composer). **Tier it — uniform max-rigour was the real cost driver in the composer overhaul:**

- *Mechanical* (renames, quoting, doc paths, green dep bumps): read + confirm what CI ran. No behaviour pass.
- *Logic, new surface, funds/security/release, wallet tree*: full pass — run the suite on the branch and prove tests can go red; build the real artifact (for a scaffolder, the generated project *is* the product); click through the changed surface once (dev server or the CLI command a user would run). Optionally a cloud multi-agent review first as a breadth pass — treat its output as claims to verify, and it never replaces the behaviour pass.

**Verify claims against code, never against the description.** Hardening's descriptions were excellent and still wrong in places (#76 mutation table, #75 "nothing on chain could spoof this"). Half-wrong claims: identify the right half (composer's "both files wrong" — one was correct). **Verify the feedback itself before implementing it** — reviewers are claims too; two composer docs PRs implemented an incorrect issue premise that 30 seconds of grep would have caught.

**Review against current `main`, on the head SHA you think you're reviewing.** Branches go stale in a queue; `gh pr diff` served stale content twice. **When CI is red, first ask what moved** — hardening #73's runner had a floating Node version, so main went red with no commit and every open PR looked guilty.

**A PR description is testimony, not evidence** — the review's job is to find where the narrative outran the code. **Recompute the math:** pinned constants, statistical formulas, thresholds — rederive independently before trusting them. Probe the standard edge classes and the fail-open/fail-closed direction of every guard; audit error responses for leaks; check read bounds on write paths. **Separate CI signal:** say which failures are code and which are infra/permissions. **Name what the PR got right** — a request-changes that ends "one round of targeted fixes, not a rethink" gets a better resolution round than a bare defect list; every finding includes the shape of the fix ("one line: strip the flag when block is true"). **For payment paths, auth, or anything moving money: adversarially verify findings** — a second independent pass attempting to refute each — before posting; plausible-but-wrong findings burn author trust and review rounds (agent-std).

**Independently confirm the highest-severity finding before acting** (both hardening HIGHs were re-verified line-by-line). A wrong HIGH burns trust; a confirmed one with `file:line` and an attack script is undeniable.

**Every finding: severity · `file:line` · one-sentence defect · concrete failure scenario · suggested fix.** "The rate limits interact badly" is not implementable; "both throttles build the key `ip:<addr>`, `take()` refills at the calling tier, so alternating requests degrades 10/hour to 60/min — namespace them" is a 20-minute fix. **Say what you verified as sound** — it tells the author what not to touch and proves you read the code.

**Verdicts:** `APPROVE` (zero open findings, however small) / `REQUEST-CHANGES` (anything else). There is no approve-with-nits: a PR is not mergeable while any finding is unresolved. A finding resolves as exactly one of: a fix commit on the PR, or — only when genuinely out of scope for the PR — a follow-up issue *filed and linked from the review*, never merely suggested. "Could be a new ticket" / "out of scope" in prose, with no issue behind it, leaves the finding open; deferred work always lands in a filed issue, otherwise it evaporates (composer #452, #460). **Review the tests as hard as the code:** if nothing realistic would make the suite go red, it's worse than none — it certifies broken output (composer #447 v1).

**For a queue of PRs, build the conflict matrix mechanically** (`git merge-tree`) and publish the merge order; name the merge-order hazards (shared files, squash retargeting of stacks, signature changes) so the second merger expects the conflict. Sequenced merges kept every intermediate `main` working across ~30 composer merges.

---

## 5. Receiving feedback

The review round is where contributor quality is actually measured. In order (agent-std):

1. **Reproduce before touching anything.** Run the reviewer's scenario and confirm it. If you can't reproduce, say so plainly — and still fix on the evidence if the mechanism is sound. Never implement a fix for a finding you haven't understood: a plausible fix for a misdiagnosed problem is two bugs.
2. **Fix, then audit your own fix** the way the reviewer reviewed the original. If the audit finds a bug in the fix, disclose it unprompted. A fix that silently changes scope is a new unreviewed change.
3. **Report what the fix taught** — not "fixed"/"done": what you reproduced, what changed, what it revealed about adjacent code. If your earlier framing made the bug look smaller than it was, correct the record.
4. **Push back only with a measurement** — an on-chain read, a header trace, a control run — not intuition.
5. **Defer ownership calls.** If a finding opens a design question that belongs to someone else, present options with trade-offs and ask; time-box it ("say what shape you want and I'll push it today"). Don't grow a tightly-scoped PR on your own judgement.

**Answer every review point explicitly: `FIXED` / `NOT-FIXED` / `DISAGREE-because`.** Responses that silently addressed some points forced full re-reviews of everything (composer). Every review ask ends as one of: a commit, a filed follow-up issue, or an explicit "won't do, because…" — never silence.

**Never respond with a silent push.** Push, then comment what changed and which findings it addresses (composer's early rounds were silent force-pushes; nobody could tell what moved). With squash merges you may rebase/force-push your own branch freely — the *comment* is the rule.

**When review proves your fix wrong, the model response is composer #461's revision:** adopt the diagnosis, encode why in the code itself ("Caught in review on #461" now lives in a doc comment), add the missing assertion, say what you verified. Turnaround beat defensiveness by a day. **Add the test the reviewer says is missing, especially when it would have caught the finding** — each hardening HIGH came with the exact test gap that hid it.

**Answer direct questions in PR threads promptly** — an unanswered go/no-go blocks the author invisibly (hardening #72). If it needs a decision process, convert to an owned issue and say so.

---

## 6. Merging & closing

**Merge what's ready promptly** — an approved PR sitting unmerged makes every stacked PR staler. Keep stacks rebased after the base merges. Call out schema migrations in merge notes.

**Approvals don't survive a re-roll.** Mondeto #89 carried a sign-off for pnpm v10; Renovate re-rolled it to v11.5.3 with the approval still sitting there. (Ruleset dismisses stale approvals on push now — but a re-approval is a re-review, not a click.)

**After merging, check what closed.** Mondeto #196 closed one second after #209 merged, even though #209's body said in bold it does not close #196 and its footer read `Closes #208. Refs #196.` — a Development-sidebar link outranks anything in the body. It stayed closed five days while the remaining work lived only in a draft PR. Rules: **sidebar links close issues; prose does not stop them** — unlink what you don't intend to close. **A ticket is done when its acceptance criteria are met, not when a related PR merges** — re-read them before closing. **If closing orphans remaining work, file the successor first** and link it from the closing comment. Run `/post-merge <PR>` after every merge until it's a habit.

**Close issues with evidence, not "done":** name the fixing PR and what was verified. Close stale issues and supersede stale PRs with the same specificity — thank the contributor, cite the superseding commit, invite fresh work (one such contributor returned with a mergeable PR the next day). **Every open PR carries a current status:** merged, reviewed with verdict, or what it's waiting on.

**Closing a PR without merging — capture what it proved.** Unmerged work often contains proven pieces (a working flow, validated thresholds). Identify what's reusable, capture it in the issue that carries the work forward with file links pinned to the PR's head SHA, close with a comment saying why and where the value went, keep the branch unless there's a reason to delete (agent-std). **When CI goes red:** diagnose to root cause, prove it with a control run (no code change), file the diagnosis as an issue so it outlives the PR. Policy calls (retries, concurrency limits) go to the maintainer, flagged — not decided unilaterally.

**Versioning:** the version lives in the repo, release tooling reads it, CI verifies tag == `package.json` and never invents versions. Changelog entries land with the change.

---

## 7. What is enforced by the platform vs. by discipline

Enforced (ruleset + repo settings from `pm-kit/protection`): PR required · 1 approval · stale approvals dismissed on push · required `ci` check · **branch must be up to date with `main`** · no force-push · no deletion · squash-only · PR title = commit. Everything else in this document rests on you. Treat a green check as information, not permission, until you know what it ran.

---

## 8. The loop

```
observe (run it) → file (claims + evidence) → fix (smallest diff + the test that fails pre-fix)
→ review (attempt to refute, running; tiered) → revise (point-by-point, announced)
→ merge (in published dependency order) → verify end-to-end on main → check what closed → correct the record
```

Calibration: composer day 1, zero of six templates built; day 4, seven of seven build end-to-end with CI gating on a real scaffold suite. The delta was verification applied uniformly to everyone's claims, including our own.

---

## 9. Where the sources disagreed — and what we chose

- **Branch naming** — three-way: kit v1 `feat/…`, Mondeto `<handle>/<slug>`, agent-std `type/issue-slug`. Chose `<handle>/<issue>-<slug>`: the type already lives in the Conventional-Commit PR title (so a type prefix is redundant), the handle answers "whose is this" for cleanup and bots (renovate/ already does this), and agent-std's issue number is worth keeping — it links branch → ticket without a lookup. Best of each; the one thing dropped is the redundant type.
- **"Squash to logical commits whose messages carry rationale and `Closes` trailers" (agent-std) vs squash-merge-to-one-commit (Mondeto, ruleset).** The repo squashes with PR title as subject and PR body as message, so the *PR body* is where rationale, verification, limits, and trailers live — the same content agent-std wants, in the place the platform actually preserves. Intermediate commits on the branch can be whatever helps you; they don't reach `main`.
- **PR template shape** — agent-std proposes What & why / Scope-not / Judgement calls / Verification / Merge order. Ours already had the first two, verification, and stacking; the missing piece was **Judgement calls**, now its own section. Nothing dropped.
- **"One issue per problem" vs "cluster findings"** — composer §1 vs its own §7 retrospective, and hardening's "one priority per issue". Not actually opposed: cluster by *fix boundary* (same-diff test) and split by *schedule/priority* (different-schedule test). Both tests are in §1.
- **Required review-thread resolution (kit v2 ruleset) vs "approve-with-nits means mergeable now" (hardening).** Both superseded. The ruleset rule stays dropped — mechanical thread resolution is click-blocking, not review quality. But the approve-with-nits verdict is gone too: no approval while any finding is open, however small. Every review point ends as a fix commit, a *filed* follow-up issue, or an explicit won't-do agreed in the thread (§4, §5).
- **"Require branch up to date" (mondeto lockfile incidents) vs the parallelism tax of many small PRs on shared files (composer §7).** Kept strict up-to-date — the lockfile incidents broke production twice, the tax is a click and a CI run. If the queue gets deep (>~5 concurrent PRs on shared files), enable GitHub **merge queue**, which performs the up-to-date test automatically and removes the clicks. Auto-merge on.
- **Squash-only vs stacked PRs.** Squash makes stacks slightly more work (second-lander rebases `--onto main`). Kept squash — the clean linear log and title-as-commit are worth more than stack convenience; keep stacks ≤ 2 deep and prefer independent branches off `main`.
- **Priority labels** — kit v1 `P0/P1/P2` vs Mondeto `priority:*`. Chose `priority:critical|high|medium|low` (already in use, and the word "critical" carries its own definition; P0 doesn't).
- **Force-push** — Mondeto "never respond with a silent force-push" vs squash-merge culture where rebasing your own branch is normal. Resolution: force-pushing *your own PR branch* is fine; the rule is *announce what changed*. Never force-push shared branches or `main` (ruleset blocks it anyway).
- **Review effort** — composer's "both passes for every substantive review" vs its own retrospective "uniform max-rigour was the real cost driver". Chose tiered (§4); a real CI suite is what makes the light tier safe, which is why CI came first.
