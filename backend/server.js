import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()
const app = express()

app.use(cors())
app.use(bodyParser.json())

import authRouter from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from  './routes/cartRoutes.js'

app.use('/api/auth', authRouter)
app.use('/api/product',productRoutes)
app.use('/api/cart',cartRoutes)


const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`)
})
