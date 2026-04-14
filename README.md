# Lockal Way

Lockal Way is a travel platform with:
- a Vite + React frontend in `client/`
- an Express + MongoDB backend in `server/`
- Docker and VM deployment support in `ops/`

## Project structure
- `client/`: traveler and guide-facing web app
- `server/`: REST API, auth, bookings, payments, and guide/trip flows
- `ops/`: deployment helpers and documentation

## Local setup
1. Copy the environment templates:
   - `cp client/.env.example client/.env`
   - `cp server/.env.example server/.env`
2. Fill in the real keys in both files.
3. Start each app:
   - frontend: `cd client && npm run dev`
   - backend: `cd server && npm run dev`

## Important auth note
Google sign-in depends on the Firebase web app keys in `client/.env`.

If `client/.env` is missing or the Firebase values are blank:
- email/password auth can still work against the backend
- Google sign-in is shown as unavailable instead of failing at runtime

## Deployment
Production-style Docker deployment is documented in `ops/deploy/FREE_VM_DEPLOYMENT.md`.
