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
        const token = await refreshToken(admin._id, "adminToken");

        // Set refresh token as a cookie
        res.cookie("refreshToken", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        });

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

// Logout controller for admin
export const logoutAdminController = async (req, res) => {
    const cookie = req.cookies;

    // Check if refresh token is present in cookies
    if (!cookie?.refreshToken) {
        return res
            .status(400)
            .send({ success: false, message: "No Refresh Token in Cookies" });
    }

    const refreshToken = cookie.refreshToken;

    try {
        // Find the admin by refreshToken
        const admin = await adminModel.findOne({ refreshToken });

        // If admin doesn't exist, clear the cookie and send 204 status
        if (!admin) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            return res.status(204).json({ success: true, message: "Admin Logout Successful" });
        }


        // Clear the refresh token cookie and send 204 status
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.status(204).json({ success: true, message: "Admin Logout Successful" });
    } catch (error) {
        console.error("Error logging out admin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const viewProfileController = async (req, res) => {
    try {
        const adminId = req.admin._id;

        // Find the admin by ID
        const admin = await adminModel.findById(adminId);

        // If admin not found, return 404 error
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        // Respond with admin details
        res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error("Error viewing admin profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
