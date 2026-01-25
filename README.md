# 🎓 SMUCT Student Management System - Backend

> A comprehensive student management backend built with Node.js, Express, and MongoDB

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Configuration](#environment-configuration)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Features](#features)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Project Overview

**SMUCT Student Management System** is a full-featured backend API for managing student records, authentication, file uploads, and administrative operations. It provides a secure, scalable platform for educational institutions to manage student data efficiently.

### Key Capabilities
- ✅ Complete CRUD operations for student records
- ✅ JWT-based authentication and authorization
- ✅ Role-based access control (Student, Teacher, Admin)
- ✅ File upload management
- ✅ Advanced search functionality
- ✅ Status management (Active, Inactive, Suspended)
- ✅ Admin-only operations

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcryptjs |
| **File Upload** | Multer |
| **Environment** | dotenv |
| **Port** | 3000 (configurable) |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your settings

# 3. Start the server
npm start

# Server will be running at: http://localhost:3000
```

---

## 📁 Project Structure

```
backend/
├── index.js                 # Main application file with all routes
├── config/
│   └── db.js               # MongoDB connection configuration
├── models/
│   └── Student.js          # Student schema and model
├── public/
│   ├── index.html          # Web interface
│   └── style.css           # Styling
├── uploads/                # File upload directory
├── .env                    # Environment variables (git-ignored)
├── .env.example            # Environment template
├── package.json            # Dependencies and scripts
└── README.md              # This file

```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| `POST` | `/auth/register` | Register new user | ❌ No |
| `POST` | `/auth/login` | Login user | ❌ No |
| `GET` | `/auth/profile` | Get current user profile | ✅ Yes |
| `DELETE` | `/auth/:id` | Delete user (admin only) | ✅ Yes (Admin) |

**Example Usage:**
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123","dept":"CS"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

### Student CRUD Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| `POST` | `/students` | Create new student | ✅ Yes |
| `GET` | `/students` | Get all students | ✅ Yes |
| `GET` | `/students/:id` | Get student by ID | ✅ Yes |
| `PUT` | `/students/:id` | Update student | ✅ Yes |
| `DELETE` | `/students/:id` | Delete student | ✅ Yes |
| `DELETE` | `/students` | Delete all students | ✅ Yes (Admin) |

**Example Usage:**
```bash
# Create student
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","dept":"EE"}'

# Get all students
curl -X GET http://localhost:3000/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| `GET` | `/search` | Search students by name | ✅ Yes |
| `GET` | `/search/email/:email` | Search by email | ✅ Yes |
| `GET` | `/search/dept/:dept` | Search by department | ✅ Yes |

**Example Usage:**
```bash
# Search by name
curl -X GET "http://localhost:3000/search?name=John" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Status Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| `PATCH` | `/students/:id/status` | Update status/role | ✅ Yes |

**Example Usage:**
```bash
# Update status
curl -X PATCH http://localhost:3000/students/123/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive","role":"teacher"}'
```

### File Upload

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| `POST` | `/api/resource/:id/upload` | Upload file | ✅ Yes |

**Example Usage:**
```bash
# Upload file
curl -X POST http://localhost:3000/api/resource/123/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@profile.pdf"
```

---

## ⚙️ Environment Configuration

### Required Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?appName=Cluster0

# Authentication
JWT_SECRET=your-secret-key-here
JWT_SECRET_DEV=dev-secret-key
JWT_SECRET_PROD=prod-secret-key
JWT_EXPIRY=7d

# File Upload
MAX_FILE_SIZE=5
UPLOAD_DIR=uploads/

# Application
APP_NAME=SMUCT Student Management System
APP_VERSION=1.0.0
ADMIN_EMAIL=admin@smuct.edu
```

### How to Configure

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values
3. Never commit `.env` to git (protected by `.gitignore`)

For detailed configuration guide, see [ENV_CONFIG_GUIDE.md](ENV_CONFIG_GUIDE.md)

---

## 💾 Database Schema

### Student Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  dept: String (department),
  status: String (enum: ['active', 'inactive', 'suspended']),
  role: String (enum: ['student', 'teacher', 'admin']),
  profilePic: String (file path),
  isAdmin: Boolean (default: false),
  createdAt: Date (auto)
}
```

**Status Meanings:**
- `active` - Student is active and can access the system
- `inactive` - Student account is temporarily disabled
- `suspended` - Student account is under suspension

**Roles:**
- `student` - Standard student user
- `teacher` - Teacher/instructor access
- `admin` - Full administrative access

---

## 🔐 Authentication

### How It Works

1. **Register**: Create account with email and password
2. **Login**: Send email/password, receive JWT token
3. **Token Storage**: Store token in localStorage
4. **API Calls**: Include token in `Authorization: Bearer <token>` header
5. **Validation**: Server validates token before processing request

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}
Payload: {
  "id": "user_id",
  "email": "user@email.com",
  "iat": timestamp,
  "exp": timestamp
}
Signature: HMAC-SHA256(base64(header) + base64(payload), secret)
```

