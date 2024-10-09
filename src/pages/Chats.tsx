import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle } from '@ionic/react';
import ChatList from '../components/Chats/ChatList/ChatList';
import ChatMessages from '../components/Chats/ChatMessages';
import ChatInput from '../components/Chats/ChatInput';
import ChatHeader from '../components/Chats/ChatHeader';
import ChatMenu from '../components/Chats/Menu/ChatMenu';
import { chatMessagesData } from '../data/ChatMessagesData';

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
        to: 'Mariana',
        from: 'Me',
        text: message,
        time: 'Now',
      });
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
