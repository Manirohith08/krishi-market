const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @POST /api/orders/create
router.post('/create', protect, authorize('customer'), async (req, res) => {
  try {
    const { deliveryAddress, deliverySlot, paymentMethod } = req.body;

    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    // Group items by farmer
    const farmerGroups = {};
    for (const item of cart.products) {
      const fId = item.farmerId.toString();
      if (!farmerGroups[fId]) {
        farmerGroups[fId] = { farmerId: item.farmerId, farmerName: item.farmerName, items: [] };
      }
      farmerGroups[fId].items.push(item);
    }

    const orders = [];

    for (const [farmerId, group] of Object.entries(farmerGroups)) {
      const products = group.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        pricePerUnit: item.pricePerUnit,
        unit: item.unit,
        quantity: item.quantity,
        subtotal: item.pricePerUnit * item.quantity
      }));

      const totalPrice = products.reduce((sum, p) => sum + p.subtotal, 0);

      const order = await Order.create({
        customerId: req.user._id,
        customerName: req.user.name,
        farmerId: group.farmerId,
        farmerName: group.farmerName,
        products,
        totalPrice,
        deliveryAddress,
        deliverySlot,
        paymentMethod: paymentMethod || 'COD',
        statusHistory: [{ status: 'Pending', note: 'Order placed' }]
      });

      // Update product quantities
      for (const item of group.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { availableQuantity: -item.quantity, totalSold: item.quantity }
        });
      }

      orders.push(order);
    }

    // Clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/orders/customer
router.get('/customer', protect, authorize('customer'), async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/orders/customer/:id
router.get('/customer/:id', protect, authorize('customer'), async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customerId: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/orders/farmer
router.get('/farmer', protect, authorize('farmer'), async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @PUT /api/orders/update-status
router.put('/update-status', protect, authorize('farmer'), async (req, res) => {
  try {
    const { orderId, status, note } = req.body;
    const validStatuses = ['Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const order = await Order.findOne({ _id: orderId, farmerId: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.orderStatus = status;
    order.statusHistory.push({ status, note: note || '' });

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    await order.save();
    res.json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/orders/farmer/stats
router.get('/farmer/stats', protect, authorize('farmer'), async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.user._id });
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.orderStatus === 'Pending').length,
      confirmed: orders.filter(o => o.orderStatus === 'Confirmed').length,
      delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
      revenue: orders.filter(o => o.orderStatus === 'Delivered').reduce((sum, o) => sum + o.totalPrice, 0)
    };
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
