# 🚀 RebuildV2 - Quick Start Guide

## 🎯 **CI/CD Setup**

### **Branch Strategy:**
- **`dev`** → Development (source code)
- **`main`** → Production (built artifacts, auto-deployed)

### **Workflow:**
```
Push to dev → GitHub Actions Build → Deploy to main → Production Server Pulls
```

---

## ⚡ **Quick Start**

### **1. Setup Git & Push to GitHub**

```bash
cd /home/aufa/Public/RebuildV2

# Make script executable
chmod +x setup-git.sh

# Run setup
./setup-git.sh
```

This will:
- ✅ Initialize git repository
- ✅ Add GitHub remote
- ✅ Create dev branch
- ✅ Initial commit
- ✅ Push to GitHub

### **2. Check GitHub Actions**

Go to: https://github.com/MrAufa1/RebuildV2/actions

Wait for build to complete (~5-10 minutes)

### **3. Deploy to Production Server**

```bash
# On production server
cd /home/aufa/Public/RebuildV2

# Make script executable
chmod +x deploy-prod.sh

# Deploy
./deploy-prod.sh
```

---

## 📋 **Development Workflow**

### **Daily Development:**

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
# Merge to dev → triggers auto-build
```

### **Update from Production:**

```bash
# Get latest production code
git fetch origin main
git merge origin/main

# Or rebase
git rebase origin/main
```

---

## 🔄 **CI/CD Process**

### **What happens when you push to dev:**

1. **GitHub Actions triggered**
2. **Install dependencies**
   - Backend npm packages
   - SPMB frontend packages
   - Website frontend packages
3. **Build frontends**
   - `spmb/frontend/dist/`
   - `website/frontend/dist/`
4. **Prepare production structure**
5. **Deploy to main branch**
6. **Create GitHub Release**

### **Build Artifacts (main branch):**

```
main/
├── backend/           # Source code (no node_modules)
├── spmb/dist/        # Built SPMB frontend
├── website/dist/     # Built Website frontend
├── public/           # Static assets
├── docker-compose.yml
└── docker/           # Docker configs
```

---

## 🛠️ **Manual Commands**

### **Build Locally:**

```bash
# Backend
cd backend && npm install

# SPMB Frontend
cd spmb/frontend && npm install && npm run build

# Website Frontend
cd website/frontend && npm install && npm run build
```

### **Run Locally:**

```bash
# With Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

### **Deploy Manually:**

```bash
# Pull latest production
git checkout main
git pull origin main

# Build and restart
docker-compose down
docker-compose up -d --build
```

---

## 📊 **GitHub Actions Status**

### **Check Build Status:**
- URL: https://github.com/MrAufa1/RebuildV2/actions
- See all workflow runs
- Check build logs

### **Releases:**
- URL: https://github.com/MrAufa1/RebuildV2/releases
- Auto-created on each successful build
- Download build artifacts

---

## 🔧 **Troubleshooting**

### **Build Fails:**

```bash
# Test build locally
cd spmb/frontend && npm run build
cd website/frontend && npm run build

# Fix errors
# Push again
git push origin dev
```

### **Deployment Fails:**

```bash
# Check GitHub Actions logs
# Verify secrets in GitHub Settings
# Retry workflow from Actions tab
```

### **Server Issues:**

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild
docker-compose down
docker-compose up -d --build
```

---

## 📁 **Important Files**

| File | Purpose |
|------|---------|
| `.github/workflows/deploy-production.yml` | CI/CD workflow |
| `setup-git.sh` | Git initialization script |
| `deploy-prod.sh` | Production deployment script |
| `docker-compose.yml` | Docker configuration |
| `.gitignore` | Git ignore rules |
| `CI_CD_SETUP.md` | Detailed CI/CD documentation |

---

## ✅ **Checklist**

### **Initial Setup:**
- [ ] Run `./setup-git.sh`
- [ ] Push to GitHub dev branch
- [ ] Check GitHub Actions
- [ ] Wait for build to complete
- [ ] Verify main branch has build artifacts

### **Production Deployment:**
- [ ] SSH to production server
- [ ] Run `./deploy-prod.sh`
- [ ] Verify services running
- [ ] Test website and SPMB
- [ ] Check logs

### **Development:**
- [ ] Create feature branch from dev
- [ ] Make changes
- [ ] Push to dev
- [ ] Monitor GitHub Actions
- [ ] Verify build success

---

## 🎉 **Summary**

**Branches:**
- `dev` → Source code, development
- `main` → Production build, auto-deployed

**Commands:**
```bash
# Setup (one time)
./setup-git.sh

# Deploy to production
./deploy-prod.sh

# Daily development
git checkout -b feature/xxx dev
# ... code ...
git push origin dev
```

**CI/CD:**
- Push to dev → Auto build
- Build success → Deploy to main
- Main updated → Deploy to server

**Ready to go!** 🚀
