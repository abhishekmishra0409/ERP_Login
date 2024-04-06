/* eslint-disable react/prop-types */
import { Table } from 'antd';

const NumberTable = ({marks}) => 
{
  const columns = [
    
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Number',
      dataIndex: 'marksObtained',
      key: 'age',
    }
  ];
 
  const data = marks.map((mark, index) => ({
    key: index.toString(),
    subject: mark.subject,
    marksObtained: mark.marksObtained,
  }));


  return (
  <>
    <Table columns={columns} dataSource={data} pagination={false} bordered />
  </>
  )
}
export default NumberTable;