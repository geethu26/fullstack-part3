
const Message = ({ message, type }) => {
    if (!message) {
      return null;
    }
  
    // Determine the CSS class based on the message type
    const messageTypeClass =
      type === 'success' ? 'message-success' : type === 'error' ? 'message-error' : '';
  
    return (
      <div className={`message ${messageTypeClass}`}>
        {message}
      </div>
    );
  };

export default Message
  