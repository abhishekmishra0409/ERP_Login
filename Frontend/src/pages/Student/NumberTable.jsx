import React from 'react';
import { Space, Table, Tag } from 'antd';
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
  // const data = [

  //   {
  //     key: '1',
  //     name: `${marks.subject}`,
  //     age: 32,
  //     address: 'New York No. 1 Lake Park'
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     age: 42,
  //     address: 'London No. 1 Lake Park',
  //     tags: ['loser'],
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     age: 32,
  //     address: 'Sydney No. 1 Lake Park',
  //     tags: ['cool', 'teacher'],
  //   },
  // ];
  const data = marks.map((mark, index) => ({
    key: index.toString(),
    subject: mark.subject,
    marksObtained: mark.marksObtained,
  }));

  
  console.log(marks)
  return (
  <>
    <Table columns={columns} dataSource={data} />;
  </>
  );
}
export default NumberTable;