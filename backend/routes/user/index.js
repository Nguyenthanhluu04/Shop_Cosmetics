import express from 'express'
import authRoutes from './authRoutes.js'
import productRoutes from './productRoutes.js'
import cartRoutes from './cartRoutes.js'
import userRoutes from './userRoutes.js'

const router = express.Router()

// User routes - organized under /api/user
router.use('/auth', authRoutes)
router.use('/product', productRoutes)
router.use('/cart', cartRoutes)
router.use('/profile', userRoutes)

export default router
