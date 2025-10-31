import React from "react";

export default function EventList({ events }) {
  if (!events.length) return <p>No events found.</p>;

  return (
    <div className="event-list">
      {events.map(ev => (
        <div key={`${ev.source}-${ev.sourceId}`} className="event-card">
          <h3>{ev.title}</h3>
          <p><strong>Category:</strong> {ev.category}</p>
          <p><strong>Source:</strong> {ev.source}</p>
          <p><strong>Date:</strong> {ev.startDate ? new Date(ev.startDate).toLocaleString() : "N/A"}</p>
          <p><strong>Venue:</strong> {ev.venue?.name}, {ev.venue?.city}</p>
          <a href={ev.url} target="_blank" rel="noopener noreferrer">View Event</a>
        </div>
      ))}
    </div>
  );
}
