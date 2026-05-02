# Codify AI Platform

Codify is an AI-powered coding interview platform that combines adaptive problem practice, an in-browser code editor, sandboxed code execution, AI chat guidance, and automated code review. It is split into a React/Vite frontend and an Express backend that manages sessions, authentication, AI features, and code execution.

## Features

- Interactive coding interview workspace with problem, editor, chat, and review panels
- Python and Java starter code generated from each problem signature
- Sandboxed code execution through E2B Code Interpreter
- Batch testcase execution with normalized output comparison
- Runtime, compilation, timeout, and internal error reporting
- AI interviewer chat and code review powered by Gemini
- User authentication with JWT and bcrypt
- Session history and interview progress tracking
- Responsive frontend built with React, Tailwind CSS, Radix UI, Monaco Editor, and lucide-react

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Monaco Editor
- Radix UI
- React Router
- Vitest

### Backend

- Node.js
- Express 5
- Sequelize
- PostgreSQL or MySQL
- JWT authentication
- Gemini API
- E2B Code Interpreter

## Project Structure

```text
Codify/
  backend/
    config/          Database configuration
    data/            Local question seed data
    middleware/      Auth middleware
    models/          Sequelize models
    routes/          API route handlers
    scripts/         Utility and seed scripts
    services/        AI and code execution services
    utils/           Code wrapping, parsing, and comparison helpers
    server.js        Express app entrypoint

  frontend/
    public/          Static assets
    src/
      components/    UI and interview components
      context/       Auth context
      hooks/         Frontend hooks
      lib/           Constants, boilerplate, helpers
      pages/         App pages
    vite.config.js   Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL or MySQL database
- E2B API key
- Gemini API key

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

JWT_SECRET=replace_with_a_secure_secret
GEMINI_API_KEY=replace_with_your_gemini_key
E2B_API_KEY=replace_with_your_e2b_key

DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codify
DB_USER=postgres
DB_PASSWORD=your_password
```

Start the backend:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

## API Overview

### Health

```http
GET /api/health
```

Returns API health and timestamp.

### Auth

```http
POST /api/auth/register
POST /api/auth/login
```

Handles account creation and login.

### Sessions

```http
POST /api/session
GET /api/session/:id
PUT /api/session/:id
```

Creates and manages interview sessions.

### Code Execution

```http
POST /api/code/submit
POST /api/code/submit-all
```

Runs code against sample or full testcase sets.

Request shape:

```json
{
  "code": "class Solution:\n    def twoSum(self, nums, target):\n        return [0, 1]\n",
  "language": "python",
  "functionName": "twoSum",
  "testCases": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]"
    }
  ]
}
```

### AI Review

```http
POST /api/review/code
POST /api/review/chat
```

Generates code reviews and interview chat responses.

## Code Execution Flow

1. The frontend sends source code, language, function name, and testcases to the backend.
2. `codeRoutes.js` parses testcase inputs such as `nums = [2,7,11,15], target = 9`.
3. `codeUtils.js` wraps Python or Java solutions in a LeetCode-style harness when testcase parameters exist.
4. `e2bService.js` writes the source file and input into an E2B sandbox.
5. Java code is compiled before execution.
6. Runtime output is captured and normalized.
7. Actual output is compared with expected output.
8. The API returns testcase-level status, stdout, stderr, compile output, and aggregate pass counts.

## Execution Debugging

The execution layer logs an execution ID for each sandbox run:

```text
[E2B:<execution-id>] Executing python | harness=true | stdin="{...}" | function=twoSum
[E2B:<execution-id>] Completed successfully | stdout=6 chars | stderr=0 chars
```

Testcase orchestration logs each case:

```text
[Code] run case 1/2 | language=python | function=twoSum | params=nums,target
[Code] case 1 result | status=Accepted | stdout=6 chars | stderr=0 chars
```

These logs make it easier to diagnose missing input, harness issues, compilation errors, runtime errors, and sandbox failures.

## Scripts

### Backend

```bash
npm run dev      # Start backend with nodemon
npm start        # Start backend with node
npm run build    # Backend placeholder build script
```

### Frontend

```bash
npm run dev       # Start Vite dev server
npm run build     # Build production frontend
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm test          # Run Vitest
```

## Verification

Useful checks after code execution changes:

```bash
node --check backend/services/e2bService.js
node --check backend/routes/codeRoutes.js
node --check backend/utils/codeUtils.js
```

Frontend checks:

```bash
cd frontend
npm run lint
npm test
npm run build
```

## Environment Notes

- `E2B_API_KEY` is required for code execution.
- `GEMINI_API_KEY` is required for AI chat and review.
- `JWT_SECRET` must be set to a strong secret before production use.
- In development, the backend syncs Sequelize models with `alter: true`.
- Configure `FRONTEND_URL` if the frontend is not running on the default Vite URL.

## License

This repository currently does not declare a license.
