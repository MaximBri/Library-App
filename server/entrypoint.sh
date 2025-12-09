#!/bin/sh
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
DB_USER=${POSTGRES_USER:-postgres}

echo "Waiting for Postgres at $DB_HOST:$DB_PORT..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
  printf '.'
  sleep 1
done
echo ""
echo "Postgres is ready."

echo "Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "Checking database state..."
TABLE_EXISTS=$(psql "${DATABASE_URL}" -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'User');")

if [ "$TABLE_EXISTS" = "f" ]; then
  echo "Database is empty. Running prisma db push to create schema..."
  npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss
else
  echo "Database exists. Running migrations..."
  npx prisma migrate deploy --schema=./prisma/schema.prisma || {
    echo "Migration failed. Trying db push as fallback..."
    npx prisma db push --schema=./prisma/schema.prisma
  }
fi

echo "Running seed script..."
npm run prisma:seed || echo "Seed script completed (admin may already exist)"

echo "Starting app..."
exec npm start