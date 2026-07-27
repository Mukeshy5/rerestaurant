const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const ApiResponse = require('../utils/apiResponse');

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return ApiResponse.error(res, 'User already exists with this email or phone', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone, password: hashedPassword, role });
    user.referralCode = user.generateReferralCode();
    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

    return ApiResponse.created(res, {
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
      token, refreshToken
    }, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, phone, password, loginType } = req.body;
    if (!email && !phone) {
      return ApiResponse.error(res, 'Email or phone is required', 400);
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] }).select('+password');
    if (!user) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, 'Account is deactivated', 401);
    }

    // Validate login type matches user role
    if (loginType === 'admin' && user.role !== 'admin') {
      return ApiResponse.error(res, 'Unauthorized: Admin access only', 403);
    }
    if (loginType === 'store' && user.role !== 'store_owner') {
      return ApiResponse.error(res, 'Unauthorized: Store owner access only', 403);
    }
    if (loginType === 'user' && !['customer', 'delivery_partner'].includes(user.role)) {
      return ApiResponse.error(res, 'Unauthorized: User access only', 403);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

    return ApiResponse.success(res, {
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
      token, refreshToken
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist')
      .populate('favoriteStores')
      .populate('recentlyViewed.product');
    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id,
      { $set: { name, phone, avatar } },
      { new: true, runValidators: true }
    );
    return ApiResponse.success(res, user, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return ApiResponse.error(res, 'Refresh token required', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    return ApiResponse.success(res, { token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    return ApiResponse.error(res, 'Invalid refresh token', 401);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    return ApiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.error(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    return ApiResponse.success(res, null, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.sendOtp = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // In production, send OTP via email/SMS
    console.log(`OTP for ${email || phone}: ${otp}`);

    return ApiResponse.success(res, { otp }, 'OTP sent successfully'); // Remove otp from response in production
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, phone, otp } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return ApiResponse.error(res, 'Invalid or expired OTP', 400);
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return ApiResponse.success(res, null, 'OTP verified successfully');
  } catch (error) {
    next(error);
  }
};