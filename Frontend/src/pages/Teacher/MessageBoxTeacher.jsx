/* eslint-disable react/prop-types */
import { Button, message } from 'antd';
import "./teacherCss/teacherCss.css";

const MessageBoxTeacher = ({ mess, handleDeleteMessage }) => {
  const { content, createdAt, _id } = mess;

  // Format date
  const dateString = createdAt;
  const dateObject = new Date(dateString);
  const currentTime = new Date();
  const elapsedMilliseconds = currentTime - dateObject;
  const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  let formattedDate = '';
  if (elapsedHours > 0) {
    formattedDate = `${elapsedHours}h`;
    if (elapsedMinutes > 0) {
      formattedDate += ` ${elapsedMinutes}m`;
    }
  } else {
    formattedDate = `${elapsedMinutes}m`;
  }

  const handleDelete = async () => {
    try {
      await handleDeleteMessage(_id);
    } catch (error) {
      message.error('Failed to delete message. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="task">
        <div className="tags">
          <span className="tag">Messages</span>
        </div>
        <p>{content}</p>
        <div className="stats">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g>
                <g id="SVGRepo_iconCarrier">
                  <path strokeLinecap="round" strokeWidth="2" d="M12 8V12L15 15"></path>
                  <circle strokeWidth="2" r="9" cy="12" cx="12"></circle>
                </g>
              </svg>
              {formattedDate}
            </div>
            <Button style={{ fontSize: '12px' }} type="primary" danger onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBoxTeacher;
