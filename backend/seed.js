/**
 * Seed script - creates demo data for Krishi Market
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishi-market';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Models
  const User = require('./models/User');
  const FarmerProfile = require('./models/FarmerProfile');
  const Product = require('./models/Product');

  // Clear existing
  await Promise.all([User.deleteMany(), FarmerProfile.deleteMany(), Product.deleteMany()]);
  console.log('Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@krishi.com',
    password: 'admin123',
    role: 'admin',
    isApproved: true
  });
  console.log('Admin created: admin@krishi.com / admin123');

  // Create farmers
  const farmerData = [
    { name: 'Ramesh Kumar', email: 'ramesh@farm.com', farmName: 'Green Valley Farm', location: 'Nashik, Maharashtra', method: 'organic' },
    { name: 'Priya Patel', email: 'priya@farm.com', farmName: 'Sunshine Organics', location: 'Anand, Gujarat', method: 'organic' },
    { name: 'Suresh Singh', email: 'suresh@farm.com', farmName: 'Singh Agro Farm', location: 'Ludhiana, Punjab', method: 'conventional' },
  ];

  for (const fd of farmerData) {
    const farmer = await User.create({
      name: fd.name, email: fd.email, password: 'farmer123',
      role: 'farmer', isApproved: true
    });
    await FarmerProfile.create({
      userId: farmer._id, farmerName: fd.name, farmName: fd.farmName,
      farmLocation: fd.location, farmingMethod: fd.method,
      cropTypes: ['tomatoes', 'onions', 'wheat'],
      bio: `${fd.name} has been farming for over 10 years using sustainable practices.`,
      yearsOfExperience: 10
    });
    console.log(`Farmer created: ${fd.email} / farmer123`);

    // Create products for each farmer
    const products = [
      { name: 'Fresh Tomatoes', desc: 'Juicy, ripe tomatoes grown without pesticides', cat: 'vegetables', price: 35, unit: 'kg', qty: 100, organic: true },
      { name: 'Sweet Onions', desc: 'Farm-fresh onions with excellent flavor', cat: 'vegetables', price: 25, unit: 'kg', qty: 200, organic: false },
      { name: 'Alphonso Mangoes', desc: 'Premium Alphonso mangoes from Maharashtra', cat: 'fruits', price: 150, unit: 'kg', qty: 50, organic: true },
    ];

    for (const p of products) {
      await Product.create({
        productName: p.name, description: p.desc, category: p.cat,
        pricePerUnit: p.price, unit: p.unit, availableQuantity: p.qty,
        organicFlag: p.organic, farmerId: farmer._id,
        farmerName: fd.name, farmLocation: fd.location, isActive: true
      });
    }
  }

  // Create customer
  await User.create({
    name: 'Anita Sharma', email: 'customer@demo.com',
    password: 'customer123', role: 'customer', isApproved: true
  });
  console.log('Customer created: customer@demo.com / customer123');

  console.log('\n✅ Seed completed!');
  console.log('\nDemo credentials:');
  console.log('Admin:    admin@krishi.com / admin123');
  console.log('Farmer:   ramesh@farm.com / farmer123');
  console.log('Customer: customer@demo.com / customer123');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
