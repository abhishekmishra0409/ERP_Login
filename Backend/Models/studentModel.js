import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default:""
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
        department:{
            type:String,
            required:true
        },
        batch: {
            type: String,
            required: true,
        },
        address:{
            type:String
        },
        city:{
            type:String
        },
        gender:{
            type:String
        },
        phone:{
            type:Number
        },
        dob:{
            type:Date
        },
        sem:{
            type:Number
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

studentSchema.statics.fetchAllBatches = async function () {
    try {
        // Use aggregation to fetch all unique batch numbers
        const batches = await this.distinct("batch");

        return batches;
    } catch (error) {
        console.error("Error fetching all batches:", error);
        throw error;
    }
};

export default mongoose.model("Student", studentSchema);
