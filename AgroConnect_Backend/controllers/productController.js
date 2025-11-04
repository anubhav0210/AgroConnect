const Product = require('../models/Product');
const { asyncHandler } = require('../utils/helpers');

// @desc    Get all products (with filters)
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // Build query
  let query = { isActive: true, isAvailable: true };

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by farmer
  if (req.query.farmer) {
    query.farmer = req.query.farmer;
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Filter by organic
  if (req.query.organic) {
    query.organic = req.query.organic === 'true';
  }

  // Search by name or description
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { category: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  // Get products with farmer details
  const products = await Product.find(query)
    .populate('farmer', 'name email phone address')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('farmer', 'name email phone address');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product (Farmer only)
// @route   POST /api/products
// @access  Private (Farmer)
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add user to req.body as farmer
  req.body.farmer = req.user.id;

  // Add location from farmer's address if not provided
  if (!req.body.location && req.user.address) {
    req.body.location = {
      city: req.user.address.city,
      state: req.user.address.state,
      pincode: req.user.address.pincode
    };
  }

  const product = await Product.create(req.body);

  await product.populate('farmer', 'name email phone');

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer - Owner only)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Make sure user is product owner
  if (product.farmer.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this product'
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('farmer', 'name email phone');

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product (Soft delete)
// @route   DELETE /api/products/:id
// @access  Private (Farmer - Owner only)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Make sure user is product owner
  if (product.farmer.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this product'
    });
  }

  // Soft delete by setting isActive to false
  product.isActive = false;
  product.isAvailable = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: {}
  });
});

// @desc    Get products by current farmer
// @route   GET /api/products/my-products
// @access  Private (Farmer)
exports.getMyProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ 
    farmer: req.user.id,
    isActive: true 
  })
    .populate('farmer', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by specific farmer
// @route   GET /api/products/farmer/:farmerId
// @access  Public
exports.getFarmerProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ 
    farmer: req.params.farmerId,
    isActive: true,
    isAvailable: true 
  })
    .populate('farmer', 'name email phone address')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { q, category, minPrice, maxPrice, organic, farmer } = req.query;
  
  let query = { isActive: true, isAvailable: true };

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ];
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  if (organic) {
    query.organic = organic === 'true';
  }

  if (farmer) {
    query.farmer = farmer;
  }

  const products = await Product.find(query)
    .populate('farmer', 'name email phone address')
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});