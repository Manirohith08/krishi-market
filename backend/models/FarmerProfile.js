const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  farmerName: { type: String, required: true, trim: true },
  farmName: { type: String, required: true, trim: true },
  farmLocation: { type: String, required: true },
  cropTypes: [{ type: String }],
  farmingMethod: {
    type: String,
    enum: ['organic', 'conventional', 'mixed'],
    default: 'conventional'
  },
  profilePhoto: { type: String, default: '' },
  bio: { type: String, maxlength: 500 },
  yearsOfExperience: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

farmerProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
