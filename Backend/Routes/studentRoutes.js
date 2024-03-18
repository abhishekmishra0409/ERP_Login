import express from "express";
import {
  forgotPasswordToken,
  loginController,
  logoutController,
  registerController,
  resetPassword,
  updatePassword,
  updateStudent,

} from "../Controllers/studentControllers.js";
import {authMiddleware, isAdmin} from "../Middlewares/authMiddleware.js";
import { viewAttendance } from "../Controllers/attendanceController.js";

const router = express.Router();

//register
router.post("/register",isAdmin, registerController);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/login", loginController);
router.put("/edit", authMiddleware, updateStudent);
router.put("/password", authMiddleware, updatePassword);
router.put("/reset-password/:token", resetPassword);
router.get("/logout", logoutController);

router.get("/view/:studentId", viewAttendance);

export default router;
