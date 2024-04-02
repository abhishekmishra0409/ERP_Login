import express from "express";

import {
  isAdmin,
  isTeacher,
} from "../Middlewares/authMiddleware.js";
import {
  createTeacherController,
  teacherloginController, teacherTestController, uploadTimeTable, deleteTimetable, logoutRoleController
} from "../Controllers/roleControllers.js";

import { uploadAttendance } from "../Controllers/attendanceController.js";
import {sendMessage} from "../Controllers/messageController.js";
import {deleteMarks, updateMarks, uploadMarks} from "../Controllers/marksController.js";

const router = express.Router();

//register
router.post("/create",  isAdmin, createTeacherController);
router.post("/login", teacherloginController);

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
router.get("/logout",isTeacher,logoutRoleController)

router.post("/upload-marks", uploadMarks);
// router.get("/view-marks", viewMarks)
router.post("/update-marks", updateMarks);
router.delete("/delete-marks/:studentId", deleteMarks);
export default router;
