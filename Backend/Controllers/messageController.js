import Student from "../Models/studentModel.js";
import Message from "../Models/messageModel.js";
import Role from "../Models/roleModel.js";
import cron from "node-cron";


export const sendMessage = async (req, res) => {
    try {
        const {  content, recipients } = req.body;
        const sender = req.user._id

        let batches = recipients || await Student.fetchAllBatches();

        if (recipients) {

            const validBatchNumbers = await Student.find({ batch: { $in: recipients } }).distinct('batch');
            batches = validBatchNumbers.length > 0 ? validBatchNumbers : recipients;
        }

      
            const message = new Message({
                sender,
                content,
                recipients: batches
            });

            const messageSave = await message.save();
        res.status(200).json({ success: true, messageSave});
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// get msg according to the user 
export const getTeacherMsg = async (req,res) =>{
    try{
        const userId = req.user._id;
        const messages = await Message.find({ sender: userId }).populate({
            path: 'sender',
            select: 'name role',
            model: Role
        });
        
        res.status(200).json({ success: true, messages });

    }catch(error){
        console.error("Error in getting msg for teacher", error);
        res.status(500).json({ success:false, message:"Internal server error", error: error.message});
    }
}


export const getMessage = async (req, res) => {
    try {
        const studentId = req.student.id;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const batch = student.batch;

        const messages = await Message.find({ recipients: batch }).populate({
            path:'sender',
            select:'name role',
            model:Role
        });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const deleteMsg = async(req,res) =>{
 try{   
    const id = req.params.id;
    // console.log(id)
    if(!id){
        return res.status(500).json({
            sucess:false,
            message:"Message not found",
        });
    }
    
    const dltRes = await Message.findByIdAndDelete(id);
    // console.log(dltRes);
    if(!dltRes){
        return res.status(500).json({
            sucess:false,
            message:"Message not found",
        });
    }

    res.status(200).json({
        success:true,
        message:"Message delted succesfully"
    })
}
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Message not found",
            error:error
        });
    }
}


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


cron.schedule("0 0 * * *", deleteExpiredMessages);
