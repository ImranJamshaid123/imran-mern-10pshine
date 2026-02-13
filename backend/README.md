# Backend API

A robust and scalable Node.js backend service built with Express.js and MySQL. This API provides comprehensive functionality for user authentication, profile management, and note-taking features.

## Table of Contents

- [Features]
- [Tech Stack]
- [Prerequisites]
- [Installation]
- [Environment Variables]
- [Running the Application]
- [API Documentation]
- [Project Structure]
- [Testing]
- [Contributing]
- [License]

## Features

- User Authentication with JWT and password hashing
- User Management (CRUD operations for user profiles)
- Notes Management (Full CRUD operations for user notes)
- Request Validation using express-validator
- Centralized Error Handling middleware
- Email Notifications via Nodemailer integration
- Structured Logging with Pino for all HTTP requests and responses
- Security features including CORS and bcryptjs encryption
- Comprehensive Testing with Mocha, Chai, and Supertest
- Development tools including Nodemon for auto-reload

## Tech Stack

- Runtime: Node.js
- Framework: Express.js 5.2.1
- Database: MySQL 2
- Authentication: JWT (jsonwebtoken)
- Password Hashing: bcryptjs
- Validation: express-validator
- Email Service: Nodemailer
- Logging: Pino
- Testing: Mocha, Chai, Supertest
- Development: Nodemon, Cross-env

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm or yarn
- MySQL Server (v5.7 or higher)

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Set up the database

Create a MySQL database and configure your connection details in the environment variables.

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourapplication.com

# Application URL
APP_URL=http://localhost:5000
```

## Running the Application

### Development Mode

Run the server with auto-reload on file changes:

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will be accessible at `http://localhost:5000` (or your configured PORT).

## API Documentation

### Authentication Endpoints

- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login user and receive JWT token
- **POST** `/auth/forgot-password` - Request password reset
- **POST** `/auth/reset-password` - Reset password with token

### User Endpoints

- **GET** `/users` - Get all users (admin only)
- **GET** `/users/:id` - Get user profile
- **PUT** `/users/:id` - Update user profile
- **DELETE** `/users/:id` - Delete user account

### Notes Endpoints

- **GET** `/notes` - Get all notes for authenticated user
- **GET** `/notes/:id` - Get specific note
- **POST** `/notes` - Create a new note
- **PUT** `/notes/:id` - Update a note
- **DELETE** `/notes/:id` - Delete a note

Note: Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── note.controller.js   # Notes management logic
│   │   └── user.controller.js   # User management logic
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT authentication middleware
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── validate.middleware.js # Request validation middleware
│   ├── routes/
│   │   ├── auth.Route.js        # Authentication routes
│   │   ├── note.Route.js        # Notes routes
│   │   ├── user.route.js        # User routes
│   │   └── index.js             # Main router
│   ├── utils/
│   │   └── sendEmail.js         # Email utility functions
│   ├── validators/
│   │   ├── auth.validator.js    # Auth request validators
│   │   ├── note.validator.js    # Note request validators
│   │   └── user.validator.js    # User request validators
│   └── tests/
│       └── ...                  # Unit tests
├── test/
│   ├── auth.test.js             # Authentication tests
│   ├── notes.test.js            # Notes tests
│   └── users.test.js            # User tests
├── app.js                       # Express app setup
├── server.js                    # Server entry point
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## Testing

Run the test suite using:

```bash
npm test
```

This will execute all unit and integration tests using Mocha and generate coverage reports.

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure that:
- Your code follows the existing code style
- All tests pass
- You add tests for new features
- You update documentation as needed

## License

This project is licensed under the ISC License - see the package.json file for details.

## Support

For support and questions, please open an issue in the repository.