### Token Expiry
- Default: 7 days
- Configurable via `JWT_EXPIRY` in `.env`

### Protected Routes

Routes requiring authentication will return `401 Unauthorized` if:
- No token provided
- Invalid/expired token
- Token signature doesn't match

---

## ✨ Features

### ✅ Student Management
- Create new student records
- View all students with pagination
- Search students by name, email, or department
- Update student information
- Delete individual or all students

### ✅ Authentication
- Secure user registration
- JWT-based login system
- Token-based API access
- Role-based authorization
- Admin-only operations

### ✅ File Management
- Profile picture upload
- Document uploads
- Configurable file size limits
- Secure file storage

### ✅ Admin Features
- Promote users to admin role
- Update student status
- Delete user accounts
- View all students
- System-wide management

### ✅ Web Interface
- Interactive dashboard
- All CRUD operations
- Authentication UI
- File upload interface
- Real-time validation

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git (for cloning)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

4. **Verify installation**
   ```bash
   npm start
   ```

   You should see:
   ```
   ✅ Server started on port 3000
   📋 Environment: development
   🔗 API: http://localhost:3000
   ```

---

## 🏃 Running the Server

### Development Mode
```bash
npm start
```

### With Specific Node Environment
```bash
# Production
NODE_ENV=production npm start

# Testing
NODE_ENV=testing npm start
```

### Using nodemon (auto-reload)
```bash
npm install --save-dev nodemon
npx nodemon index.js
```

### Server Startup Output
```
════════════════════════════════════════
   SMUCT Student Management System
        Express Server Started
════════════════════════════════════════
✅ Server started on port 3000
📋 Environment: development
🔗 API: http://localhost:3000
════════════════════════════════════════
```

---

## 📚 Documentation

### Main Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| [README.md](README.md) | Project overview | 5 min |
| [ENV_CONFIG_GUIDE.md](ENV_CONFIG_GUIDE.md) | Environment configuration | 10 min |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Setup instructions | 5 min |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick lookup | 2 min |
| [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) | System design | 8 min |
| [COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md) | Verification | 3 min |
| [README_ENV_CONFIG.md](README_ENV_CONFIG.md) | Configuration summary | 7 min |

### Quick Links

- **Getting Started?** → Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Need Quick Answers?** → Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Configuring Environment?** → See [ENV_CONFIG_GUIDE.md](ENV_CONFIG_GUIDE.md)
- **Understanding Architecture?** → Review [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

---

## 🧪 Testing API Endpoints

### Using cURL

```bash
# 1. Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","dept":"CS"}'

# 2. Login (save the token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer TOKEN"

# 4. Create a student
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","dept":"EE"}'

# 5. Get all students
curl -X GET http://localhost:3000/students \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import API collection from provided Postman JSON file (if available)
2. Set `{{base_url}}` to `http://localhost:3000`
3. Set `{{token}}` to your JWT token
4. Test each endpoint

---

## 📮 Comprehensive API Testing with Postman

This section provides detailed Postman testing instructions for all API endpoints.

### 1. Create Student [POST]

#### a) Single Student

**Method:** `POST`  
**URL:** `http://localhost:3000/students`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "_id": "223071004",
  "name": "Abid Hossain",
  "dept": "CSE",
  "email": "abid@gmail.com",
  "password": "mypassword"
}
```

#### b) Multiple Students

**Method:** `POST`  
**URL:** `http://localhost:3000/students`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "students": [
    { "_id": "223071005", "name": "Rahim", "dept": "EEE", "email": "rahim@gmail.com", "password": "1234" },
    { "_id": "223071006", "name": "Karim", "dept": "ME", "email": "karim@gmail.com", "password": "1234" }
  ]
}
```

---

### 2. Get All Students [GET]

**Method:** `GET`  
**URL:** `http://localhost:3000/students`  
**Description:** Retrieves all student records

