import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonInput,
  IonButton,
  IonFooter,
  IonIcon,
  IonSearchbar,
  IonBadge,
} from '@ionic/react';
import { camera, mic, attach, chatbubbles, addCircle } from 'ionicons/icons';

import './Chats.scss'; // Ensure this contains the necessary styles

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { from: 'Me', text: 'Hey, Mariana', time: '10:45 AM' },
    { from: 'Me', text: 'Sure, just give me a call!', time: '10:46 AM' },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { from: 'Me', text: message, time: 'Now' }]);
      setMessage(''); // clear input
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Wraith</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="chat-container">
          {/* Sidebar*/}
          <div className="chat-list">
            {/* Chats title and New Chat Icon */}
            <div className="chats-header">
              <div className="chats-title">
                <IonLabel>Chats</IonLabel>
                <IonIcon icon={addCircle} size="large" className="new-chat-icon" />
              </div>

              {/* Search Bar */}
              <IonSearchbar placeholder="Search" />
            </div>

            {/* List of chats */}
            <IonList>
              <IonItem>
                <IonAvatar slot="start">
                  <img src="https://i.pravatar.cc/300?u=claudia" alt="Claudia" />
                </IonAvatar>
                <IonLabel>
                  <h2>Claudia Alves</h2>
                  <p>3 New Messages</p>
                </IonLabel>
                <IonBadge color="success" slot="end">3m ago</IonBadge>
              </IonItem>

              <IonItem>
                <IonAvatar slot="start">
                  <img src="https://i.pravatar.cc/300?u=teamchat" alt="Team Chat" />
                </IonAvatar>
                <IonLabel>
                  <h2>Team Chat</h2>
                  <p>New Message</p>
                </IonLabel>
                <IonBadge color="success" slot="end">5m ago</IonBadge>
              </IonItem>

              {/* Add more chat items as needed */}
            </IonList>
          </div>

          {/* Chat view */}
          <div className="chat-view">
            <div className="chat-header">
              <IonItem lines="none" className="user-chat-bar">
                <IonAvatar slot="start">
                  <img src="https://i.pravatar.cc/300?u=mariana" alt="Mariana" />
                </IonAvatar>
                <IonLabel>
                  <h2>Mariana Napolitani</h2>
                  <p>Click here for contact information</p>
                </IonLabel>
              </IonItem>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.from === 'Me' ? 'from-me' : 'from-them'}`}>
                  <p>{msg.text}</p>
                  <span>{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input area */}
            <IonFooter className="chat-input">
              <IonToolbar>
                <IonInput
                  value={message}
                  placeholder="Write your message here"
                  onIonChange={(e: CustomEvent) => setMessage(e.detail.value!)}
                />
                <IonButton onClick={handleSendMessage} slot="end" fill="clear">
                  <IonIcon icon={camera} />
                </IonButton>
                <IonButton onClick={handleSendMessage} slot="end" fill="clear">
                  <IonIcon icon={mic} />
                </IonButton>
                <IonButton onClick={handleSendMessage} slot="end" fill="clear">
                  <IonIcon icon={attach} />
                </IonButton>
              </IonToolbar>
            </IonFooter>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChatPage;
