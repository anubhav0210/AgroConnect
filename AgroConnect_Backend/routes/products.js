const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getFarmerProducts,
  searchProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getProducts);

router.route('/search')
  .get(searchProducts);

router.route('/farmer/:farmerId')
  .get(getFarmerProducts);

router.route('/:id')
  .get(getProduct);

// Protected routes
router.use(protect);

// Farmer only routes
router.route('/')
  .post(authorize('farmer'), createProduct);

router.route('/my-products')
  .get(authorize('farmer'), getMyProducts);

router.route('/:id')
  .put(authorize('farmer'), updateProduct)
  .delete(authorize('farmer'), deleteProduct);

module.exports = router;