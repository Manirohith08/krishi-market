const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect, authorize('admin'));

// @GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    const farmers = await User.countDocuments({ role: 'farmer' });
    const customers = await User.countDocuments({ role: 'customer' });
    const pendingFarmers = await User.countDocuments({ role: 'farmer', isApproved: false });
    const revenue = await Order.aggregate([
      { $match: { orderStatus: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers: users,
        farmers,
        customers,
        pendingFarmers,
        totalProducts: products,
        totalOrders: orders,
        totalRevenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/admin/farmers/pending
router.get('/farmers/pending', async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer', isApproved: false }).sort({ createdAt: -1 });
    res.json({ success: true, farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @PUT /api/admin/farmers/approve/:id
router.put('/farmers/approve/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'Farmer not found.' });
    res.json({ success: true, message: 'Farmer approved.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
