import mongoose from "mongoose"

const timeTableDetails = new mongoose.Schema({
    batch:{
        type:String,
        required:true
    },
    timeTableURL:{
        type:String
    },
    cloudinary_name:{
        type:String
    }
})

const timetable = mongoose.model("Time-Table", timeTableDetails);
export default timetable;