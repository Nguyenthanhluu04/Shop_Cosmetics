import express from 'express'
import {verifyToken} from '../middlewares/verifyToken.js'
import {verifyRole} from '../middlewares/VerifyRole.js'

const router = express.Router();

import {handleAddToCart , handleGetCartItems} from '../controllers/cartContronller.js'

router.post('/addcart',verifyToken,verifyRole(["user"]),handleAddToCart)
router.get('/getcartitems',verifyToken,verifyRole(["user"]),handleGetCartItems)
export default router;