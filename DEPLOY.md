# Deploy Instructions

## Quick Deploy (5 menit)

### Step 1: Push ke GitHub

```bash
cd ~/Desktop/portfolio-new

# Buat repo baru di GitHub:
# Buka: https://github.com/new
# Nama: portfolio-new
# Public
# JANGAN centang "Initialize with README"
# Click "Create repository"

# Push code:
git remote add origin https://github.com/ahfasxp/portfolio-new.git
git push -u origin main
```

### Step 2: Deploy ke Vercel

1. Buka: https://vercel.com/new
2. Login (udah login via Chrome)
3. Click "Import Git Repository"
4. Pilih `ahfasxp/portfolio-new`
5. Framework Preset: **Next.js** (auto-detect)
6. Click **Deploy**
7. Tunggu 2-3 menit
8. Live! 🎉

## Vercel akan auto-detect:
- ✅ Framework: Next.js
- ✅ Build Command: `next build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

## Setelah deploy:
- URL: `https://portfolio-new-xxx.vercel.app`
- Auto SSL
- Auto CI/CD (setiap git push = auto redeploy)
- Custom domain bisa ditambah di Settings

## Troubleshooting

**"Build failed - react-icons not found":**
- Vercel akan auto npm install, harusnya gak terjadi
- Kalau terjadi: di Vercel dashboard → Settings → Root Directory (pastikan `.`)

**"Image optimization error":**
- Udah handled di next.config.js
- remotePatterns untuk firebasestorage.googleapis.com

## Custom Domain (nanti)

Setelah deploy sukses, bisa add custom domain:
1. Vercel Dashboard → Settings → Domains
2. Add domain (misal: ahfas.vercel.app atau custom domain)
3. Update DNS sesuai instruksi Vercel
