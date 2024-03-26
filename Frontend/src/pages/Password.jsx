import  { useState } from 'react';
import { Input, Button, message } from 'antd';
import { updatePassword } from '../features/student/studentSlice';
import { useDispatch } from 'react-redux';

const PasswordUpdatePage = () => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (password.length < 8) {
      message.error('Password must be at least 8 characters long');
      return;
    }
  
    try {
      const res = await dispatch(updatePassword({ password }));
      if (res) {
        message.success('Password updated successfully');
        setPassword('');
      } else {
        message.error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password: ', error);
      message.error('Failed to update password');
    }
  };
  

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      <h2>Update Password</h2>
      <Input.Password
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={handleChange}
        style={{ marginBottom: '20px' }}
      />
      <Button type="primary" onClick={handleSubmit}>
        Update Password
      </Button>
    </div>
  );
};

export default PasswordUpdatePage;
