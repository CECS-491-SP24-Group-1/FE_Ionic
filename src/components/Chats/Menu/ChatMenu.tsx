import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonButton, IonIcon, IonButtons } from '@ionic/react';
import { close } from 'ionicons/icons';
import { menuController } from '@ionic/core'; // Import menuController
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

  // Function to close the menu by explicitly specifying the menuId
  const closeMenu = async () => {
    await menuController.close('chat-menu'); // Close the menu with id 'chat-menu'
  };

  return (
    <IonMenu side="end" contentId="main-content" menuId="chat-menu"> {/* Added explicit menuId */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chat Information</IonTitle>
          <IonButtons slot="end">
            {/* Wrap IonIcon inside IonButton */}
            <IonButton onClick={closeMenu}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
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
          {/* Menu options */}
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
