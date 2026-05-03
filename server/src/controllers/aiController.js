const {
  checkImageQuality,
  scanBookImage,
  suggestPrice,
  getTrendingBooks,
} = require('../services/aiService');

const imageQualityCheck = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }
    const result = await checkImageQuality(req.file.buffer);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const ocrScan = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required for OCR' });
    }
    const result = await scanBookImage(req.file.buffer);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const priceSuggestion = async (req, res, next) => {
  try {
    const { title, condition, semester, subject } = req.body;
    const result = await suggestPrice({ title, condition, semester, subject });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const trending = async (req, res, next) => {
  try {
    const books = await getTrendingBooks();
    res.json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

module.exports = { imageQualityCheck, ocrScan, priceSuggestion, trending };
