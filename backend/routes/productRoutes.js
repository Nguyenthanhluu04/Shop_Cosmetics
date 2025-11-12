import express from 'express'

const router = express.Router();

import { handleGetProducts ,handleGetCategory, handleProductDetails } from '../controllers/productContronller.js';

router.get('/getproducts',handleGetProducts);

router.get('/getcategory',handleGetCategory)
router.get('/gotodetail/:id',handleProductDetails)


export default router;