import React from 'react';
import { IonList } from '@ionic/react';
import ChatItem from './ChatItem';
import ChatsHeader from './ChatsHeader';
import SearchBar from './SearchBar';

const ChatList: React.FC = () => {
  return (
    <div className="chat-list">
      {/* Chats title and New Chat Icon */}
      <ChatsHeader />
      
      {/* Search Bar */}
      <SearchBar />

      {/* List of chats */}
      <IonList>
        <ChatItem
          avatarUrl="https://i.pravatar.cc/300?u=claudia"
          name="Claudia Alves"
          message="3 New Messages"
          time="3m ago"
        />
        <ChatItem
          avatarUrl="https://i.pravatar.cc/300?u=teamchat"
          name="Team Chat"
          message="New Message"
          time="5m ago"
        />
      </IonList>
    </div>
  );
};

export default ChatList;
