import express from "express";

import {
  isAdmin,
  isTeacher,
} from "../Middlewares/authMiddleware.js";
import {
  createTeacherController,
  teacherloginController, teacherTestController,
} from "../Controllers/teacherControllers.js";

import { uploadAttendance } from "../Controllers/attendanceController.js";

const router = express.Router();

//register
router.post("/create",  isAdmin, createTeacherController);
router.post("/teacher-login", teacherloginController);

//test teacher Protected Route
router.get(
  "/teacher-test",
  isTeacher,
    teacherTestController
);

router.post("/upload-attendance",isTeacher, uploadAttendance);

export default router;
