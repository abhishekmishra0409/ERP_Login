import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getToken = () => {
  return sessionStorage.getItem("token");
};

const createStudent = async (studentData) => {
    try {
      const token = getToken(); 
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.post(`${base_url}student/register`, studentData);
      return response.data;
    } catch (error) {
      if (error.response) {
        
        if (error.response.status === 409) {
          
          throw new Error("Student already registered");
        } else {
          
          throw new Error("Server error");
        }
      } else if (error.request) {
        
        throw new Error("No response received");
      } else {

        throw new Error("Error creating student");
      }
    }
  };
  

// Update an existing student
const updateStudent = async (studentId, updatedData) => {
  try {
    const token = getToken(); 
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.put(`${base_url}student/${studentId}`, updatedData, { 
    });
    return response.data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

const studentService = {
  createStudent,
  updateStudent
};

export default studentService;
