const axios = require('axios');
const categories = require('../config/categories');

async function fetchSeatGeekEvents(clientId, clientSecret, limit = 20) {
  let allEvents = [];

  for (const cat of categories) {
    try {
      const res = await axios.get('https://api.seatgeek.com/2/events', {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          per_page: limit,
          q: cat.keyword
        },
      });

      const events = res.data.events || [];
      allEvents.push(...events.map(ev => ({
        source: "seatgeek",
        sourceId: ev.id,
        title: ev.title,
        description: ev.description || "",
        url: ev.url,
        category: cat.label,
        startDate: ev.datetime_local ? new Date(ev.datetime_local) : null,
        venue: {
          name: ev.venue?.name,
          address: ev.venue?.address,
          city: ev.venue?.city,
          country: ev.venue?.country,
        },
      })));
    } catch (err) {
      console.error("SeatGeek fetch error:", err.message);
    }
  }

  return allEvents;
}

module.exports = { fetchSeatGeekEvents };
