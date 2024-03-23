import { Button, Checkbox, Form, Input,message } from "antd";
import { login } from "../features/auth/authSlice"; 
import { useDispatch } from "react-redux"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch(); 

  const onFinish = (values) => {
    
    dispatch(login(values)) 
      .unwrap() 
      .then(() => {
        message.success('Login successfully.');
        navigateTo("/admin");
      })
      .catch((error) => {
        console.error("Login error:", error);
        message.error('Failed to Login.');
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="py-5" style={{ background: "#FFFFF0", minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div
        className="my-5 w-25 rounded-3 mx-auto p-4 border"
        style={{ background: "white" }}
      >
        <h3 className="text-center title">Login</h3>
        <p className="text-center">Login to your account to continue.</p>
        <div className="error text-center"></div>
        <Form
          action="/admin"
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
          <label htmlFor="email">Email</label>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input id="email" style={{width:"150%"}}/>
          </Form.Item>
          <label htmlFor="password">Password</label>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password id="password" style={{width:"150%"}}/>
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
            <Button type="primary" htmlType="submit" style={{ width: "150%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
