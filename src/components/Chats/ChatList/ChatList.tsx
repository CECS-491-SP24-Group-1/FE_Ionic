// src/components/Chats/ChatList.tsx

import React from 'react';
import { IonList, IonItem, IonAvatar, IonLabel, IonBadge } from '@ionic/react';
import { chatList } from '../../../data/ChatListData';


interface ChatListProps {
  onChatSelect: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  return (
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
  );
};

export default ChatList;
