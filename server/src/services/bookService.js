const Book = require('../models/Book');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

const viewCache = new Map();
const VIEW_TTL_MS = 1000 * 60 * 5;

const createBook = async ({ seller, title, author, subject, semester, branch, college, condition, type, price, files }) => {
  const uploadedImages = [];
  for (const file of files) {
    const result = await uploadImage(file);
    uploadedImages.push(result);
  }

  const book = await Book.create({
    seller,
    title,
    author,
    subject,
    semester,
    branch,
    college,
    condition,
    type,
    price,
    images: uploadedImages,
    status: 'Approved', // ✅ auto-approve on create
  });

  return book;
};

const getBookById = async id => {
  return Book.findById(id).populate('seller', 'name email college branch semester isVerified');
};

const searchBooks = async ({ college, branch, semester, condition, type, minPrice, maxPrice, search, sort, page = 1, limit = 20 }) => {
  
  const query = {}; // ✅ removed hardcoded status & college requirement

  if (college) query.college = college;         // ✅ only filter if provided
  if (branch) query.branch = branch;
  if (semester) query.semester = Number(semester);
  if (condition) query.condition = condition;
  if (type) query.type = type;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }
  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { author: new RegExp(search, 'i') },
      { subject: new RegExp(search, 'i') },
    ];
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    mostViewed: { views: -1 },
  };
  const sortOrder = sortOptions[sort] || { createdAt: -1 };

  const books = await Book.find(query)
    .populate('seller', 'name email isVerified')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sortOrder);

  return books;
};

const shouldCountView = (bookId, userId) => {
  const key = `${userId}:${bookId}`;
  const lastSeen = viewCache.get(key);
  const now = Date.now();
  if (lastSeen && now - lastSeen < VIEW_TTL_MS) {
    return false;
  }
  viewCache.set(key, now);
  return true;
};

const incrementBookView = async (book, userId) => {
  if (!userId) {
    book.views += 1;
    await book.save();
    return book;
  }

  if (!shouldCountView(book._id, userId)) {
    return book;
  }

  book.views += 1;
  await book.save();
  return book;
};

const updateBook = async ({ bookId, sellerId, updateData, files }) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw { statusCode: 404, message: 'Book not found' };
  }
  if (book.seller.toString() !== sellerId.toString()) {
    throw { statusCode: 403, message: 'You can only update your own books' };
  }

  const allowedFields = ['title', 'author', 'subject', 'semester', 'branch', 'condition', 'type', 'price'];
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      book[field] = updateData[field];
    }
  });

  if (files && files.length > 0) {
    for (const image of book.images) {
      await deleteImage(image.publicId);
    }
    const newImages = [];
    for (const file of files) {
      const result = await uploadImage(file);
      newImages.push(result);
    }
    book.images = newImages;
  }

  await book.save();
  return book;
};

const deleteBook = async ({ bookId, sellerId }) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw { statusCode: 404, message: 'Book not found' };
  }
  if (book.seller.toString() !== sellerId.toString()) {
    throw { statusCode: 403, message: 'You can only delete your own books' };
  }

  for (const image of book.images) {
    await deleteImage(image.publicId);
  }

  await book.deleteOne();
  return book;
};

module.exports = { createBook, getBookById, searchBooks, updateBook, deleteBook, incrementBookView };