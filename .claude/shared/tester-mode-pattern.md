# Tester mode — run real paths in production with a restricted audience

Synced from `pm-kit`. Generic pattern; the worked example is mini-quiz (see end).

## Why it exists

Some paths cannot be meaningfully faked: anything that moves money, spends gas, sends a real message, or writes to a third-party system. A staging environment proves the code typechecks against a mock; it does not prove that real gas gets spent from the real treasury and the real receipt comes back. Tester mode lets you run the *identical* production pipeline with real (small) stakes, visible only to a handful of internal accounts.

It has already paid for itself: our first native-CELO payout ran this way and surfaced three bugs that no offline test could have found — all three lived in the gap between "the code typechecks" and "real gas was spent from the real treasury".

## The model: restrict the audience, never the behaviour

Two flags, both **database columns** (not config, not env — toggling must never need a deploy):

| Flag | Lives on | Meaning |
|---|---|---|
| capability flag, e.g. `isTester` | the **account** | this account may see and act on tester-only entities |
| audience flag, e.g. `testerOnly` | the **entity** (quiz, campaign, map, product, drop…) | visible only to tester accounts |

Toggle both from the admin surface. Index the audience flag together with whatever the public listing filters on, so the public query stays cheap.

## Enforcement: server-side, at every surface

The frontend never decides. Every check runs in the API, and **each surface is gated independently** — one leaked room code or one missed UI condition must expose nothing. The honest work of porting this pattern is *enumerating the surfaces*; the checks themselves are one-liners. The standard set:

| Surface | Behaviour for non-testers |
|---|---|
| Listing / feed / search | filtered out **in the query**, not post-filtered |
| Direct lookup by id/code/slug | **404, not 403** — existence is part of what's hidden; probing confirms nothing |
| Join / mutate / submit | rejected with a specific error code |
| In-flight reads (state, results, progress) | **re-checked on every call** — no riding along mid-flow with a leaked code |
| Realtime (SSE / websocket / push) | checked at subscribe time |
| Aggregates (leaderboards, stats, analytics, exports) | **decide explicitly per aggregate** — see the gap below |
| Notifications / emails / social posts | tester entities never trigger public-facing sends |
| Deep links / OG previews / sitemaps | 404 / excluded |

Identity comes from the same auth the endpoints already use — there is no separate "tester API".

## The part that makes it valuable: downstream is flag-blind

Scheduler, scoring, payout, settlement, treasury, messaging workers contain **zero** references to the audience flag. A tester run is not a simulation; it is the identical pipeline with real prizes, real gas, real transfers. The only restricted dimension is *who can see it*.

Keep it this way. A sandbox branch inside the payment code means the one path you most need to prove — real money moving — is exactly the path a test never runs. **Do not add tester awareness downstream of access control.** (Reviewers: grep for the flag; if it appears in a worker or a payment module, that's a finding.)

## Running a production test

1. Mark participating accounts as testers.
2. Create the entity with a **small** stake, tick tester-only, schedule/publish it.
3. Preflight (funding, config) runs at creation/scheduling time, not at payout time — an underfunded run is refused before it exists, so you never drain a treasury to test the failure path.
4. **Verify results at the source of truth** — on-chain balance delta = prizes + gas, the third-party's own ledger, the recorded webhook body — not from your UI. The UI is one of the things under test.
5. Write up what the run proved and what it surfaced, with tx hashes, in the issue that tracked the launch. Numbers from the run become pinned tests.

## Known gap to decide up front: aggregates

Every app has some surface that sums over activity — a leaderboard, "total volume", analytics, a public counter. Tester activity flows into it unless excluded. Small volumes make it tolerable *today*, but it is an unexamined edge, not a decision. Decide per aggregate whether tester rows are included, record it in the repo's decisions doc, and pin the choice in a test. It is easier to exclude tester rows on day one than to explain a test artifact on a public board later. If aggregate standing ever gates prizes or promotion, exclusion becomes mandatory.

## Porting checklist (use in the PR that introduces it)

- [ ] Two DB flags (account capability, entity audience), admin-togglable, no deploy
- [ ] Every surface in the table above enumerated for this app and gated server-side; listing filters in the query
- [ ] 404 for hidden entities on direct lookup
- [ ] Re-check on in-flight reads and realtime subscribe
- [ ] `grep -r <audienceFlag>` shows nothing downstream of access control
- [ ] Aggregate decision recorded and pinned in a test
- [ ] Preflight at creation time; smallest viable stake documented
- [ ] Verification recipe written down: where the source of truth is and what delta to expect
- [ ] Doc's update triggers listed (new public surface, flag-semantics change, aggregate decision)

## Worked example: mini-quiz

`User.isTester` / `Quiz.testerOnly` in `apps/api/prisma/schema.prisma`; composite index `[kind, testerOnly, status, scheduledStart]`. Enforced in `routes/quizzes.public.ts` (listing filter, by-code → 404), `routes/rooms.ts` (404 not 403), `services/room.service.ts` (`joinRoom` → `TESTER_ONLY`; lobby/submit/results re-checked per call), `routes/room-events.ts` (SSE subscribe). Viewer identity via `services/tester-access.service.ts`. Downstream (scheduler, scoring, payout worker, treasury) flag-blind. Known gap: `services/leaderboard.service.ts` and admin analytics aggregate tester XP/answers — acceptable while testers are internal and volumes tiny; decide per-aggregate if standing ever gates prizes. Update triggers: new public quiz surface (route, SSE channel, aggregate); change to flag semantics; the aggregate decision.
