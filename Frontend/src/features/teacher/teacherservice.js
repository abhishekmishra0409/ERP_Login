import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getToken = () => {
    return sessionStorage.getItem("refreshToken");
};

const getBatches = async () => {
    try {
        const url = base_url + "student/batch";
        const response = await axios.get(url);
        const batches = response.data;
        sessionStorage.setItem('batches', JSON.stringify(batches));
        return batches;
        
    } catch (error) {
        console.error('Error fetching batches:', error);
        throw error;
    }
};

const getStudentByBatch = async (batch) => {
    try {
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const url = base_url + "student";
        const response = await axios.get(url, {
            params: {
                batch: batch
            },
            headers: headers,
            withCredentials: true,
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching student by batch:', error);
        throw error;
    }
};

const uploadTimeTable = async (formData) => {
    try {
        const url = base_url + "teacher/upload-timetable";
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        };
        const response = await axios.post(url, formData, {
            headers: headers,
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading time table:', error);
        throw error;
    }
};

const postMarks = async (marksData) => {
    try {
        const url = base_url + "teacher/upload-marks";
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const response = await axios.post(url, marksData, {
            headers: headers,
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error posting marks:', error);
        throw error;
    }
};

const sendMsg = async( sendedMessage ) =>{
    try{
        const url = base_url + "teacher/send-message";
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const response = await axios.post(url, sendedMessage, {
            headers: headers,
            withCredentials: true,
        });
        // console.log(response);
        return response.data;
    }catch(error){
        console.error("Error occurred "+error);
        throw error;
    }
}

const getMsg = async() =>{
    try{
        const url = base_url+"teacher/get-teacher-msg";
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const response = await axios.get(url, {
            headers: headers,
            withCredentials: true,
        });
        // console.log(response);
        return response.data;
    }catch(error){
        console.error("Error occurred "+error);
        throw error;
    }
    
}

const dltMsg = async(_id) =>{
    try {
        const url = base_url + `teacher/delete-msg/${_id}`;
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const response = await axios.delete(url, {
            headers: headers,
            withCredentials: true,
        });
        // console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error occurred ", error);
        throw error;
    }
}
const teacherService = {
    getBatches,
    getStudentByBatch,
    uploadTimeTable,
    postMarks,
    sendMsg,
    getMsg,
    dltMsg
};

export default teacherService;
