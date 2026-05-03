const { createBook, searchBooks, getBookById, updateBook, deleteBook, incrementBookView } = require('../services/bookService');
const { logSearchQuery } = require('../services/aiService');

const addBook = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }

    const payload = {
      ...req.body,
      seller: req.user._id,
      college: req.user.college,
      branch: req.user.branch,
      files: req.files,
    };
    const book = await createBook(payload);
    res.status(201).json({ success: true, message: 'Book submitted for review', data: book });
  } catch (error) {
    next(error);
  }
};

const listBooks = async (req, res, next) => {
  try {
    const filters = {
      ...req.query,
      college: req.user.college,
    };
    const books = await searchBooks(filters);
    if (filters.search) {
      await logSearchQuery({ query: filters.search, userId: req.user._id, college: req.user.college });
    }
    res.json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book || book.college !== req.user.college) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    await incrementBookView(book, req.user._id);
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const editBook = async (req, res, next) => {
  try {
    const book = await updateBook({
      bookId: req.params.id,
      sellerId: req.user._id,
      updateData: req.body,
      files: req.files,
    });
    res.json({ success: true, message: 'Book updated successfully', data: book });
  } catch (error) {
    next(error);
  }
};

const removeBook = async (req, res, next) => {
  try {
    const book = await deleteBook({ bookId: req.params.id, sellerId: req.user._id });
    res.json({ success: true, message: 'Book deleted successfully', data: { id: book._id } });
  } catch (error) {
    next(error);
  }
};

module.exports = { addBook, listBooks, getBook, editBook, removeBook };
