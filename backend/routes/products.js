const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const FarmerProfile = require('../models/FarmerProfile');
const { protect, authorize, farmerApproved } = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/products/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|webp/;
    if (types.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// Ensure upload dir exists
const fs = require('fs');
if (!fs.existsSync('uploads/products')) {
  fs.mkdirSync('uploads/products', { recursive: true });
}

// @GET /api/products — public
router.get('/', async (req, res) => {
  try {
    const { category, search, organic, page = 1, limit = 12, farmer } = req.query;
    const query = { isActive: true, availableQuantity: { $gt: 0 } };

    if (category && category !== 'all') query.category = category;
    if (organic === 'true') query.organicFlag = true;
    if (farmer) query.farmerId = farmer;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('farmerId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmerId', 'name email');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    let farmerProfile = null;
    try {
      farmerProfile = await FarmerProfile.findOne({ userId: product.farmerId._id });
    } catch(e) {}

    res.json({ success: true, product, farmerProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @POST /api/products — farmer only
router.post('/', protect, authorize('farmer'), farmerApproved, upload.single('productImage'), async (req, res) => {
  try {
    const { productName, description, category, pricePerUnit, unit, availableQuantity, harvestDate, organicFlag } = req.body;

    const farmerProfile = await FarmerProfile.findOne({ userId: req.user._id });

    const product = await Product.create({
      productName,
      description,
      category,
      pricePerUnit: Number(pricePerUnit),
      unit: unit || 'kg',
      availableQuantity: Number(availableQuantity),
      harvestDate: harvestDate || null,
      organicFlag: organicFlag === 'true',
      productImage: req.file ? `/uploads/products/${req.file.filename}` : '',
      farmerId: req.user._id,
      farmerName: req.user.name,
      farmLocation: farmerProfile?.farmLocation || ''
    });

    res.status(201).json({ success: true, message: 'Product added successfully.', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @PUT /api/products/:id — farmer only
router.put('/:id', protect, authorize('farmer'), upload.single('productImage'), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmerId: req.user._id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const updates = { ...req.body };
    if (req.file) updates.productImage = `/uploads/products/${req.file.filename}`;
    if (updates.pricePerUnit) updates.pricePerUnit = Number(updates.pricePerUnit);
    if (updates.availableQuantity !== undefined) updates.availableQuantity = Number(updates.availableQuantity);
    if (updates.organicFlag !== undefined) updates.organicFlag = updates.organicFlag === 'true';

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: 'Product updated.', product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @DELETE /api/products/:id — farmer only
router.delete('/:id', protect, authorize('farmer'), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/products/farmer/my-products — farmer only
router.get('/farmer/my-products', protect, authorize('farmer'), async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