---

### 3. Get Student by ID [GET /:id]

**Method:** `GET`  
**URL:** `http://localhost:3000/students/<STUDENT_ID>`  
**Example:** `http://localhost:3000/students/223071004`  
**Description:** Retrieve a specific student record by ID

---

### 4. Update Student by ID [PUT /:id]

**Method:** `PUT`  
**URL:** `http://localhost:3000/students/<STUDENT_ID>`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Abid Hossain",
  "dept": "FDT"
}
```

**Description:** Update specific fields of a student record

---

### 5. Delete All Students [DELETE]

**Method:** `DELETE`  
**URL:** `http://localhost:3000/students`  
**Description:** Deletes all student records (Admin only)

---

### 6. Delete Student by ID [DELETE /:id]

**Method:** `DELETE`  
**URL:** `http://localhost:3000/students/<STUDENT_ID>`  
**Description:** Delete a specific student record by ID

---

### 7. Search Student by Name [GET /search?name=value]

**Method:** `GET`  
**URL:** `http://localhost:3000/search?name=<STUDENT_NAME>`  
**Example:** `http://localhost:3000/search?name=Abid`  
**Description:** Search for students by name (supports partial matching)

---

### 8. File Upload [POST /api/resource/:id/upload]

**Method:** `POST`  
**URL:** `http://localhost:3000/api/resource/<STUDENT_ID>/upload`  
**Body Type:** `form-data`

**Form-Data Parameters:**
```
Key: file
Type: File
Value: (select an image or PDF file)
```

**Description:** Upload files (images or PDFs) related to a student resource

---

### 9. Update Status/Role [PATCH /:id/status]

**Method:** `PATCH`  
**URL:** `http://localhost:3000/students/<STUDENT_ID>/status`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "status": "inactive",
  "role": "teacher"
}
```

**Description:** Update only specific fields like status or role

---

### 10. Admin Registration [POST /auth/register]

**Method:** `POST`  
**URL:** `http://localhost:3000/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "_id": "Admin01",
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "dept": "CSE",
  "isAdmin": true
}
```

**Expected Response:**
```json
{
  "message": "Student registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJBZG1pbjAxIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc2OTE5MDI0NSwiZXhwIjoxNzY5Nzk1MDQ1fQ.ytIMDsV-A3I_hgXRqI6tv2rcpOnffnNL46a0rV1IuOw",
  "student": {
    "_id": "Admin01",
    "name": "Admin User",
    "email": "admin@example.com",
    "dept": "CSE",
    "role": "student",
    "isAdmin": true
  }
}
```

---

### 11. Admin Login [POST /auth/login]

**Method:** `POST`  
**URL:** `http://localhost:3000/auth/login`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer <AUTH_TOKEN>
```

**Body (raw JSON):**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJBZG1pbjAxIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc2OTE5MDMwMSwiZXhwIjoxNzY5Nzk1MTAxfQ.VOuNA9bEt3e3Xd2SuLVYQg1ttlcGbjkhydZgUfoWPSk",
  "student": {
    "_id": "Admin01",
    "name": "Admin User",
    "email": "admin@example.com",
    "dept": "CSE",
    "role": "student",
    "status": "active"
  }
}
```

**Note:** Save the token from the response and use it in subsequent requests.

---

### 12. Get Profile [GET /auth/profile] (Protected Route)

**Method:** `GET`  
**URL:** `http://localhost:3000/auth/profile`  
**Headers:**
```
Authorization: Bearer <AUTH_TOKEN>
```

**Description:** Retrieve the current user's profile. Requires valid authentication token.

---

### 13. Delete User [DELETE /auth/:id] (Admin-Only Route)

**Method:** `DELETE`  
**URL:** `http://localhost:3000/auth/<USER_ID>`  
**Headers:**
```
Authorization: Bearer <AUTH_TOKEN>
```

**Description:** Delete a user account. Only accessible by admin users.

