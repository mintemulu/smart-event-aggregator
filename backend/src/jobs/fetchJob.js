const cron = require('node-cron');
const Event = require('../models/Event');
const { fetchSeatGeekEvents } = require('../services/fetchSeatGeek');
const { fetchTicketmasterEvents } = require('../services/fetchTicketmaster');

async function fetchAndSaveAll() {
  try {
    const [tmEvents, sgEvents] = await Promise.all([
      fetchTicketmasterEvents(process.env.TICKETMASTER_API_KEY, 50),
      fetchSeatGeekEvents(process.env.SEATGEEK_CLIENT_ID, process.env.SEATGEEK_CLIENT_SECRET, 50)
    ]);

    const all = [...tmEvents, ...sgEvents];

    for (const e of all) {
      if (!e.source || !e.sourceId) continue;
      await Event.findOneAndUpdate(
        { source: e.source, sourceId: e.sourceId },
        { $set: e },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`Fetched & upserted ${all.length} events`);
  } catch (err) {
    console.error('fetchAndSaveAll error', err);
  }
}

function startFetchJob() {
  fetchAndSaveAll(); // run immediately

  const hours = parseInt(process.env.FETCH_INTERVAL_HOURS || '6', 10);
  const cronExpr = `0 */${Math.max(1, hours)} * * *`;
  console.log('Scheduling fetch job with cron:', cronExpr);

  cron.schedule(cronExpr, () => {
    console.log('Running scheduled fetch job...');
    fetchAndSaveAll();
  });
}

module.exports = startFetchJob;
