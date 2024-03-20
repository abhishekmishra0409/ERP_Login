import mongoose from "mongoose"

const timeTableDetails = new mongoose.Schema({
    department:{
        type:String,
        required:true
    },
    sem:{
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