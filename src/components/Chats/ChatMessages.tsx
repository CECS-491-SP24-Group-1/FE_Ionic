import React, { useEffect, useRef } from 'react';

interface ChatMessagesProps {
  messages: { from: string; text: string; time: string }[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  // Reference to the messages container
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Reference to scroll to the end of the messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages container when the messages change,
  // but only if the content height exceeds the container height.
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;
      const shouldScroll =
        container.scrollHeight > container.clientHeight;

      if (shouldScroll) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  return (
    <div ref={messagesContainerRef} className="chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-bubble ${msg.from === 'Me' ? 'from-me' : 'from-them'}`}
        >
          <p>{msg.text}</p>
          <span>{msg.time}</span>
        </div>
      ))}
      {/* Dummy div to ensure scroll to bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
