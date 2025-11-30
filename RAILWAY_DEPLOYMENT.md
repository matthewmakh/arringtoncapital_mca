# Railway Deployment Guide

## Quick Deploy to Railway

### 1. Create a Railway Account
Go to [railway.app](https://railway.app) and sign up/login with GitHub

### 2. Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `matthewmakh/arringtoncapital_mca`
4. Railway will automatically detect it's a Node.js project

### 3. Configure Environment Variables
In Railway dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-a-random-32+-character-string>
ADMIN_EMAIL=admin@harringtoncapital.com
ADMIN_PASSWORD=<change-this-secure-password>
DB_PATH=./data/database.db
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CORS_ORIGIN=*
```

**Important**: Generate a secure JWT_SECRET. You can use this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy
Railway will automatically:
- Install dependencies (`npm install`)
- Run `npm start` (which runs init-db first)
- Assign a public URL

### 5. Access Your Application
Railway will provide a URL like: `https://your-app.up.railway.app`

## Frontend Configuration

Update `api.js` in your frontend to point to your Railway URL:

```javascript
const API_BASE_URL = 'https://your-app.up.railway.app/api';
```

## Database Persistence

⚠️ **Important**: Railway's ephemeral storage means the SQLite database will reset on redeploys.

For production, consider:
1. Use Railway's Volume feature for persistent storage
2. Migrate to PostgreSQL (Railway offers free PostgreSQL)
3. Use external database service

## File Uploads

Upload files will also be ephemeral. For production:
1. Use Railway Volumes
2. Use AWS S3 or similar cloud storage
3. Update file handling in `routes/files.js`

## Monitoring

Check logs in Railway dashboard:
- Click on your deployment
- Go to "Deployments" tab
- Click on active deployment to see logs

## Custom Domain (Optional)

In Railway dashboard:
1. Go to Settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

If deployment fails:
1. Check logs in Railway dashboard
2. Verify all environment variables are set
3. Ensure `JWT_SECRET` is set
4. Check that `NODE_ENV` is set to `production`

## Local Development

To run locally:
```bash
npm install
cp .env.example .env
# Edit .env with your values
npm run init-db
npm start
```

Server will run on http://localhost:3000
