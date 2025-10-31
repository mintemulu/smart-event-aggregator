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

## Design Explanation

The service periodically fetches events from Ticketmaster and SeatGeek using lightweight adapters. Each adapter normalizes provider payloads into a unified `Event` document: `{ source, sourceId, title, description, url, category, startDate, endDate, venue{ name, address, city, country } }`. Documents are upserted by `{source, sourceId}` to avoid duplicates, with indexes on text fields and a uniqueness constraint on identifiers.

(Note: Eventbrite search functionality has been deprecated and is no longer used)

The REST API exposes two endpoints: `GET /api/events` for querying (search and filters) and `GET /api/events/categories` for distinct categories. A GraphQL endpoint (`/graphql`) offers a flexible alternative, returning the same event shape and supporting arguments for keyword, category, city, limit, and offset. Search uses a robust, regex-based strategy that matches all words across multiple fields (title, description, category, and venue fields) while still honoring selected filters. This ensures queries like “sport” return relevant results even when matches occur in categories or venues rather than descriptions alone.

The React dashboard provides a clean toolbar with a keyword search (with icon) and a category dropdown (default “All Categories”). It queries the REST API and renders concise event cards with titles, categories, dates, venues, and links. The architecture favors clarity and maintainability: adapters are independent, storage is normalized, APIs are thin, and the UI is minimal with fast iterations.

## Api Providers

- [Ticketmaster API](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)
- [SeatGeek API](https://platform.seatgeek.com/)
