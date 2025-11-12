
import express from 'express';

const router = express.Router(); 

import { handleLogin, handleRegister, handleRefreshToken } from '../controllers/authController.js';

router.post('/register', handleRegister);
router.post('/login',handleLogin);
router.post('/refresh',handleRefreshToken)

export default router;
