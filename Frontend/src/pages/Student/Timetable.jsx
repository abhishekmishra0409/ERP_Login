import { useState } from 'react';
import { Image, message, Button, Spin } from 'antd';
import { getTimetable } from '../../features/student/studentSlice';
import { useDispatch } from 'react-redux';
import '../../utils/additionalCss.css';

const Timetable = () => {
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const storedUserData = JSON.parse(sessionStorage.getItem('userData')) || {};
  const batch = storedUserData.batch;

  const data = { batch };

  const getTimeTable = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(data).toString();
      const res = await dispatch(getTimetable(queryParams));
      const img = await res.payload.timeTableURL;
      setImgUrl(img);
      message.success('Time table fetched');
    } catch (error) {
      console.error('Error fetching timetable:', error);
      message.error('Failed to fetch timetable');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <div style={{  padding: '10px', borderRadius: '5px'}}>
        <h3>Time-Table</h3>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 40 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            Batch : <h6>{batch}</h6>
          </div>
        </div>
        <Button type="primary" onClick={getTimeTable} loading={loading}>
          Get Time-Table
        </Button>
        <div style={{ marginTop: '20px', textAlign: 'center' }}> 
          {loading ? ( 
            <Spin size="large" />
          ) : (
            imgUrl && (
              <Image
                width={500}
                src={imgUrl}
                style={{ margin: '0 auto' }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
