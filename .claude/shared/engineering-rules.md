# Engineering rules — issues, PRs, tests, reviews, merging, closing

One document, synced to every repo from `pm-kit`. Do not edit here — edit in `pm-kit/templates/.claude/shared/` and the sync opens PRs.

Every rule here was earned by a real incident in our own products. The failure mechanisms are kept — they're what make the rules recognisable in the moment — but they are illustrations, not rankings: a rule without an example is just as binding as one with.

**One-paragraph philosophy:** treat the agent's output as claims to be verified, not results to be trusted. Measure instead of reason wherever possible, and pin the measurement in a test. State what the change does *not* do as clearly as what it does. When a guarantee appears in prose, a test must prove it on every path — narrative must never outrun code. When a reviewer pushes back, reproduce their finding before touching anything. The bugs that survive live at the seams (wiring, error paths, bounds), so verification means running the artifact, not just its units.

The two rules that hold everything else together:

1. **Evidence over assertion, at every stage.** Issues, PR bodies, reviews, and status comments are all claims. The only claims that survive unchanged are the ones somebody executed. State the *scope of your evidence*: "true of what I ran" is not "true of what a user gets".
2. **The record gets corrected, publicly, by whoever finds the error — including in their own work.** A single uncorrected sentence in an audit has caused multiple downstream fixes. Corrections are cheap; propagation is not.

---

## 1. Issues

