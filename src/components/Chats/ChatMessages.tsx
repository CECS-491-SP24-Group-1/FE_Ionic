import React from 'react';

interface ChatMessagesProps {
  messages: { from: string; text: string; time: string }[];
}

//TODO: use ref to start at the bottom of chat

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-bubble ${msg.from === 'Me' ? 'from-me' : 'from-them'}`}
        >
          <p>{msg.text}</p>
          <span>{msg.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
