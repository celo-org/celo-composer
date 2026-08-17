# Recurring-defect checklist — run against any security- or money-path diff

Each item caught at least one real finding (hardening PRs #49–#82, mondeto, agent-assisted-dev rounds). Reviewers and `/review-pr` run this item by item; authors run it before opening the PR.

1. **Self-referential verification** — is X checked against a value derived from X? (#75: receipt's token address compared to the log's own address.) Anchor checks to config/allowlists, never to the untrusted input.
2. **Defaults on the money path** — any `?? fallback` where the fallback has value? (#75: unknown token `?? "USDC"`.) Unknown means reject-and-alert, never a default.
3. **Shared keyspaces** — do two limiters/caches/locks build the same key? (#82: `ip:<addr>` shared by two throttles with different tiers.) Namespace per purpose.
4. **One-shot checks** — does a safety check latch on first failure and never retry? (#75: decimals check latched false on a transient RPC error.) Distinguish "refuted" from "unreachable"; only refuted may latch.
5. **Unbounded wedge + alert flood** — can one poisoned item pin a cursor or queue forever, and does its alert re-fire every tick? Bound retries, dedup alerts. (#75/#78; two wedge incidents in that codebase.)
6. **Silent-stall siblings** — for every loud failure path, is there a quiet branch that resets the failure counter? (#78: pending-log branch stalled with no alert while the tick "succeeded".)
7. **Upgrade path on existing state** — migrations against a populated DB, deploys against a root-owned volume, compose changes on a box mid-layout-change. Fresh-state testing proves nothing about the box you have. (#74, #77.)
8. **Cap semantics** — does the limit bind the actual resource or a client claim? (#82: `Content-Length` checked, chunked bodies still fully buffered.) Name which layer holds the real bound.
9. **Docs/code drift** — do README, bootstrap, examples, and error strings still describe the world this diff creates? (#74 README; #76's stale "recipient is not the treasury".)
10. **Test-double honesty** — does every fake honour the arguments it receives, and can every "never happened" assertion actually fail? (#76/#78 filter-ignoring fake; #82 vacuous counter.)
11. **Payout parity** — anything that ranks or pays: compared byte-for-byte against the other side (contract `fee = price * bps / 10000`, live `feeRate()`, the other route), including the *window* handed to an identical comparator (mondeto #48, #223, #224).
12. **Fee omission in every path** — if a fee/discount is subtracted in one code path, is it subtracted in all paths that serve users? (mondeto #182: log-scan path fixed, subgraph path — production — identical defect.)
13. **Error-body leakage** — what does each 4xx/5xx reveal? Exact scores are gradient oracles; flags are detection oracles. Fail-open or fail-closed decided per check, written down, and matched by the code (agent-std).
14. **Read bounds on write paths** — every read is bounded at the query (`take(limit)`), never collect-then-slice; no fail-open catch around an unbounded read (agent-std).
15. **Silent config fallbacks** — no `?? default` for critical config; unset/unrecognised is an error. Env compared exactly (`printf`, not `echo`); build-inlined vars need a rebuild; secrets checked for presence, never printed (agent-std).
16. **Guarantee-on-every-path** — for each prose guarantee ("never reveals X", "payment flow untouched"), point at the test asserting it on the *rejected/failure* path (agent-std).
17. **Threshold bands and boundaries** — the band between two thresholds, `>=` vs `>` at exact values, Unicode/empty input, concurrent duplicate requests (agent-std).
18. **Has it run in anger?** — for a path that moves real money / sends real messages / writes to a third party: was it exercised in production via **tester mode** (restricted audience, identical pipeline, small stake, verified at the source of truth) before public launch? If the app has no tester mode yet, that's the first ticket — see `tester-mode-pattern.md`. And `grep` the audience flag: it must not appear downstream of access control.
