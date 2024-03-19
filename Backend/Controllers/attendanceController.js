import AttendanceModel from "../models/attendanceModel.js";

export const uploadAttendance = async (req, res) => {
  try {
    // Extract data from request body
    const { batch, year, month, day, attendance } = req.body;

    // Validate input data
    if (!batch || !year || !month || !day || !attendance || !Array.isArray(attendance)) {
      return res.status(400).json({ success: false, message: "Invalid attendance data" });
    }

    // Check if attendance data is empty
    if (attendance.length === 0) {
      return res.status(400).json({ success: false, message: "Attendance data is empty" });
    }

    // Convert year, month, and day to a date string
    const date = new Date(year, month-1, day+1).toISOString();

    // Update attendance records for each student
    const attendanceRecords = await Promise.all(attendance.map(async (record) => {
      const { studentId, status } = record;

      // Find or create attendance record for the student on the specified date
      let attendanceRecord = await AttendanceModel.findOneAndUpdate(
          { studentId, date },
          { studentId, date, status },
          { upsert: true, new: true }
      );

      return attendanceRecord;
    }));

    res.status(200).json({ success: true, message: "Attendance uploaded successfully", attendance: attendanceRecords });
  } catch (error) {
    console.error("Error uploading attendance:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
