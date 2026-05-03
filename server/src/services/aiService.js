const Book = require('../models/Book');
const Wishlist = require('../models/Wishlist');
const SearchLog = require('../models/SearchLog');
const { analyzeImageQuality } = require('../utils/imageQuality');
const { recognizeBookText, parseTitleAndAuthor } = require('../utils/ocr');

const checkImageQuality = async buffer => {
  return analyzeImageQuality(buffer);
};

const scanBookImage = async buffer => {
  const text = await recognizeBookText(buffer);
  const suggestions = parseTitleAndAuthor(text);
  return {
    extractedText: text,
    titleSuggestion: suggestions.titleSuggestion,
    authorSuggestion: suggestions.authorSuggestion,
    subjectSuggestion: suggestions.subjectSuggestion,  // ✅ new
    editionSuggestion: suggestions.editionSuggestion,  // ✅ new
  };
};

const suggestPrice = async ({ title, condition, semester, subject }) => {
  if (!title || !condition || !semester || !subject) {
    throw { statusCode: 400, message: 'Title, condition, semester, and subject are required' };
  }

  const searchQuery = {
    status: 'Approved',
    title: new RegExp(title, 'i'),
    subject: new RegExp(subject, 'i'),
    semester,
  };

  let listings = await Book.find(searchQuery).select('price condition');

  if (!listings.length) {
    listings = await Book.find({ status: 'Approved', subject: new RegExp(subject, 'i'), semester }).select('price condition');
  }

  if (!listings.length) {
    listings = await Book.find({ status: 'Approved', subject: new RegExp(subject, 'i') }).select('price condition');
  }

  const averagePrice = listings.length ? listings.reduce((sum, book) => sum + book.price, 0) / listings.length : 0;
  const multipliers = { New: 1.0, 'Like New': 0.92, Good: 0.82, Old: 0.66 };
  const conditionMultiplier = multipliers[condition] || 0.75;
  const suggestedPrice = Math.max(0, Math.round(averagePrice * conditionMultiplier));

  return {
    suggestedPrice,
    averagePrice: Number(averagePrice.toFixed(2)),
    conditionMultiplier,
    matchedListingCount: listings.length,
    condition,
  };
};

const getTrendingBooks = async () => {
  const approvedBooks = await Book.find({ status: 'Approved' })
    .populate('seller', 'name email college')
    .lean();

  const wishlistCounts = await Wishlist.aggregate([
    { $unwind: '$books' },
    { $group: { _id: '$books', count: { $sum: 1 } } },
  ]);

  const wishlistMap = new Map(wishlistCounts.map(entry => [entry._id.toString(), entry.count]));
  const searchLogs = await SearchLog.find().lean();
  const now = Date.now();

  const results = approvedBooks.map(book => {
    const wishlistCount = wishlistMap.get(book._id.toString()) || 0;
    const searchCount = searchLogs.reduce((count, log) => {
      const query = log.query.toLowerCase();
      const titleMatch = book.title?.toLowerCase().includes(query);
      const authorMatch = book.author?.toLowerCase().includes(query);
      const subjectMatch = book.subject?.toLowerCase().includes(query);
      return count + (titleMatch || authorMatch || subjectMatch ? 1 : 0);
    }, 0);

    const ageDays = Math.max(1, (now - new Date(book.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const recencyScore = 1 / ageDays;
    const trendingScore = book.views * 0.45 + wishlistCount * 4 + searchCount * 3 + recencyScore * 100;

    return {
      ...book,
      wishlistCount,
      searchCount,
      recencyScore: Number(recencyScore.toFixed(4)),
      trendingScore: Number(trendingScore.toFixed(2)),
    };
  });

  return results.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 12);
};

const logSearchQuery = async ({ query, userId, college }) => {
  if (!query || !userId || !college) {
    return;
  }

  await SearchLog.create({ query: query.trim(), user: userId, college });
};

module.exports = {
  checkImageQuality,
  scanBookImage,
  suggestPrice,
  getTrendingBooks,
  logSearchQuery,
};
