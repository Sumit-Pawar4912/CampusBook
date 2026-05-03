const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

const getWishlistForUser = async userId => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: 'books',
    populate: { path: 'seller', select: 'name college isVerified' },
  });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, books: [] });
  }
  return wishlist;
};

const addBookToWishlist = async (user, bookId) => {
  const book = await Book.findById(bookId).populate('seller');
  if (!book) {
    throw { statusCode: 404, message: 'Book not found' };
  }
  if (book.college !== user.college) {
    throw { statusCode: 403, message: 'You can only wishlist books from your own college' };
  }
  if (book.seller.toString() === user._id.toString()) {
    throw { statusCode: 403, message: 'You cannot add your own book to the wishlist' };
  }

  const wishlist = await getWishlistForUser(user._id);
  if (!wishlist.books.some(id => id.toString() === bookId.toString())) {
    wishlist.books.push(bookId);
    await wishlist.save();
  }
  return wishlist;
};

const removeBookFromWishlist = async (userId, bookId) => {
  const wishlist = await getWishlistForUser(userId);
  wishlist.books = wishlist.books.filter(id => id.toString() !== bookId.toString());
  await wishlist.save();
  return wishlist;
};

module.exports = { getWishlistForUser, addBookToWishlist, removeBookFromWishlist };
