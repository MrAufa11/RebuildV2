#!/bin/bash

# Script to rollback database migration via Docker
# Usage: ./run-rollback.sh

set -e

echo "🔄 Running database rollback via Docker..."
echo ""

# Get project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Rollback SQL file
ROLLBACK_FILE="$PROJECT_ROOT/deploy/api/migrations/spmb/20260407000000-rollback-add-approved-amount-to-registrants.sql"

# Check if rollback file exists
if [ ! -f "$ROLLBACK_FILE" ]; then
    echo "❌ Rollback file not found: $ROLLBACK_FILE"
    exit 1
fi

echo "📁 Rollback file: $ROLLBACK_FILE"
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
echo "📋 Copying rollback file to container..."
docker cp "$ROLLBACK_FILE" "$MYSQL_CONTAINER:/tmp/rollback.sql"

# Execute rollback
echo "⚙️  Running rollback..."
docker exec -i "$MYSQL_CONTAINER" mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; source /tmp/rollback.sql;"

if [ $? -eq 0 ]; then
    # Cleanup
    echo "🧹 Cleaning up..."
    docker exec "$MYSQL_CONTAINER" rm -f /tmp/rollback.sql

    echo ""
    echo "✅ Rollback completed successfully!"
else
    echo "❌ Rollback failed!"
    echo "Please check the error message above."
    exit 1
fi
