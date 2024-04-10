import { message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMessage } from '../../features/student/studentSlice';
import MessageContent from './MessageContent';
import { Empty } from 'antd';

const Message = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();

    async function fetchMessages() {
        try {
            setLoading(true);
            const response = await dispatch(getMessage());
            // console.log(response);
            setMessages(response.payload.messages);
        } catch (error) {
            message.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Spin size="large" />
                </div>
            ) : (
                <>
                    {messages.length >= 1 ? (
                        messages.slice().reverse().map((mes, idx) => (
                            <MessageContent mes={mes} key={idx} />
                        ))
                    ) : (
                        <Empty description={"There are no messages to show"} />
                    )}
                </>
            )}
        </div>
    );
}

export default Message;
