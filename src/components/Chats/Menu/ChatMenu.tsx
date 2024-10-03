import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/react';
import MenuItem from './MenuItem';

const ChatMenu: React.FC = () => {
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
              <img src="https://i.pravatar.cc/300" alt="User" />
            </IonAvatar>
            <IonLabel>
              <h2>Mariana Napolitani</h2>
              <p>Active 3h ago</p>
            </IonLabel>
          </IonItem>
          <MenuItem label="Profile" />
          <MenuItem label="Mute" />
          <MenuItem label="Search" />
          <MenuItem label="Customize Chat" />
          <MenuItem label="Media, Files, and Links" />
          <MenuItem label="Privacy & Support" />
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default ChatMenu;
