import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: {},
    token: "",
});

  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = sessionStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token, 
      });
    }
    //eslint-disable-next-line
  }, []);

  let isLoggedIn = !!auth.token;

  console.log(isLoggedIn);

  const LogoutUser = ()=>{
    setAuth({
      user: {},
      token: ""
    });
    return sessionStorage.removeItem("auth");
  }
  

  return (
    <AuthContext.Provider value={[auth, setAuth, LogoutUser, isLoggedIn]}>
      {children}
    </AuthContext.Provider>
  );
  
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
