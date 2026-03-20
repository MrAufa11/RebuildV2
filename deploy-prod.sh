#!/bin/bash

# ============================================
# PRODUCTION DEPLOYMENT SCRIPT
# ============================================
# This script deploys from main branch (production)
# Run this on production server after CI/CD builds
# ============================================

set -e  # Exit on error

echo "============================================"
echo "  PRODUCTION DEPLOYMENT"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_DIR="/home/aufa/Public/RebuildV2"
BRANCH="main"

echo -e "${BLUE}📁 Project Directory:${NC} $PROJECT_DIR"
echo -e "${BLUE}🌿 Branch:${NC} $BRANCH"
echo ""

# Check if we're in the right directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Project directory not found: $PROJECT_DIR${NC}"
    exit 1
fi

cd $PROJECT_DIR

# Pull latest from main
echo -e "${BLUE}🔄 Pulling latest from $BRANCH...${NC}"
git fetch origin $BRANCH
git reset --hard origin/$BRANCH
echo -e "${GREEN}✅ Code updated${NC}"
echo ""

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker-compose down
echo -e "${GREEN}✅ Containers stopped${NC}"
echo ""

# Build and start new containers
echo -e "${BLUE}🏗️  Building containers...${NC}"
docker-compose up -d --build
echo -e "${GREEN}✅ Containers built and started${NC}"
echo ""

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check container status
echo -e "${BLUE}📊 Container Status:${NC}"
docker-compose ps
echo ""

# Show logs
echo -e "${BLUE}📝 Recent logs:${NC}"
docker-compose logs --tail=20
echo ""

# Cleanup old images
echo -e "${BLUE}🧹 Cleaning up old Docker images...${NC}"
docker image prune -f
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Summary
echo "============================================"
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "============================================"
echo ""
echo "Services running:"
docker-compose ps --format "table {{.Name}}\t{{.Status}}"
echo ""
echo "Access URLs:"
echo "  - Website: http://localhost:5173"
echo "  - SPMB: http://localhost:5174"
echo "  - Backend API: http://localhost:3000"
echo ""
echo "Logs:"
echo "  docker-compose logs -f"
echo ""
echo "Stop services:"
echo "  docker-compose down"
echo ""
echo "============================================"
echo ""
