# Smart Helmet Central Command

React + Vite frontend and Express + MongoDB API for Smart Helmet monitoring, SOS simulation, and emergency dispatch workflows.

## Architecture

```
Frontend (Vite/React on Vercel)
    → Authenticated REST API + WebSocket (Express on Node host)
        → MongoDB Atlas
```

Deploy the API on a long-running Node host (Render, Railway, Fly.io, Docker/VM). Do **not** rely on Vercel serverless for the WebSocket server.

## Project layout

- `client/` — React dashboard (JWT login)
- `server/` — Express API, Mongoose models, authenticated WebSocket
- `.github/workflows/ci.yml` — lint/build/test CI

## Local setup

### 1. Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Required for production:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `NODE_ENV=production`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (used to seed the first admin)

For local development without MongoDB, leave `MONGO_URI` empty and keep `ALLOW_MEMORY_MODE=1`. The API seeds a memory admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### 2. Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Leave `VITE_API_URL` empty for local development so Vite proxies `/api` to `http://localhost:4000`.

Default login (change immediately in production):

- Email: value of `ADMIN_EMAIL` (example: `admin@smarthelmet.local`)
- Password: value of `ADMIN_PASSWORD` (example from `.env.example`)

## Scripts

| Package | Script | Purpose |
| --- | --- | --- |
| client | `npm run dev` | Vite dev server |
| client | `npm run build` | Production build |
| client | `npm run lint` | ESLint |
| server | `npm run dev` | API with `--watch` |
| server | `npm start` | Production API start |
| server | `npm test` | Node test runner |
| server | `npm run lint` | ESLint |
| root | `npm run lint` / `npm test` | Convenience wrappers |

## Environment variables

### Server

- `PORT`
- `NODE_ENV`
- `MONGO_URI` (required in production)
- `JWT_SECRET` (required in production)
- `JWT_EXPIRES_IN`
- `CLIENT_ORIGIN` (comma-separated allowed frontend origins)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME`
- `ALLOW_MEMORY_MODE` (development only)
- `ALLOW_NO_ORIGIN` (optional; non-browser clients in production)
- `API_RATE_LIMIT`

### Client

- `VITE_API_URL` (production API base URL, no trailing slash)
- `VITE_WS_URL` (optional explicit WebSocket URL)
- `VITE_ALLOW_MOCKS` (`true` only for offline UI demos)

## Production notes

1. Deploy `server/` to a Node host (Docker image included as `server/Dockerfile`) and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV=production`, and admin seed vars.
2. Deploy `client/` to Vercel with Root Directory `client`, build `npm run build`, output `dist`.
3. Set `VITE_API_URL` in Vercel to the public API URL.
4. Allow the Vercel domain in `CLIENT_ORIGIN`.
5. In MongoDB Atlas, allow the API host IP (or a tightly scoped network policy).
6. Change the default admin password immediately after first login.

## Security

- Never commit `.env` files.
- All alert/telemetry/config/device routes require JWT auth.
- Simulate SOS/impact endpoints require Admin or Operator roles.
- Production refuses to start without MongoDB.
- CORS is origin-allowlisted in production.
