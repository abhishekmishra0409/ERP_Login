import {
  Button, 
  Form,
  Input,
  DatePicker,
  Select,
} from 'antd';
import { RxUpdate } from "react-icons/rx";
const { Option } = Select;
import { updateName } from '../../features/student/studentSlice';
import { useDispatch } from 'react-redux';
import { studentProfile } from '../../features/student/studentSlice';
import { message } from 'antd';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const Update = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = async(values) => {
   try{
     console.log('Received values of form: ', values);
    const res = await dispatch(updateName(values));
    
// console.log(res)
    // console.log(res.payload.status);
    if(res.payload.status == 200){
       sessionStorage.removeItem("userData");
     
       dispatch(studentProfile()).then((get) => {
        console.log(get.payload);
        let t = get.payload.success;
        if (t === true) {
          message.success("Details updated successfully");
          form.resetFields();
          // alert("Details updated succesfully");
        }
      })
    }}catch(error){
      message.error("Try Again later")
    }
  };
  
  
  return (
    <div style={{   padding: '20px 40px', borderRadius: '5px'}}>

    <h4>Update Details</h4><p style={{color:'lightgrey'}}>You can enter any field which you want to update</p>
    <Form
     style={{maxWidth: 600, alignItems:'flex-start', justifyContent:'flex-start', paddingTop:'40px'}}
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      // initialValues={{
      //   residence: ['Indore', 'hangzhou', 'xihu'],
      //   prefix: '+91',
      // }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Name"
        >
        <Input placeholder='Enter your Name'/>
      </Form.Item>
     
      <Form.Item
        name="sem"
        label="Semester"
        >
      
        <Input  placeholder='(i.e) 1,2'   maxLength={1}/>
      </Form.Item>


      <Form.Item
        name="address"
        label="Local Address"
      >
        <Input  placeholder='xyz, abcd colony'/>
      </Form.Item>
      <Form.Item
        name="city"
        label="City"
      >
        <Input placeholder='(i.e)Indore, New-Delhi'/>
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"  >
        <Input
        maxLength={10}
        minLength={10}
         placeholder='1362459778'
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item label="D.O.B" name="dob" >
        <DatePicker />
      </Form.Item>
      

      <Form.Item
        name="gender"
        label="Gender">
        <Select placeholder="select your gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>


      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit"  style={{width:120, display:'flex',justifyContent:"space-around"}}>
            Update
            <RxUpdate className="fs-5"/>
        </Button>
      </Form.Item>
    </Form>
    </div>

  );
};
export default Update;