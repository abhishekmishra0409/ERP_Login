import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getToken = () => {
  return sessionStorage.getItem("token");
};

const login = async (user) => {
    try {
      const response = await axios.post(`${base_url}admin/login`, user, {
        withCredentials: true
      });
      if (response.data) {
        axios.defaults.headers.common["Authorization"] = response.data.token;
      
        sessionStorage.setItem("token", response.data.token); 
        
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

        const userDataResponse = await axios.get(`${base_url}admin/profile`, {
         
        });
        
        sessionStorage.setItem("userData", JSON.stringify(userDataResponse.data)); 
        
        return response.data;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
};
const logout = async () => {
  try {
    const token = getToken();
    const headers = {
      'Authorization': token,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${base_url}admin/logout`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    if (response.ok) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userData");
    } else {
      const errorData = await response.json();
      throw new Error(`Logout failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


const authService = {
  login,
  logout
};

export default authService;
