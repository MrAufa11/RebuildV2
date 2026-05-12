#!/bin/bash

# Script to run database migration via Docker
# Usage: ./run-migration.sh

set -e

echo "🚀 Running database migration via Docker..."
echo ""

# Get project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Migration SQL file
MIGRATION_FILE="$PROJECT_ROOT/deploy/api/migrations/spmb/20260407000000-add-approved-amount-to-registrants.sql"

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "📁 Migration file: $MIGRATION_FILE"
echo ""

# Database configuration from docker-compose.yml
MYSQL_CONTAINER="database"
DB_NAME="spmb"
DB_USER="root"
DB_PASSWORD="root"

echo "🐳 Database Configuration:"
echo "   Container: $MYSQL_CONTAINER"
echo "   Database:  $DB_NAME"
echo "   User:      $DB_USER"
echo ""

# Check if container is running
if ! docker ps | grep -q "$MYSQL_CONTAINER"; then
    echo "❌ MySQL container '$MYSQL_CONTAINER' is not running!"
    echo ""
    echo "Please start it with:"
    echo "   docker-compose up -d db"
    exit 1
fi

echo "✅ MySQL container is running"
echo ""

# Copy SQL file to container
echo "📋 Copying migration file to container..."
docker cp "$MIGRATION_FILE" "$MYSQL_CONTAINER:/tmp/migration.sql"

# Execute migration
echo "⚙️  Running migration..."
docker exec -i "$MYSQL_CONTAINER" mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; source /tmp/migration.sql;"

if [ $? -eq 0 ]; then
    # Cleanup
    echo "🧹 Cleaning up..."
    docker exec "$MYSQL_CONTAINER" rm -f /tmp/migration.sql

    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "📝 To rollback, run:"
    echo "   cd $PROJECT_ROOT/backend/scripts"
    echo "   ./run-rollback.sh"
else
    echo "❌ Migration failed!"
    echo "Please check the error message above."
    exit 1
fi
