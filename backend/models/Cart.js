const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmerName: { type: String }
});

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

cartSchema.methods.calculateTotal = function() {
  this.totalPrice = this.products.reduce((sum, item) => {
    return sum + (item.pricePerUnit * item.quantity);
  }, 0);
  return this.totalPrice;
};

cartSchema.pre('save', function(next) {
  this.calculateTotal();
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
