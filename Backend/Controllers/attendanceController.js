import Attendance from "../models/attendanceModel.js";

export const uploadAttendance = async (req, res) => {
  try {
    const { attendance, year, month, day } = req.body;

    // Validate if attendance is provided and is an array
    if (!Array.isArray(attendance)) {
      return res.status(400).json({ error: "Attendance data is missing or invalid" });
    }

    // Iterate over each attendance entry and update or add to the attendance records
    for (const { studentId, status } of attendance) {
      let attendanceRecord = await Attendance.findOne({ studentId });

      // Check if attendanceRecord exists
      if (!attendanceRecord) {
        attendanceRecord = new Attendance({ studentId, attendance: [] });
      }

      // Find the attendance entry for the specified day
      const existingAttendanceIndex = attendanceRecord.attendance.findIndex(
          entry => entry.year === year && entry.month === month && entry.day === day
      );

      // If attendance entry for the day exists, update the status
      if (existingAttendanceIndex !== -1) {
        attendanceRecord.attendance[existingAttendanceIndex].status = status;
      } else {
        // Otherwise, add a new attendance entry for the day
        attendanceRecord.attendance.push({ year, month, day, status });
      }

      await attendanceRecord.save();
    }

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
