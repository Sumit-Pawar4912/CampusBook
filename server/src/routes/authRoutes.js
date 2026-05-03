const express = require('express');
const { register, login, adminLogin, getMe } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const validateRequest = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/admin/login', loginValidation, validateRequest, adminLogin);
router.get('/me', protect, getMe);

module.exports = router;
