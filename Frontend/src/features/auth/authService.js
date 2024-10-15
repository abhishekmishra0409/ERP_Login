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
    // console.log(response.data);
    if (response.data) {
      axios.defaults.headers.common["Authorization"] =
        response.data.refreshToken;

      sessionStorage.setItem("user", JSON.stringify(response.data.user));
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

      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");

  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

const authService = {
  login,
  logout,
};

export default authService;
