const express = require('express');
const schema = require('./schema/schema');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const app = express();

// DB connection
mongoose.connect('mongodb+srv://graphql-admin:ninja@cluster0.j8x9m.mongodb.net/graphql-test?retryWrites=true&w=majority');
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
