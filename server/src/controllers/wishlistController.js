const { getWishlistForUser, addBookToWishlist, removeBookFromWishlist } = require('../services/wishlistService');

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getWishlistForUser(req.user._id);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

const addWishlistItem = async (req, res, next) => {
  try {
    const wishlist = await addBookToWishlist(req.user, req.params.bookId);
    res.status(201).json({ success: true, message: 'Book added to wishlist', data: wishlist });
  } catch (error) {
    next(error);
  }
};

const removeWishlistItem = async (req, res, next) => {
  try {
    const wishlist = await removeBookFromWishlist(req.user._id, req.params.bookId);
    res.json({ success: true, message: 'Book removed from wishlist', data: wishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addWishlistItem, removeWishlistItem };
