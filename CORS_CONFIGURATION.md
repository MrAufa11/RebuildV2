# CORS Configuration Guide

## Backend CORS Setup

Backend sudah dikonfigurasi dengan support multiple origins yang fleksibel dan cerdas. Berikut penjelasannya:

### Cara Kerja

**Development Mode (`NODE_ENV=development`):**
- ✅ Semua origins diizinkan (untuk kemudahan development)
- Tidak perlu set `CORS_ORIGINS` variable

**Production Mode (`NODE_ENV=production`):**
- ✅ Hanya origins yang didaftar di `CORS_ORIGINS` yang diizinkan
- **Wajib** set variable `CORS_ORIGINS`

### Format CORS_ORIGINS

Variable `CORS_ORIGINS` mendukung 3 format sekaligus (comma-separated):

#### 1. **Exact URL Match**
```env
CORS_ORIGINS=http://localhost:5173, http://localhost:5174
```
✅ Hanya exact URLs ini yang diizinkan

#### 2. **Domain Pattern Match** (www dan non-www auto-match)
```env
CORS_ORIGINS=https://example.com, https://www.example.com
```
✅ Keduanya diizinkan (domain check dengan `.includes()`)
❌ Tidak perlu duplikasi - bisa pakai regex untuk lebih aman

#### 3. **Regex Pattern** (paling fleksibel)
```env
CORS_ORIGINS=/^https:\/\/(www\.)?example\.com(:\d+)?$/
```
✅ Pattern: `https://example.com` + `https://www.example.com` + custom ports
- `/^https:\/\/...$/` - harus regex wrapper
- `(www\.)?` - optional www
- `(:\d+)?` - optional custom port

### Contoh Konfigurasi

#### Development
```env
NODE_ENV=development
# Tidak perlu set CORS_ORIGINS, semua origins diizinkan
```

#### Production - Single Domain
```env
NODE_ENV=production
CORS_ORIGINS=/^https:\/\/(www\.)?yourdomain\.com(:\d+)?$/
```
✅ Supports:
- `https://yourdomain.com`
- `https://www.yourdomain.com`
- `https://yourdomain.com:8080`
- `https://www.yourdomain.com:8080`

#### Production - Multiple Domains
```env
NODE_ENV=production
CORS_ORIGINS=/^https:\/\/(www\.)?yourdomain\.com(:\d+)?$/, https://api.yourdomain.com, /^https:\/\/(www\.)?partner\.com$/
```

#### Production - Mixed Subdomains
```env
NODE_ENV=production
# Main domain + app subdomain + api subdomain
CORS_ORIGINS=/^https:\/\/(www\.)?yourdomain\.com(:\d+)?$/, /^https:\/\/(app|api)\.yourdomain\.com(:\d+)?$/
```

### Docker Compose Setup

File `.env` di backend akan otomatis di-mount ke container. Untuk Docker:

```yaml
# docker-compose.yml
backend:
  environment:
    - NODE_ENV=production
    - CORS_ORIGINS=/^https:\/\/(www\.)?yourdomain\.com$/
```

### Testing CORS

```bash
# Test allowed origin
curl -H "Origin: https://www.example.com" \
     -H "Access-Control-Request-Method: POST" \
     http://localhost:3000/api/test

# Test blocked origin
curl -H "Origin: https://attacker.com" \
     -H "Access-Control-Request-Method: POST" \
     http://localhost:3000/api/test
```

### Troubleshooting

**CORS Error: "CORS policy: origin not allowed"**
- ✅ Cek variable `CORS_ORIGINS` di `.env`
- ✅ Cek `NODE_ENV` value
- ✅ Pastikan origin URL match persis (protocol, domain, port)

**CORS Warning: "CORS_ORIGINS not configured in production"**
- ✅ Set `CORS_ORIGINS` di `.env` sebelum deploy
- ✅ Jangan gunakan production tanpa explicit CORS origins

### Security Notes

1. **Jangan** gunakan regex `/.*/ ` atau allow-all patterns di production
2. **Jangan** commit credentials ke git - gunakan `.env` local file
3. **Selalu** gunakan `https://` di production (set di regex)
4. **Test** CORS configuration sebelum deploy
5. **Dokumentasi** semua origins yang diizinkan untuk audit purposes

---
**Updated:** Docker DB config sudah match dengan `.env` configuration
