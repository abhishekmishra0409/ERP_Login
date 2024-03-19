import attendanceModel from "../models/attendanceModel.js";

export const uploadAttendance = async (req, res) => {
  try {
    const { studentId, year, month, day, status } = req.body;

    let attendanceRecord = await attendanceModel.findOne({ studentId });

    // If no create a new one
    if (!attendanceRecord) {
      attendanceRecord = new attendanceModel({
        studentId,
        attendance: [{ year, month, day, status }],
      });
    } else {
      const existingAttendanceIndex = attendanceRecord.attendance.findIndex(
          (entry) =>
              entry.year.toString() === year &&
              entry.month.toString() === month &&
              entry.day.toString() === day
      );

      if (existingAttendanceIndex !== -1) {
        // If attendance already exists for the same day, month, and year
        const existingStatus =
            attendanceRecord.attendance[existingAttendanceIndex].status;

        //  if new status is different from the existing status
        if (existingStatus !== status) {
          // Update the status
          attendanceRecord.attendance[existingAttendanceIndex].status = status;
        } else {
          // If the new status is the same as the existing status, do nothing
          return res.status(200).json({
            message: "Attendance already exists with the same status",
            existingStatus,
          });
        }
      } else {
        // if attendance doesn't exist
        attendanceRecord.attendance.push({ year, month, day, status });
      }
    }

    // Save
    await attendanceRecord.save();

    res
        .status(200)
        .json({ message: "Attendance updated successfully", attendanceRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
