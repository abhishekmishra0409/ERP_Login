import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export const Logout = () => {
  const navigate = useNavigate();
  const [, , LogoutUser] = useAuth(); 

  useEffect(() => {
    const logout = async () => {
      await LogoutUser();
      navigate('/login'); 
    };
    logout();
  }, [LogoutUser, navigate]);


  return null;
};
