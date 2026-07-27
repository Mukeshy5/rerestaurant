const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock isInStock');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [], total: 0, itemCount: 0 });
    return ApiResponse.success(res, cart);
  } catch (error) { next(error); }
});

router.post('/add', protect, async (req, res, next) => {
  try {
    const { product, store, name, image, price, quantity, variant } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [], total: 0, itemCount: 0 });

    const existingItem = cart.items.find(item => item.product.toString() === product && JSON.stringify(item.variant) === JSON.stringify(variant));
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      cart.items.push({ product, store, name, image, price, quantity, variant, subtotal: price * quantity });
    }

    cart.store = store;
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    await cart.save();

    return ApiResponse.success(res, cart, 'Item added to cart');
  } catch (error) { next(error); }
});

router.put('/update/:productId', protect, async (req, res, next) => {
  try {
    const { quantity, variant } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return ApiResponse.error(res, 'Cart not found', 404);

    const item = cart.items.find(i => i.product.toString() === req.params.productId && JSON.stringify(i.variant) === JSON.stringify(variant));
    if (!item) return ApiResponse.error(res, 'Item not found in cart', 404);

    item.quantity = quantity;
    item.subtotal = item.price * quantity;
    cart.itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.total = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    await cart.save();

    return ApiResponse.success(res, cart, 'Cart updated');
  } catch (error) { next(error); }
});

router.delete('/remove/:productId', protect, async (req, res, next) => {
  try {
    const { variant } = req.query;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return ApiResponse.error(res, 'Cart not found', 404);

    cart.items = cart.items.filter(i => !(i.product.toString() === req.params.productId && JSON.stringify(i.variant) === JSON.stringify(variant)));
    cart.itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.total = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    if (cart.items.length === 0) cart.store = undefined;
    await cart.save();

    return ApiResponse.success(res, cart, 'Item removed from cart');
  } catch (error) { next(error); }
});

router.delete('/', protect, async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [], total: 0, itemCount: 0, store: undefined } });
    return ApiResponse.success(res, null, 'Cart cleared');
  } catch (error) { next(error); }
});

module.exports = router;