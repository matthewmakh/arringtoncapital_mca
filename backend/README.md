# Harrington Capital Backend API

Backend API server for Harrington Capital client portal system.

## Features

- **Authentication**: JWT-based authentication for merchants and admin
- **Database**: SQLite database (easily upgradeable to PostgreSQL/MySQL)
- **File Upload**: Secure file upload and download functionality
- **Merchant Management**: Admin can create and manage merchant accounts
- **Application Processing**: Submit and review funding applications
- **Transaction Tracking**: Track fund requests and transactions
- **Security**: Helmet, CORS, rate limiting, input validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` and change:
- `JWT_SECRET`: Use a strong random string (at least 32 characters)
- `ADMIN_PASSWORD`: Change the default admin password
- `PORT`: Set your desired port (default: 3000)

### 3. Initialize Database

```bash
npm run init-db
```

This will:
- Create the database file
- Create all necessary tables
- Create the default admin user

Default admin credentials:
- Email: `admin@harringtoncapital.com`
- Password: (set in .env file, default: `admin123`)

**Important**: Change the admin password after first login!

### 4. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (merchant or admin)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Merchants (Protected)
- `GET /api/merchants` - Get all merchants (admin only)
- `GET /api/merchants/:id` - Get merchant by ID
- `POST /api/merchants` - Create merchant (admin only)
- `PUT /api/merchants/:id` - Update merchant (admin only)
- `GET /api/merchants/:id/transactions` - Get merchant transactions
- `POST /api/merchants/:id/funds` - Request funds (merchant)

### Applications
- `POST /api/applications` - Submit application (public)
- `GET /api/applications` - Get all applications (admin only)
- `GET /api/applications/:id` - Get application by ID (admin only)
- `POST /api/applications/:id/approve` - Approve application (admin only)
- `POST /api/applications/:id/reject` - Reject application (admin only)

### Files (Protected)
- `POST /api/files/upload` - Upload file
- `GET /api/files` - Get files list
- `GET /api/files/:id/download` - Download file

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens expire after 7 days. Use the `/api/auth/login` endpoint to get a new token.

## Database Schema

- **users**: User accounts (merchants and admin)
- **merchants**: Merchant account details (credit limits, balances)
- **applications**: Funding applications
- **transactions**: Fund requests and transactions
- **documents**: Uploaded files
- **messages**: System messages (to be implemented)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- Rate limiting to prevent abuse
- Helmet for security headers
- CORS configuration
- File type validation for uploads

## Upgrading to Production Database

To use PostgreSQL or MySQL instead of SQLite:

1. Install the database driver:
   ```bash
   npm install pg  # For PostgreSQL
   # or
   npm install mysql2  # For MySQL
   ```

2. Update `models/database.js` to use the new database
3. Update connection string in `.env`

## Notes

- Files are stored in the `uploads/` directory
- Database file is stored in `data/database.db`
- In production, configure proper file storage (AWS S3, etc.)
- Set up email service for password resets and notifications
- Use environment variables for all sensitive configuration

