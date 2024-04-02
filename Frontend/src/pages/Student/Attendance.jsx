import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { attendance } from "../../features/student/studentSlice";
import {UserOutlined} from "@ant-design/icons";
import {  Progress, Avatar } from 'antd';
import AttendanceCalendor from './AttendanceCalendor';
import '../../utils/additionalCss.css'

const Attendance = () => {
  const dispatch = useDispatch();
  const [attendanceData, setAttendanceData] = useState(null);
  const [user, setUser] = useState(null);


  async function getAttendance(){
    const res = await dispatch(attendance());
    setAttendanceData(res.payload); 
  }
 
  
  useEffect(()=>{
    getAttendance();
    const us = JSON.parse(sessionStorage.getItem("userData"));
    setUser(us);

  },[dispatch, attendance])

  
  
  return (
    <div>
    {
      attendanceData &&  
    <>
        <h4>Attendance Board</h4>
 
      <div style={{padding:'20px', display:'flex', justifyContent:'space-evenly', alignItems:'center' ,boxShadow:`rgba(0, 0, 0, 0.35) 0px 5px 15px`, borderRadius:'20px' }}>



        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <Avatar size={80}  
          style={{backgroundColor: '#fde3cf', color: '#f56a00'}} 
          icon={<UserOutlined />}  />
          <div>
          <h5>{user.name}</h5>
          <p>{user.email}</p>

          </div>
        </div>

        <div style={{fontSize:'16px'}}>
        <div style={{display:'flex', gap:'5px'}}> 
          <h6>Total Classes :</h6> <p> {attendanceData.totalAttendance} </p>
        </div>
        <div style={{display:'flex', gap:'5px'}}> 
          <h6>Present :</h6> <p> {attendanceData.totalPresent} </p>
        </div>
        <div style={{display:'flex', gap:'5px'}}> 
          <h6>Absent :</h6> <p> {attendanceData.totalAttendance - attendanceData.totalPresent} </p>
        </div>

        </div>

        <div>
          <Progress type="circle" percent={(attendanceData.totalPresent / attendanceData.totalAttendance) * 100} format={(percent) => `${percent} %`} />
          <p>Attendance Percentage</p>
        </div>

        <div>
          <Progress type="circle" percent={(attendanceData.totalPresent / attendanceData.totalAttendance) * 100} format={() => `${attendanceData.totalPresent}/${attendanceData.totalAttendance}`} />
          <p>Attended Classes</p>
        </div>
      </div>

      <div style={{marginTop:50, padding:20, }} className="Calender">
        {
          attendanceData &&
        <AttendanceCalendor attendanceData={attendanceData} />
        }
      </div>
    </>
      
    }
    </div>
  )
}


export default Attendance
