import React from 'react';
import { menuController } from '@ionic/core';
import { IonItem, IonAvatar, IonLabel, IonButton, IonIcon, IonMenuToggle } from '@ionic/react';
import { call, videocam, informationCircle } from 'ionicons/icons';
import { chatList } from '../../data/ChatListData'; // Import chatList here

interface ChatHeaderProps {
  selectedChatId: number; // Pass the chatId instead of avatarUrl and name
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChatId }) => {
  // Find the selected chat based on selectedChatId
  const selectedChat = chatList.find(chat => chat.id === selectedChatId);

  // Ensure the selected chat exists
  if (!selectedChat) {
    return null; // Handle the case where the chat is not found (optional)
  }

  const toggleMenu = async () => {
    await menuController.toggle();
  };

  return (
    <IonItem lines="none" className="user-chat-bar">
      <IonAvatar slot="start">
        <img src={selectedChat.avatar} alt={selectedChat.name} />
      </IonAvatar>
      <IonLabel>
        <h2>{selectedChat.name}</h2>
        <p>Click here for contact information</p>
      </IonLabel>
      <div className="chat-header-icons">
        <IonButton fill="clear">
          <IonIcon icon={call} />
        </IonButton>
        <IonButton fill="clear">
          <IonIcon icon={videocam} />
        </IonButton>
        <IonMenuToggle>
          <IonButton fill="clear" onClick={toggleMenu}>
            <IonIcon icon={informationCircle} />
          </IonButton>
        </IonMenuToggle>
      </div>
    </IonItem>
  );
};

export default ChatHeader;
