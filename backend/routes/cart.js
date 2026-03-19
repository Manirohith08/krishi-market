const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/cart
router.get('/', protect, authorize('customer'), async (req, res) => {
  try {
    let cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ customerId: req.user._id, products: [] });
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @POST /api/cart/add
router.post('/add', protect, authorize('customer'), async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    if (product.availableQuantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock.' });
    }

    let cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      cart = new Cart({ customerId: req.user._id, products: [] });
    }

    const existingIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingIndex >= 0) {
      cart.products[existingIndex].quantity += quantity;
    } else {
      cart.products.push({
        productId: product._id,
        productName: product.productName,
        productImage: product.productImage,
        pricePerUnit: product.pricePerUnit,
        unit: product.unit,
        quantity,
        farmerId: product.farmerId,
        farmerName: product.farmerName
      });
    }

    await cart.save();
    res.json({ success: true, message: 'Added to cart.', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @PUT /api/cart/update
router.put('/update', protect, authorize('customer'), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const itemIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    if (quantity <= 0) {
      cart.products.splice(itemIndex, 1);
    } else {
      cart.products[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, message: 'Cart updated.', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @DELETE /api/cart/remove
router.delete('/remove', protect, authorize('customer'), async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    cart.products = cart.products.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ success: true, message: 'Item removed.', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @DELETE /api/cart/clear
router.delete('/clear', protect, authorize('customer'), async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user._id });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
