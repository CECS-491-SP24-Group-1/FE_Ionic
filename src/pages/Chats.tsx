import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle } from '@ionic/react';
import ChatHeader from '../components/Chats/ChatHeader';
import ChatMessages from '../components/Chats/ChatMessages';
import ChatInput from '../components/Chats/ChatInput';
import ChatList from '../components/Chats/ChatList/ChatList';
import ChatMenu from '../components/Chats/Menu/ChatMenu';
import './Chats.scss';

const Chats: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { from: 'Me', text: 'Hey, Mariana', time: '10:45 AM' },
    { from: 'Me', text: 'Sure, just give me a call!', time: '10:46 AM' },
  ]);

  const handleSendMessage = (newMessage: string) => {
    if (newMessage.trim()) {
      setMessages([...messages, { from: 'Me', text: newMessage, time: 'Now' }]);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Wraith</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent id="main-content">
        <div className="chat-container">
          <ChatList />
          <div className="chat-view">
            <ChatHeader
              avatarUrl="https://i.pravatar.cc/300?u=mariana"
              name="Mariana Napolitani"
            />
            <ChatMessages messages={messages} />
          </div>
        </div>
      </IonContent>

      <ChatInput onSendMessage={handleSendMessage} />
      <ChatMenu />
    </IonPage>
  );
};

export default Chats;
