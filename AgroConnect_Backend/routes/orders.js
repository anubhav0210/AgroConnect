const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUserOrders)
  .post(createOrder);

router.route('/admin/all')
  .get(authorize('admin'), getAllOrders);

router.route('/:id')
  .get(getOrder);

router.route('/:id/status')
  .put(authorize('admin', 'farmer'), updateOrderStatus);

module.exports = router;