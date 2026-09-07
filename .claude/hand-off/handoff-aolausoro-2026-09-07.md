# Handoff — 2026-09-07

## What was done

Executed **all 11 tasks** of Phase 2 of the equilibrium config-replication plan
(`docs/superpowers/plans/2026-09-06-equilibrium-config-replication.md`, spec
`docs/superpowers/specs/2026-09-06-equilibrium-config-replication-design.md`):

1. `.npmrc`, `.editorconfig`, `pnpm-workspace.yaml`, `.vscode/settings.json`.
2. Prettier config + full-repo reformat (semi-free, single-quote, width 100).
3. Flat `eslint.config.mjs`; husky + lint-staged; `lint` / `lint:fix` scripts.
4. Dependency alignment — Payload 3.86.0, Next 16.2.6, React 19.2.6; kept
   `@types/node@24` + `typescript@5.9`; adopted `payload-totp`.
5. TypeScript `include`/`exclude`; jest + cypress → vitest + playwright.
6. `next.config.mjs` — enabled `output: 'standalone'`, merged the duplicated
   `experimental` key, added `turbopack.root`; postcss deps; `.gitignore`.
7. `app/api/health/route.ts` — static `/api/health` endpoint.
8. Multi-stage standalone `Dockerfile` + `deploy/` (nginx `production.conf`,
   `docker-compose.production.yml`, `setup-droplet.sh`); loopback-bound dev
   `docker-compose.yml`.
9. `.github/workflows/ci.yml` + `deploy-production.yml` (replaced
   `node.js.yml`).
10. Installed `payload` + `cms-migration` + `health-check` skills under
    `.claude/skills/` (symlinked from `.agents/skills/`); `skills-lock.json`.
11. This docs scaffold — `AGENT.md`, `CLAUDE.md`, `CONTEXT.md`,
    `docs/agents/{domain,issue-tracker}.md`, `docs/deployment-plan.md`,
    `docs/adr/`, `.claude/hand-off/`, `.env.example`, rewritten `README.md`;
    moved `PAYLOAD_CMS_INTEGRATION.md` → `docs/payload-cms-integration.md`;
    deleted `update-dep.sh`.

### Deviations / fixes made along the way

- **Task 1:** a `pnpm.overrides` entry had to be corrected for the install to
  resolve.
- **Task 4:** 3 import statements were fixed to unblock the dependency bump.
- **Task 5:** `tests/int/api.int.spec.ts` is skip-guarded (needs a real Mongo);
  the `/api/health` tests mock their dependencies rather than hitting a live
  server.
- **Task 9:** the CI `Lint`, `Type-check`, and `Build` steps are
  `continue-on-error: true` — the legacy code does not pass them yet. The
  `deploy-production.yml` push-to-`main` trigger is commented out; only
  `workflow_dispatch` is active.

## Key decisions

- Production-only deploy — no staging (per user).
- No dependency removals this phase — the entire Clerk / Prisma / Redux /
  inversify / Sentry / Cloudinary prune is deferred to Phase 3.
- CI gates kept soft (`continue-on-error`) rather than blocking, so the pipeline
  is exercised now and tightened when Phase 3 lands a green baseline.

## Known issues / open (Phase 3 work — not regressions)

- `pnpm run lint` (44 ESLint errors), `pnpm exec tsc --noEmit` (154 errors), and
  `pnpm run build` (Clerk async Server Actions + Prisma-6 mongodb wasm
  resolution) all fail. Tracked in `AGENT.md` § Migration in progress.
- `payload.config.ts` does not fully load — `Posts` references an unregistered
  `categories` collection.
- `deploy-production.yml` is inert until the droplet + runner + secrets exist,
  and its `build` job still needs a `permissions: { packages: write }` block —
  see `docs/deployment-plan.md` § Known follow-ups.
- `/api/health` vs the Payload catch-all `app/(protected)/api/[...slug]/route.ts`
  — first successful prod build must confirm no "parallel routes" error.

## Next steps

1. **Phase 3:** brainstorm + scope finishing the Payload migration and the
   dependency prune (register `categories`, port `Posts` blocks, replace Clerk
   auth, drop Prisma / Redux / inversify / Cloudinary).
2. Provision deployment infra (see `docs/deployment-plan.md` status table), then
   re-enable the push-to-`main` deploy trigger and drop the CI
   `continue-on-error` flags.
3. Triage the 44 ESLint errors and 154 tsc errors.

## Suggested Skills

- `/superpowers:brainstorming` — Phase 3 scoping
- `/health-check` — before any Phase 3 implementation
- `/payload` — for the collection / auth / config work Phase 3 entails
