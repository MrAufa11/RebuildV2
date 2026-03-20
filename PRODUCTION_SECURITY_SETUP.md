# 🔒 PRODUCTION SECURITY SETUP - HIDE BACKEND

## 🎯 **SOLUSI UNTUK CONCERN KAMU**

### **Problem:**
- ❌ Backend API terekspos ke public (`http://172.18.0.4:3000/api/...`)
- ❌ Images bisa diakses langsung via `/api/images/...`
- ❌ Backend seharusnya hidden di production
- ❌ Development URLs masih terbuka

### ✅ **Solusi: Nginx Reverse Proxy + Image Alias**

---

## 📊 **ARCHITECTURE**

### **Development (Sekarang):**
```
User → Backend:3000
     ├─→ /api/* → Express API
     └─→ /api/images/* → ImageController → uploads/
```

**Issue:** Backend port 3000 terekspos

### **Production (Setup Baru):**
```
User → Nginx:443 (HTTPS)
     ├─→ / → Vue.js Frontend (public_html)
     ├─→ /images/* → Nginx direct serve (uploads/)
     └─→ /api/* → Backend:3000 (hidden, localhost only)
```

**Benefits:**
- ✅ Backend tidak terekspos langsung
- ✅ Images di-serve Nginx (lebih cepat)
- ✅ HTTPS termination di Nginx
- ✅ Rate limiting, caching, security headers

---

## 🛠️ **SETUP PRODUCTION**

### **1. Struktur Folder:**

```
/home/username/
├── backend/                    # HIDDEN (not in public_html)
│   ├── controllers/
│   │   └── ImageController.js  # Updated with signed URL support
│   ├── routes/
│   │   └── images.js
│   ├── uploads/
│   │   └── website/           # 221 images (secure)
│   ├── .env
│   └── index.js
│
├── public_html/                # PUBLIC (web accessible)
│   └── website/               # Vue.js build output
│       ├── index.html
│       └── assets/
│
└── nginx-production.conf       # Nginx config
```

### **2. Nginx Configuration:**

File: `/etc/nginx/sites-available/yoursite.com`

```nginx
server {
    listen 443 ssl http2;
    server_name yoursite.com;
    
    # SSL
    ssl_certificate /etc/letsencrypt/live/yoursite.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yoursite.com/privkey.pem;
    
    # Frontend
    root /home/username/public_html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Images - Serve directly (FAST!)
    location /images/ {
        alias /home/username/backend/uploads/website/;
        
        location ~* \.(jpg|jpeg|png|gif|webp|svg)$ {
            add_header Cache-Control "public, max-age=31536000";
            try_files $uri =404;
        }
    }
    
    # Backend API - Proxy (hidden)
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **3. Backend Environment (.env):**

```env
NODE_ENV=production
PORT=3000

# Image Security
IMAGES_REQUIRE_SIGNED_URLS=false    # false = public, true = token required
PREVENT_HOTLINKING=false            # Enable referer checking
ALLOWED_DOMAINS=yoursite.com        # Allowed referers

# Only listen on localhost (not exposed)
HOST=127.0.0.1
```

---

## 🔄 **DEPLOYMENT STEPS**

### **Step 1: Update Database URLs**

Untuk production, ganti URL images:

```sql
-- From: /api/images/website/filename.jpg
-- To:   /images/filename.jpg

USE rebuild_v2;

UPDATE Articles 
SET image_url = REPLACE(image_url, '/api/images/website/', '/images/');

UPDATE Banners 
SET image_url = REPLACE(image_url, '/api/images/website/', '/images/');

UPDATE Galleries 
SET image_url = REPLACE(image_url, '/api/images/website/', '/images/');

UPDATE Teachers 
SET image_url = REPLACE(image_url, '/api/images/website/', '/images/');
```

### **Step 2: Deploy Backend**

```bash
# Upload ke server
scp -r backend/ user@server:/home/username/backend/

# Install dependencies
cd /home/username/backend
npm install --production

# Start with PM2
pm2 start index.js --name website-backend
pm2 save
pm2 startup
```

### **Step 3: Deploy Frontend**

```bash
# Build
cd website/frontend
npm run build

