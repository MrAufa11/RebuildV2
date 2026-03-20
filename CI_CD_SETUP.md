# 🚀 CI/CD SETUP GUIDE - RebuildV2

## 📋 **BRANCH STRATEGY**

### **Branch Structure:**
```
dev (development)
  ├── All source code
  ├── Backend code
  ├── Frontend source (SPMB & Website)
  ├── Configuration files
  └── Development environment

main (production)
  ├── Built artifacts only
  ├── Backend (without node_modules)
  ├── Frontend dist/ folders
  ├── Docker configuration
  └── Production-ready files
```

---

## 🔄 **CI/CD FLOW**

### **Workflow:**
```
1. Developer pushes to dev branch
   ↓
2. GitHub Actions triggered
   ↓
3. Auto build:
   - Install dependencies
   - Build SPMB frontend
   - Build Website frontend
   - Prepare production structure
   ↓
4. Deploy to main branch
   ↓
5. Production server pulls main
   ↓
6. Auto-deploy with Docker
```

---

## 🛠️ **SETUP STEPS**

### **1. Initialize Git Repository**

```bash
cd /home/aufa/Public/RebuildV2

# Initialize git
git init

# Add remote
git remote add origin https://github.com/MrAufa1/RebuildV2.git

# Create .gitignore (already done)
# Create branch structure
```

### **2. Setup Branch Structure**

```bash
# Create dev branch
git checkout -b dev

# Add all files
git add .

# Initial commit
git commit -m "🎉 Initial commit: RebuildV2 project"

# Push dev branch
git push -u origin dev
```

### **3. Configure GitHub Secrets**

Go to: `https://github.com/MrAufa1/RebuildV2/settings/secrets/actions`

**Add these secrets:**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DEPLOY_SSH_KEY` | (your SSH key) | For server deployment |
| `PROD_SERVER_HOST` | your.server.com | Production server |
| `PROD_SERVER_USER` | username | Server username |
| `DOCKER_USERNAME` | your-docker-user | Docker Hub username |
| `DOCKER_PASSWORD` | your-docker-pass | Docker Hub password |

### **4. First Deployment**

```bash
# Push to dev (triggers CI/CD)
git push origin dev

# GitHub Actions will:
# 1. Build everything
# 2. Deploy to main branch
# 3. Create release
```

---

## 📁 **FILE STRUCTURE**

### **dev branch (Source Code):**
```
RebuildV2/
├── .github/workflows/
│   └── deploy-production.yml  # CI/CD workflow
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/              # Images (gitignored)
│   └── index.js
├── spmb/frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── website/frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── public/
│   ├── website/              # Images (gitignored)
│   └── spmb/
├── docker/
├── docker-compose.yml
└── package.json
```

### **main branch (Production Build):**
```
RebuildV2/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/              # Empty or .gitkeep
│   └── index.js
├── spmb/
│   └── dist/                 # Built files
├── website/
│   └── dist/                 # Built files
├── public/
│   ├── website/              # Images
│   └── spmb/
├── docker/
├── docker-compose.yml
└── .gitignore
```

---

## 🚀 **DEPLOYMENT TO SERVER**

### **Option 1: Manual Pull (Simple)**

```bash
# On production server
cd /path/to/RebuildV2

# Checkout main branch
git checkout main

# Pull latest
git pull origin main

# Restart containers
docker-compose down
docker-compose up -d --build
```

### **Option 2: Auto-Deploy with Webhook (Advanced)**

Create `/home/aufa/Public/RebuildV2/.github/workflows/deploy-server.yml`:

```yaml
name: Deploy to Production Server

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_SERVER_HOST }}
          username: ${{ secrets.PROD_SERVER_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /path/to/RebuildV2
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker system prune -f
```

---

## 🧪 **LOCAL DEVELOPMENT**

### **Workflow:**

```bash
# 1. Create feature branch
git checkout -b feature/new-feature dev

# 2. Make changes
# ... code ...

# 3. Commit
git add .
git commit -m "✨ Add new feature"

# 4. Push to dev
git push origin feature/new-feature

# 5. Create Pull Request on GitHub
# Merge to dev → triggers CI/CD
```

### **Update from main:**

```bash
# Get latest production code
git checkout main
git pull origin main

# Merge to dev
git checkout dev
git merge main

# Or rebase
git checkout dev
git rebase main
```

---

## 📊 **GITHUB ACTIONS STATUS**

### **Check Build Status:**
- Go to: `https://github.com/MrAufa1/RebuildV2/actions`
- See all workflow runs
- Check build logs

### **Build Artifacts:**
- Production build deployed to `main` branch
- Release created automatically
- Download from Releases page

---

## 🔧 **TROUBLESHOOTING**

### **Build Fails:**

```bash
# Test build locally
cd spmb/frontend && npm run build
cd website/frontend && npm run build

# Check for errors
# Fix issues
# Push again
```

### **Deploy Fails:**

```bash
# Check GitHub Actions logs
# Look for error messages
# Verify secrets are correct
# Retry workflow
```

### **Server Deployment Fails:**

```bash
# SSH to server
ssh user@server.com

# Check logs
docker-compose logs

# Restart services
docker-compose restart
```

---

## ✅ **CHECKLIST**

### **Initial Setup:**
- [ ] Initialize git repository
- [ ] Add GitHub remote
- [ ] Create dev branch
- [ ] Push initial code to dev
- [ ] Configure GitHub secrets
- [ ] Test first deployment

### **CI/CD Configuration:**
- [ ] `.github/workflows/deploy-production.yml` created
- [ ] `.gitignore` configured
- [ ] Branch protection rules (optional)
- [ ] Webhook for auto-deploy (optional)

### **Production Server:**
- [ ] Git installed
- [ ] Docker & Docker Compose
- [ ] SSH access configured
- [ ] Pull main branch
- [ ] Run docker-compose

---

## 🎯 **QUICK START**

```bash
# 1. Initialize
cd /home/aufa/Public/RebuildV2
git init
git remote add origin https://github.com/MrAufa1/RebuildV2.git

# 2. Create dev branch
git checkout -b dev
git add .
git commit -m "🎉 Initial commit"
git push -u origin dev

# 3. Wait for GitHub Actions
# Go to: https://github.com/MrAufa1/RebuildV2/actions
# Check build status

# 4. After build success
# main branch will have production build
# Pull on server: git pull origin main
```

---

## 📖 **ADDITIONAL RESOURCES**

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Docker Compose:** https://docs.docker.com/compose/
- **Git Branching:** https://git-scm.com/book/en/v2/Git-Branching

---

## 🎉 **SUMMARY**

✅ **dev branch:** Source code, development
✅ **main branch:** Production build, auto-deployed
✅ **CI/CD:** GitHub Actions auto-builds on push to dev
✅ **Deployment:** Pull main on production server

**Ready to push!** 🚀
