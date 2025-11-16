import express from 'express'
import { verifyToken } from '../../middlewares/verifyToken.js'
import { verifyRole } from '../../middlewares/verifyRole.js'

import { getUsers, createStaff, updateUser, deleteUser } from '../../controllers/admin/userController.js'

const router = express.Router()

// Dashboard - cả admin và staff đều truy cập được
router.get('/', verifyToken, verifyRole(['admin', 'staff']), getUsers)

// Chỉ admin mới được tạo, sửa, xóa user
router.post('/', verifyToken, verifyRole(['admin']), createStaff)
router.put('/:id', verifyToken, verifyRole(['admin']), updateUser)
router.delete('/:id', verifyToken, verifyRole(['admin']), deleteUser)

export default router
