import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js';
const router = express.Router();

import { getTodos , createTodo , deleteTodo , updateTodo , sortTodo} from '../controllers/todoController.js';

router.get('/gettodos',verifyToken,getTodos);
router.post('/createtodo',verifyToken,createTodo)
router.delete('/deletetodo',verifyToken,deleteTodo)
router.put('/updatetodo',verifyToken,updateTodo)
router.get('/sorttodo',verifyToken,sortTodo)

export default router;