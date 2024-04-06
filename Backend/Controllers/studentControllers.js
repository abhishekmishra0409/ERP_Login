import {
  comparePassword,
  hashPassword,
  createPasswordResetToken,
} from "../Helper/hashFunction.js";
import studentModel from "../Models/studentModel.js";
import generateRefreshToken from "../Helper/JwtToken.js";
import sendEmail from "../Helper/EmailSend.js";
import AttendanceModel from "../models/attendanceModel.js";

export const registerController = async (req, res) => {
  try {
    const { email, batch,enrollment,department } = req.body;
    // Validations
    if (!email || !enrollment || !batch ||!department) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if student already exists
    const existingStudent = await studentModel.findOne({ $or: [{ email: email }, { enrollment: enrollment }] });

    if (existingStudent) {
      return res.status(409).json({success: false, message: "Student already exists" });
    }

    // Register student
    const student = await studentModel.create({
      email,
      enrollment ,
      batch,
      department
    });
    const password = student.password;

    const hashedPassword = await hashPassword(password);

    await studentModel.findByIdAndUpdate(
        student._id,
        { password: hashedPassword },
        { new: true }
    );

    // Respond with success message
    res.status(200).send({
      success: true,
      message: "Student registered successfully.",
      user: {
        email: student.email,
        batch: student.batch,
        enrollment:student.enrollment,
        password: hashedPassword,
        department:student.department
      },
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).send({ success: false, message: "Error in registration" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res
          .status(400)
          .send({ success: false, message: "Invalid email or password" });
    }

    // Check if the student exists
    const student = await studentModel.findOne({ email });
    if (!student) {
      return res
          .status(404)
          .send({ success: false, message: "Email does not exist" });
    }

    // Verify the password
    const match = await comparePassword(password, student.password);
    if (!match) {
      return res
          .status(401)
          .send({ success: false, message: "Password does not match" });
    }

    // Generate refresh token
    const refreshToken = await generateRefreshToken(student._id , "0822IT21");

    // Update refresh token in the database
    await studentModel.findByIdAndUpdate(
        student._id,
        { refreshToken: refreshToken },
        { new: true }
    );


    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    // Respond with student details and refresh token
    res.json({
      _id: student?._id,
      success: true,
      message: "Login successful",
      refreshToken: refreshToken,
      user: {
        name: student?.name,
        email: student?.email,
        batch: student?.batch,
        enrollment: student?.enrollment
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send({ success: false, message: "Error in login" });
  }
};

export const viewProfileController = async (req, res) => {
  try {
    const studentId = req.student._id;

    // Find the student by ID
    const student = await studentModel.findById(studentId);

    // If student not found, return 404 error
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Respond with student details
    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error viewing student profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Handle refresh token
export const logoutController = async (req, res) => {
  const cookie = req.cookies;

  // Check if refresh token is present in cookies
  if (!cookie?.refreshToken) {
    return res
        .status(400)
        .send({ success: false, message: "No Refresh Token in Cookies" });
  }

  const refreshToken = cookie.refreshToken;

  try {
    // Find the student by refreshToken
    const student = await studentModel.findOne({ refreshToken });

    // If user doesn't exist, clear the cookie and send 204 status
    if (!student) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.status(204).json({ success: true, message: "Logout Successfully" });
    }

    // Update user document to remove the refresh token
    await studentModel.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    // Clear the refresh token cookie and send 204 status
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(204).json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateStudent = async (req, res) => {
  const { _id } = req.student;
  const { address, city, gender, name, phone, dob, sem  } = req.body;
  try {
    const updatedStudent = await studentModel.findByIdAndUpdate(
        _id,
        { name :name,
          address: address,
          city:city,
          gender:gender,
          phone:phone,
          dob:dob,
          sem:sem
        },
        { new: true }
    );
    res.json({ message: "Update done ", data: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {

    const { _id } = req.student;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const hashedPassword = await hashPassword(password);


    const updatedStudent = await studentModel.findByIdAndUpdate(
        _id,
        { password: hashedPassword },
        { new: true }
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Forgot Password Token Controller
export const forgotPasswordToken = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the student by email
    const student = await studentModel.findOne({ email });

    // If student not found, return error
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found with this email" });
    }

    // Generate password reset token with expiration time
    const { token, expiresAt } = await createPasswordResetToken();

    // Set password reset token and expiry time for the student
    student.passwordResetToken = token;
    student.passwordResetExpires = expiresAt;
    await student.save();

    // Construct reset URL with token
    const resetURL = `http://localhost:8080/api/student/reset-password/${token}`;

    // Compose email content
    const emailContent = `
      <p>Hey Student,</p>
      <p>Please follow this link to reset your password. This link is valid for 10 minutes:</p>
      <p><a href='${resetURL}'>Reset Password</a></p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `;

    // Send email with reset URL
    await sendEmail({
      to: email,
      subject: "Forgot Password Link",
      html: emailContent,
    });

    res.json({
      success: true,
      message: "Password reset token sent successfully",
    });
  } catch (error) {
    console.error("Error generating password reset token:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    console.log("Received token:", token);

    // Find the student by password reset token
    const student = await studentModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Check if the token is not expired
    });

    // If student not found or token expired, return error
    if (!student) {
      console.error("Token expired or invalid");
      return res
        .status(400)
        .json({ success: false, message: "Token expired or invalid" });
    }

    // Set new password for the student
    student.password = await hashPassword(password);
    student.passwordResetToken = undefined;
    student.passwordResetExpires = undefined;
    await student.save();

    // Return success message
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = studentModel.find(JSON.parse(queryStr)).sort({ enrollment: 1 });
    if (req.query.batch) {
      query = query.where('batch').equals(req.query.batch);
    }
    const students = await query;
    res.status(200).json({
      success: true,
      students
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: err.message
    });
  }
};

export const getStudentByEnrollment = async (req, res) => {
  try {
    const { enrollment } = req.params;
    const student = await studentModel.findOne({ enrollment });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: err.message,
    });
  }
};

export const updateStudentContoller = async (req, res) => {
  const { id } = req.params;
  const { name, email, department, batch } = req.body;

  try {
    const updatedStudent = await studentModel.findByIdAndUpdate(
        id,
        { name, email, department, batch },
        { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'Failed to update student data', error: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { month, year } = req.query;

    // Find attendance record for the student
    const attendanceRecord = await AttendanceModel.findOne({ studentId });
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found for the student" });
    }

    // Filter attendance records based on selected month and year
    let filteredAttendance = attendanceRecord.attendance;
    if (year && month) {
      filteredAttendance = attendanceRecord.attendance.filter(
          (entry) => entry.month === parseInt(month) && entry.year === parseInt(year)
      );
    }

    // Sort attendance records by date (year, month, day)
    filteredAttendance.sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1, a.day);
      const dateB = new Date(b.year, b.month - 1, b.day);
      return dateA - dateB;
    });

    let totalPresent = 0;
    for (const entry of filteredAttendance) {
      if (entry.status === "Present") {
        totalPresent++;
      }
    }

    res.status(200).json({
      totalAttendance: filteredAttendance.length,
      totalPresent,
      attendance: filteredAttendance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// import studentModel from "../Models/studentModel.js";
import timetable from "../Models/timeTableModel.js"; 
export const getTimeTable = async(req,res) =>{
  try{
    const { batch } = req.query;
   if( !batch){
      return res.status(400).json({
      success: false,
      message:"Complete all the fields "
     });
   }

console.log(batch);
   
    const getAllTimeTable = await timetable.findOne({ batch })
    // console.log(getAllTimeTable.length)
    // console.log(getAllTimeTable.timeTableURL);
    return res.status(200).json({
      success: true,
      data: getAllTimeTable
    });
  }catch(error){
    console.log(error);
  }
}


export const getBatch = async (req, res) => {
  try {
    // Call the fetchAllBatches static method defined in the student model
    const batches = await studentModel.fetchAllBatches();

    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching all batches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// // View MST marks
import marksModel from "../Models/marksModel.js";

export const viewMarks = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { semester, exam } = req.query;

    const queryObj = { semester, exam };
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const marks = await marksModel.findOne({ ...JSON.parse(queryStr), 'students.studentId': studentId });

    if (!marks) {
      return res.status(404).json({ message: 'Marks not found for the student in the specified semester and exam' });
    }

    const studentMarks = marks.students.find(student => student.studentId.toString() === studentId.toString());

    if (!studentMarks || !studentMarks.marks) {
      return res.status(404).json({ message: 'Marks not found for the student in the specified semester and exam' });
    }

    res.status(200).json({ marks: studentMarks.marks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
