FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm config set store-dir /root/.local/share/pnpm/store && \
    pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time env: generateStaticParams queries the DB, and payload.config resolves
# the storage adapter (requires S3_* when STORAGE_PROVIDER=s3) at module load.
# These ARGs live only in this discarded builder stage — not in the final image.
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_CDN_URL
ARG NEXT_PUBLIC_SITE_NAME
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG STORAGE_PROVIDER
ARG S3_BUCKET
ARG S3_REGION
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_ENDPOINT
ENV DATABASE_URL=$DATABASE_URL \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    NEXT_PUBLIC_CDN_URL=$NEXT_PUBLIC_CDN_URL \
    NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    STORAGE_PROVIDER=$STORAGE_PROVIDER \
    S3_BUCKET=$S3_BUCKET \
    S3_REGION=$S3_REGION \
    S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
    S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY \
    S3_ENDPOINT=$S3_ENDPOINT
RUN --mount=type=cache,target=/app/.next/cache pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# next start re-reads next.config.js at runtime (it imports imageHosts.mjs);
# without these the image remotePatterns are lost and /_next/image 400s.
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/src/starter/imageHosts.mjs ./src/starter/imageHosts.mjs
COPY --from=builder /app/src/payload-types.ts ./src/payload-types.ts
COPY --from=builder /app/starter.config.ts ./starter.config.ts
COPY --from=builder /app/src/migrations ./src/migrations
EXPOSE 3000
CMD ["pnpm", "start"]
