import express from "express";
import {
  forgotPasswordToken, getAllStudents, getStudentAttendance,
  loginController,
  logoutController,
  registerController,
  resetPassword,
  updatePassword,
  updateStudent, viewProfileController,

} from "../Controllers/studentControllers.js";
import {authMiddleware, isAdmin, isTeacher} from "../Middlewares/authMiddleware.js";

const router = express.Router();

//register
router.post("/register",isAdmin, registerController);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/login", loginController);
router.put("/edit", authMiddleware, updateStudent);
router.get("/profile", authMiddleware, viewProfileController);
router.get("/",isTeacher, getAllStudents);
router.put("/password", authMiddleware, updatePassword);
router.put("/reset-password/:token", resetPassword);
router.get("/logout", logoutController);
router.get("/attendance",authMiddleware ,getStudentAttendance);

export default router;
