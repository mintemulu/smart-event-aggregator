const axios = require('axios');
const categories = require('../config/categories');

async function fetchTicketmasterEvents(apikey, pageSize = 20) {
  let allEvents = [];

  for (const cat of categories) {
    try {
      const res = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
        params: {
          apikey,
          size: pageSize,
          keyword: cat.keyword
        }
      });

      const events = res.data?._embedded?.events || [];
      allEvents.push(...events.map(ev => ({
        source: 'ticketmaster',
        sourceId: ev.id,
        title: ev.name,
        description: ev.info || ev.pleaseNote || '',
        url: ev.url,
        category: cat.label,
        startDate: ev.dates?.start?.dateTime ? new Date(ev.dates.start.dateTime) : null,
        endDate: ev.dates?.end?.dateTime ? new Date(ev.dates.end.dateTime) : null,
        venue: ev._embedded?.venues?.[0] ? {
          name: ev._embedded.venues[0].name,
          address: ev._embedded.venues[0].address?.line1 || '',
          city: ev._embedded.venues[0].city?.name || '',
          country: ev._embedded.venues[0].country?.name || ''
        } : {},
      })));
    } catch (err) {
      console.error('Ticketmaster fetch error:', err.message);
    }
  }

  return allEvents;
}

module.exports = { fetchTicketmasterEvents };
