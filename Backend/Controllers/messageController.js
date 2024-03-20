import Student from "../Models/studentModel.js";
import Message from "../Models/messageModel.js";
import cron from "node-cron";


export const sendMessage = async (req, res) => {
    try {
        const {  content, recipients } = req.body;
        const sender = req.user._id

        // Fetch all batches if recipients is not specified
        let batches = recipients || await Student.fetchAllBatches();

        // If recipients are specified, ensure they are batch numbers
        if (recipients) {
            // Validate recipients to ensure they are batch numbers
            // If they are not batch numbers, treat them as individual student IDs
            const validBatchNumbers = await Student.find({ batch: { $in: recipients } }).distinct('batch');
            batches = validBatchNumbers.length > 0 ? validBatchNumbers : recipients;
        }

        // Create and save message for each batch
        const messagePromises = batches.map(async (batch) => {
            const message = new Message({
                sender,
                content,
                recipients: [batch]
            });
            return await message.save();
        });

        // Execute all message creation promises in parallel
        const messages = await Promise.all(messagePromises);

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const getMessage = async (req, res) => {
    try {
        const studentId = req.student.id;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const batch = student.batch;

        const messages = await Message.find({ recipients: batch });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// Function to delete expired messages
const deleteExpiredMessages = async () => {
    try {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - 1);

        // Delete messages older than the threshold date
        await Message.deleteMany({ createdAt: { $lt: thresholdDate } });

        console.log("Expired messages deleted successfully.");
    } catch (error) {
        console.error("Error deleting expired messages:", error);
    }
};

// Schedule the delete function to run daily at midnight
cron.schedule("0 0 * * *", deleteExpiredMessages);
