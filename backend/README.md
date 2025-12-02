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
- Optional variables:
  - `NODE_ENV` — defaults to `development`
  - `PORT` — defaults to `3000`

Example `.env` (you can paste this into `backend/.env` and adjust):
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/devinche
```
Notes:
- If `MONGODB_URI` is missing, the app will throw an error during startup when loading config.

## 3) Start the backend server
Run from the `backend` folder:
```bash
# Development (auto‑reload with nodemon, assuming index.ts is your entry)
npm run dev

# Or regular start (ts-node)
npm start
```
The server listens on the port defined by `PORT` (default 3000) and uses the current environment from `NODE_ENV`.

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