---

### 🔑 Authentication Flow in Postman

1. **Register** → Send POST request to `/auth/register`
2. **Copy Token** → From the response, copy the JWT token
3. **Set Authorization** → In subsequent requests, add header:
   ```
   Authorization: Bearer <YOUR_TOKEN_HERE>
   ```
4. **Test Protected Routes** → Now you can access protected endpoints

### 📝 Postman Tips

- **Environment Variables:** Create a Postman environment with:
  - `base_url`: `http://localhost:3000`
  - `auth_token`: Your JWT token
  - Use as: `{{base_url}}/students` and `Bearer {{auth_token}}`

- **Collections:** Organize all requests in a collection for easy management

- **Pre-request Scripts:** Automatically set tokens before each request

- **Tests:** Add test scripts to validate responses

---

## ❓ Troubleshooting

### Server Won't Start

**Problem:** "Cannot find module 'dotenv'"
```bash
# Solution: Install dependencies
npm install
```

**Problem:** "Port 3000 is already in use"
```bash
# Solution: Use different port
PORT=3001 npm start
```

**Problem:** "MongoDB connection failed"
```bash
# Solution: Check your MONGODB_URI in .env
# Verify:
# 1. Connection string is correct
# 2. IP address is whitelisted in MongoDB Atlas
# 3. Database user has correct permissions
```

### Authentication Issues

**Problem:** "Invalid token"
- Token has expired (check JWT_EXPIRY)
- Token signature doesn't match (check JWT_SECRET)
- Token format is wrong (should be `Authorization: Bearer <token>`)

**Problem:** "Unauthorized" on protected routes
- Ensure token is included in header
- Token must start with "Bearer "
- User role may not have permission

### File Upload Issues

**Problem:** "File size exceeds maximum"
```bash
# Solution: Increase MAX_FILE_SIZE in .env
MAX_FILE_SIZE=10  # 10 MB
```

**Problem:** "Cannot find uploads directory"
```bash
# Solution: Create uploads directory
mkdir uploads
```

### Database Issues

**Problem:** "Connection timeout"
- Check MongoDB Atlas network whitelist
- Verify internet connection
- Check firewall settings

**Problem:** "Authentication failed"
- Verify MongoDB username and password
- Check MONGODB_URI format
- Ensure special characters are URL-encoded

---

## 📋 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    "id": "12345",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Technical error details"
}
```

### Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Server Error` - Server error

---

## 🔒 Security Best Practices

✅ **Do:**
- Keep `.env` file private (never commit to git)
- Use strong JWT secrets in production
- Update dependencies regularly
- Validate all user input
- Use HTTPS in production
- Rotate secrets periodically
- Store passwords hashed

❌ **Don't:**
- Commit `.env` to version control
- Use default/weak secrets
- Expose sensitive information in logs
- Trust client-side validation alone
- Use HTTP in production
- Share authentication tokens
- Store plain-text passwords

---

## 📞 Support & Help

### Documentation Resources
- Full API documentation: See endpoint tables above
- Configuration help: [ENV_CONFIG_GUIDE.md](ENV_CONFIG_GUIDE.md)
- Setup instructions: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Common issues: [Troubleshooting](#troubleshooting) section

### Debugging

Enable detailed logs:
```bash
LOG_LEVEL=debug npm start
```

Check server logs for:
- Connection errors
- Authentication failures
- Validation errors
- Database operations

---

## 🤝 Contributing

### Code Style
- Use consistent indentation (2 spaces)
- Follow JavaScript conventions
- Add comments for complex logic
- Test changes before committing

### Submitting Changes
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Wait for review

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2026 | Initial release with all features |

---

## 📄 License

This project is part of SMUCT Semester 8 coursework.

---

## 👥 Contact & Support

**Project:** SMUCT Student Management System
**Environment:** Production Ready
**Status:** Active Development

---

## 🎉 Quick Start Checklist

- [ ] Clone/download the project
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with your MongoDB URI
- [ ] Run `npm start`
- [ ] Visit `http://localhost:3000`
- [ ] Register and login
- [ ] Test API endpoints
- [ ] Explore web interface

---

**Last Updated:** January 24, 2026
**Status:** ✅ Production Ready
**Support:** Complete Documentation Available

Happy coding! 🚀
