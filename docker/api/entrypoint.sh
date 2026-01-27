#!/bin/sh
set -e

# Migrations should be run separately in CI/CD, not on every startup
# Uncomment below only for initial deployment:
# echo "Running database migrations..."
# npx prisma migrate deploy

echo "Starting application..."
exec node apps/api/dist/main.js
