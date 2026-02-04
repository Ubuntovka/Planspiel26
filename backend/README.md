# Backend — Run Guide

This guide covers only the backend service. It explains how to set up the backend, configure environment variables, and run the MongoDB initialization script (dbInit).

## Prerequisites
- Node.js 18+ and npm
- A MongoDB instance and a valid connection string

## 1) Install dependencies
From the repository root:
```bash
cd backend
npm install
```

## 2) Environment variables
An example file is provided at `backend/.env.example`. This file is only an example — copy its contents, fill in the actual values for your environment, and save them as `backend/.env`.

- Required variables:
  - `MONGODB_URI` — connection string for your MongoDB instance
  - `JWT_KEY` — secret used to sign JWT access tokens (keep it long and random)
- Optional variables:
  - `NODE_ENV` — defaults to `development`
  - `PORT` — recommended `4000` (defaults to `3000` if unset)
  - `OPENAI_API_KEY` — required for AI diagram generation from the Mona chat (WAM diagram from prompt). If unset, `POST /api/llm/generate-diagram` returns 503.
  - `OPENAI_MODEL` — optional; defaults to `gpt-4o` for diagram generation.

Example `.env` (you can paste this into `backend/.env` and adjust):
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/devinche
JWT_KEY=replace-with-a-long-random-secret
# Google OAuth (Authorization Code with popup)
GOOGLE_CLIENT_ID=332723524164-9hq53ucjcmv5eedbhnb6nosagif20nv9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```
Notes:
- If `MONGODB_URI` is missing, the app will throw an error during startup when loading config.
- If `JWT_KEY` is missing, auth will fail with 500 when trying to issue tokens.

## 3) Start the backend server
Run from the `backend` folder:
```bash
# Development (auto‑reload with nodemon, assuming index.ts is your entry)
npm run dev

# Or regular start (ts-node)
npm start
```
The server listens on the port defined by `PORT` (commonly 4000 for this project; 3000 if unset) and uses the current environment from `NODE_ENV`.

## 3.1) Google OAuth (Popup Code Flow)

This backend supports Google Sign‑In via the Authorization Code flow (popup on the frontend). Configure your Google Cloud Console OAuth client (type: Web application):

- Authorized JavaScript origins: `http://localhost:3000`
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

Required backend env vars (in `backend/.env`):

```
GOOGLE_CLIENT_ID=332723524164-9hq53ucjcmv5eedbhnb6nosagif20nv9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

Endpoint used by the frontend to exchange the authorization code for tokens and receive your JWT:

- `POST /api/users/oauth/google/code` with JSON body `{ "code": "<authorization_code>" }`

On success, the backend verifies the Google ID token, creates/updates the user (email, first name, last name, picture), and returns `{ user, token }` where `token` is your app’s JWT.

## 3.2) API documentation (Swagger/OpenAPI)

This project includes interactive API documentation powered by Swagger UI and an OpenAPI 3.0 specification generated from JSDoc comments.

- Swagger UI: http://localhost:PORT/api-docs (e.g., http://localhost:4000/api-docs)
- Raw OpenAPI JSON: http://localhost:PORT/openapi.json

How it works:
- The OpenAPI spec is generated at runtime using `swagger-jsdoc` from specially formatted `@openapi` JSDoc blocks in the code.
- The generator scans the following paths (see `index.ts`):
  - `./api/routes/**/*.ts`
  - `./models/**/*.ts`
- A security scheme `bearerAuth` is defined for JWT-protected endpoints.

Authorize in Swagger UI (for secured endpoints):
1. Obtain a JWT from `POST /api/users/register` or `POST /api/users/login`.
2. In Swagger UI, click the “Authorize” button (padlock icon).
3. For `bearerAuth`, paste your token value without the `Bearer ` prefix. Swagger UI will add it automatically.
4. Click “Authorize”, then “Close”. You can now call secured endpoints from the UI.

Documenting endpoints with `@openapi` JSDoc:
- Place a block comment above the route declaration. Example:

```ts
/**
 * @openapi
 * /api/example:
 *   get:
 *     tags:
 *       - Example
 *     summary: Example endpoint
 *     responses:
 *       200:
 *         description: Successful response
 */
```

Reusable schemas and Users API docs:
- Common request/response schemas (e.g., `User`, `AuthResponse`, `LoginRequest`, `UpdateUserRequest`, etc.) are defined inside `userRoutes.ts` under `components.schemas` and referenced by all user endpoints.
- All user routes are documented and visible under the `Users` tag in Swagger UI.

Servers/base URL:
- By default, the OpenAPI `servers` list includes your local server URL (e.g., `http://localhost:<PORT>`). If you deploy the backend, update `servers` in `backend/index.ts` accordingly.

