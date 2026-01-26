<<<<<<< Local
# Build stage - Using Debian slim for better Prisma/OpenSSL compatibility
FROM node:20-bookworm-slim AS builder
=======
# Build stage - use slim for consistent Prisma binary compatibility
FROM node:20-slim AS builder
>>>>>>> Remote

WORKDIR /app

<<<<<<< Local
# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

=======
# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

>>>>>>> Remote
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

<<<<<<< Local
# Production stage
FROM node:20-bookworm-slim AS production
=======
# Production stage - use slim for OpenSSL 1.1 compatibility with Prisma
FROM node:20-slim AS production
>>>>>>> Remote

WORKDIR /app

<<<<<<< Local
# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*

=======
# Install OpenSSL and other required libraries for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

>>>>>>> Remote
# Create non-root user for security
<<<<<<< Local
RUN groupadd -g 1001 nodejs && \
    useradd -m -u 1001 -g nodejs nestjs
=======
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -m nestjs
>>>>>>> Remote

<<<<<<< Local
# Copy built application (preserves nested path structure from TypeScript compilation)
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
=======
# Copy built application - preserve the dist structure for path resolution
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
>>>>>>> Remote
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Create the expected 'src' directories for lib path resolution
# The compiled code expects libs/*/src/ but the build outputs to libs/*/
RUN mkdir -p dist/libs/database/src dist/libs/redis/src dist/libs/shared/src && \
    cp dist/libs/database/*.js dist/libs/database/*.d.ts dist/libs/database/src/ 2>/dev/null || true && \
    cp dist/libs/redis/*.js dist/libs/redis/*.d.ts dist/libs/redis/src/ 2>/dev/null || true && \
    cp -r dist/libs/shared/*.js dist/libs/shared/*.d.ts dist/libs/shared/dto dist/libs/shared/src/ 2>/dev/null || true

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

<<<<<<< Local
# Start the application (path matches TypeScript outDir structure)
CMD ["node", "dist/apps/api/src/main.js"]
=======
# Start the application with migrations
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/apps/api/src/main.js"]
>>>>>>> Remote

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
