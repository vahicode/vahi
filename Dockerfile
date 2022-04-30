# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /vahi
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /vahi
COPY --from=deps /vahi/node_modules ./node_modules
COPY . .

# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /vahi

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 vahi
RUN adduser --system --uid 1001 vahi

COPY --from=builder /vahi/api ./api
COPY --from=builder /vahi/db ./db
COPY --from=builder /vahi/markdown ./markdown
COPY --from=builder /vahi/prisma ./prisma
COPY --from=builder /vahi/public ./public
COPY --from=builder /vahi/scripts ./scripts
COPY --from=builder /vahi/next.config.mjs ./
COPY --from=builder /vahi/package.json ./package.json
COPY --from=builder /vahi/vahi.config.mjs ./vahi.config.mjs

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=vahi:vahi /vahi/.next/standalone ./
COPY --from=builder --chown=vahi:vahi /vahi/.next/static ./.next/static

# Install PM2 process manager
RUN npm install pm2 -g

USER vahi
EXPOSE 3000
ENV PORT 3000

# Run NextJS under PM2
CMD ["pm2-runtime", "server.js"]
