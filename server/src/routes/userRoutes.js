const express = require('express');
const { profile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateMiddleware');
const { updateProfileValidation } = require('../validators/userValidators');

const router = express.Router();

router.use(protect);
router.get('/profile', profile);
router.put('/profile', updateProfileValidation, validateRequest, updateProfile);

module.exports = router;
