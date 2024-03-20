import Attendance from "../models/attendanceModel.js";

export const uploadAttendance = async (req, res) => {
  try {
    const { attendance,year, month, day, } = req.body;

    // Iterate over each attendance entry and update or add to the attendance records
    for (const { studentId,  status } of attendance) {
      let attendanceRecord = await Attendance.findOne({ studentId });

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
    res.status(500).json({ error: error.message });
  }
};
