import './App.css'
import { Routes, Route } from "react-router-dom";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Student from './pages/Student/Student';
import Update from './pages/Student/Update';
import TimeTable from './pages/Student/Timetable';
import Teacher from './pages/Teacher/Teacher';
import StudentLayout from "./component/StudentLayout"
import TeacherLayout from "./component/Teacher.Layout"
import Attendance from './pages/Student/Attendance';
import Mst from './pages/Student/Mst';
import Password from './pages/Student/Password';
import Profile from './pages/Student/Profile';
import TeacherAttendance from'./pages/Teacher/Attendance'
import UnderProcess from './pages/UnderProcess';

function App() {

 
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/reset-password/*' element={<ResetPassword/>} />
      <Route path='/student' element={<StudentLayout/>}>
        <Route  path='' element={<Student/>}/>
        <Route  path='profile' element={<Profile />} />
        <Route  path='update' element={<Update/>}/>
        <Route  path='timetable' element={<TimeTable/>}/>
        <Route  path='attendance' element={<Attendance/>}/>
        <Route  path='mst' element={<Mst/>}/>
        <Route  path='changepassword' element={<Password />}/>
        <Route  path='application' element={<UnderProcess />} />
        <Route  path='nodues' element={<UnderProcess />} />
      </Route>
      
      <Route path='/teacher' element={<TeacherLayout/>} >
        <Route  path='' element={<Teacher/>}/>
        <Route  path='attendance' element={<TeacherAttendance/>}/>

      </Route>
    </Routes>
    </>
  )
}

export default App
