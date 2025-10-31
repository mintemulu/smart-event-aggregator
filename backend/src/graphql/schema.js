const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt } = require('graphql');
const Event = require('../models/Event');

const VenueType = new GraphQLObjectType({
  name: 'Venue',
  fields: () => ({
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    country: { type: GraphQLString },
  })
});

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id: { type: GraphQLString },
    source: { type: GraphQLString },
    sourceId: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    url: { type: GraphQLString },
    category: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    venue: { type: VenueType }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    events: {
      type: new GraphQLList(EventType),
      args: {
        q: { type: GraphQLString },
        category: { type: GraphQLString },
        city: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const filter = {};
        if (args.category) filter.category = new RegExp(args.category, 'i');
        if (args.city) filter['venue.city'] = new RegExp(args.city, 'i');

        // Regex-based multi-field search to include category/venue/title/description
        const fields = ['title', 'description', 'category', 'venue.name', 'venue.city'];
        let query;
        if (args.q) {
          const words = String(args.q).trim().split(/\s+/).filter(Boolean).map(w => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
          const andClauses = words.map(rx => ({ $or: fields.map(f => ({ [f]: rx })) }));
          query = Event.find({ ...filter, ...(andClauses.length ? { $and: andClauses } : {}) }).sort({ startDate: 1 });
        } else {
          query = Event.find(filter).sort({ startDate: 1 });
        }
        if (args.offset) query.skip(args.offset);
        return query.limit(args.limit || 20);
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });
