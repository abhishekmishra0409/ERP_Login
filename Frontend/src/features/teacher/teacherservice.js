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


const teacherService = {
    getBatches,
    getStudentByBatch
  
};

export default teacherService;
