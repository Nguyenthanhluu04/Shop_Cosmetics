import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()
const app = express()

app.use(cors())
app.use(bodyParser.json())

import authRouter from './routes/auth.js'
import todoRouter from './routes/todo.js'

app.use('/api/auth', authRouter)
app.use('/api/todo',todoRouter)



const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`)
})
