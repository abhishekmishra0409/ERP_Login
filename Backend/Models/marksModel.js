import mongoose from "mongoose";

const studentMarksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    marks: [
        {
            subject: {
                type: String,
                required: true,
            },
            marksObtained: {
                type: Number,
                required: true,
            },
        },
    ],
});

const marksSchema = new mongoose.Schema(
    {
        semester: {
            type: String,
            required: true,
        },
        exam: {
            type: String,
            required: true,
        },
        students: [studentMarksSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Marks", marksSchema);
