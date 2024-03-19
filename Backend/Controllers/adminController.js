import adminModel from "../Models/adminModel.js";
import { hashPassword, comparePassword } from "../Helper/hashFunction.js";
import refreshToken from "../Helper/JwtToken.js";

export const registerAdminController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validations
        if (!name || !email || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }

        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ email: email });
        if (existingAdmin) {
            return res.status(409).send({ message: "Admin already exists" });
        }

        // Register admin
        const hashedPassword = await hashPassword(password);
        const admin = await adminModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Respond with success message
        res.status(200).send({
            success: true,
            message: "Admin registered successfully.",
            admin,
        });
    } catch (error) {
        console.error("Error in admin registration:", error);
        res.status(500).send({ success: false, message: "Error in admin registration" });
    }
};

// Admin login controller
export const loginAdminController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res
                .status(400)
                .send({ success: false, message: "Invalid email or password" });
        }

        // Check if the admin exists
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res
                .status(404)
                .send({ success: false, message: "Email does not exist" });
        }

        // Verify the password
        const match = await comparePassword(password, admin.password);
        if (!match) {
            return res
                .status(401)
                .send({ success: false, message: "Password does not match" });
        }

        // Generate access token
        const token =  await refreshToken(admin._id,"adminToken")

        // Respond with admin details and access token
        res.json({
            _id: admin._id,
            success: true,
            message: "Login successful",
            token: token,
            admin: {
                name: admin.name,
                email: admin.email,
                token: token,
            },
        });
    } catch (error) {
        console.error("Error in admin login:", error);
        res.status(500).send({ success: false, message: "Error in admin login" });
    }
};
