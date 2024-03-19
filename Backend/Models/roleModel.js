import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["principal", "HOD", "teacher"],
            default: "teacher",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
