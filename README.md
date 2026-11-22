# Leafnote

*Your thoughts, thoughtfully organized.*

10Pearls Cohort 10, MERN track. Haiqa Anis Khan.

A notes app built with MongoDB, Express, React and Node.js. Users will be able to sign up, write notes, tag them, pin and favorite them, archive or trash them, search, and import/export. Changes will sync live between open tabs.

I'm building it week by week. This branch (`week-01-foundation`) is the starting point: the backend and frontend are set up and talking to each other, but there are no user accounts or notes yet.

## What's done in Week 1

**Backend**
- Express 5 API (ES modules). `app.js` builds the app and `server.js` starts it, so tests can import the app without opening a port
- MongoDB connection with Mongoose, connection events logged, clean shutdown on Ctrl + C. If MongoDB is down at startup, the API keeps running and retries the connection (2s, 4s, 8s, 16s, then every 30s)
- `GET /api/health` returns the API and database status (200 if MongoDB is connected, 503 if not)
- `.env` settings are checked on startup, with `.env.example` as the template
- Helmet security headers, CORS limited to the frontend URL, 100 KB body limit
- One error handler and a 404 handler, so every error comes back in the same JSON format
- Pino logging (readable in development, JSON in production, passwords/tokens/cookies hidden)
- Mocha + Chai + Supertest tests, ESLint, c8 coverage

**Frontend**
- React 19, Vite, Tailwind CSS 4, React Router, Axios, Lucide icons
- Sage green, cream and soft white theme, with a leaf-and-page logo
- Reusable components: Button, TextField, Card, Tag, Logo, Spinner, StatusBadge, NoteCard
- Layout with the green sidebar and a slide-in menu on mobile
- Home page with a banner and a **System status** card that checks the backend and database live, with a retry button
- Vite proxy so the browser calls `/api` on the same origin (needed for cookies in Week 2)
- 404 page, keyboard focus styles, labels for screen readers
- Jest + React Testing Library tests, ESLint

The other sidebar pages are greyed out for now. The note cards on Home are sample content to show the design.

## Tech stack

| | |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Axios, Lucide, PropTypes |
| Backend | Node.js 22.18+/24.11+, Express 5, Mongoose, Helmet, CORS, dotenv |
| Database | MongoDB (Atlas or local) |
| Logging | Pino, pino-http |
| Testing | Mocha, Chai, Supertest, c8 (backend), Jest, React Testing Library (frontend) |
| Quality | ESLint, SonarQube, CodeRabbit |

## How it's structured

```text
React (localhost:5173) --/api--> Vite proxy --> Express (localhost:5000) --> MongoDB
```

On the backend, routes point to controllers, controllers handle the request and response, services hold the logic, and middleware handles logging and errors. Models come in Week 2.

```text
backend/src/
  app.js, server.js
  config/        env.js, database.js
  controllers/   health.controller.js
  middleware/    errorHandler.js, notFound.js, requestLogger.js
  routes/        index.js, health.routes.js
  services/      health.service.js
  utils/         logger.js, ApiError.js
  tests/

frontend/src/
  App.jsx, main.jsx, index.css
  components/    common/, dashboard/, notes/
  hooks/         useHealthStatus.js
  layouts/       AppLayout.jsx
  pages/         HomePage.jsx, NotFoundPage.jsx
  services/      api.js, healthService.js
  utils/
  tests/
```

## Running it locally

You need Node.js 22.18+ or 24.11+, Git, and a MongoDB database (a free Atlas cluster or MongoDB Community Server).

**Backend**

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

The copied `.env` points at a local MongoDB (`mongodb://127.0.0.1:27017/leafnote`). If you use MongoDB Atlas, open `backend/.env` now and replace `MONGODB_URI` with your Atlas connection string (see the table below). Then start the API:

```powershell
npm run dev
```

**Frontend** (in a second terminal)

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Then open http://localhost:5173. The System status card should show **Online** and **Connected**.

If PowerShell blocks npm with "running scripts is disabled", run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once.

### Environment variables

`backend/.env`

| Variable | Example |
|---|---|
| `NODE_ENV` | `development` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/leafnote?retryWrites=true&w=majority` |
| `CLIENT_URL` | `http://localhost:5173` |
| `LOG_LEVEL` | `info` |

`frontend/.env`

| Variable | Example |
|---|---|
| `VITE_API_URL` | `/api` |
| `VITE_PROXY_TARGET` | `http://localhost:5000` |

`.env` files are in `.gitignore` and never committed.

## API

Every response looks like `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code", "message" } }`.

| Method | Route | What it does |
|---|---|---|
| GET | `/` | API name and version |
| GET | `/api/health` | API and database status. 200 when connected, 503 when MongoDB is down |

Error codes so far: `INVALID_JSON` (400), `NOT_FOUND` (404), `PAYLOAD_TOO_LARGE` (413), `INTERNAL_ERROR` (500).

## Tests

```powershell
npm test              # in backend/ or frontend/
npm run test:coverage
npm run lint
```

Backend tests don't touch the real database. They cover the app setup, config checks, the error handler and the health route.

Frontend tests cover routing, the System status card in all its states, the health hook and service, the sidebar and the shared components.

Results on my machine: backend 28 passing, frontend 32 passing, both lint runs clean.

## Known issues

- `npm audit` shows some moderate warnings in dev-only test tools (minimatch/glob inside Mocha, c8 and Jest). They don't ship with the app, and the `--force` fix downgrades the test runners, so I've left them for now.
- The banner image is from the Canva design reference given for this project.

## Next up (Week 2)

Sign up, log in, log out, forgot/reset password, JWT in an HTTP-only cookie, protected pages, and database tests.
