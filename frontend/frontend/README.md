# Notes App (React)

A production-ready Notes application built with React. It provides authentication, protected routes, and full note CRUD workflows with a clean and maintainable structure.

## Table of Contents

- Overview
- Features
- Tech Stack
- Requirements
- Installation
- Configuration
- Available Scripts
- Testing
- Project Structure
- Operational Notes

## Overview

This frontend consumes a REST API and manages authentication via JWT. It is designed to be easy to run locally and straightforward to deploy.

## Features

- User authentication (register, login, password reset)
- Protected routes for authenticated views
- Create, view, edit, and delete notes
- JWT auto-attachment for API requests
- Responsive UI with Bootstrap
- Unit and component tests with React Testing Library

## Tech Stack

- React 19
- React Router 7
- Axios
- Bootstrap 5
- React Testing Library + Jest

## Requirements

- Node.js 18+ (recommended)
- Backend API running locally or remotely

## Installation

```bash
npm install
```

## Configuration

The API base URL is defined in `src/api/axios.js`.

```js
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});
```

Update the value to point to the correct backend environment before running the app.

## Available Scripts

- `npm start` - Start the development server
- `npm test` - Run the test suite
- `npm run build` - Build for production
- `npm run eject` - Eject Create React App configuration (one-way)

## Testing

```bash
npm test
```

## Project Structure

```
src/
  api/            # Axios instance and API modules
  auth/           # Auth pages (login/register/reset)
  notes/          # Notes pages and components
  profile/        # Profile modal
  routes/         # Protected routes
  styles/         # Page-level styles
  utils/          # Auth utilities
```

## Operational Notes

- JWT tokens are stored in `localStorage` and attached via Axios interceptors.
- Ensure the backend API enables CORS for the frontend origin.
