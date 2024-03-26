import { useState } from 'react';
import { Image, message } from 'antd';
import { getTimetable } from '../features/student/studentSlice';
import { useDispatch } from 'react-redux';
import '../utils/additionalCss.css';

const Timetable = () => {
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState('');
  const storedUserData = JSON.parse(sessionStorage.getItem('userData')) || {};
  const department = storedUserData.department;
  const sem = storedUserData.sem;

  const data = { department, sem };

  const getTimeTable = async () => {
    try {
      const queryParams = new URLSearchParams(data).toString();
      const res = await dispatch(getTimetable(queryParams));
      const img = await res.payload.timeTableURL;
      setImgUrl(img);
      message.success('Time table fetched');
    } catch (error) {
      console.error('Error fetching timetable:', error);
      message.error('Failed to fetch timetable');
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 10px 0.1px grey' }}>
        <h3>Time-Table</h3>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 40 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            Department : <h6>{department}</h6>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            Semester: <h6>{sem}</h6>
          </div>
        </div>
        <button onClick={getTimeTable}>Get Time-Table</button>
        <div>
          {imgUrl && (
            <Image
              width={500}
              src={imgUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
