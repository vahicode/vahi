# Base image: Start from NodeJS on Debian Buster (slim) and avoid all the MUSL issues of Alpine
FROM node:16-buster-slim as base

# We need openssl for prisma
RUN apt-get update && apt-get install libssl-dev -y

# Keep everything in /vahi
WORKDIR /vahi

# Copy package info so we have everything to install dependencies
COPY package.json yarn.lock ./




# Builder image: Build NextJS
FROM base as builder

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Generate prisma client
RUN npx prisma generate

# Build NextJS
RUN yarn build




# Production build image: Generate production dependencies
FROM base as prod-build

RUN yarn install --production
COPY prisma prisma
RUN npx prisma generate
RUN cp -R node_modules prod_node_modules



# Final image we'll run in production
FROM base as prod
WORKDIR /vahi

# Install PM2 process manager
RUN npm install pm2 -g

# Copy in dependencies and build artifacts
COPY --from=prod-build /vahi/prod_node_modules /vahi/node_modules
COPY --from=builder /vahi/public ./public
COPY --from=builder /vahi/scripts ./scripts
COPY --from=builder /vahi/api ./api
COPY --from=builder /vahi/db ./db
COPY --from=builder /vahi/prisma ./prisma
COPY --from=builder /vahi/next.config.mjs /vahi/next-i18next.config.js /vahi/package.json /vahi/vahi.config.mjs /vahi/yarn.lock /vahi/process.yml ./
COPY --from=builder /vahi/.next/standalone ./
COPY --from=builder /vahi/.next/static ./.next/static
# Generate Prisma client (yeah, again because it tends to not work otherwise)
RUN npx prisma generate

# Expose and set port
EXPOSE 3000
ENV PORT 3000
ENV VAHI_DOCKER 1

# Run NextJS under PM2
CMD ["pm2-runtime", "process.yml"]
