# Backend Setup & Migration Guide

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and update:
# - JWT_SECRET (use a strong random string)
# - ADMIN_PASSWORD (change from default)
# - PORT (if you want a different port)
```

### 3. Initialize Database

```bash
npm run init-db
```

This creates:
- Database file at `backend/data/database.db`
- All necessary tables
- Default admin user

### 4. Start Backend Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:3000`

### 5. Update Frontend API URL (if needed)

If your backend runs on a different port, update `api.js`:
```javascript
const API_BASE_URL = 'http://localhost:YOUR_PORT/api';
```

## Frontend Updates

The frontend has been updated to use the API. Key changes:

1. **api.js** - New API client that handles all backend communication
2. **app.js** - Updated to use API for authentication
3. **portal.js** - Needs update to use API (see below)
4. **admin.js** - Needs update to use API (see below)

## Migration Status

✅ **Completed:**
- Backend server structure
- Database schema and initialization
- Authentication API endpoints
- Merchant management API endpoints
- Application submission API endpoints
- File upload/download API endpoints
- Security middleware
- Frontend API client (api.js)
- Frontend login/authentication

⚠️ **Needs Update:**
- portal.js - Update to use API for merchant dashboard data
- admin.js - Update to use API for admin functions
- form.js - Update application submission to use API

## Testing the Backend

### Test Login

1. Start the backend server
2. Open browser console on the frontend
3. Test login:
```javascript
// Admin login
await window.API.auth.login('admin@harringtoncapital.com', 'admin123');

// Merchant login (after creating merchant)
await window.API.auth.login('merchant@example.com', 'password');
```

### Test Admin Functions

```javascript
// Get all merchants
await window.API.merchants.getAll();

// Create merchant
await window.API.merchants.create({
    email: 'test@example.com',
    name: 'Test User',
    company: 'Test Company',
    approvedAmount: 500000,
    password: 'test123',
    status: 'active'
});

// Get all applications
await window.API.applications.getAll();
```

## Next Steps

1. **Update portal.js**: Replace localStorage calls with API calls
2. **Update admin.js**: Replace localStorage calls with API calls  
3. **Update form.js**: Submit applications via API
4. **Test all functionality**: Ensure everything works end-to-end
5. **Production deployment**: 
   - Use PostgreSQL/MySQL instead of SQLite
   - Set up proper file storage (AWS S3, etc.)
   - Configure email service
   - Set up SSL/HTTPS
   - Configure proper CORS origins

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Merchants
- `GET /api/merchants` - List all (admin)
- `GET /api/merchants/:id` - Get one
- `POST /api/merchants` - Create (admin)
- `PUT /api/merchants/:id` - Update (admin)
- `POST /api/merchants/:id/funds` - Request funds

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - List all (admin)
- `POST /api/applications/:id/approve` - Approve (admin)

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List files
- `GET /api/files/:id/download` - Download file

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Troubleshooting

### Database errors
- Make sure `backend/data/` directory exists
- Run `npm run init-db` again to recreate tables

### CORS errors
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- Or set to `*` for development (not recommended for production)

### Authentication errors
- Check JWT_SECRET in `.env` matches
- Tokens expire after 7 days
- Make sure token is being sent in Authorization header

### Port already in use
- Change PORT in `.env`
- Or kill the process using the port

## Production Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure proper CORS origins
- [ ] Set up SSL/HTTPS
- [ ] Use production database (PostgreSQL/MySQL)
- [ ] Configure file storage (S3, etc.)
- [ ] Set up email service
- [ ] Configure environment variables properly
- [ ] Set up logging/monitoring
- [ ] Set up backups
- [ ] Review and test all security measures

