const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'vegetables',
      'fruits',
      'grains',
      'dairy',
      'poultry',
      'seeds',
      'fertilizers',
      'tools'
    ]
  },
  subCategory: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Please add unit'],
    enum: ['kg', 'g', 'litre', 'ml', 'piece', 'dozen', 'packet']
  },
  images: [{
    public_id: String,
    url: String
  }],
  farmer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    city: String,
    state: String,
    pincode: String
  },
  harvestDate: {
    type: Date
  },
  organic: {
    type: Boolean,
    default: false
  },
  certifications: [String],
  minOrder: {
    type: Number,
    default: 1
  },
  maxOrder: {
    type: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text'
});

// Index for farmer products
productSchema.index({ farmer: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);