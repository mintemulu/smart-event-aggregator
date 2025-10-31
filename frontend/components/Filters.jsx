import React, { useEffect, useState } from "react";

export default function Filters({ events, selectedCategory, searchQuery, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch("http://localhost:5000/api/events/categories"); // fixed URL
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      className="filters"
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '10px 12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
      }}
      role="search"
      aria-label="Search and filter events"
    >
      <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 520 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 18,
            height: 18,
            color: '#6b7280'
          }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          placeholder="Search events..."
          aria-label="Search events"
          value={searchQuery}
          onChange={e => onFilterChange('q', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            outline: 'none'
          }}
        />
        
      </div>

      <div style={{ minWidth: 200 }}>
        <select
          value={selectedCategory}
          onChange={e => onFilterChange('category', e.target.value)}
          disabled={loadingCategories}
          aria-label="Filter by category"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            backgroundColor: '#fff'
          }}
        >
          <option value="">All Categories</option>
          {loadingCategories ? (
            <option>Loading...</option>
          ) : (
            categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}
