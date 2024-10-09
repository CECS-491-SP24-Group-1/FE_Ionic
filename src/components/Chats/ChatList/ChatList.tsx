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
      <IonList className="chat-list">
        {chatList.map((chat) => (
          <IonItem button key={chat.id} onClick={() => onChatSelect(chat.id)} className="chat-list-item">
            <IonAvatar slot="start" className="chat-list-avatar">
              <img src={chat.avatar} alt={chat.name} />
            </IonAvatar>
            <IonLabel className="chat-list-label">
              <h2 className="chat-list-name">{chat.name}</h2>
              <p className="chat-list-message">{chat.lastMessage}</p>
            </IonLabel>
            <IonBadge color="success" slot="end" className="chat-list-badge">
              {chat.time}
            </IonBadge>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};

export default ChatList;
