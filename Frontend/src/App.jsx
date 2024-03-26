import './App.css'
import { Routes, Route } from "react-router-dom";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Student from './pages/Student';
import Update from './pages/Update';
import TimeTable from './pages/Timetable';
import Teacher from './pages/Teacher';
import StudentLayout from "./component/StudentLayout"
import TeacherLayout from "./component/Teacher.Layout"
import Attendance from './pages/Attendance';
import Mst from './pages/Mst';
import Password from './pages/Password';

function App() {

 
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/reset-password/*' element={<ResetPassword/>} />
      <Route path='/student' element={<StudentLayout/>}>
        <Route  path='' element={<Student/>}/>
        <Route  path='/student/update' element={<Update/>}/>
        <Route  path='/student/timetable' element={<TimeTable/>}/>
        <Route  path='/student/attendance' element={<Attendance/>}/>
        <Route  path='/student/mst' element={<Mst/>}/>
        <Route  path='/student/changepassword' element={<Password />}/>
      </Route>
      
      <Route path='/teacher' element={<TeacherLayout/>} >
        <Route  path='' element={<Teacher/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
