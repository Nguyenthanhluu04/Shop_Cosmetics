import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()
const app = express()

app.use(cors())
app.use(bodyParser.json())

import userRouter from './routes/user/index.js'
import adminRoutes from './routes/admin/index.js' // Updated admin routes

app.use('/api', userRouter)
app.use('/api/admin', adminRoutes) // All admin routes are organized under /api/admin


const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`)
})
