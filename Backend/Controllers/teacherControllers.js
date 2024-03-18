import { comparePassword, hashPassword } from "../Helper/hashFunction.js";
import teacherModel from "../Models/teacherModel.js";
import JWT from "jsonwebtoken";

export const createTeacherController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validations
    if (!name || !email || !password) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Check if teacher already exists
    const existingTeacher = await teacherModel.findOne({ email });
    if (existingTeacher) {
      return res.status(409).send({
        success: false,
        message: "Teacher already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create teacher
    const user = await new teacherModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Teacher registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error in creating teacher:", error);
    res.status(500).send({
      success: false,
      message: "Error in creating teacher",
      error: error.message,
    });
  }
};

// Teacher login
export const teacherloginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if teacher exists
    const user = await teacherModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = JWT.sign({ _id: user._id }, "teacherToken", {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user?.name,
        email: user?.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error in teacher login:", error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

// Test controller
export const teacherTestController = (req, res) => {
  res.send("Teacher Protected Route");
};
