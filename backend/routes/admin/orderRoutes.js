import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { 
  getAllOrders, 
  getOrderDetail, 
  updateOrderStatus, 
  deleteOrder,
  getOrderStats
} from '../../controllers/admin/orderController.js';

const router = express.Router();

// Admin và staff đều có thể xem đơn hàng
router.get('/', verifyToken, verifyRole(['admin', 'staff']), getAllOrders);
router.get('/stats', verifyToken, verifyRole(['admin', 'staff']), getOrderStats);
router.get('/:id', verifyToken, verifyRole(['admin', 'staff']), getOrderDetail);

// Admin và staff có thể cập nhật trạng thái
router.put('/:id/status', verifyToken, verifyRole(['admin', 'staff']), updateOrderStatus);

// Chỉ admin mới có thể xóa đơn hàng
router.delete('/:id', verifyToken, verifyRole(['admin']), deleteOrder);

export default router;
