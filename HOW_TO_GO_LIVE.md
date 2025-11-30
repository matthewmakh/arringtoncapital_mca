# How to Make Your Website Live 🌐

This guide will help you turn your local website into a real, accessible website on the internet.

## 📋 Overview

You have **two parts** to host:
1. **Frontend** (HTML, CSS, JavaScript) - The website visitors see
2. **Backend** (Node.js server) - The API that handles data and authentication

---

## 🎯 Option 1: FREE Hosting (Easiest - Recommended for Starting)

### Frontend: GitHub Pages (FREE)
- ✅ Free forever
- ✅ Easy setup
- ✅ Custom domain support
- ✅ SSL certificate included
- ❌ Only works for static files (HTML, CSS, JS)

### Backend: Railway / Render / Fly.io (FREE tier available)
- ✅ Free tier available
- ✅ Easy deployment
- ✅ Handles Node.js apps
- ✅ Database included

**Steps:**

#### Step 1: Host Frontend on GitHub Pages

1. **Create GitHub account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Install Git** (if not installed)
   - Download: https://git-scm.com/downloads
   - Install with default settings

3. **Create GitHub repository:**
   ```bash
   cd "C:\Users\no1ca\Desktop\harrington capital website fully saved"
   
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Harrington Capital website"
   ```

4. **Push to GitHub:**
   - Go to github.com, click "+" → "New repository"
   - Name it "harrington-capital-website"
   - Don't initialize with README
   - Copy the repository URL (e.g., `https://github.com/yourusername/harrington-capital-website.git`)
   
   ```bash
   git remote add origin YOUR_REPOSITORY_URL
   git branch -M main
   git push -u origin main
   ```

5. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at: `https://yourusername.github.io/harrington-capital-website`

#### Step 2: Host Backend on Railway (FREE tier)

1. **Sign up at Railway:**
   - Go to https://railway.app
   - Sign up with GitHub (easiest)

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository (or create new one for backend)

3. **Deploy backend:**
   - Railway will detect Node.js automatically
   - Set these environment variables in Railway dashboard:
     - `NODE_ENV=production`
     - `PORT` (Railway sets this automatically)
     - `JWT_SECRET` (generate a random string, at least 32 characters)
     - `DB_PATH=./data/database.db`
     - `ADMIN_EMAIL=admin@harringtoncapital.com`
     - `ADMIN_PASSWORD=your-secure-password`

4. **Get backend URL:**
   - Railway gives you a URL like: `https://your-app.railway.app`
   - Copy this URL

5. **Update frontend API URL:**
   - Edit `api.js` in your GitHub repository
   - Change: `const API_BASE_URL = 'http://localhost:3000/api';`
   - To: `const API_BASE_URL = 'https://your-app.railway.app/api';`
   - Commit and push changes

#### Step 3: Initialize Database
- After backend deploys, visit: `https://your-app.railway.app/api/health`
- Run database initialization via Railway console or create an endpoint

**Cost:** $0/month (with free tier limitations)

---

## 💰 Option 2: Budget Hosting ($5-10/month)

### VPS (Virtual Private Server)

**Recommended Providers:**
- **DigitalOcean** - $5/month (Droplet)
- **Linode** - $5/month
- **Vultr** - $5/month
- **Hetzner** - €4/month

**Steps:**

1. **Sign up and create server:**
   - Choose Ubuntu 22.04
   - Smallest size ($5/month) is fine to start

2. **Connect via SSH:**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install Nginx (web server):**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

5. **Upload your files:**
   ```bash
   # Create project folder
   mkdir /var/www/harrington-capital
   cd /var/www/harrington-capital
   
   # Use SFTP or Git to upload files
   ```

