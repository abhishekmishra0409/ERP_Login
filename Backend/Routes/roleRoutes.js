import express from "express";

import {
  isAdmin,
  isTeacher,
} from "../Middlewares/authMiddleware.js";
import {
  createTeacherController,
  teacherloginController, teacherTestController, uploadTimeTable, deleteTimetable
} from "../Controllers/roleControllers.js";

import { uploadAttendance } from "../Controllers/attendanceController.js";
import {sendMessage} from "../Controllers/messageController.js";

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

// timetable routes
router.post("/upload-timetable",isTeacher, uploadTimeTable);
router.delete("/delete-timetable",isTeacher, deleteTimetable);
router.post("/send-message",isTeacher,sendMessage)

export default router;
