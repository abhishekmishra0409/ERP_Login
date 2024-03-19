import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
      enrollment:{
        type:String,
          required:true
      },
      password: {
          type: String,
          default: "svgi@svce",
      },
    batch: {
      type: String,
      required: true,
    },
      refreshToken :{
          type:String
      },
      role :{
          type:String,
          default:"student"
      },
      passwordChangedAt : Date,
      passwordResetToken : String,
      passwordResetExpires:Date,
  },
  { timestamps: true },

);

export default mongoose.model("Student", studentSchema);
