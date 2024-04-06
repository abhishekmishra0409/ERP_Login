import { useState, useEffect } from 'react';
import { Select, Table, Spin, Alert, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchStudentsByBatch , postMarks } from '../../features/teacher/teacherSlice';

const { Option } = Select;

function Mst() {
  const dispatch = useDispatch();
  const [batch, setBatch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customColumns, setCustomColumns] = useState([]);
  const [columnName, setColumnName] = useState('');
  const [marksData, setMarksData] = useState([]); 

  useEffect(() => {
    fetchBatchData();
  }, []);

  const fetchBatchData = async () => {
    try {
      const res = sessionStorage.getItem('batches');
      const parsedBatch = JSON.parse(res);
      setBatch(parsedBatch);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  useEffect(() => {
    if (selectedBatch && selectedSemester && selectedExamType) {
      setIsLoading(true);
      setError(null);
      dispatch(fetchStudentsByBatch(selectedBatch))
        .then((response) => {
          setStudents(response.payload);
          setMarksData(response.payload.students.map(student => ({
            studentId: student._id,
            marks: customColumns.reduce((acc, column) => {
              acc[column.dataIndex] = '';
              return acc;
            }, {})
          })));
        })
        .catch((error) => {
          console.error('Error fetching students:', error);
          setError('Error fetching students. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedBatch, selectedSemester, selectedExamType, customColumns, dispatch]);

  const handleBatchSelect = (value) => {
    setSelectedBatch(value);
  };

  const handleSemesterSelect = (value) => {
    setSelectedSemester(value);
  };

  const handleExamTypeSelect = (value) => {
    setSelectedExamType(value);
  };

  const handleAddColumn = () => {
    if (columnName.trim() !== '') {
      const newCustomColumns = [...customColumns, { title: columnName, dataIndex: columnName, key: columnName, editable: true }];
      setCustomColumns(newCustomColumns);
      setColumnName('');
      const updatedMarksData = marksData.map(mark => {
        mark.marks[columnName.toLowerCase()] = '';
        return mark;
      });
      setMarksData(updatedMarksData);
    }
  };

  const handleInputChange = (value, studentId, columnName) => {
    const updatedMarksData = marksData.map(mark => {
      if (mark.studentId === studentId) {
        mark.marks[columnName] = value;
      }
      return mark;
    });
    setMarksData(updatedMarksData);
  };

  const handleSubmitMarks = () => {
    setIsLoading(true); 
    
    const isAnyFieldBlank = marksData.some(({ marks }) =>
      Object.values(marks).some((value) => value === '')
    );
  
    if (isAnyFieldBlank) {
      setIsLoading(false); 
      message.error('Please fill in all marks obtained fields');
      return; 
    }
  
    const formattedData = {
      semester: selectedSemester,
      exam: selectedExamType,
      students: marksData.map(({ studentId, marks }) => ({
        studentId,
        marks: Object.entries(marks).map(([subject, marksObtained]) => ({
          subject,
          marksObtained,
        })),
      })),
    };
  
    // console.log('Formatted Data:', formattedData);
    dispatch(postMarks(formattedData))
      .then(() => {
        setIsLoading(false);
        message.success('Marks data submitted successfully');
        setSelectedBatch(null);
        setSelectedExamType(null);
        setSelectedSemester(null);
        setMarksData([]);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error submitting marks data:', error);
        message.error('Failed to submit marks data. Please try again.');
      });
  };
  
  

  const columns = [
    { title: 'Enrollment', dataIndex: 'enrollment', key: 'enrollment' },
    ...customColumns.map(column => ({
      ...column,
      render: (text, record) => (
        <Input
          value={marksData.find(mark => mark.studentId === record._id)?.marks[column.dataIndex]}
          onChange={(e) => handleInputChange(e.target.value, record._id, column.dataIndex)}
          style={{ width: 150 }}
          required
        />
      )
    })),
  ];

  return (
    <div>
      <h2>MST</h2>
      <Select
        placeholder="Select Batch"
        style={{ width: 200, marginBottom: '1rem', marginRight: '15px' }}
        onChange={handleBatchSelect}
        value={selectedBatch}
      >
        {batch &&
          batch.map((b) => (
            <Option key={b} value={b}>
              {b}
            </Option>
          ))}
      </Select>
      <Select
        placeholder="Select Semester"
        style={{ width: 200, marginBottom: '1rem', marginRight: '15px' }}
        onChange={handleSemesterSelect}
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
        onChange={handleExamTypeSelect}
        value={selectedExamType}
      >
        {['MST1', 'MST2', 'Final'].map((type) => (
          <Option key={type} value={type}>
            {type}
          </Option>
        ))}
      </Select>
      
      
      
      {isLoading && <Spin />}
      {error && <Alert message={error} type="error" />}
      {selectedBatch && selectedExamType && selectedSemester && (
        <>
        <Input
        placeholder="Enter Subject Name"  
        style={{ width: 200, marginBottom: '1rem', marginRight: '15px' }}
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
      />
        <Button type="primary" onClick={handleAddColumn}>Add Subject</Button>
         <Table
         dataSource={students.students  }
         columns={columns}
         rowKey="_id"
         pagination={false}
         bordered
       />
       <Button type="primary" onClick={handleSubmitMarks} disabled={isLoading} style={{marginTop:"20px"}} >Submit Marks</Button>
       </>
        )}
    </div>
  );
}

export default Mst;
