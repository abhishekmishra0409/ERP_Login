import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getYourMsg, sendYourMsg, deleteMsg } from '../../features/teacher/teacherSlice';
import MessageBoxTeacher from './MessageBoxTeacher';
import { Empty, message, Spin } from 'antd';
import { IoSend } from 'react-icons/io5';

function Teacher() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [chars, setChars] = useState(0);
  const [sendMessage, setMessage] = useState({
    content: '',
    recipients: ''
  });
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    fetchBatches();
    fetchMsg();
  }, []);

  async function fetchBatches() {
    try {
      setLoading(true);
      const res = await JSON.parse(sessionStorage.getItem('batches'));
      setBatches(res || []);
    } catch (error) {
      message.error("Can't show options, please try again");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMsg() {
    try {
      setLoading(true);
      const responce = await dispatch(getYourMsg());
      if (responce.error) {
        message.error("There is an error in fetching your messages");
      }
      setMsgs(responce.payload.messages || []);
    } catch (error) {
      message.error("Can't show messages");
    } finally {
      setLoading(false);
    }
  }

  const handleChanges = (e) => {
    const { name, value } = e.target;
    if (name === 'content') {
      setChars(value.length);
    }

    setMessage(prevstate => ({
      ...prevstate,
      [name]: value
    }));
  };

  const submitHandler = async () => {
    if (!sendMessage.content.trim()) {
      message.error("Message content cannot be empty");
      return;
    }
    try {
      setLoading(true);
      await dispatch(sendYourMsg(sendMessage));
      message.success("Message sent successfully");
      setMessage({
        content: '',
        recipients: ''
      });
      setChars(0);
      fetchMsg();
    } catch (error) {
      message.error("Failed to send message. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setLoading(true);
      const response = await dispatch(deleteMsg(messageId));
      if (response.error) {
        message.error('Failed to delete message. Please try again later.');
      } else {
        message.success('Message deleted successfully');
        fetchMsg();
      }
    } catch (error) {
      message.error('Failed to delete message. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="tweet-textarea">
        <textarea
          className="tweet-input"
          placeholder="Type your message.."
          rows="4"
          value={sendMessage.content}
          name="content"
          onChange={handleChanges}
          maxLength={300}
        ></textarea>

        <div className="tweet-footer">
          <div className="char-count">{chars}/300</div>

          <div className="innerButton">
            <select
              name="recipients"
              value={sendMessage.recipients}
              onChange={handleChanges}
              className="options"
            >
              <option value="">All</option>
              {batches.length >= 1 ? (
                batches.map((batch, idx) => (
                  <option key={idx} value={batch}>{batch}</option>
                ))
              ) : (
                <option> Options not found</option>
              )}
            </select>

            <button className="tweet-button" onClick={submitHandler}>
              Send Message <IoSend />
            </button>
          </div>
        </div>
      </div>

      <h4>Messages sent by you</h4>
      <Spin spinning={loading}>
        {
          msgs.length > 0 ? (
            msgs.slice().reverse().map((mess, idx) => (
              <MessageBoxTeacher
                key={idx}
                mess={mess}
                handleDeleteMessage={handleDeleteMessage}
              />
            ))
          ) : (
            <Empty description={"No message found from your side"} />
          )
        }
      </Spin>
    </div>
  );
}

export default Teacher;
