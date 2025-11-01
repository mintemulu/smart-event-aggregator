## Design Explanation

The service periodically fetches events from Ticketmaster and SeatGeek using lightweight adapters. Each adapter normalizes provider payloads into a unified `Event` document: `{ source, sourceId, title, description, url, category, startDate, endDate, venue{ name, address, city, country } }`. Documents are upserted by `{source, sourceId}` to avoid duplicates, with indexes on text fields and a uniqueness constraint on identifiers.

(Note: Eventbrite search functionality has been deprecated and is no longer used)

The REST API exposes two endpoints: `GET /api/events` for querying (search and filters) and `GET /api/events/categories` for distinct categories. A GraphQL endpoint (`/graphql`) offers a flexible alternative, returning the same event shape and supporting arguments for keyword, category, city, limit, and offset. Search uses a robust, regex-based strategy that matches all words across multiple fields (title, description, category, and venue fields) while still honoring selected filters. This ensures queries like “sport” return relevant results even when matches occur in categories or venues rather than descriptions alone.

The React dashboard provides a clean toolbar with a keyword search (with icon) and a category dropdown (default “All Categories”). It queries the REST API and renders concise event cards with titles, categories, dates, venues, and links. The architecture favors clarity and maintainability: adapters are independent, storage is normalized, APIs are thin, and the UI is minimal with fast iterations.
