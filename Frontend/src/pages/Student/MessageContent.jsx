/* eslint-disable react/prop-types */
import "./MessageContent.css";

const MessageContent = ({ mes }) => {
    const { content, createdAt, sender } = mes;

    const currentTime = new Date();
    const messageTime = new Date(createdAt);
    const elapsedMilliseconds = currentTime - messageTime;
    const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

   
    let elapsedTimeString = '';
    if (elapsedHours > 0) {
        elapsedTimeString = `${elapsedHours}h`;
        if (elapsedMinutes > 0) {
            elapsedTimeString += ` ${elapsedMinutes}m`;
        }
    } else {
        elapsedTimeString = `${elapsedMinutes}m`;
    }
    return (
        <div>
            <div className="card">
                <div className="header">
                    <span className="icon">
                        <svg fillRule="evenodd" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fillRule="evenodd"></path>
                        </svg>
                    </span>
                    <h6 className="alert">New message!</h6>
                </div>

                <p className="message">
                    {content}
                </p>

                <div className="actions">
                    <div>
                        <p style={{ fontSize: '13px' }}> {sender.name}</p>
                        <p style={{ fontSize: '10px' }}>{sender.role.toUpperCase()}</p>
                    </div>

                    <div style={{ color: 'grey', fontSize: '12px' }}>
                        {elapsedTimeString} ago
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageContent;
