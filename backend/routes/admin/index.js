import express from 'express'
import userRoutes from './userRoutes.js'
import productRoutes from './productRoutes.js'
import orderRoutes from './orderRoutes.js'

const router = express.Router()

// Admin user management routes
router.use('/users', userRoutes)

// Admin product management routes
router.use('/products', productRoutes)

// Admin order management routes
router.use('/orders', orderRoutes)

export default router
