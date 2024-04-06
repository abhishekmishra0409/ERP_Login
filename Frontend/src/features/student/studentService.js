import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getToken = () => {
  return sessionStorage.getItem("refreshToken");
};

const getAll = async () => {
  try {
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const url = base_url + "student/profile";
    const response = await axios.get(url, {
      headers: headers,
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Failed:", error);
    throw error;
  }
};

const timetable = async (data) => {
  try {
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const url = base_url + "student/get-timetable?" + data;
    const res = await axios.get(url, {
      headers: headers,
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updatePassword = async (password) => {
  try {
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const url = base_url + "student/password";
    const response = await axios.put(url, password, {
      headers: headers,
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Error occurred", error);
    throw error;
  }
};

const updateName = async (details) => {
  try {
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const url = base_url + "student/edit";
    const response = await axios.put(url, details, {
      headers: headers,
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Error occurred", error);
    throw error;
  }
};

const getAttendance = async() =>{
  try{
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const url = base_url + "student/attendance";
    const response = await axios.get(url, {
      headers: headers,
      withCredentials: true,
    });

    return response;
  }catch(error){
    console.error("error occurred "+error);
    throw error;
  }
}

const mstResult = async(data)=>{
  try{
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const url = base_url + "student/view-marks?" + data;
    const res = await axios.get(url, {
      headers: headers,
      withCredentials: true,
    });
    return res;
  }catch(error){
    console.error(error);
    throw error;
  }
}

const studentService = {
  getAll,
  timetable,
  updatePassword,
  updateName,
  getAttendance,
  mstResult
};

export default studentService;
