import express from 'express';
import { 
  getUserInfo, 
  updateUserInfo,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../../controllers/user/userController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// User info routes
router.get('/info', verifyToken, getUserInfo);
router.put('/info', verifyToken, updateUserInfo);

// Address routes
router.get('/addresses', verifyToken, getAddresses);
router.post('/addresses', verifyToken, addAddress);
router.put('/addresses/:id', verifyToken, updateAddress);
router.delete('/addresses/:id', verifyToken, deleteAddress);

export default router;
