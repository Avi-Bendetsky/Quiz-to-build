#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node -r tsconfig-paths/register dist/apps/api/main.js
#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node -r tsconfig-paths/register dist/apps/api/main.js
