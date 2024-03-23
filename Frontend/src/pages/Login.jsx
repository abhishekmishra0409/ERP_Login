import { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Radio } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { studentLogin, teacherLogin } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userType, setUserType] = useState('student');
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const onFinish = async (values) => {
    try {
      if (userType === 'student') {
        await dispatch(studentLogin(values)).unwrap();
        navigateTo('/student');
      } else if (userType === 'teacher') {
        await dispatch(teacherLogin(values)).unwrap();
        navigateTo('/teacher');
      }
      message.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Failed to login.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="py-5" style={{ background: '#FFFFF0', minHeight: '100vh' }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div
        className="my-5 w-25 rounded-3 mx-auto p-4 border"
        style={{ background: 'white' }}
      >
        <h3 className="text-center title">Login</h3>
        <p className="text-center">Login to your account to continue.</p>
        <div className="error text-center"></div>
        <Form
          action="/dashboard"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
            <label >Email</label>
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} style={{ width: '150%' }} />
          </Form.Item>
          <label >Password</label>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} style={{ width: '150%' }} />
          </Form.Item>
          <Form.Item label="User Type">
            <Radio.Group defaultValue={userType} onChange={(e) => setUserType(e.target.value)}>
              <Radio.Button value="student">Student</Radio.Button>
              <Radio.Button value="teacher">Teacher</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 0,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '150%' }}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
