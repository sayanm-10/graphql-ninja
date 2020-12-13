const express = require('express');
const schema = require('./schema/schema');
const { graphqlHTTP } = require('express-graphql');

const app = express();

app.use('/graphql', graphqlHTTP({

}));

app.listen(4000, () => {
    console.log('Server listening on port 4000');
});