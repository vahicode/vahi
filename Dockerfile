# Start from NodeJS on Debian Buster (slim) and avoid all the MUSL issues of Alpine
FROM node:16-buster-slim as builder

# We need openssl for prisma, add sqlite for convenience
RUN apt-get update && apt-get install -y openssl sqlite3

# Keep everything in /vahi
WORKDIR /vahi

# Create user/group to run the app
#RUN addgroup --system --gid 1001 vahi
#RUN adduser --system --uid 1001 vahi
#USER vahi

# Copy package info & install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy source
COPY . .

# Copy in an empty db
#COPY db/schema.db ./db/vahi.db

# Build
RUN yarn build

# Copy in dependencies and build artifacts
#COPY --chown=vahi:vahi node_modules ./
COPY .next/standalone ./
COPY .next/static ./.next/static

# Add prisma
RUN npx prisma generate

# Install PM2 process manager
RUN npm install pm2 -g

EXPOSE 3000
ENV PORT 3000

# Run NextJS under PM2
CMD ["pm2-runtime", "server.js"]
