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

    res.status(200).send({
      success: true,
      message: "Login successful",
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

async function uploading(file, folder){
  const options={
    folder  }
  
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// upload time table contorller
export const uploadTimeTable = async(req,res)=>{
  try{
    const imgFile =req.files.imgFile;
    const {department, sem} = req.body;

    // console.log(imgFile)
    if(!imgFile){
      return  res.status(400).json({
        success:false,
        message:"Image file is not found"
      })
    }
  
    const supportedFiles = ["jpeg", "jpg", "png"];
    const fileType = imgFile.name.split(".")[1];
    // console.log(fileType);

    if(!supportedFiles.includes(fileType)){
      return res.status(400).json({
        success:false,
        message:"File not supported"
    })
    }


  const uploadImg = await uploading(imgFile, "TimeTable");
  // console.log(uploadImg);
    if(!uploadImg){
      res.status(400).json({
        success:false,
        msg:"Error while uploading try again",
        error: error
    })
    }
    
    const sendDetail = await new timetable({
      department,
      sem,
      timeTableURL:uploadImg.secure_url, 
      cloudinary_name:uploadImg.public_id}).save();
  
// console.log(sendDetail)

    
    return res.status(200).json({
      success:true,
      msg:"File uploaded successfully",
      data: sendDetail
  })

  }catch(error){
    console.log(error)
    return res.status(400).json({
      success:false,
      msg:"Error while uploading",
      error: error
  })
  }
}


// delete time Table
export const deleteTimetable = async(req,res) =>{
  try{
    const {department, sem} = req.query;
    if(!department || !sem){
       return res.status(400).json({
        success:false,
        msg:"Fill all the fields"
    });
  }
  const findAndDestroy = await timetable.findOne({department,sem});
  const del = await cloudinary.uploader.destroy(findAndDestroy.cloudinary_name);
  if(!del){
    return res.status(400).json({
      success:false,
      msg:"not deleted from cloud"
  });
  }
  const deleteTt = await timetable.deleteOne({department, sem});
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