const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  source: { type: String, required: true },        // 'ticketmaster' | 'eventbrite'
  sourceId: { type: String, required: true }, // unique id from source
  title: String,
  description: String,
  url: String,
  category: String,
  startDate: Date,
  endDate: Date,
  venue: {
    name: String,
    address: String,
    city: String,
    country: String,
  },
  raw: Object, // store original raw payload if needed
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

EventSchema.index({ title: "text", description: "text" });
EventSchema.index({ source: 1, sourceId: 1 }, { unique: true });

module.exports = mongoose.model('Event', EventSchema);
