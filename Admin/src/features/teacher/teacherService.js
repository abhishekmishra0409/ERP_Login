import axios from "axios";
import { base_url } from "../../utils/baseUrl";

// Function to get the JWT token from sessionStorage
const getToken = () => {
  return sessionStorage.getItem("token");
};

// Create a new student
const createTeacher = async (teacherData) => {
    try {
      const token = getToken(); 
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.post(`${base_url}teacher/create`, teacherData);
      return response.data;
    } catch (error) {
      if (error.response) {
        
        if (error.response.status === 409) {
          
          throw new Error("Teacher already registered");
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
  

  const teacherService = {
    createTeacher,
  };
  
  export default teacherService;