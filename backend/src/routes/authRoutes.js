const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, refreshToken, logout, updatePassword, sendOtp, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);
router.put('/password', protect, updatePassword);

module.exports = router;