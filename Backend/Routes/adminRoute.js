import express from 'express';
import {
    registerAdminController,
    loginAdminController,
    logoutAdminController,
    viewProfileController
} from '../Controllers/adminController.js';
import {isAdmin} from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', registerAdminController);
router.post('/login', loginAdminController);
router.get('/logout',isAdmin, logoutAdminController);
router.get('/profile',isAdmin, viewProfileController);

export default router;
