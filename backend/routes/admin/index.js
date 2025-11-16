import express from 'express'
import userRoutes from './userRoutes.js'

const router = express.Router()

// Admin user management routes
router.use('/users', userRoutes)

// Có thể thêm các routes admin khác ở đây
// router.use('/products', productRoutes)
// router.use('/orders', orderRoutes)
// router.use('/stats', statsRoutes)

export default router
