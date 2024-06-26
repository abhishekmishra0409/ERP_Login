import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        role: {
            type: String,
            default: "Admin",
        },
    },
    { timestamps: true }
);


const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
