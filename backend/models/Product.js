const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'dairy', 'grains', 'herbs', 'other']
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  unit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'g', 'litre', 'piece', 'dozen', 'quintal', 'bunch']
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  harvestDate: { type: Date },
  organicFlag: { type: Boolean, default: false },
  productImage: { type: String, default: '' },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: { type: String },
  farmLocation: { type: String },
  isActive: { type: Boolean, default: true },
  totalSold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ farmerId: 1 });
productSchema.index({ productName: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
