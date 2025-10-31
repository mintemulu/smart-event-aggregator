const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

function escapeRegex(input = '') {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 🟢 GET /api/events
// Optional query: ?q=keyword&category=Tech&city=Addis&page=1&limit=20
router.get('/', async (req, res) => {
  try {
    let { q, category, city, page = 1, limit = 20 } = req.query;

    // normalize inputs
    q = (q || '').trim();
    category = (category || '').trim();
    city = (city || '').trim();

    const filter = {};

    if (category) filter.category = new RegExp(escapeRegex(category), 'i');
    if (city) filter['venue.city'] = new RegExp(escapeRegex(city), 'i');

    // Fields to search with regex when needed
    const searchFields = ['title', 'description', 'category', 'venue.name', 'venue.city'];

    // If q present, build AND of words, each word can match any of the fields (OR)
    let results;
    if (q) {
      const words = q.split(/\s+/).filter(Boolean).map(w => new RegExp(escapeRegex(w), 'i'));
      const andClauses = words.map(rx => ({ $or: searchFields.map(f => ({ [f]: rx })) }));
      results = await Event.find({
        ...filter,
        ...(andClauses.length ? { $and: andClauses } : {}),
      })
        .sort({ startDate: 1 })
        .skip((page - 1) * parseInt(limit, 10))
        .limit(parseInt(limit, 10));
    } else {
      results = await Event.find(filter)
        .sort({ startDate: 1 })
        .skip((page - 1) * parseInt(limit, 10))
        .limit(parseInt(limit, 10));
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🟢 GET /api/events/categories
// Returns unique event categories for dropdown filters
router.get('/categories', async (req, res) => {
  try {
    const categories = await Event.distinct('category');
    res.json(categories.filter(Boolean).sort());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

module.exports = router;
