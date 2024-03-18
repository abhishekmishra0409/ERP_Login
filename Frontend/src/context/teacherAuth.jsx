import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const TeacherAuthContext = createContext();
const TeacherAuthProvider = ({ children }) => {
  const [teacherauth, setTeacherAuth] = useState({
    user: null,
    token: "",
  });

  axios.defaults.headers.common["Authorization"] = teacherauth?.token;

  useEffect(() => {
    const data = localStorage.getItem("teacher");
    if (data) {
      const parseData = JSON.parse(data);
      setTeacherAuth({
        ...teacherauth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    //eslint-disable-next-line
  }, []);
  return (
    <TeacherAuthContext.Provider value={[teacherauth, setTeacherAuth]}>
      {children}
    </TeacherAuthContext.Provider>
  );
};

// custom hook
const useTeacherAuth = () => useContext(TeacherAuthContext);

export { useTeacherAuth, TeacherAuthProvider};
