import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    attendance: [
        {
            year: {
                type: Number,
                required: true,
            },
            month: {
                type: Number,
                required: true,
            },
            day: {
                type: Number,
                required: true,
            },

            status: {
                type: String,
                enum: ["Present", "Absent"],
                required: true,
            },
        },
    ],
},{
    timestamps:true
});

export default mongoose.model("Attendance", attendanceSchema);