**Verify before filing — "confirmed" means you ran it.** Distinguish "I ran this, here is the output" from "static reading suggests". Audits routinely produce wrong static-reading claims (a helper that "never returns true" worked; a "type-check failure" didn't exist; "unwired" providers were wired) — and unverified ones ship into fixes and docs. Facts about the outside world get checked at the source: token addresses via `eth_call` not memory, package APIs against the installed package, advisories against the advisory API. Fabricated contract addresses with correct-looking prefixes have made it into filed issues.

**Name the defect in the code path that serves users, not where you noticed it.** A fee bug was once reported in a fallback route that never runs in production — while the production path had the identical defect. Ask: is the location I found it the location users hit?

**One fix-unit per issue, one priority per issue.** Cluster by *fix boundary*, not observation boundary: one ticket per thing one person fixes in one pass over one file-set, with a checklist inside. **Same-diff test:** if two tickets would be closed by the same diff, merge them (one ticket covering nine locations fixed by one diff is the right shape; four tickets closed by one PR is the wrong shape). **Different-schedule test:** if two items in one issue would be scheduled or prioritised differently, split them — bundling a live defect with low-priority hardening makes the defect inherit the low priority. **One symptom is not one defect:** a blank screen (parse failure) and a freeze (main-thread block) were once conflated in one ticket; work on one looked like progress on the other until they were split. AI makes finding cheap — findings outnumber fix-units roughly 4:1 — so cluster before filing, never map finding → ticket 1:1.

**Anatomy of a good issue:** what happens (exact commands + real output, or user steps + observed) → root cause (`file:line`) → impact (who hits this doing what; for security/money, what the attacker gets — "quota theft, a DoS lever against settlement, lands in rotated container logs" is the sentence that gets an issue prioritised) → suggested fix → version/commit tested. Use the issue forms in `.github/ISSUE_TEMPLATE/`.

**State non-goals, dependencies, and what is explicitly not a blocker.** A single sentence "Explicitly not a blocker" keeps an issue out of sprint discussions. Name who owns a shared file; put "Depends on #N" in the body so ordering survives without memory.

**Acceptance criteria as checkboxes; separate code work from ops work.** List "rotate the credential / recreate the container / purge captures" as their own boxes, so a code PR can close its half while the ops half stays tracked ("this stops the repo adding to the exposure; rotation actually closes it").

**Say how we'd know it's fixed.** Before asking a reporter to retest, have a way to answer yourself. A client that fails to parse never fires analytics — so support reports were once the entire evidence base for a bug. Instrument first, then ask, or better, just look.

**Record negative results precisely or not at all.** A "tried and did not work" table once ruled out an approach that works — it had been aimed at the wrong target. Record *why* it failed precisely enough to tell "doesn't work" from "applied wrong". When unsure, write *attempted, outcome unclear*, never *ruled out*.

**Write the defect as a mechanism, with measurements** ("225 of 574 responses were template output") — numbers in the issue become pinned tests in the fix. **Mark open questions as open** ("number left to implementer") so the implementer surfaces the judgement call instead of guessing silently. **Pin prior art to a commit SHA**, not a branch — branch links rot. Acceptance checklists include documentation requirements so they can't be dropped silently. For audits, split into lettered fixes (A–G) mapping 1:1 to PRs, with a status table on the parent issue. A root cause found during unrelated work (a CI flake, an infra gap) gets its own issue so it outlives the PR.

**When your issue turns out wrong, correct it in-thread:** what was wrong, what's true, and who downstream inherited it — name the affected PRs. Retitle when scope narrows. One home per work item.

**Priority lives in labels** — `priority:critical|high|medium|low` — not board fields. `priority:critical` = money correctness, security, or user-visible wrong data. Don't inflate it. Add every new issue to the board when filed, not in batches.

---

## 2. Pull requests

**Branch → PR → squash merge into `main`. Nothing goes straight to `main`.** Branch names: `<github-handle>/<issue>-<slug>`, slug naming the *problem, not your solution* (`lena/196-minipay-freeze`); bots keep their prefix (`renovate/...`). (A close call — see §9.)

**The PR title is the commit on `main`** (squash with PR title). Conventional Commits, scoped, imperative, stating the *outcome*: `fix(buy): block buying ocean pixels via long-press inspect path`, not `fix buy bug`.

**Smallest correct diff, one concern per PR.** Big mixed PRs stall behind their weakest part; a two-line fix that unblocks a queue of stacked PRs beats a bundled cleanup. If it builds on another PR, say so in the first line, name the base, give review order, offer to rebase ("Stacked on the base PR. Merge that first and this retargets cleanly."). Independent PRs say "branched off main, independent of my other open PRs". Keep stacks shallow (depth ≤ 2); with squash merges the second-lander rebases with `git rebase --onto main <base-branch>` after the base merges.

**Every sentence in the body is a claim that will be adversarially checked.** Bodies that overclaim get caught ("only one place interpolates the name" — there was a second; "the suite would have caught this" — its check was a no-op). Write bodies you'd bet on, with **verification evidence as commands + output**, not "tested ✓". Include the **mutation count** (§3).

**Surface judgement calls the spec left open as explicit, reversible decisions** ("named constant, one-line change if you want it more sensitive"). Never smuggle product decisions into bug fixes; if one is bundled, flag it for the maintainer to keep or drop ("happy to drop it; the fix stands without it"). Push back on the spec when the evidence disagrees, *with the evidence* — correcting an issue's overstatement is a contribution.

**Say what the PR actually does, and what it does NOT do — with numbers where possible** ("blocks repeats, not first submissions — roughly 190 of the 225"). Known accepted limitations are pinned in a test, not left implicit, so a future change has to confront them. A PR labelled "data layer only" once also retired a product tab, rewired a route, and rewrote FAQ answers — and was reviewed under a label that said it wasn't there. A "what this does not buy" section ("whoever controls the endpoint completely can forge the receipt too; the independent second source is the follow-up, and this is not it") prevents a phrase like "verified on chain" from stopping people asking questions.

**`Closes #N` is a contract: only when the entire issue's acceptance criteria are met. Otherwise `Refs #N`** and list which boxes this closes.

**Never delete a wrong claim from a PR body — strike it through with a pointer to the correcting commit.** The visible correction is the trust signal. Because we squash-merge with PR title + body, the PR body *is* the commit message on `main`: rationale, verification performed, known limits, and `Closes`/`Refs` trailers all live there. Keep agent co-author trailers; they're honest and cost nothing.

**For a stack, verify the merged union:** merge all open branches into one tree locally and run the suite — each PR green individually says nothing about the combination. **When you touch CI, prove it in both directions:** link one green run and one deliberately red run.

**Reproduce before you fix, fix the root cause, collapse duplicated facts.** Write the attack as a test, run it red on main, then green on the branch. Duplication is where drift starts: when one fact lives in four places the copies diverge — move it to one module, and if your fix restates a fact somewhere, ask where else it lives. State the trade-off that picked the design — "a missing file fails loudly at once, a missing variable misbehaves silently at runtime" is the strongest one-line justification a PR can carry.

**Flag breaking internal changes for parallel work** — a signature change that breaks a sibling PR is fine when announced, a surprise when not. **Know your conflicts before the reviewer does:** when PRs touch shared files, say so, propose a merge order, pre-write the resolution hunk. Whoever merges second rebases.

**Runbooks, README, `.env.example`, examples, and error strings are part of the diff.** Grep for the old instructions — stale docs asserting the property an issue exists to create are worse than silence, because they stop anyone checking. Runbook steps get reviewed like code.

**Ask before public or irreversible actions** — filing on external repos, posting from the org, force-pushing shared branches, deleting branches, anything outward-facing. Track the decision as an owned issue, not a PR thread. **This applies doubly to agents: propose, never execute, anything outward-facing.**

**Lockfile PRs — a rule that has burned us twice:** never merge two lockfile-touching PRs without rebasing the second. Merge one → wait for `main` to update → rebase the next and **regenerate the lockfile, never hand-resolve** → wait for green on the rebased head → merge. Renovate only rebases when it next runs. (The ruleset's "require branch up to date" now enforces the rebase mechanically; the regenerate-don't-hand-resolve part is still yours.)

---

## 3. Tests & verification

**Every change ships with the test that would have caught the bug** — the assertion that fails on pre-fix code, not merely a test that passes. A fix once broke every generated scaffold while its tests stayed green, because the fixture asserted components existed but not that the manifest kept their dependencies.

**Cover the seams, not just the units.** Pure-function tests are necessary, not sufficient — the bugs that survive live at the wiring: response bodies, query bounds, component props, error paths, config parsing. Every PR has at least one test *through* the seam it touches (route in → response out; CLI as subprocess; component render). **A stated guarantee needs a test on every path** — if prose says "the error response never reveals X", a test asserts it on the *rejected* path, not just the accepted one. **Measured over reasoned:** any threshold, constant, or "this can't happen" is justified by a measurement pinned in a test, never only in a comment. Edge classes to check every time: Unicode/non-Latin input; empty input; the band between two thresholds (clears one floor, misses another); exact boundary values (`>=` vs `>`); concurrent duplicate requests.

**Error paths are an attack surface.** Audit what every 4xx/5xx body leaks — exact scores are gradient oracles, flags are detection oracles. Decide per check whether it fails open or closed, write it down, verify the code matches. **Reads on write paths are bounded at the query** (`take(limit)`), never collect-then-slice — a fail-open catch around an unbounded read silently disables the check for exactly the heaviest users.

**Config safety:** no silent fallbacks for critical config — unset or unrecognised values are errors, not defaults (a quiet default has shipped the wrong environment to production). Env values compared exactly — set with `printf`, never `echo` (stray newline). Build-time-inlined vars (`NEXT_PUBLIC_*`) need a fresh build; dashboard edits alone do nothing. Never print secret values — check presence, not content; keys never in argv, shell history, or committed files.

**Mutation-test the fix and state the count** ("disabling receipt verification turns 5 red"). A suite equally green with and without the fix proves nothing.

**Pair every absence-assertion with a control.** "Nothing bad happened" must run beside "something happened at all", or it passes against code that never ran — one review caught four vacuous passes this way. **Check that "never happened" assertions can fail** — a `calls === 0` assertion on a path where the counter can't increment proves nothing. Make it fail by hand first.

**Fixtures are real captured data.** Classifier tests once asserted on the bare fragment `'execution reverted'`, which never occurs in real errors — the real ones carry a docs URL that a different rule matched first, so real reverts were misfiled as network errors. Green tests, wrong behaviour.

**Test doubles honour their inputs.** A fake `getLogs` that ignores the filter it's handed silently turns every test depending on that filter into a vacuous one.

**Assert at the boundary where damage happens** — the recorded webhook POST body, not stdout, because a leak that only reaches the messaging channel never appears in the console. **Verify deployment claims from inside the running system**, and test the existing-state case (populated DB, root-owned volume), not just fresh state.

**Paths that cannot be faked get run in production with a restricted audience — tester mode.** Staging proves code against a mock; it cannot prove real gas leaves the real treasury. Two DB flags (account capability + entity audience), server-side gating at every surface (listing, lookup → 404, join, in-flight reads, realtime, aggregates), and everything downstream flag-blind so the tester run is the identical pipeline with real (small) stakes. Our first real-money payout ran this way and surfaced three bugs no offline test could reach. Verify at the source of truth, not the UI. Pattern and porting checklist: `tester-mode-pattern.md`.

**Anything that decides who gets paid gets compared byte-for-byte against the other side** — contract, on-chain read, the other route — including the *window* handed to an identical comparator (two comparators can match while their block windows don't). Check fee arithmetic against the live contract value, not a copy. Money/security diffs additionally run `money-path-checklist.md`.

**Test in a normal browser, not only the primary wallet client.** A wallet/provider-tree change once broke the public site in every browser for days while the in-wallet experience stayed fine. Wallet/provider tree changes get loaded in a normal browser too.

**A green check is only as good as what the check runs.** CI that is secret-scanning-only makes every broken PR green. A "TypeScript check" can resolve to npm's placeholder package named `tsc` and certify syntax errors. Know what gates actually verify; the CI in `pm-kit` fails without lint/test scripts and uses `--no-install` for exactly this reason. **A green check reflects the commit it ran on** — a green run that predates the change it needed to guard counts for nothing.

---

## 4. Reviewing

**Review by attempting to refute, with the code running.** Reading diffs catches style; running catches a fix that silently stripped a template's wallet stack, a tarball shipping the files a script existed to exclude, a type checker that wasn't one. **Tier it — uniform max-rigour is a real cost driver:**

- *Mechanical* (renames, quoting, doc paths, green dep bumps): read + confirm what CI ran. No behaviour pass.
- *Logic, new surface, funds/security/release, wallet tree*: full pass — run the suite on the branch and prove tests can go red; build the real artifact (for a scaffolder, the generated project *is* the product); click through the changed surface once (dev server or the CLI command a user would run). Optionally a cloud multi-agent review first as a breadth pass — treat its output as claims to verify, and it never replaces the behaviour pass.

**Verify claims against code, never against the description.** Excellent descriptions are still wrong in places. Half-wrong claims: identify the right half. **Verify the feedback itself before implementing it** — reviewers are claims too; incorrect issue premises have been implemented verbatim when thirty seconds of grep would have caught them.

**Review against current `main`, on the head SHA you think you're reviewing.** Branches go stale in a queue; `gh pr diff` can serve stale content. **When CI is red, first ask what moved** — a runner with a floating Node version once turned main red with no commit behind it, and every open PR looked guilty.

**A PR description is testimony, not evidence** — the review's job is to find where the narrative outran the code. **Recompute the math:** pinned constants, statistical formulas, thresholds — rederive independently before trusting them. Probe the standard edge classes and the fail-open/fail-closed direction of every guard; audit error responses for leaks; check read bounds on write paths. **Separate CI signal:** say which failures are code and which are infra/permissions. **Name what the PR got right** — a request-changes that ends "one round of targeted fixes, not a rethink" gets a better resolution round than a bare defect list; every finding includes the shape of the fix ("one line: strip the flag when block is true"). **For payment paths, auth, or anything moving money: adversarially verify findings** — a second independent pass attempting to refute each — before posting; plausible-but-wrong findings burn author trust and review rounds.

**Independently confirm the highest-severity finding before acting.** A wrong HIGH burns trust; a confirmed one with `file:line` and an attack script is undeniable.

**Every finding: severity · `file:line` · one-sentence defect · concrete failure scenario · suggested fix.** "The rate limits interact badly" is not implementable; "both throttles build the key `ip:<addr>`, `take()` refills at the calling tier, so alternating requests degrades 10/hour to 60/min — namespace them" is a 20-minute fix. **Say what you verified as sound** — it tells the author what not to touch and proves you read the code.

**Verdicts:** `APPROVE` (zero open findings, however small) / `REQUEST-CHANGES` (anything else). There is no approve-with-nits: a PR is not mergeable while any finding is unresolved. A finding resolves as exactly one of: a fix commit on the PR, or — only when genuinely out of scope for the PR — a follow-up issue *filed and linked from the review*, never merely suggested. "Could be a new ticket" / "out of scope" in prose, with no issue behind it, leaves the finding open; deferred work always lands in a filed issue, otherwise it evaporates. **Review the tests as hard as the code:** if nothing realistic would make the suite go red, it's worse than none — it certifies broken output.

**For a queue of PRs, build the conflict matrix mechanically** (`git merge-tree`) and publish the merge order; name the merge-order hazards (shared files, squash retargeting of stacks, signature changes) so the second merger expects the conflict. Sequenced merges can keep every intermediate `main` working across dozens of merges.

---

## 5. Receiving feedback

The review round is where contributor quality is actually measured. In order:

1. **Reproduce before touching anything.** Run the reviewer's scenario and confirm it. If you can't reproduce, say so plainly — and still fix on the evidence if the mechanism is sound. Never implement a fix for a finding you haven't understood: a plausible fix for a misdiagnosed problem is two bugs.
2. **Fix, then audit your own fix** the way the reviewer reviewed the original. If the audit finds a bug in the fix, disclose it unprompted. A fix that silently changes scope is a new unreviewed change.
3. **Report what the fix taught** — not "fixed"/"done": what you reproduced, what changed, what it revealed about adjacent code. If your earlier framing made the bug look smaller than it was, correct the record.
4. **Push back only with a measurement** — an on-chain read, a header trace, a control run — not intuition.
5. **Defer ownership calls.** If a finding opens a design question that belongs to someone else, present options with trade-offs and ask; time-box it ("say what shape you want and I'll push it today"). Don't grow a tightly-scoped PR on your own judgement.

**Answer every review point explicitly: `FIXED` / `NOT-FIXED` / `DISAGREE-because`.** Responses that silently address some points force full re-reviews of everything. Every review ask ends as one of: a commit, a filed follow-up issue, or an explicit "won't do, because…" — never silence.

**Never respond with a silent push.** Push, then comment what changed and which findings it addresses — after a round of silent force-pushes nobody can tell what moved. With squash merges you may rebase/force-push your own branch freely — the *comment* is the rule.

**When review proves your fix wrong, the model response is:** adopt the diagnosis, encode why in the code itself (a "caught in review" doc comment at the site), add the missing assertion, say what you verified. Turnaround beats defensiveness. **Add the test the reviewer says is missing, especially when it would have caught the finding** — high-severity findings usually come with the exact test gap that hid them.

**Answer direct questions in PR threads promptly** — an unanswered go/no-go blocks the author invisibly. If it needs a decision process, convert to an owned issue and say so.

---

## 6. Merging & closing

**Merge what's ready promptly** — an approved PR sitting unmerged makes every stacked PR staler. Keep stacks rebased after the base merges. Call out schema migrations in merge notes.

**Approvals don't survive a re-roll.** A dependency PR once carried a sign-off for one major version after the bot re-rolled it to the next. (The ruleset dismisses stale approvals on push now — but a re-approval is a re-review, not a click.)

**After merging, check what closed.** An issue once closed the second a *related* PR merged — the PR's body said in bold it does not close that issue, and its footer said `Refs` — because a Development-sidebar link outranks anything in the body. It stayed wrongly closed for days. Rules: **sidebar links close issues; prose does not stop them** — unlink what you don't intend to close. **A ticket is done when its acceptance criteria are met, not when a related PR merges** — re-read them before closing. **If closing orphans remaining work, file the successor first** and link it from the closing comment. Run `/post-merge <PR>` after every merge until it's a habit.

**Close issues with evidence, not "done":** name the fixing PR and what was verified. Close stale issues and supersede stale PRs with the same specificity — thank the contributor, cite the superseding commit, invite fresh work (contributors treated this way come back with mergeable PRs). **Every open PR carries a current status:** merged, reviewed with verdict, or what it's waiting on.

**Closing a PR without merging — capture what it proved.** Unmerged work often contains proven pieces (a working flow, validated thresholds). Identify what's reusable, capture it in the issue that carries the work forward with file links pinned to the PR's head SHA, close with a comment saying why and where the value went, keep the branch unless there's a reason to delete. **When CI goes red:** diagnose to root cause, prove it with a control run (no code change), file the diagnosis as an issue so it outlives the PR. Policy calls (retries, concurrency limits) go to the maintainer, flagged — not decided unilaterally.

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

Calibration, from one four-day overhaul: day 1, zero of six templates built; day 4, seven of seven built end-to-end with CI gating on a real scaffold suite. The delta was verification applied uniformly to everyone's claims, including our own.

---

## 9. Close calls — and what we chose

Places where reasonable conventions pulled in different directions; the decision and the reasoning:

- **Branch naming.** Candidates: `feat/<slug>`, `<handle>/<slug>`, `type/<issue>-<slug>`. Chose `<handle>/<issue>-<slug>`: the type already lives in the Conventional-Commit PR title (so a type prefix is redundant), the handle answers "whose is this" for cleanup and bots (`renovate/` already works this way), and the issue number links branch → ticket without a lookup.
- **"Squash to logical commits whose messages carry rationale and trailers" vs squash-merge-to-one-commit.** The repo squashes with PR title as subject and PR body as message, so the *PR body* is where rationale, verification, limits, and trailers live — the same content, in the place the platform actually preserves. Intermediate commits on the branch can be whatever helps you; they don't reach `main`.
- **PR template shape.** What & why / Scope-not / Judgement calls / Verification / Merge order. The one section teams usually lack is **Judgement calls** — it's now its own section.
- **"One issue per problem" vs "cluster findings".** Not actually opposed: cluster by *fix boundary* (same-diff test) and split by *schedule/priority* (different-schedule test). Both tests are in §1.
- **Required review-thread resolution (ruleset) vs approve-with-nits.** Both rejected. Mechanical thread resolution is click-blocking, not review quality — the ruleset doesn't require it. But approve-with-nits is gone too: no approval while any finding is open, however small. Every review point ends as a fix commit, a *filed* follow-up issue, or an explicit won't-do agreed in the thread (§4, §5).
- **"Require branch up to date" vs the parallelism tax of many small PRs on shared files.** Kept strict up-to-date — stale-head merges have broken production; the tax is a click and a CI run. If the queue gets deep (>~5 concurrent PRs on shared files), enable GitHub **merge queue**, which performs the up-to-date test automatically and removes the clicks. Auto-merge on.
- **Squash-only vs stacked PRs.** Squash makes stacks slightly more work (second-lander rebases `--onto main`). Kept squash — the clean linear log and title-as-commit are worth more than stack convenience; keep stacks ≤ 2 deep and prefer independent branches off `main`.
- **Priority labels.** `priority:critical|high|medium|low` over `P0/P1/P2` — the word "critical" carries its own definition; P0 doesn't.
- **Force-push.** "Never respond with a silent force-push" vs squash culture where rebasing your own branch is normal. Resolution: force-pushing *your own PR branch* is fine; the rule is *announce what changed*. Never force-push shared branches or `main` (ruleset blocks it anyway).
- **Review effort.** Uniform max-rigour review vs cost. Chose tiered (§4); a real CI suite is what makes the light tier safe, which is why CI comes first.
