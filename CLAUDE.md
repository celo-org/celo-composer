# CLAUDE.md — @celo/celo-composer

<!-- Repo-owned. Keep it LEAN: a router. Shared rules are imported below and synced from pm-kit —
     don't restate them here. Every Claude session (local, Cowork, CI action) reads this. -->

## What this project is

CLI tool (`npx @celo/celo-composer@latest create`) that scaffolds Celo dApp starter
kits: Turborepo/PNPM monorepos with Next.js, TypeScript, Tailwind, and shadcn/ui.
Users pick a template (basic web app, MiniPay, Farcaster miniapp, AI chat, x402 paid
API), a wallet provider (RainbowKit, Thirdweb), and an optional contracts framework
(Hardhat, Foundry). Published to npm; used by developers starting new Celo projects.

## Commands

- Install: `pnpm install`
- Dev: `pnpm dev` (runs the CLI via tsx)
- Tests: `pnpm test` (jest) — run after EVERY change
- Lint: `pnpm lint` · Typecheck: `pnpm build` (tsc; there is no separate typecheck script)
- Build: `pnpm build`

## Architecture pointers

- `src/index.ts` — CLI entry (bin: `celo-composer`); `src/commands/create.ts` — the create command.
- `src/generators/` — plop-based scaffolding logic + jest tests (scaffold smoke, template wiring).
- `src/utils/` — path resolution, safe copy, template registry, input validation.
- `templates/` — the actual dApp templates that get copied into generated projects (base, minipay, farcaster-miniapp, ai, x402, wallets, contracts).
- `docs/` — Mintlify docs (getting started, CLI reference, integrations).

## Team rules (shared, synced — read them)

@.claude/shared/engineering-rules.md

Money/security diffs additionally run: @.claude/shared/money-path-checklist.md
Before a real-money / real-send path goes public, it runs in production behind tester mode: @.claude/shared/tester-mode-pattern.md

The ten you must never violate, even without reading the above:
1. Never push to `main`. Branch `<handle>/<issue>-<slug>` → PR → squash. Title = the commit on `main` (Conventional Commits, scoped, outcome).
2. One concern per PR, one fix-unit per issue, one priority per issue.
3. Every change ships the test that fails on pre-fix code, through the seam it touches (route/CLI/component), and any prose guarantee is tested on its failure path. State the mutation count in the PR.
4. `Closes #N` only if every acceptance box is met; otherwise `Refs #N`. After merge, check what actually closed.
5. Every claim in an issue/PR/review is evidence-backed: commands + output, `file:line`. "Confirmed" means you ran it. Measured over reasoned — thresholds and constants pinned in a test, not a comment.
6. Say what the PR does NOT do (with numbers). Say what it actually does, even beyond the ticket. Flag judgement calls and bundled product changes for the maintainer.
7. On review feedback: reproduce first, fix, audit your own fix, report what it taught. Answer every point FIXED / NOT-FIXED / DISAGREE-with-measurement; never a silent push; never delete a wrong claim — strike it through.
8. Use only existing labels: `bug` `enhancement` `chore` `priority:critical|high|medium|low` `status: triage`. Never invent labels.
9. Ask before anything outward-facing or irreversible (external repos, posting, deleting, force-pushing shared branches). Propose, never execute.
10. No secrets in diffs. New env vars → `.env.example` + runbook, in the same PR.

Use the plugin commands: `/file-issue`, `/write-pr`, `/review-pr`, `/post-merge`, `/close-pr`.

## Product context

- README.md — features, usage, template matrix.
- docs/ — published docs (Mintlify); CHANGELOG.md — release history.

## Gotchas

- The generated output is the product. Any change under `templates/` must be verified by scaffolding a project with the CLI and building the generated project — the CLI building is not enough.
- Releases: git tag `v*` must equal `package.json` version (CI enforces this); CHANGELOG.md needs an entry for each release.
- Packing prunes files (`scripts/prepack-prune.cjs` / `postpack-restore.cjs`) — check them before adding files the published package needs.
