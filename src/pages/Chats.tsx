import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle } from '@ionic/react';
import ChatList from '../components/Chats/ChatList/ChatList';
import ChatMessages from '../components/Chats/ChatMessages';
import ChatInput from '../components/Chats/ChatInput';
import ChatHeader from '../components/Chats/ChatHeader';
import ChatMenu from '../components/Chats/Menu/ChatMenu';
import { chatMessagesData } from '../data/ChatMessagesData';
import WebSocket, { WebSocketServer } from 'ws';

import './Chats.scss';

const Chats: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  // Function to handle chat selection
  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  // Function to handle sending messages
  const handleSendMessage = (message: string) => {
    if (selectedChatId !== null) {
      chatMessagesData[selectedChatId].push({
        from: 'Me',
        text: message,
        time: 'Now',
      });
    }
  };

  useEffect(() => {
    // Open a WebSocket connection to the server
    const newSocket = new WebSocket('ws://localhost:8080');

    // Set the socket to state so that it can be accessed later
    setSocket(newSocket);

    // Handle incoming messages
    newSocket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    // Clean up the socket when the component is unmounted
    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && input.trim() !== '') {
      socket.send(input);
      setInput(''); // Clear the input field
    }
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Chats</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent id="main-content">
        <div className="chat-container">
          {/* Chat list (left sidebar) */}
          <div className="chat-list">
            <ChatList onChatSelect={handleChatSelect} />
          </div>

          {/* Chat view (right side) */}
          <div className="chat-view">
            {selectedChatId !== null ? (
              <>
                {/* Pass only the selectedChatId to ChatHeader */}
                <ChatHeader selectedChatId={selectedChatId} />

                {/* Messages */}
                <ChatMessages messages={chatMessagesData[selectedChatId]} />

                {/* Input field for sending messages */}
                <ChatInput onSendMessage={handleSendMessage} />
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Please select a chat to view messages.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Menu (right side menu) */}
        <ChatMenu selectedChatId={selectedChatId} />
      </IonContent>
    </IonPage>
  );
};

export default Chats;
