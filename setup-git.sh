#!/bin/bash

# ============================================
# GIT & CI/CD SETUP SCRIPT
# ============================================
# This script will:
# 1. Initialize git repository
# 2. Create dev branch
# 3. Setup initial commit
# 4. Push to GitHub
# ============================================

set -e  # Exit on error

echo "============================================"
echo "  GIT & CI/CD SETUP"
echo "============================================"
echo ""

# Configuration
GITHUB_REPO="https://github.com/MrAufa1/RebuildV2.git"
DEV_BRANCH="dev"
MAIN_BRANCH="main"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install git first.${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Current directory:${NC} $(pwd)"
echo ""

# Check if .git already exists
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git repository already exists${NC}"
    read -p "Do you want to reinitialize? (y/N): " reinit
    if [[ $reinit =~ ^[Yy]$ ]]; then
        rm -rf .git
        echo "✅ Removed existing .git directory"
    else
        echo "⊘ Skipping initialization"
    fi
fi

# Initialize git if not exists
if [ ! -d ".git" ]; then
    echo -e "${BLUE}🔄 Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
    echo ""
fi

# Check if remote exists
if ! git remote | grep -q "^origin$"; then
    echo -e "${BLUE}🔗 Adding GitHub remote...${NC}"
    git remote add origin $GITHUB_REPO
    echo -e "${GREEN}✅ Remote added: $GITHUB_REPO${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Remote 'origin' already exists${NC}"
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "   Current: $CURRENT_REMOTE"
    read -p "Do you want to update it? (y/N): " update_remote
    if [[ $update_remote =~ ^[Yy]$ ]]; then
        git remote set-url origin $GITHUB_REPO
        echo -e "${GREEN}✅ Remote updated${NC}"
    fi
    echo ""
fi

# Create necessary directories
echo -e "${BLUE}📂 Creating necessary directories...${NC}"
mkdir -p backend/uploads/website
mkdir -p backend/uploads/spmb
mkdir -p public/website
mkdir -p public/spmb

# Create .gitkeep files
touch backend/uploads/.gitkeep
touch backend/uploads/website/.gitkeep
touch backend/uploads/spmb/.gitkeep
touch public/website/.gitkeep
touch public/spmb/.gitkeep

echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Create .env files from .env.example if they don't exist
echo -e "${BLUE}📝 Checking .env files...${NC}"
if [ -f "backend/.env.example" ] && [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "   Created backend/.env from .env.example"
fi
if [ -f "spmb/frontend/.env.example" ] && [ ! -f "spmb/frontend/.env" ]; then
    cp spmb/frontend/.env.example spmb/frontend/.env
    echo "   Created spmb/frontend/.env from .env.example"
fi
if [ -f "website/frontend/.env.example" ] && [ ! -f "website/frontend/.env" ]; then
    cp website/frontend/.env.example website/frontend/.env
    echo "   Created website/frontend/.env from .env.example"
fi
echo -e "${GREEN}✅ .env files checked${NC}"
echo ""

# Checkout or create dev branch
echo -e "${BLUE}🌿 Setting up dev branch...${NC}"
if git show-ref --verify --quiet refs/heads/$DEV_BRANCH; then
    echo "   Dev branch exists, checking out..."
    git checkout $DEV_BRANCH
else
    echo "   Creating dev branch..."
    git checkout -b $DEV_BRANCH
fi
echo -e "${GREEN}✅ Dev branch ready${NC}"
echo ""

# Add files
echo -e "${BLUE}📦 Adding files to git...${NC}"
git add .
echo -e "${GREEN}✅ Files added${NC}"
echo ""

# Check status
echo -e "${BLUE}📊 Git status:${NC}"
git status --short
echo ""

# Commit
echo -e "${BLUE}✏️  Creating initial commit...${NC}"
git commit -m "🎉 Initial commit: RebuildV2 project with CI/CD setup

- Backend (Express.js)
- SPMB Frontend (Vue.js)
- Website Frontend (Vue.js)
- GitHub Actions CI/CD workflow
- Docker configuration
- Migration scripts

Branches:
- dev: Development (source code)
- main: Production (build artifacts)

Automated build and deployment on push to dev."

echo -e "${GREEN}✅ Initial commit created${NC}"
echo ""

# Push
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
echo "   Branch: $DEV_BRANCH"
echo "   Remote: $GITHUB_REPO"
echo ""

git push -u origin $DEV_BRANCH

echo ""
echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
echo ""

# Summary
echo "============================================"
echo "  ✅ SETUP COMPLETE!"
echo "============================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Go to GitHub and check the repository:"
echo "   https://github.com/MrAufa1/RebuildV2"
echo ""
echo "2. Check GitHub Actions for build status:"
echo "   https://github.com/MrAufa1/RebuildV2/actions"
echo ""
echo "3. After build completes, main branch will have:"
echo "   - Built frontend files (dist/)"
echo "   - Backend code (without node_modules)"
echo "   - Production-ready structure"
echo ""
echo "4. On production server:"
echo "   git pull origin main"
echo "   docker-compose up -d --build"
echo ""
echo "5. For development:"
echo "   git checkout dev"
echo "   # Make changes"
echo "   git push origin dev  # Triggers auto-build"
echo ""
echo "============================================"
echo ""