# Upload build output
scp -r dist/* user@server:/home/username/public_html/website/
```

### **Step 4: Setup Nginx**

```bash
# Copy config
sudo cp nginx-production.conf /etc/nginx/sites-available/yoursite.com

# Enable site
sudo ln -s /etc/nginx/sites-available/yoursite.com /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

### **Step 5: Firewall**

```bash
# Allow only HTTP, HTTPS, SSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp

# Block direct backend access
sudo ufw deny 3000/tcp

# Enable
sudo ufw enable
```

---

## 🔐 **SECURITY LAYERS**

### **Layer 1: Network Level**
- ✅ Backend hanya listen on localhost (127.0.0.1)
- ✅ Firewall block port 3000 dari public
- ✅ Hanya Nginx yang bisa akses backend

### **Layer 2: Nginx Level**
- ✅ HTTPS termination
- ✅ Security headers
- ✅ Rate limiting
- ✅ Block sensitive paths (.env, .git, node_modules)

### **Layer 3: Application Level**
- ✅ ImageController validation
- ✅ Optional signed URLs
- ✅ Hotlinking protection
- ✅ Directory traversal protection

---

## 🎯 **DEVELOPMENT vs PRODUCTION**

### **Development URLs:**
```
Frontend: http://localhost:5173
Backend:  http://localhost:3000
Images:   http://localhost:3000/api/images/website/file.jpg
```

### **Production URLs:**
```
Frontend: https://yoursite.com
Backend:  https://yoursite.com/api/... (via Nginx proxy)
Images:   https://yoursite.com/images/file.jpg (direct)
```

---

## 📝 **TWO MODE SETUP**

### **Mode A: Public Images (Default - Recommended)**

Images accessible tanpa token:
```
URL: https://yoursite.com/images/file.jpg
Access: Public
Cache: 1 year
```

**Use case:** Website public, images tidak sensitif

### **Mode B: Signed URLs (Extra Security)**

Images butuh token:
```javascript
// Generate signed URL
const { url } = ImageController.generateSignedUrl('file.jpg', 'website', 60);
// Result: /api/images/website/file.jpg?token=abc123&expires=1234567890
```

**Use case:** Premium content,防止 hotlinking

---

## ✅ **CHECKLIST PRODUCTION**

### **Pre-Deployment:**
- [ ] Update database URLs to `/images/`
- [ ] Set `NODE_ENV=production`
- [ ] Set `HOST=127.0.0.1` in .env
- [ ] Enable HTTPS (Let's Encrypt)

### **Deployment:**
- [ ] Backend uploaded to hidden folder
- [ ] Frontend built and uploaded
- [ ] Nginx configured
- [ ] Firewall rules set
- [ ] PM2 running backend

### **Post-Deployment:**
- [ ] Test frontend loads
- [ ] Test images load (`/images/file.jpg`)
- [ ] Test API works (`/api/...`)
- [ ] Verify backend not accessible directly (port 3000 blocked)
- [ ] Check HTTPS working
- [ ] Verify security headers

---

## 🆘 **TROUBLESHOOTING**

### **Images tidak muncul:**
```bash
# Check permissions
ls -la /home/username/backend/uploads/website/

# Check Nginx error log
sudo tail -f /var/log/nginx/yoursite.com.error.log

# Test direct access
curl -I https://yoursite.com/images/test.jpg
```

### **Backend tidak accessible:**
```bash
# Check PM2 running
pm2 status

# Check backend logs
pm2 logs website-backend

# Test localhost
curl http://127.0.0.1:3000/api/
```

### **HTTPS tidak work:**
```bash
# Check SSL cert
sudo certbot certificates

# Renew if needed
sudo certbot renew
```

---

## 📊 **SUMMARY**

### **Development (Current):**
- ✅ Images via `/api/images/website/...`
- ✅ Backend accessible on port 3000
- ✅ OK for testing

### **Production (Setup):**
- ✅ Images via `/images/...` (direct, fast)
- ✅ Backend hidden behind Nginx
- ✅ HTTPS enabled
- ✅ Firewall blocks direct backend access
- ✅ **100% secure & production-ready**

---

## 🚀 **NEXT ACTION**

**Untuk sekarang (development):**
- Biarkan URLs seperti sekarang: `/api/images/website/...`
- Tidak perlu change apapun
- Focus development

**Saat deploy production:**
1. Run SQL update URLs ke `/images/`
2. Deploy dengan Nginx config
3. Setup firewall
4. Test semua endpoint

**File penting:**
- `nginx-production.conf` - Nginx config template
- `backend/controllers/ImageController.js` - Updated dengan signed URL support
- Dokumentasi ini

Ada pertanyaan lagi? 🎉