Fetch the spec via curl:
```bash
curl http://localhost:4000/openapi.json | jq '.'
```

## 4) Run the database initialization script (dbInit)
This script connects to MongoDB using the same configuration and creates sample collections/documents.

From the `backend` folder, run one of the following:
```bash
# Using the convenience npm script
npm run db:init

# OR run it directly with ts-node
npx ts-node scripts/dbInit.ts
```

What the script does:
- Loads env vars via `config/config.ts`
- Connects to `config.mongoUri`
- Clears relevant collections
- Seeds a sample user and a sample diagram
- Disconnects


## 5) Users API — Endpoints and Usage

All user-related endpoints are mounted under `/api/users`. The API returns JSON responses. For authenticated routes, include the header `Authorization: Bearer <token>` obtained from the Register or Login response.

### Register
- Method/URL: `POST /api/users/register`
- Purpose: Create a new user and return a JWT access token.
- Required JSON body fields:
  - `username` (string)
  - `email` (string)
  - `firstName` (string)
  - `lastName` (string)
  - `password` (string, min 8 chars)
- Success response: `201` with `{ user, token }` where `user` is sanitized (no password/tokens)
- Errors: `400` with `{ error: string }`
- Example:
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"alice",
    "email":"alice@example.com",
    "firstName":"Alice",
    "lastName":"Doe",
    "password":"SuperSecret1"
  }'
```

### Login
- Method/URL: `POST /api/users/login`
- Purpose: Authenticate user and return a JWT access token.
- Required JSON body fields:
  - `email` (string)
  - `password` (string)
- Success response: `200` with `{ user, token }`
- Errors: `400` with `{ error: "Invalid email or password" }` or validation error messages
- Example:
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"SuperSecret1"}'
```

### Get current user (Me)
- Method/URL: `GET /api/users/me`
- Auth: Bearer token required
- Success response: `200` with sanitized `user`
- Errors: `401` with `{ error: string }`
- Example:
```bash
TOKEN=... # paste the token from register/login
curl http://localhost:4000/api/users/me -H "Authorization: Bearer $TOKEN"
```

### Update profile
- Method/URL: `PATCH /api/users/update`
- Auth: Bearer token required
- Purpose: Update one or more profile fields.
- Required JSON body field:
  - `oldPassword` (string) — your current password (used to verify identity)
- Optional fields to update (send any subset):
  - `username`, `email`, `password`, `firstName`, `lastName`, `pictureUrl`, `preferredLanguage`
- Success response: `200` with `{ user }` (updated, sanitized)
- Errors: `400` with `{ error: string }` (e.g., missing `oldPassword`, no updatable fields provided) or `401` if not authenticated
- Example (change preferred language):
```bash
curl -X PATCH http://localhost:4000/api/users/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword":"SuperSecret1","preferredLanguage":"de"}'
```
- Example (change password):
```bash
curl -X PATCH http://localhost:4000/api/users/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword":"SuperSecret1","password":"NewStrongerPass2"}'
```

### Delete account
- Method/URL: `DELETE /api/users/delete`
- Auth: Bearer token required
- Success response: `200` with `{ message: 'User deleted successfully.', user }`
- Errors: `400` with `{ error: string }` or `401` if not authenticated
- Example:
```bash
curl -X DELETE http://localhost:4000/api/users/delete -H "Authorization: Bearer $TOKEN"
```

### Logout (current device)
- Method/URL: `POST /api/users/logout`
- Auth: Bearer token required
- Purpose: Invalidate the current token only.
- Success response: `200` with `{ message: 'User logged out successfully.' }`
- Example:
```bash
curl -X POST http://localhost:4000/api/users/logout -H "Authorization: Bearer $TOKEN"
```

### Logout from all devices
- Method/URL: `POST /api/users/logoutall`
- Auth: Bearer token required
- Purpose: Invalidate all active tokens for the user.
- Success response: `200` with `{ message: 'User logged out from all devices successfully.' }`
- Example:
```bash
curl -X POST http://localhost:4000/api/users/logoutall -H "Authorization: Bearer $TOKEN"
```

### Notes and Troubleshooting
- Always send `Content-Type: application/json` for requests with a JSON body.
- For update operations you must include `oldPassword` in the JSON body, even if you only change non-sensitive fields.
- Ensure your `.env` contains both `MONGODB_URI` and `JWT_KEY` and restart the server after changes.
- Tokens expire after 1 hour; re-login to get a new token if needed.

#### Google OAuth troubleshooting
- Ensure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` are present in `backend/.env`.
- The redirect URI in `.env` must exactly match the one configured in Google Cloud Console.
- Frontend should run on `http://localhost:3000` and call backend at `http://localhost:4000` (or via a proxy). Clear site data for both origins if you change settings.
