require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDB = require('../src/config/db');
const Event = require('../src/models/Event');
const { fetchTicketmasterEvents } = require('../src/services/fetchTicketmaster');
const { fetchEventbriteEvents } = require('../src/services/fetchEventbrite');

(async () => {
  try {
    await connectDB();
    const [tm, eb] = await Promise.all([
      fetchTicketmasterEvents(process.env.TICKETMASTER_API_KEY, 50),
      fetchEventbriteEvents(50)
    ]);
    const all = [...tm, ...eb];
    let upserts = 0;
    for (const e of all) {
      if (!e?.source || !e?.sourceId) continue;
      await Event.findOneAndUpdate(
        { source: e.source, sourceId: e.sourceId },
        { $set: e },
        { upsert: true, setDefaultsOnInsert: true }
      );
      upserts++;
    }
    console.log(`Fetched ${all.length} events, upserted ${upserts}`);
  } catch (err) {
    console.error('runFetchOnce error:', err?.response?.data || err.message);
  } finally {
    process.exit(0);
  }
})();