6. **Set up backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your settings
   npm run init-db
   npm install pm2 -g  # Process manager
   pm2 start server.js --name harrington-backend
   pm2 save
   pm2 startup
   ```

7. **Set up Nginx for frontend:**
   ```bash
   sudo nano /etc/nginx/sites-available/harrington-capital
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/harrington-capital;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
       
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/harrington-capital /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Get SSL certificate (FREE with Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

**Cost:** ~$5/month + domain name ($10-15/year)

---

## 🌟 Option 3: Professional Hosting (Recommended for Business)

### Cloud Hosting

**AWS (Amazon Web Services):**
- Frontend: S3 + CloudFront
- Backend: EC2 or Elastic Beanstalk
- Database: RDS (PostgreSQL)

**Google Cloud Platform:**
- Frontend: Firebase Hosting
- Backend: Cloud Run or App Engine
- Database: Cloud SQL

**Microsoft Azure:**
- Frontend: Static Web Apps
- Backend: App Service
- Database: Azure SQL

**Cost:** $20-100+/month depending on usage

---

## 📝 What You Need

### 1. Domain Name (Your Website Address)

**Where to buy:**
- **Namecheap** - $8-12/year
- **Google Domains** - $12/year
- **Cloudflare** - $8-10/year (often cheapest)

**Popular domains:**
- `.com` - Most professional ($10-15/year)
- `.net` - Alternative ($10-12/year)
- `.co` - Modern option ($20-30/year)

**After buying domain:**
- Point it to your hosting provider's nameservers
- This connects `yourdomain.com` to your server

### 2. SSL Certificate (HTTPS - Secure Connection)

**FREE options:**
- Let's Encrypt (automatic with most hosts)
- Cloudflare (free SSL)

**Why you need it:**
- Required for login/authentication
- Google ranks HTTPS sites higher
- Browser shows "Not Secure" without it

### 3. Email (Optional but Recommended)

**Options:**
- **Google Workspace** - $6/user/month
- **Microsoft 365** - $6/user/month
- **Zoho Mail** - Free for personal, $1/user/month for business

---

## 🚀 Quickest Path to Go Live (Recommended)

### For Testing/Demo:
1. ✅ Frontend: GitHub Pages (FREE)
2. ✅ Backend: Railway FREE tier
3. ✅ Total: $0/month

### For Real Business:
1. ✅ Buy domain name (~$10/year)
2. ✅ Get VPS server ($5/month)
3. ✅ Set up with Nginx + SSL
4. ✅ Total: ~$6/month

---

## 📚 Detailed Tutorials

### GitHub Pages Setup:
1. https://pages.github.com
2. https://docs.github.com/en/pages/getting-started-with-github-pages

### Railway Deployment:
1. https://docs.railway.app
2. Sign up and follow deployment wizard

### VPS Setup:
1. DigitalOcean tutorials: https://www.digitalocean.com/community/tutorials
2. Search for "How to deploy Node.js app"

---

## ⚠️ Important Notes

1. **Backend Security:**
   - Change default admin password
   - Use strong JWT_SECRET
   - Enable rate limiting
   - Keep software updated

2. **Database:**
   - SQLite works for small sites
   - Consider PostgreSQL for production
   - Set up automatic backups

3. **Monitoring:**
   - Set up uptime monitoring (UptimeRobot - FREE)
   - Monitor server resources
   - Set up error logging

4. **Backups:**
   - Regular database backups
   - Backup code to GitHub
   - Keep local copies

---

## 🆘 Need Help?

- **GitHub Pages support:** https://github.com/orgs/community/discussions
- **Railway support:** https://docs.railway.app/help
- **Domain help:** Contact your registrar

---

## ✅ Checklist Before Going Live

- [ ] Test all features locally
- [ ] Update API URLs in frontend
- [ ] Set strong passwords and secrets
- [ ] Configure environment variables
- [ ] Test login functionality
- [ ] Set up SSL certificate
- [ ] Configure domain DNS
- [ ] Test on mobile devices
- [ ] Set up monitoring
- [ ] Create backups

---

**Your website is ready to go live! Start with the FREE option to test, then upgrade when ready.**

