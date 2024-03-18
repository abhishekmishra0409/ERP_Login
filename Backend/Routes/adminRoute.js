import express from 'express';
import { registerAdminController, loginAdminController } from '../Controllers/adminController.js';

const router = express.Router();

router.post('/register', registerAdminController);
router.post('/login', loginAdminController);

export default router;
