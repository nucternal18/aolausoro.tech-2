# Multi-stage standalone build. Requires `output: 'standalone'` in next.config.mjs.
# Adapted from the Next.js with-docker example and the equilibrium project.
FROM node:22.19.0-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# pnpm-workspace.yaml carries the allowBuilds approvals — without it here,
# `pnpm i --frozen-lockfile` hard-fails with ERR_PNPM_IGNORED_BUILDS.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the build output — must be set before
# `next build`, not just at container runtime.
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLOUDINARY_NAME
ENV NEXT_PUBLIC_CLOUDINARY_NAME=$NEXT_PUBLIC_CLOUDINARY_NAME
ARG DO_SPACES_CDN_ENDPOINT
ENV DO_SPACES_CDN_ENDPOINT=$DO_SPACES_CDN_ENDPOINT

# Payload initializes against a real, reachable (disposable) DB during
# `next build` for generateStaticParams. These must NOT be real secrets.
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET

# Sentry source-map upload during build (optional; no-ops without the token).
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Baked into the client bundle at build time (not secret — Sentry DSNs are
# public by design). P3.3c wires this as a GH Actions secret/build-arg.
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN

ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm && pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD HOSTNAME="0.0.0.0" node server.js
