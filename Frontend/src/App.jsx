import './App.css'
import { Routes, Route } from "react-router-dom";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import StudentLayout from "./component/StudentLayout"

function App() {

 
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/reset-password/*' element={<ResetPassword/>} />
      <Route path='/student' element={<StudentLayout/>}>
      <Route  path='' element={<Student/>}/>
      </Route>
      
      <Route path='/teacher' element={<Teacher/>} />
    </Routes>
    </>
  )
}

export default App
