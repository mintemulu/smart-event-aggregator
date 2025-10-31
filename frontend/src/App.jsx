import React, { useEffect, useState } from "react";
import EventList from "../components/EventList";
import Filters from "../components/Filters";

function App() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: "", q: "" });

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.q) params.append("q", filters.q);

      const res = await fetch(`http://localhost:5000/api/events?${params.toString()}`); // fixed URL
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="app">
      <h1>Smart Event Feed Aggregator</h1>
      <Filters
        events={events}
        selectedCategory={filters.category}
        searchQuery={filters.q}
        onFilterChange={handleFilterChange}
      />
      <EventList events={events} />
    </div>
  );
}

export default App;
