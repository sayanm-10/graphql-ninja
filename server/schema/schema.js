const graphql = require('graphql');
const _ = require('lodash');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID 
} = graphql;

// dummy data
const books = [
	{title: 'JS for dummies', genre: 'tech', id: '1'},
	{title: 'JS for novices', genre: 'tech', id: '2'},
	{title: 'JS for ninjas', genre: 'tech', id: '3'},
];

const BookType = new GraphQLObjectType({
	name: 'Books',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		genre: { type: GraphQLString }
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID }},
			resolve(parent, args){
				// code that gets the actual data from the DB/source
				return _.find(books, {id: args.id});
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
