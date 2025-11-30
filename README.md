# Harrington Capital Website - Complete Backup

This folder contains the complete Harrington Capital website with all files.

## 📁 File Structure

### Frontend Files
- **index.html** - Main website HTML file
- **styles.css** - All website styling
- **app.js** - Main application JavaScript (login, navigation)
- **portal.js** - Client portal functionality
- **form.js** - Application form handling
- **admin.js** - Admin portal functionality
- **api.js** - API client for backend communication

### Backend Files
- **backend/** - Complete backend server system
  - Node.js + Express server
  - SQLite database
  - API endpoints
  - Authentication system
  - File upload/download
  - See `backend/README.md` for backend setup instructions

## 🚀 Quick Start

### Frontend Only
Simply open `index.html` in your web browser. The website will work with demo/localStorage data.

### Full Setup (Frontend + Backend)

1. **Set up backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and set JWT_SECRET
   npm run init-db
   npm start
   ```

2. **Open frontend:**
   - Open `index.html` in your browser
   - The frontend will connect to the backend API at `http://localhost:3000`

## 📋 Features

### Frontend
- ✅ Professional navy & gold design
- ✅ Responsive layout
- ✅ Client portal
- ✅ Admin portal
- ✅ Application forms
- ✅ Login system
- ✅ Beautiful UI/UX

### Backend
- ✅ REST API
- ✅ JWT authentication
- ✅ SQLite database
- ✅ Merchant management
- ✅ Application processing
- ✅ File upload/download
- ✅ Security features

## 🔐 Default Credentials

### Admin
- Email: `admin@harringtoncapital.com`
- Password: Set in backend `.env` file (default: `admin123`)

### Demo Account
- Email: `demo@harringtoncapital.com`
- Password: `demo123`

## 📝 Notes

- All frontend files are in the root of this folder
- Backend files are in the `backend/` subfolder
- Database will be created in `backend/data/database.db` when you run `npm run init-db`
- Uploads will be stored in `backend/uploads/` folder

## 🔄 To Restore

1. Copy this entire folder to your desired location
2. If using backend: Run `npm install` in the `backend/` folder
3. Open `index.html` to view the website

## 📅 Backup Date

This backup was created on: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 💾 What's Included

✅ Complete website HTML/CSS/JS
✅ Full backend API system
✅ Database schema
✅ All configuration files
✅ Setup documentation
✅ API client
✅ Security features

**Everything needed to run the complete Harrington Capital website system!**

