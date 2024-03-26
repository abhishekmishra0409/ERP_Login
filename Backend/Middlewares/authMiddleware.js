import jwt from "jsonwebtoken";
import StudentModel from "../Models/studentModel.js";
import roleModel from "../Models/roleModel.js";
import adminModel from "../Models/adminModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, "0822IT21");
        const student = await StudentModel.findById(decoded?.id);
        if (!student) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid token" });
        }
        req.student = student;
        next();
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Token not provided" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }
  } catch (err) {
    console.error("Error in authMiddleware:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

// Admin access
export const isAdmin = async (req, res, next) => {
  // Get the JWT token from the request headers or cookies
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.refreshToken;
  // console.log(token)

  // Check if token is present
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "adminToken");
    const admin = await adminModel.findById(decoded?.id);
    // Check if decoded token includes admin role
    if (admin.role !== 'Admin') {
      return res.status(403).send({ message: "Not authorized" });
    }

    // Pass admin data to the request object
    req.admin = admin;

    // Move to the next middleware/controller
    next();
  } catch (error) {
    // console.error("Error verifying admin token:", error);
    return res.status(401).send({ message: "Invalid token" });
  }
};

export const isTeacher = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization.split(' ')[1] || req.cookies.refreshToken;

    // Verify token
    const decoded = jwt.verify(token, 'teacherToken');
    // Check if user is a teacher
    const user = await roleModel.findById(decoded.id);
    if (!user || user.role !== 'teacher') {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized Access: User is not a teacher',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in teacher middleware:', error);
    res.status(401).send({
      success: false,
      error,
      message: 'Error in teacher middleware',
    });
  }
};