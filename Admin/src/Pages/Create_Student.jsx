import { Form, Input, Button, Select,message } from 'antd';
import { MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createStudent } from '../features/student/studentSlice';

const { Option } = Select;

const Create_Student = () => {
  const [form] = Form.useForm();

    const dispatch = useDispatch();

    const onFinish = (values) => {
        dispatch(createStudent(values))
        .unwrap()
          .then(() => {
            message.success('Student added successfully!');
            form.setFieldsValue({
                email: '',
                enrollment: '',
              });
          })
          .catch((error) => {
            if (error.response) {
                message.error(error.response);
            }
               else {
              message.error('Student already Registered');
            }
          });
      };

    return (
        <Form
        form={form}
            name="create-student"
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please enter the student email!' },
                    { type: 'email', message: 'Please enter a valid email address!' }
                ]}
            >
                <Input prefix={<MailOutlined />} placeholder="Enter email" />
            </Form.Item>

            <Form.Item
                label="Enrollment"
                name="enrollment"
                rules={[{ required: true, message: 'Please enter the enrollment number!' }]}
            >
                <Input prefix={<IdcardOutlined />} placeholder="Enter enrollment number" />
            </Form.Item>

            <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: 'Please select the department!' }]}
            >
                <Select placeholder="Select department">
                    <Option value="CSE">CSE</Option>
                    <Option value="ECE">ECE</Option>
                    <Option value="MECH">MECH</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Batch"
                name="batch"
                rules={[{ required: true, message: 'Please enter the batch number!' }]}
            >
                <Input placeholder="Enter batch number" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Create_Student;
