# Deployment Guide - Anointed Trinity Pre-School

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Backend Deployment](#backend-deployment)
5. [Database Setup](#database-setup)
6. [Production Checklist](#production-checklist)

## Prerequisites

- GitHub account with repository access
- Node.js 18+ installed locally
- Git configured
- PostgreSQL 12+ (for local or managed database)
- Cloudinary account (for image uploads)
- Email service (Gmail, SendGrid, etc.)

## Environment Setup

### 1. Environment Variables

Create `.env.local` in your project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/anointed_trinity_db"

# JWT
JWT_SECRET="your-secret-key-change-this"
JWT_EXPIRY="7d"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@anointedtrinity.co.za"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://anointedtrinity.co.za"
NEXT_PUBLIC_SITE_NAME="Anointed Trinity Pre-School"
NODE_ENV="production"

# Admin Configuration
ADMIN_SECRET="strong-secret-for-admin-creation"
```

## Frontend Deployment (Vercel)

### Option 1: Direct Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up with GitHub

3. **Import Project**
   - Click "New Project"
   - Select your repository
   - Click "Import"

4. **Configure Environment Variables**
   - In "Environment Variables" section, add all variables from `.env.local`
   - Select which environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is now live!

### Option 2: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Backend Deployment

### Option 1: Railway.app (Recommended)

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway and select your repo

3. **Add PostgreSQL Database**
   - Click "Add"
   - Select "PostgreSQL"
   - Click "Create"

4. **Configure Environment Variables**
   - In "Variables" tab, add all production variables
   - Railway will automatically create `DATABASE_URL`

5. **Connect to Vercel**
   - Copy Railway environment variables
   - Add to Vercel project

### Option 2: Render.com

1. **Create Account**
   - Visit https://render.com
   - Sign in with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repo

3. **Configure Service**
   - Name: `anointed-trinity-api`
   - Region: Your closest region
   - Runtime: Node.js
   - Build command: `npm install`
   - Start command: `npm run build && npm start`

4. **Add Environment Variables**
   - Add all production variables from `.env.local`

### Option 3: Traditional Server (DigitalOcean, AWS, etc.)

```bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Clone repository
cd /var/www
git clone https://github.com/your-username/anointed-trinity.git
cd anointed-trinity

# Install dependencies
npm install --production

# Setup environment variables
nano .env.production

# Build application
npm run build

# Start with PM2
npm install -g pm2
pm2 start "npm start" --name "anointed-trinity"
pm2 startup
pm2 save

# Setup Nginx as reverse proxy
sudo apt-get install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
# Add proxy configuration pointing to localhost:3000

# Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Database Setup

### Local Development

```bash
# Push schema to local database
npm run db:push

# Seed with test data
npm run db:seed

# Open Prisma Studio for database management
npm run db:studio
```

### Production Database Migration

```bash
# 1. Create backup of development database
pg_dump anointed_trinity_db > backup.sql

# 2. Migrate schema to production
npm run db:push -- --skip-generate

# 3. Seed production data (be careful with production!)
NODE_ENV=production npm run db:seed

# 4. Verify migration
npm run db:studio
```

### Database Backup Strategy

```bash
# Weekly backup script (backup.sh)
#!/bin/bash
BACKUP_DIR="/var/backups/anointed-trinity"
mkdir -p $BACKUP_DIR
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Automate with cron
crontab -e
# Add: 0 2 * * 0 /path/to/backup.sh (weekly at 2 AM)
```

## DNS Configuration

### Pointing Domain to Vercel

1. **Add Domain in Vercel**
   - Project Settings → Domains
   - Add your domain

2. **Update DNS Records** at your domain registrar:

   **Option A: Nameservers (Recommended)**
   ```
   NS1: ns1.vercel-dns.com
   NS2: ns2.vercel-dns.com
   NS3: ns3.vercel-dns.com
   NS4: ns4.vercel-dns.com
   ```

   **Option B: CNAME Record**
   ```
   CNAME: cname.vercel-dns.com
   ```

3. **Verify SSL Certificate**
   - Wait 5-10 minutes for propagation
   - Vercel automatically provisions SSL

## SSL/HTTPS Configuration

### Vercel
- Automatically provisioned and renewed

### Traditional Server
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d anointedtrinity.co.za

# Configure Nginx for HTTPS
sudo nano /etc/nginx/sites-available/default
# Redirect HTTP to HTTPS

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring & Logging

### Application Monitoring
```bash
# PM2 Monitoring (Traditional Servers)
pm2 monit

# View logs
pm2 logs anointed-trinity

# Set up alerts
pm2 install pm2-auto-pull
```

### Error Tracking (Sentry - Optional)
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.ts
# See Sentry documentation for setup
```

### Database Monitoring
```bash
# Connect to production database
psql $DATABASE_URL

# Check database size
SELECT pg_size_pretty(pg_database_size(current_database()));

# View table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) 
FROM pg_stat_user_tables 
ORDER BY pg_total_relation_size(relid) DESC;
```

## Production Checklist

- [ ] All environment variables configured
- [ ] Database migrated and backed up
- [ ] SSL certificate installed
- [ ] Email service verified
- [ ] Cloudinary account configured
- [ ] Admin account created
- [ ] Test login flow (parent and admin)
- [ ] Test application submission
- [ ] Test email notifications
- [ ] Database backup automation set up
- [ ] Monitoring and alerts configured
- [ ] Error logging enabled
- [ ] Performance optimized (images, caching)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Sitemap and robots.txt generated
- [ ] Google Analytics integrated
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

## Scaling Considerations

### When Traffic Increases

1. **Database**
   - Enable connection pooling
   - Add read replicas
   - Optimize queries with indices

2. **Application Server**
   - Add more instances
   - Use load balancer
   - Enable caching (Redis)

3. **Static Assets**
   - Use CDN (Cloudflare)
   - Enable browser caching
   - Compress images

4. **Monitoring**
   - Set up alerting
   - Track performance metrics
   - Monitor error rates

## Support & Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear build cache
rm -rf .next
npm run build
```

**Database Connection Error**
```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

**Email Not Sending**
```bash
# Verify SMTP credentials in .env
# Check email service rate limits
# Review email logs: `pm2 logs`
```

For additional help:
- Documentation: [README.md](../README.md)
- API Docs: [docs/API.md](./API.md)
- Issues: Create GitHub issue
- Contact: support@anointedtrinity.co.za
