const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FarmerProfile = require('../models/FarmerProfile');
const { protect, authorize } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profiles/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `farmer-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// @GET /api/farmers/:userId — public
router.get('/:userId', async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ userId: req.params.userId })
      .populate('userId', 'name email createdAt');
    if (!profile) return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @GET /api/farmers/me/profile — farmer only
router.get('/me/profile', protect, authorize('farmer'), async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ userId: req.user._id });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @POST /api/farmers/profile — farmer only
router.post('/profile', protect, authorize('farmer'), upload.single('profilePhoto'), async (req, res) => {
  try {
    const { farmerName, farmName, farmLocation, cropTypes, farmingMethod, bio, yearsOfExperience } = req.body;

    const existing = await FarmerProfile.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Profile already exists. Use PUT to update.' });
    }

    const profile = await FarmerProfile.create({
      userId: req.user._id,
      farmerName: farmerName || req.user.name,
      farmName,
      farmLocation,
      cropTypes: cropTypes ? cropTypes.split(',').map(c => c.trim()) : [],
      farmingMethod,
      bio,
      yearsOfExperience: Number(yearsOfExperience) || 0,
      profilePhoto: req.file ? `/uploads/profiles/${req.file.filename}` : ''
    });

    res.status(201).json({ success: true, message: 'Profile created.', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @PUT /api/farmers/profile — farmer only
router.put('/profile', protect, authorize('farmer'), upload.single('profilePhoto'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    if (updates.cropTypes) updates.cropTypes = updates.cropTypes.split(',').map(c => c.trim());
    if (updates.yearsOfExperience) updates.yearsOfExperience = Number(updates.yearsOfExperience);

    const profile = await FarmerProfile.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Profile updated.', profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
