# TODO App - Backend API

A RESTful API server for the TODO application built with Express.js and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [MongoDB Configuration](#mongodb-configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Assumptions & Limitations](#assumptions--limitations)

## ✨ Features

- ✅ RESTful API with CRUD operations for TODOs
- ✅ MongoDB integration with Mongoose ODM
- ✅ CORS enabled for cross-origin requests
- ✅ Input validation and error handling
- ✅ Request logging for development
- ✅ Health check endpoint
- ✅ Database seeding script
- ✅ Environment-based configuration

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing
- **Nodemon** - Development auto-reload

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **MongoDB Atlas account (cloud)** - [Sign up](https://www.mongodb.com/cloud/atlas)

## 🚀 Installation & Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   
   Create a `.env` file in the `server` directory:
   ```bash
   # On Windows PowerShell
   New-Item -Path .env -ItemType File
   ```

4. **Configure environment variables:**
   
   Edit the `.env` file and add your MongoDB connection string:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   NODE_ENV=development
   ```

## 🗄️ MongoDB Configuration

### MongoDB Atlas (Cloud)

1. **Create a MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a new cluster:**
   - Choose the free tier (M0 Sandbox)
   - Select a cloud provider and region

3. **Set up database access:**
   - Go to "Database Access" and create a database user
   - Set username and password (save these credentials)

4. **Configure network access:**
   - Go to "Network Access"
   - Add your IP address or use `0.0.0.0/0` for development (allows access from anywhere)
   - ⚠️ **Note:** `0.0.0.0/0` is not recommended for production

5. **Get your connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `todoapp`)

   Example:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority
   ```

## ▶️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in `.env`)

### Verify Server is Running

Check the health endpoint:
```bash
# Using curl
curl http://localhost:5000/api/health

# Or visit in browser:
http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-11-08T12:00:00.000Z"
}
```

## 📡 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/health` | Health check | - |
| GET | `/api/todos` | Get all todos | - |
| GET | `/api/todos/:id` | Get single todo | - |
| POST | `/api/todos` | Create new todo | `{ title, description? }` |
| PUT | `/api/todos/:id` | Update todo | `{ title?, description?, done? }` |
| DELETE | `/api/todos/:id` | Delete todo | - |

### Example Requests

**Create a TODO:**
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'
```

**Get all TODOs:**
```bash
curl http://localhost:5000/api/todos
```

**Update a TODO:**
```bash
curl -X PUT http://localhost:5000/api/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```

**Delete a TODO:**
```bash
curl -X DELETE http://localhost:5000/api/todos/{id}
```

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 5000 | No |
| `MONGODB_URI` | MongoDB connection string | - | **Yes** |
| `NODE_ENV` | Environment mode | development | No |

## ⚠️ Assumptions & Limitations

### Assumptions

1. **Single User:** The application does not include user authentication or multi-user support
2. **Simple Data Model:** TODOs only have title, description, and done status
3. **No Pagination:** All todos are returned at once (suitable for small datasets)
4. **CORS Enabled:** All origins are allowed by default (configured for development)
5. **No File Uploads:** TODOs are text-only, no attachments supported
6. **UTC Timestamps:** All timestamps use UTC timezone

### Current Limitations

1. **No Authentication/Authorization:**
   - Any client can perform any operation
   - No user-specific todos
   - No API rate limiting

2. **No Data Validation on Frontend:**
   - Validation is primarily server-side
   - Client should handle validation for better UX

3. **No Pagination or Filtering:**
   - All todos are fetched at once
   - May become slow with thousands of todos
   - No search or filter capabilities

4. **No Real-time Updates:**
   - No WebSocket support
   - Clients must poll or refresh to see updates

5. **Limited Error Messages:**
   - Error messages are basic
   - No detailed validation feedback for all fields

6. **No Data Backup:**
   - No automated backup mechanism
   - Seed script deletes all data

7. **Basic Security:**
   - No input sanitization against XSS
   - No rate limiting
   - CORS allows all origins (not production-ready)

8. **No Logging:**
   - Basic console logging only
   - No persistent log files
   - No error tracking service integration

### Recommended Improvements for Production

- [ ] Add user authentication (JWT or OAuth)
- [ ] Implement pagination and filtering
- [ ] Add input sanitization and advanced validation
- [ ] Set up proper CORS configuration
- [ ] Add rate limiting and request throttling
- [ ] Implement proper logging (Winston, Morgan)
- [ ] Add monitoring and error tracking (Sentry)
- [ ] Set up automated backups
- [ ] Add unit and integration tests
- [ ] Implement caching (Redis)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up CI/CD pipeline

---

