# aolausoro.tech

Personal portfolio and content site for Adewoyin Oladipupo-Usoro. Payload CMS
(admin at `/admin`) + Next.js App Router frontend, MongoDB, deployed as a
standalone Docker image.

## Getting started

```bash
cp .env.example .env         # fill in DATABASE_URL + PAYLOAD_SECRET at minimum
docker compose up -d mongo   # or point DATABASE_URL at MongoDB Atlas
pnpm install
pnpm dev                     # http://localhost:3000
```

Create the first admin user from the on-screen prompt at `/admin`.

## Commands

See `AGENT.md` § Commands for the full list. Common ones: `pnpm dev`,
`pnpm run build`, `pnpm run lint`, `pnpm exec tsc --noEmit`,
`pnpm run test:int`, `pnpm run test:e2e`.

## Working in this repo

- `AGENT.md` / `CLAUDE.md` — orientation for AI agents and contributors
- `CONTEXT.md` — domain glossary
- `docs/deployment-plan.md` — how production is deployed
- `docs/payload-cms-integration.md` — the Payload migration notes
- `docs/superpowers/` — specs and implementation plans
- `docs/agents/` — how agents consume the issue tracker and domain docs

## Status

Mid-migration from a Clerk + Prisma + Redux + inversify stack onto Payload CMS,
and **not finished**: Clerk, Prisma, Redux, inversify, Sentry, and Cloudinary
are all still installed and imported. `pnpm run lint`, `pnpm exec tsc --noEmit`,
and `pnpm run build` currently fail on pre-existing legacy-code errors — that is
Phase 3 work (see `AGENT.md`). Production only — no staging environment.
