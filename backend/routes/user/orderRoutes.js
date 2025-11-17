import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { 
  createOrder, 
  getMyOrders, 
  getOrderDetail, 
  cancelOrder,
  getUserAddresses,
  addAddress
} from '../../controllers/user/orderController.js';

const router = express.Router();

// Địa chỉ giao hàng
router.get('/addresses', verifyToken, getUserAddresses);
router.post('/addresses', verifyToken, addAddress);

// Đơn hàng
router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrderDetail);
router.put('/:id/cancel', verifyToken, cancelOrder);

export default router;
