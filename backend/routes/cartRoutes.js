import express from 'express'
import {verifyToken} from '../middlewares/verifyToken.js'
import {verifyRole} from '../middlewares/VerifyRole.js'

const router = express.Router();

import {handleAddToCart, handleGetCartItems, handleUpdateQuantity, handleRemoveCartItem} from '../controllers/cartContronller.js'

router.post('/addcart',verifyToken,verifyRole(["user"]),handleAddToCart)
router.get('/getcartitems',verifyToken,verifyRole(["user"]),handleGetCartItems)
router.put('/updatequantity',verifyToken,verifyRole(["user"]),handleUpdateQuantity)
router.delete('/removeitem/:productId',verifyToken,verifyRole(["user"]),handleRemoveCartItem)

export default router;