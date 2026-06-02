# DBDiagram — ER Schema Designer

A small full-stack project to create, store, and share database diagrams (DBML). It includes a React + Vite frontend for editing and viewing diagrams and an Express + MongoDB backend for authentication and persistence.

## Features

- User registration and authentication (JWT)
- Create, edit and save DBML diagrams
- Share diagrams via public token
- Simple REST API for auth and diagram storage

## Repository layout

- `backend/` — Express API
  - `src/app.js` — app entry and server
  - `src/routes` — route definitions (`/api/auth`)
  - `src/controllers` — request handlers
  - `src/models` — Mongoose models (`User`, `Diagram`)
- `frontend/` — React (Vite) app
  - `src/` — React components, pages and utilities

## Prerequisites

- Node.js 18+ and npm
- A running MongoDB instance (Atlas or local)

## Environment variables

Create a `.env` file in the `backend/` folder with at least:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWT tokens
- `JWT_EXPIRES_IN` — (optional) token expiry, e.g. `7d`
- `CLIENT_URL` — (optional) frontend origin, e.g. `http://localhost:5173`
- `PORT` — (optional) backend port (default: `4000`)

Example `.env` (do NOT commit this file):

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/dbdiagram
JWT_SECRET=supersecretvalue
CLIENT_URL=http://localhost:5173
PORT=4000
```

## Install & Run (development)

Backend (from repo root):

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at the URL printed by Vite (usually `http://localhost:5173`). The backend health endpoint is `GET /health`.

## API (quick reference)

- `POST /api/auth/register` — body: `{ name, email, password }` — returns `{ token, user }`
- `POST /api/auth/login` — body: `{ email, password }` — returns `{ token, user }`
- `GET /api/auth/me` — protected — returns `{ user }` (requires `Authorization: Bearer <token>`)

Models of note:

- `User` — `{ name, email, password }` (password hashed)
- `Diagram` — `{ title, schema, shareToken, isPublic, userId }`

## Notes & Next steps

- Frontend uses `react-router` and `reactflow` for canvas editing.
- To enable sharing, the backend generates `shareToken` values on diagrams; ensure routes exist in your app to fetch by token if you expose public diagrams.

## Contributing

- Fork, create a feature branch, send a PR. Be sure to add tests for new behavior.

## License

- Add your preferred license file if desired.

---

If you want, I can commit this `README.md` and attempt to push to your GitHub remote now (you may be prompted for credentials). Tell me to proceed when ready.
