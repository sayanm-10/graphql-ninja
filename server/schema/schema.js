const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList
} = graphql;

// // dummy data
// const books = [
// 	{title: 'JS for dummies', genre: 'tech', id: '1', authorId: '3'},
// 	{title: 'TS for dummies', genre: 'tech', id: '1', authorId: '3'},
// 	{title: 'Node.js for dummies', genre: 'tech', id: '1', authorId: '3'},
// 	{title: 'JS for novices', genre: 'tech', id: '2', authorId: '1'},
// 	{title: 'JS for ninjas', genre: 'tech', id: '3', authorId: '2'},
// 	{title: 'Redux for rockstars', genre: 'tech', id: '3', authorId: '2'},
// ];

// const authors = [
// 	{id: '1', name: 'Jim', age: 43},
// 	{id: '2', name: 'Tim', age: 29},
// 	{id: '3', name: 'Bill', age: 58}
// ];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				// return _.find(authors, {id: parent.authorId});
				return Author.findById(parent.authorId);
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
				// return _.filter(books, book => parent.id === book.authorId);
				return Book.find({authorId: parent.id});
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
				// return _.find(books, {id: args.id});
				return Book.findById(args.id);
			}
		},
		author: { // another query
			type: AuthorType,
			args: { id : { type: GraphQLID}},
			resolve(parent, args) {
				// return _.find(authors, {id: args.id});
				return Author.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return books;
				return Book.find({}); // empty predicate, returns everything
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				// return authors;
				return Author.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: {type: GraphQLString},
				age: {type: GraphQLInt}
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					age: args.age
				});

				return author.save();
			}
		},
		addBook: {
			type: BookType,
			args: {
				title: {type: GraphQLString},
				genre: {type: GraphQLString},
				authorId: {type: GraphQLID}
			},
			resolve(parent, args) {
				let book = new Book({
					title: args.title,
					genre: args.genre,
					authorId: args.authorId
				});

				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
