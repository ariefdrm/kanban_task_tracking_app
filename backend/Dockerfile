# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client, then compile NestJS.
# NestJS sourceRoot="src" → output lands in dist/ (not dist/src/).
# The compiled import "../generated/prisma/client" from dist/prisma/* therefore
# resolves to dist/generated/prisma — copy the generated JS client there.
RUN bunx prisma generate
RUN bun run build
RUN cp -r src/generated dist/generated

# ─── Stage 3: Production ──────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Install production deps only (prisma is in dependencies — needed for migrate deploy)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Compiled application + generated Prisma client
COPY --from=builder /app/dist ./dist

# Migration files (prisma migrate deploy reads these at startup)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

COPY entrypoint.sh ./
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
