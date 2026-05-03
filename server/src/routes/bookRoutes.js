const express = require('express');
const { addBook, listBooks, getBook, editBook, removeBook } = require('../controllers/bookController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateMiddleware');
const { createBookValidation, updateBookValidation, bookQueryValidation, bookIdValidation } = require('../validators/bookValidators');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', uploadMiddleware.array('images', 6), createBookValidation, validateRequest, addBook);
router.get('/', bookQueryValidation, validateRequest, listBooks);
router.get('/:id', bookIdValidation, validateRequest, getBook);
router.put('/:id', uploadMiddleware.array('images', 6), updateBookValidation, validateRequest, editBook);
router.delete('/:id', bookIdValidation, validateRequest, removeBook);

module.exports = router;
