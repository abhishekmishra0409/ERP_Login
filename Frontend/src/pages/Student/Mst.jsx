import { Table } from "antd"
import NumberTable from "./NumberTable"
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { mstNumbers } from "../../features/student/studentSlice";

const Mst = () => {
    const dispatch = useDispatch();  
    const [marks, setMarks] = useState();
    // console.log(marks)

    const fetchData = async() =>{
      const id = JSON.parse(sessionStorage.getItem("userData"));
      const data = {studentId : id._id};
      
      const queryParams = new URLSearchParams(data).toString();
      const res = await dispatch(mstNumbers(queryParams));
    
      setMarks(res.payload.marks.marks);
    }

    useEffect(()=>{
     fetchData();
      // console.log(res.data);
    },[dispatch])
  
  return (
    <div style={{boxShadow: '0px 0px 10px 0.1px grey', padding:'15px', borderRadius:'17px'}}>
    <h4>MST marks</h4>
    {
      marks ?  (<NumberTable marks={marks} /> ):  (<Table />)
    } 
    </div>
  )
}

export default Mst
