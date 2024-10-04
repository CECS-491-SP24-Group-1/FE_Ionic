import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/react';
import { chatList } from '../../../data/ChatListData';

interface ChatMenuProps {
  selectedChatId: number | null;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ selectedChatId }) => {
  // If no chat is selected, return null
  if (selectedChatId === null) return null;

  // Find the selected chat details from the chatList
  const selectedChat = chatList.find(chat => chat.id === selectedChatId);

  // If the selected chat is not found, return null
  if (!selectedChat) return null;

  return (
    <IonMenu side="end" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chat Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonAvatar slot="start">
              <img src={selectedChat.avatar} alt={selectedChat.name} />
            </IonAvatar>
            <IonLabel>
              <h2>{selectedChat.name}</h2>
              <p>Last message at {selectedChat.time}</p>
            </IonLabel>
          </IonItem>
          <IonItem button>
            <IonLabel>Profile</IonLabel>
          </IonItem>
          <IonItem button>
            <IonLabel>Mute Notifications</IonLabel>
          </IonItem>
          <IonItem button>
            <IonLabel>Search in Chat</IonLabel>
          </IonItem>
          <IonItem button>
            <IonLabel>Media, Links, and Docs</IonLabel>
          </IonItem>
          <IonItem button>
            <IonLabel>Privacy & Support</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default ChatMenu;
