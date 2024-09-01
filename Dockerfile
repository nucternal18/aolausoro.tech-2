# Use the official Node.js 14 image as the base
FROM node:20.17.0-alpine3.20 AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
# Install dependencies based on the preferred package manager
COPY package.json ./
RUN npm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder

# add environment variables to client code
# ARG NEXT_PUBLIC_CLOUDINARY_NAME
# ARG NEXT_PUBLIC_CLOUDINARY_PRESET
# ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
# ARG NEXT_PUBLIC_API_URL
# ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL

# ENV NEXT_PUBLIC_CLOUDINARY_NAME=$NEXT_PUBLIC_CLOUDINARY_NAME
# ENV NEXT_PUBLIC_CLOUDINARY_PRESET=$NEXT_PUBLIC_CLOUDINARY_PRESET
# ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Copy the .env file to the container
COPY ./.env /app/.env
COPY ./.env.local /app/.env.local

ARG NODE_ENV=production
ARG NEXT_TELEMETRY_DISABLED=1
# RUN NODE_ENV=${NODE_ENV} yarn build
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED
ENV NODE_ENV=$NODE_ENV

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npx prisma generate && npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# You only need to copy next.config.js if you are NOT using the default configuration. 
# Copy all necessary files used by nex.config as well otherwise the build will fail.
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/app ./app
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]