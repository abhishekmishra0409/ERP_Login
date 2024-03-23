import { Form, Input, Select, Button, message } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTeacher } from '../features/teacher/teacherSlice'; 

const { Option } = Select;

const Create_Teacher = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch(); // Get the dispatch function from Redux

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Dispatch the createTeacher action with the form values
      await dispatch(createTeacher(values));
      message.success('Teacher created successfully!');
      form.resetFields();
    } catch (error) {
      console.error('Error creating teacher:', error);
      message.error('Failed to create teacher.');
    }
    setLoading(false);
  };
  return (
    <Form
      form={form} 
      name="create-role"
      onFinish={onFinish}
      initialValues={{ role: 'teacher' }} 
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the name!' }]}
      >
        <Input placeholder="Enter name" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: 'Please enter the email!' }]}
      >
        <Input placeholder="Enter email" type="email" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please enter the password!' }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>
      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select the role!' }]}
      >
        <Select placeholder="Select role">
          <Option value="principal">Principal</Option>
          <Option value="HOD">HOD</Option>
          <Option value="teacher">Teacher</Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Create_Teacher;
