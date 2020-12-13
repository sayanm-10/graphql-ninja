const express = require('express');
const schema = require('./schema/schema');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const SECRETS = require('./config/secrets.json');
const DB_NAME = 'graphql-test';

const app = express();

// DB connection
mongoose.connect(`mongodb+srv://${SECRETS.DB_UNAME}:${SECRETS.DB_PWD}@cluster0.j8x9m.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`);
mongoose.connection.once('open', () => {
    console.log('CONNECTED TO DB...');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Server listening on port 4000');
});
