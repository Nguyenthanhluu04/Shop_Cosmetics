import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories
} from '../../controllers/admin/productController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';

const router = express.Router();

// Tất cả routes đều cần xác thực - admin và staff đều được truy cập
router.use(verifyToken);
router.use(verifyRole(['admin', 'staff']));

// Routes - Phải đặt /categories trước /:id để tránh conflict
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
