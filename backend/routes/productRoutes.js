import express from 'express'

const router = express.Router();

import { handleGetProducts ,handleGetCategory, handleProductDetails, handleSearchProducts } from '../controllers/productContronller.js';

router.get('/getproducts',handleGetProducts);

router.get('/getcategory',handleGetCategory)
router.get('/gotodetail/:id',handleProductDetails)
router.get('/search',handleSearchProducts)


export default router;