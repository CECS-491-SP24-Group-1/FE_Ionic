import React from 'react';
import { IonList, IonItem, IonAvatar, IonLabel, IonBadge } from '@ionic/react';
import { chatList } from '../../../data/ChatListData';
import ChatsHeader from './ChatsHeader'; // Adjust the import to make sure it points to the correct file

interface ChatListProps {
  onChatSelect: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  return (
    <>
      {/* Include the header at the top of the chat list */}
      <ChatsHeader />

      {/* The chat list itself */}
      <IonList>
        {chatList.map(chat => (
          <IonItem button key={chat.id} onClick={() => onChatSelect(chat.id)}>
            <IonAvatar slot="start">
              <img src={chat.avatar} alt={chat.name} />
            </IonAvatar>
            <IonLabel>
              <h2>{chat.name}</h2>
              <p>{chat.lastMessage}</p>
            </IonLabel>
            <IonBadge color="success" slot="end">{chat.time}</IonBadge>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};

export default ChatList;
