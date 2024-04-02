import { Badge, Calendar } from 'antd';
import '../../utils/additionalCss.css'


const getListData = (value, attendanceData) => {
    let listData = [];
    
    // const dateString = `${value.year()}-${value.month() + 1}-${value.date()}`;
    const attendanceEntry = attendanceData.attendance.find(entry =>
      entry.year === value.year() && entry.month === value.month() + 1 && entry.day === value.date());

 
    if (attendanceEntry && attendanceEntry.status === 'Present') {
      listData.push({
        type: 'success',
        content: 'Present',
      });
    } 

    return listData;
  };

  const getMonthData = () => {
   
  };  

const AttendanceCalendor = ({attendanceData}) => {
    
  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    const listData = getListData(value, attendanceData);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  return <Calendar cellRender={cellRender} className="small-calendar"/>;
};
export default AttendanceCalendor;