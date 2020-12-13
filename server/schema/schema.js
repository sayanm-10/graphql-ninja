const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const BookType = new GraphQLObjectType({
	name: 'Books',
	fields: () => ({
		id: { type: GraphQLString },
		title: { type: GraphQLString },
		genre: { type: GraphQLString }
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLString }},
			resolve(parent, args){
				// code that gets the actual data from the DB/source
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
