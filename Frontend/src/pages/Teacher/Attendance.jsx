import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchStudentsByBatch } from '../../features/teacher/teacherSlice';
import { Select, Table, Spin, Alert, DatePicker, Button, message } from 'antd';
import axios from 'axios';
const { Option } = Select;

const getToken = () => {
    return sessionStorage.getItem("refreshToken");
};

function Attendance() {
    const dispatch = useDispatch();
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [batch, setBatch] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]); 

    async function batches() {
        const res = sessionStorage.getItem('batches')
                const parsedBatch = JSON.parse(res);
                setBatch(parsedBatch);
    }

    useEffect(() => {
        batches();
    }, []);

    useEffect(() => {
        if (selectedBatch && selectedDate) {
            setIsLoading(true);
            setError(null); 
            dispatch(fetchStudentsByBatch(selectedBatch))
                .then((response) => {
                    setStudents(response.payload);
                    setAttendanceData(response.payload.students.map(student => ({
                        studentId: student._id,
                        status: '' 
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
    }, [selectedBatch, selectedDate, dispatch]);

    const handleBatchSelect = (value) => {
        setSelectedBatch(value);
        setStudents([])
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleSubmitAttendance = async () => {
        try {
            setIsLoading(true);
            await uploadAttendanceApi(selectedDate, attendanceData);
            setAttendanceData([]); 
            setSelectedBatch(null);
            message.success('Attendance submitted successfully');
        } catch (error) {
            message.error("Error at Uploading data")
        } finally {
            setIsLoading(false);
        }
    };

    const uploadAttendanceApi = async (selectedDate, attendanceData) => {
        const url = 'http://localhost:8080/api/teacher/upload-attendance';
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const requestData = {
            year: selectedDate.$y,
            month: selectedDate.$M + 1,
            day: selectedDate.$D,
            attendance: attendanceData,
        };

        const response = await axios.post(url, requestData, { headers });
        return response.data;
    };

    const handleAttendanceChange = (value, studentId) => {
        setAttendanceData(prevAttendanceData => {
            const updatedAttendanceData = prevAttendanceData.map(item => {
                if (item.studentId === studentId) {
                    return { ...item, status: value };
                }
                return item;
            });
            return updatedAttendanceData;
        });
    };
    
    const columns = [
        {
            title: 'Enrollment',
            dataIndex: 'enrollment',
            key: 'enrollment',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Attendance',
            dataIndex: '_id',    
            key: 'attendance',
            render: (studentId) => {
                return (
                    <Select
                        style={{ width: 120 }}
                        defaultValue={attendanceData.find(item => item.studentId === studentId)?.status}
                        onChange={(value) => handleAttendanceChange(value, studentId)}
                    >
                        <Option key={`${studentId}_Present`} value="Present">
                            Present
                        </Option>
                        <Option key={`${studentId}_Absent`} value="Absent">
                            Absent
                        </Option>
                    </Select>
                );
            }
        }
    ];


    return (
        <div>
            <h2>Attendance</h2>
            <h3>All Batches</h3>
            <Select
                placeholder="Select Batch"
                style={{ width: 200, marginBottom: '1rem', marginRight: "15px" }}
                onChange={handleBatchSelect}
                value={selectedBatch}
            >
                {batch?.map(b => (
                    <Option key={b} value={b}>
                        {b}
                    </Option>
                ))}
            </Select>
            <DatePicker
                style={{ marginBottom: '1rem', marginRight: "15px" }}
                onChange={handleDateChange}
                disabled={!selectedBatch}
            />
            <Button type="primary" onClick={handleSubmitAttendance} disabled={!selectedBatch || !selectedDate }>
                {isLoading ? <Spin /> : 'Submit Attendance'}
            </Button>
            {error && <Alert message={error} type="error" />}
            {selectedBatch && selectedDate && (
                <div>
                    <h3>Students of Batch: {selectedBatch}</h3>
                    <Table dataSource={students.students} columns={columns} loading={isLoading} rowKey="_id" pagination={false} />
                </div>
            )}
        </div>
    );
}

export default Attendance;
