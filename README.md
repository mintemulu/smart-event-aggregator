# Smart Event Feed Aggregator

A small service that aggregates events from multiple public APIs, stores them in MongoDB, and exposes them via REST and GraphQL with a simple React dashboard (search + category filter).

## Tech Used

- Backend: Node.js (Express), GraphQL (express-graphql), node-cron
- Database: MongoDB (Mongoose)
- Frontend: React + Vite
- Fetchers: Ticketmaster API, SeatGeek API

## Setup

1. Prerequisites

- Node.js 18+ and npm
- MongoDB connection string
- API keys: Ticketmaster, SeatGeek (client id/secret)

2. Backend

- Create `backend/.env` with:
  - `MONGODB_URI=mongodb+srv://...`
  - `TICKETMASTER_API_KEY={{TICKETMASTER_API_KEY}}`
  - `SEATGEEK_CLIENT_ID={{SEATGEEK_CLIENT_ID}}`
  - `SEATGEEK_CLIENT_SECRET={{SEATGEEK_CLIENT_SECRET}}`
  - Optional: `PORT=5000`, `FETCH_INTERVAL_HOURS=6`
- Install and run:
  ```bash
  cd backend
  npm ci
  npm start
  ```
- REST base: `http://localhost:5000/api`
- GraphQL: `http://localhost:5000/graphql` (GraphiQL enabled)

3. Frontend

- Install and run:
  ```bash
  cd frontend
  npm ci
  npm run dev
  ```
- Open `http://localhost:5173` (the UI calls the backend at `http://localhost:5000`).

## Api Providers

- [Ticketmaster API](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)
- [SeatGeek API](https://platform.seatgeek.com/)
