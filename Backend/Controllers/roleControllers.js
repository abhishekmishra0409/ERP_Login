import { comparePassword, hashPassword } from "../Helper/hashFunction.js";
import roleModel from "../Models/roleModel.js";
import refreshToken from "../Helper/JwtToken.js";

export const createTeacherController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validations
    if (!name || !email || !password) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Check if teacher already exists
    const existingTeacher = await roleModel.findOne({ email });
    if (existingTeacher) {
      return res.status(409).send({
        success: false,
        message: "Teacher already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create teacher
    const user = await new roleModel({
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
    const user = await roleModel.findOne({ email });
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
    const token = await refreshToken(user._id,"teacherToken")

    res.cookie("refreshToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      refreshToken: token,
      user: {
        name: user?.name,
        email: user?.email,
      },
      token:token,
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


import {v2 as cloudinary} from "cloudinary"
import timetable from "../Models/timeTableModel.js";
import adminModel from "../Models/adminModel.js";

async function uploading(file, folder){
  const options={
    folder  }
  
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

export const uploadTimeTable = async (req, res) => {
  try {
    const imgFile = req.files.imgFile;
    const { batch } = req.body;

    if (!imgFile) {
      return res.status(400).json({
        success: false,
        message: "Image file is not found"
      });
    }

    const supportedFiles = ["jpeg", "jpg", "png"];
    const fileType = imgFile.name.split(".")[1];

    if (!supportedFiles.includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: "File not supported"
      });
    }

    const uploadImg = await uploading(imgFile, "TimeTable");

    if (!uploadImg) {
      return res.status(400).json({
        success: false,
        msg: "Error while uploading try again"
      });
    }

    let existingRecord = await timetable.findOne({ batch });

    if (existingRecord) {
      await cloudinary.uploader.destroy(existingRecord.cloudinary_name);
      existingRecord.timeTableURL = uploadImg.secure_url;
      existingRecord.cloudinary_name = uploadImg.public_id;
      await existingRecord.save();

      return res.status(200).json({
        success: true,
        msg: "File updated successfully",
        data: existingRecord
      });
    } else {
      const newRecord = await new timetable({
        batch,
        timeTableURL: uploadImg.secure_url,
        cloudinary_name: uploadImg.public_id
      }).save();

      return res.status(200).json({
        success: true,
        msg: "File uploaded successfully",
        data: newRecord
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: "Error while uploading",
      error: error.message
    });
  }
};

// delete time Table
export const deleteTimetable = async(req,res) =>{
  try{
    const {batch} = req.query;
    if(!batch){
       return res.status(400).json({
        success:false,
        msg:"Fill all the fields"
    });
  }
  const findAndDestroy = await timetable.findOne({batch});
  const del = await cloudinary.uploader.destroy(findAndDestroy.cloudinary_name);
  if(!del){
    return res.status(400).json({
      success:false,
      msg:"not deleted from cloud"
  });
  }
  const deleteTt = await timetable.deleteOne({batch});
  return res.status(200).json({
    success:true,
    msg:"Deleted successfully",
    data:deleteTt
});

  }catch(error){
    return res.status(400).json({
      success:false,
      msg:"Fill all the fields",
      error:error
  });
  }
}

export const logoutRoleController = async (req, res) => {
  const cookie = req.cookies;

  // Check if refresh token is present in cookies
  if (!cookie?.refreshToken) {
    return res
        .status(400)
        .send({ success: false, message: "No Refresh Token in Cookies" });
  }

  const refreshToken = cookie.refreshToken;

  try {
    // Find the admin by refreshToken
    const role = await roleModel.findOne({ refreshToken });

    // If admin doesn't exist, clear the cookie and send 204 status
    if (!role) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.status(204).json({ success: true, message: "Teacher Logout Successful" });
    }


    // Clear the refresh token cookie and send 204 status
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(204).json({ success: true, message: "Teacher Logout Successful" });
  } catch (error) {
    console.error("Error logging out Teacher:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};