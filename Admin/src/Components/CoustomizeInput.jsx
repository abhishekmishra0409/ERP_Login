import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const CustomInput = (props) => {
  const { type, label, i_id, i_class ,width } = props;
  return (
    <>
      <label htmlFor={i_id}>{label}</label>
      <Form.Item 
        name={i_id} 
        className={`${i_class}`}
        rules={[
          {
            required: true,
            message: `Please input your ${label}!`,
          },
        ]}
      >
        <Input type={type} style={{ width: `${width}%` }} />

      </Form.Item>
    </>
  );
};

CustomInput.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  i_id: PropTypes.string.isRequired,
  i_class: PropTypes.string,
  width: PropTypes.string,

};

export default CustomInput;
