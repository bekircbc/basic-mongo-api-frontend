import express from 'express';
import mongoose from 'mongoose';
import { Book } from './models/Book.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_CONNECTION =
	process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/bookapi';

const app = express();
app.use(cors());
const port = 3459;

app.use(express.json());

mongoose.connect(MONGODB_CONNECTION);

app.get('/', (req, res) => {
	res.send('<h1>Book API</h1>');
	// console.log(req.url);
});

//sending data to bookapi

// app.post("/book", async (req, res) => {
//   const book = new Book({
//     title: "ttt",
//     description: "ddd",
//     numberOfPages: 999,
//   });
//   await book.save();
//   console.log("book created: " + new Date());
//   res.status(200).json({
//     message: "book was created",
//   });
// });

//posting data

app.post('/book', async (req, res) => {
	const book = new Book(req.body);
	await book.save();
	res.status(200).json({ message: 'book created', book });
});

//getting books data

app.get('/book', async (req, res) => {
	const books = await Book.find().sort({ title: 1 });
	res.status(200).json({ message: 'fetched all books', books });
});

//getting a book with id

app.get('/book/:id', async (req, res) => {
	const id = req.params.id;
	const book = await Book.find({ _id: id });

	res.status(200).json({ message: 'fetched book with id ' + id, book });
});

//putting data

app.put('/book/:id', async (req, res) => {
	const id = req.params.id;
	const oldBook = await Book.find({ _id: id });
	await Book.updateOne({ _id: id }, { $set: { ...req.body } });
	const newBook = await Book.find({ _id: id });
	res.status(200).json({
		message: 'replaced book with id = ' + id,
		oldBook,
		newBook,
	});
});

//patching data from

app.patch('/book/:id', async (req, res) => {
	const id = req.params.id;
	const oldBook = await Book.find({ _id: id });
	await Book.updateOne({ _id: id }, { $set: { ...req.body } });
	const newBook = await Book.find({ _id: id });
	res.status(200).json({
		message: 'patched book with id = ' + id,
		oldBook,
		newBook,
	});
});

//deleting data from

app.delete('/book/:id', async (req, res) => {
	const id = req.params.id;
	const book = await Book.find({ _id: id });
	await Book.deleteOne({ _id: id });
	res.status(200).json({ message: 'deleted book with id = ' + id, book });
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
