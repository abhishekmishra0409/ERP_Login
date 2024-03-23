import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStudent } from '../features/student/studentSlice';
import axios from 'axios';


const UpdateStudentForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const dispatch = useDispatch();



  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/student/${values.enrollment}`);
      if (response.data.success) {
        setStudentData(response.data.student);
        form.setFieldsValue(response.data.student); 
      } else {
        message.error('Student not found.');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      message.error('Failed to fetch student data.');
    }
    setLoading(false);
  };

  const onUpdate = async (updatedData) => {
    setLoading(true);
    try {
      await dispatch(updateStudent({ studentId: studentData._id, updatedData }));
      message.success('Student data updated successfully.');
      form.resetFields(); 
      setStudentData(null); 
    } catch (error) {
      console.error('Error updating student:', error);
      message.error('Failed to update student data.');
    }
    setLoading(false);
  };

  return (
    <>
      <Form
        form={form}
        name="update-student"
        onFinish={onFinish}
        layout="vertical"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          name="enrollment"
          label="Enter Student Enrollment Number"
          rules={[{ required: true, message: 'Please enter enrollment number' }]}
        >
          <Input placeholder="Enrollment Number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Fetch Student Data
          </Button>
        </Form.Item>
      </Form>
      {studentData && (
        <Form
          form={form}
          name="update-student-details"
          onFinish={onUpdate}
          layout="vertical"
          initialValues={studentData} 
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter email' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please enter department' }]}
          >
            <Input placeholder="Department" />
          </Form.Item>
          <Form.Item
            name="batch"
            label="Batch"
            rules={[{ required: true, message: 'Please enter batch' }]}
          >
            <Input placeholder="Batch" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Student
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default UpdateStudentForm;
