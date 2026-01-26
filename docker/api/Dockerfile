# Build stage - Using Debian slim for better Prisma/OpenSSL compatibility
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY libs/database/package*.json ./libs/database/
COPY libs/redis/package*.json ./libs/redis/
COPY libs/shared/package*.json ./libs/shared/

RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build only the API for production
RUN cd apps/api && npx nest build

# Production stage
FROM node:20-bookworm-slim AS production

WORKDIR /app

# Install OpenSSL and other required libraries for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -m -u 1001 -g nodejs nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
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

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

# Start the application
CMD ["./entrypoint.sh"]

# Development stage
FROM node:20-bookworm-slim AS development

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY libs/database/package*.json ./libs/database/
COPY libs/redis/package*.json ./libs/redis/
COPY libs/shared/package*.json ./libs/shared/

RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "start:dev"]
