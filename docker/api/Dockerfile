# Build stage - Using latest LTS with security patches
FROM docker.io/library/node:20.18.1-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL and security updates (required by Prisma)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

# Update npm to latest secure version
RUN npm install -g npm@latest

# Install dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY libs/database/package*.json ./libs/database/
COPY libs/redis/package*.json ./libs/redis/
COPY libs/shared/package*.json ./libs/shared/

RUN npm ci --audit --production=false

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build only the API for production
RUN npm run build --workspace=api

# Production stage - Hardened image
FROM docker.io/library/node:20.18.1-bookworm-slim AS production

WORKDIR /app

# Install security updates and minimal runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    dumb-init \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -m -u 1001 -g nodejs nestjs

# Copy built application from correct location
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/tsconfig.json ./tsconfig.json

# Copy libs with compiled dist directories for path resolution
COPY --from=builder --chown=nestjs:nodejs /app/libs ./libs

# Copy entrypoint script
COPY --chown=nestjs:nodejs docker/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check with reduced privileges
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the application with dumb-init
CMD ["/usr/bin/dumb-init", "--", "./entrypoint.sh"]

# Development stage
FROM docker.io/library/node:20.18.1-bookworm-slim AS development

WORKDIR /app

# Install OpenSSL and security updates (required by Prisma)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

# Update npm to latest secure version
RUN npm install -g npm@latest

# Install dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY libs/database/package*.json ./libs/database/
COPY libs/redis/package*.json ./libs/redis/
COPY libs/shared/package*.json ./libs/shared/

RUN npm ci --audit

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "start:dev"]
