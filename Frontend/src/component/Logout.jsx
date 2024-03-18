import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
// import Cookie from "js-cookie"

export const Logout = () => {
  const navigate = useNavigate();
  const [, , LogoutUser] = useAuth(); 

  useEffect(() => {
    const logout = async () => {
      await LogoutUser();
      console.log(document.cookie);

      navigate('/login'); 
    };
    logout();
  }, [LogoutUser, navigate]);

  
  return null;
};
