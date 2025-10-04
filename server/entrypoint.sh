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

echo "Running prisma migrate deploy..."
if npx prisma migrate deploy --schema=./prisma/schema.prisma; then
  echo "Migrations deployed."
else
  echo "migrate deploy failed — running prisma db push as fallback"
  npx prisma db push --schema=./prisma/schema.prisma
fi


echo "Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "Running seed script..."
npm run prisma:seed || echo "Seed script failed or admin already exists"

echo "Starting app..."
exec npm start
