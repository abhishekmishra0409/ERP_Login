import { Select, Button,Spin } from "antd";
import NumberTable from "./NumberTable";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { mstNumbers } from "../../features/student/studentSlice";

const { Option } = Select;

const Mst = () => {
    const dispatch = useDispatch();  
    const [marks, setMarks] = useState();
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedExamType, setSelectedExamType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const data = `semester=${selectedSemester}&exam=${selectedExamType}`
    const fetchData = async() =>{
      setIsLoading(true);
      const res = await dispatch(mstNumbers(data));
      setMarks(res.payload.marks);
      setIsLoading(false);
    }

    const handleFetchMarks = () => {
      if (selectedSemester && selectedExamType) {
        fetchData();
      }
    };

    // useEffect(()=>{
    //   if (selectedSemester && selectedExamType) {
    //     fetchData();
    //   }
    // },[dispatch, selectedSemester, selectedExamType]);
  
  return (
    <>
    <div style={{boxShadow: '0px 0px 10px 0.1px grey', padding:'15px', borderRadius:'17px'}}>
      <h4>MST marks</h4>
      <Select
        placeholder="Select Semester"
        style={{ width: 200, marginBottom: '1rem', marginRight: '15px' }}
        onChange={(value) => setSelectedSemester(value)}
        value={selectedSemester}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <Option key={sem} value={sem}>
            Semester {sem}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Select Exam Type"
        style={{ width: 200, marginBottom: '1rem', marginRight: '15px' }}
        onChange={(value) => setSelectedExamType(value)}
        value={selectedExamType}
      >
        {['MST1', 'MST2', 'Final'].map((type) => (
          <Option key={type} value={type}>
            {type}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handleFetchMarks} disabled={!selectedSemester || !selectedExamType || isLoading}>{isLoading ? <Spin size="small" /> : 'Fetch Marks'}</Button>
      {
        marks ?  (<NumberTable marks={marks} /> ):  null
      } 
    </div>
    </>
  );
};

export default Mst;
