const graphql = require('graphql');
const _ = require('lodash');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList
} = graphql;

// dummy data
const books = [
	{title: 'JS for dummies', genre: 'tech', id: '1', authorId: '3'},
	{title: 'TS for dummies', genre: 'tech', id: '1', authorId: '3'},
	{title: 'Node.js for dummies', genre: 'tech', id: '1', authorId: '3'},
	{title: 'JS for novices', genre: 'tech', id: '2', authorId: '1'},
	{title: 'JS for ninjas', genre: 'tech', id: '3', authorId: '2'},
	{title: 'Redux for rockstars', genre: 'tech', id: '3', authorId: '2'},
];

const authors = [
	{id: '1', name: 'Jim', age: 43},
	{id: '2', name: 'Tim', age: 29},
	{id: '3', name: 'Bill', age: 58}
];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return _.find(authors, {id: parent.authorId});
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return _.filter(books, book => parent.id === book.authorId);
				// return _.filter(books, {authorId: parent.id});
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: { // this will become one of the queries
			type: BookType,
			args: { id: { type: GraphQLID }},
			resolve(parent, args){
				// code that gets the actual data from the DB/source
				return _.find(books, {id: args.id});
			}
		},
		author: { // another query
			type: AuthorType,
			args: { id : { type: GraphQLID}},
			resolve(parent, args) {
				return _.find(authors, {id: args.id});
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return books;
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return authors;
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
