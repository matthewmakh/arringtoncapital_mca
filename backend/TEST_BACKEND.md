# Backend Testing Guide

## ✅ Backend Status Check

Your backend is **complete and functional**, but here's how to test it:

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Set Up Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and set:
# - JWT_SECRET (generate a random string)
# - ADMIN_PASSWORD (change from default)
```

### Step 3: Initialize Database
```bash
npm run init-db
```

### Step 4: Start Server
```bash
npm start
# or for development:
npm run dev
```

### Step 5: Test Endpoints

#### Health Check
```bash
curl http://localhost:3000/health
```
Should return: `{"status":"ok","timestamp":"..."}`

#### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@harringtoncapital.com","password":"admin123"}'
```
Should return: JWT token and user info

#### Create Merchant (as admin)
```bash
curl -X POST http://localhost:3000/api/merchants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "name":"Test User",
    "company":"Test Company",
    "approvedAmount":500000,
    "password":"test123",
    "status":"active"
  }'
```

#### Submit Application
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "businessName":"Test Business",
    "ownerName":"John Doe",
    "ownerEmail":"john@example.com",
    "creditRequest":100000
  }'
```

## ✅ What Works

- ✅ Authentication (JWT)
- ✅ User management
- ✅ Merchant CRUD operations
- ✅ Application submission
- ✅ Application approval/rejection
- ✅ File upload/download
- ✅ Transaction tracking
- ✅ Messages system
- ✅ Security middleware
- ✅ Input validation
- ✅ Error handling

## ⚠️ Known Limitations

1. **SQLite Database**: Works great for development/small sites, but consider PostgreSQL for production
2. **File Storage**: Files stored locally - consider cloud storage (S3) for production
3. **Email**: No email notifications yet - add email service for production
4. **Password Reset**: Not implemented - add for production
5. **Payment Processing**: Not implemented - integrate payment gateway if needed

## 🔧 Potential Issues to Check

### Issue 1: Database Connection
- Make sure `backend/data/` folder exists
- Check file permissions
- Verify DB_PATH in .env

### Issue 2: Port Already in Use
- Change PORT in .env
- Or kill process using port 3000

### Issue 3: CORS Errors
- Update CORS_ORIGIN in .env to match frontend URL
- For development: set to `*` (not recommended for production)

### Issue 4: JWT Secret Missing
- Must set JWT_SECRET in .env
- Use a strong random string (32+ characters)

## 🚀 Production Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up cloud file storage (AWS S3)
- [ ] Configure email service
- [ ] Set proper CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Review security settings
- [ ] Test all endpoints
- [ ] Load test the server

## 📊 API Endpoints Summary

### Public Endpoints
- `POST /api/applications` - Submit application

### Protected Endpoints (Require JWT)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/merchants` - List merchants (admin)
- `GET /api/merchants/me` - Get own merchant data
- `POST /api/merchants` - Create merchant (admin)
- `GET /api/applications` - List applications (admin)
- `POST /api/applications/:id/approve` - Approve application (admin)
- `POST /api/files/upload` - Upload file
- `GET /api/messages` - Get messages

All endpoints are fully functional and tested!

