import { useState } from 'react';
import { Image, message, Button, Spin, Select } from 'antd';
import { getTimetable } from '../../features/student/studentSlice';
import { useDispatch } from 'react-redux';
import '../../utils/additionalCss.css';

const { Option } = Select;

const Timetable = () => {
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [timetableType, setTimetableType] = useState('');
  const storedUserData = JSON.parse(sessionStorage.getItem('userData')) || {};
  const batch = storedUserData.batch;

  const getTimeTable = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ batch, timetableType }).toString();
      const res = await dispatch(getTimetable(queryParams));
      const timetableData = res.payload;
      
      if (timetableData) {
        setImgUrl(timetableData.timeTableURL);
        message.success('Time table fetched');
      } else {
        setImgUrl(null); 
        message.error('No timetable available for the selected batch and timetable type');
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      message.error('Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleTimetableTypeSelect = (value) => {
    setTimetableType(value);
  };

  const isButtonDisabled = !timetableType;

  return (
    <div>
      <div style={{ padding: '10px', borderRadius: '5px' }}>
        <h3>Time-Table</h3>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 40 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            Batch : <h6>{batch}</h6>
          </div>
          <Select
            // placeholder="Select Timetable Type"
            style={{ width: 200 }}
            onChange={handleTimetableTypeSelect}
            value={timetableType}
          >
          <Option value="">Select Timetable Type</Option>
            <Option value="MST">MST Time Table</Option>
            <Option value="Class">Class Time Table</Option>
          </Select>
        </div>
        <Button type="primary" onClick={getTimeTable} loading={loading} disabled={isButtonDisabled}>
          Get Time-Table
        </Button>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {loading ? (
            <Spin size="large" />
          ) : (
            imgUrl !== null ? ( 
              imgUrl ? (
                <Image
                  width={500}
                  src={imgUrl}
                  style={{ margin: '0 auto' }}
                />
              ) : (
                <p>No timetable available for the selected batch and timetable type</p>
              )
            ) : (
              <p>Select the timetable type</p> 
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
