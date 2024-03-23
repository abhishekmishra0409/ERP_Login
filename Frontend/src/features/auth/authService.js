import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getToken = () => {
    return sessionStorage.getItem("refreshToken");
  };

const login = async (user, userType) => {
  try {
    let loginEndpoint = "";
    if (userType === "student") {
      loginEndpoint = `${base_url}student/login`; 
    } else if (userType === "teacher") {
      loginEndpoint = `${base_url}teacher/login`; 
    } else {
      throw new Error("Invalid user type");
    }

    const response = await axios.post(loginEndpoint, user, {
      withCredentials: true,
    });
console.log(response.data);
    if (response.data) {
      axios.defaults.headers.common["Authorization"] = response.data.refreshToken;

      sessionStorage.setItem("user",JSON.stringify(response.data.user));
      sessionStorage.setItem("refreshToken", response.data.refreshToken);

      return response.data;
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

const logout = async (userType) => {
    try {
      let logoutEndpoint = "";
      if (userType === "student") {
        logoutEndpoint = `${base_url}student/logout`;
      } else if (userType === "teacher") {
        logoutEndpoint = `${base_url}teacher/logout`;
      } else {
        throw new Error("Invalid user type");
      }
  
      const token = getToken();
      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };
  
      const response = await fetch(logoutEndpoint, {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      });
  
      if (response.ok) {
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("user");
      } else {
        const errorData = await response.json();
        throw new Error(`Logout failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };
  

const authService = {
  login,
  logout
};

export default authService;
