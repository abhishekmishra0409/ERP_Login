import {
  comparePassword,
  hashPassword,
  createPasswordResetToken,
} from "../Helper/hashFunction.js";
import studentModel from "../Models/studentModel.js";
import generateRefreshToken from "../Middlewares/refreshToken.js";
import sendEmail from "../Helper/EmailSend.js";
// import attendanceModel from "../Models/attendanceModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, batch } = req.body;
    // Validations
    if (!name || !email || !password || !batch) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if student already exists
    const existingStudent = await studentModel.findOne({ email: email });
    if (existingStudent) {
      return res.status(409).send({ message: "Student already exists" });
    }

    // Register student
    const hashedPassword = await hashPassword(password);
    const student = await studentModel.create({
      name,
      email,
      password: hashedPassword,
      batch,
    });

    // Respond with success message
    res.status(200).send({
      success: true,
      message: "Student registered successfully by admin.",
      student,
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
    const refreshToken = await generateRefreshToken(student._id);

    // Update refresh token in the database
    await studentModel.findByIdAndUpdate(
        student._id,
        { refreshToken: refreshToken },
        { new: true }
    );


    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
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
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send({ success: false, message: "Error in login" });
  }
};

// Handle refresh token - Removed the refresh token logic

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
      return res.sendStatus(204);
    }

    // Update user document to remove the refresh token
    await studentModel.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    // Clear the refresh token cookie and send 204 status
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(204).json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateStudent = async (req, res) => {
  const { _id } = req.student;

  try {
    const updatedStudent = await studentModel.findByIdAndUpdate(
      _id,
      { name: req.body.name },
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
    const hashedPassword = await hashPassword(password);

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

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

// export const viewAttendance = async (req, res) => {
//   try {
//     const studentId = req.params.studentId;
//     const attendance = await attendanceModel
//       .find({ student: studentId })
//       .sort({ date: "desc" });

//     const presentCount = attendance.filter(
//       (entry) => entry.status === "Present"
//     ).length;

//     res.status(200).json({
//       count: attendance.length,
//       presentCount,
//       studentId,
//       attendance,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
