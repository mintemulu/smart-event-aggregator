require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const eventsRouter = require('./src/routes/events');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql/schema');
const startFetchJob = require('./src/jobs/fetchJob');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();
 
app.use('/api/events', eventsRouter);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);   
    startFetchJob();
});