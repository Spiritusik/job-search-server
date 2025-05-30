# Job Search Server

**Job Search Server** is a backend RESTful API built with **Node.js**, **Express**, and **MongoDB**. It handles user authentication, token management, and job-related business logic for the job search application.

---

## 🚀 Tech Stack

- **Node.js** + **Express** – RESTful server
- **MongoDB** + **Mongoose** – Database and ODM
- **JWT** – Token-based authentication
- **Yup** – Validation
- **Cookie-parser** – Manage cookies
- **dotenv** – Environment config
- **CORS** – Cross-origin requests

---

## 🧩 Core Features

### 🔐 Authentication

- Registration and login with secure password hashing
- JWT access and refresh tokens
- Middleware for token validation and route protection

### 👤 User Management

- Check current session (`/auth`)
- Logout and token invalidation
- Roles support (default: `USER`)

### 🔁 Token Management

- Refresh token rotation
- Secure storage in MongoDB
- Expiration support via `.env`

---

## 📦 Project Structure

- config/ # Environment configs
- controllers/ # Route logic
- dtos/ # Payload formatters
- error/ # Custom API errors
- middlewares/ # Global error handlers
- models/ # Mongoose models (User, Token)
- routes/ # Express routers
- services/ # Business logic (userService, tokenService)
- types/ # TS types (e.g. JwtPayload)
- server.ts # App entry point
- .env # Environment variables
- tsconfig.json # TypeScript config
- package.json # Scripts and dependencies

---

## 🛠️ Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/Spiritusik/job-search-server.git
cd job-search-server
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
PORT=5000
MONGGO_DB_ACCESS_LOGIN=your_login
MONGGO_DB_ACCESS_PASSWORD=your_password
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=30
JWT_REFRESH_EXPIRES_IN=30
CLIENT_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

## 📄 API Endpoints

| Method | Endpoint                 | Description                    |
| ------ | ------------------------ | ------------------------------ |
| POST   | `/api/user/registration` | Register a new user            |
| POST   | `/api/user/login`        | Login and receive tokens       |
| POST   | `/api/user/logout`       | Invalidate refresh token       |
| GET    | `/api/user/auth`         | Check if user is authenticated |

## 📎 Related Project
- 👉 [Frontend – job-search-client](https://github.com/Spiritusik/job-search-client)