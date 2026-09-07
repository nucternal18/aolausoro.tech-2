# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-07.md`

## Standing context

- **Phase 2 (project-config replication from the `equilibrium` sibling project)
  is complete, reviewed, and pushed.** Branch `feature/refactor-portfolio`,
  HEAD `644d51d`, on `origin`. The integration decision (merge to `main` /
  open a PR / keep as-is) is still open — **do not merge to `main` yet**, the
  branch build is deliberately red pending Phase 3. Plan + spec:
  `docs/superpowers/{plans,specs}/2026-09-06-equilibrium-config-replication*`.
- **Phase 3 (finish the Payload migration + dependency prune) is scoped but not
  started** — see the latest dated handoff § Next steps and the spec's § 8.
- `pnpm run lint`, `pnpm exec tsc --noEmit`, and `pnpm run build` all fail on
  pre-existing legacy-code errors. Expected Phase 3 work — `AGENT.md`
  § Migration in progress. In-scope Phase 2 gates (`pnpm run test:int`,
  `prettier --check`, `tsc ≤ 156`) are green.
- `payload.config.ts` does not fully load (`Posts` → unregistered `categories`
  collection) — first Phase 3 blocker to clear.
- Deployment infra (droplet, Atlas, Cloudflare, self-hosted runner, GH Actions
  secrets) is not provisioned; `deploy-production.yml` is
  `workflow_dispatch`-only and CI's lint/typecheck/build/prisma steps are
  `continue-on-error`. `docs/deployment-plan.md` tracks status and open
  follow-ups.
- The full SDD execution ledger (rulings, per-task reviews, reports) lives at
  `.superpowers/sdd/2026-09-06-equilibrium-config-replication/` — gitignored,
  local only.
