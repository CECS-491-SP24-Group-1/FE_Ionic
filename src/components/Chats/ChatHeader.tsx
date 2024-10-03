import React from 'react';
import { menuController } from '@ionic/core';
import { IonItem, IonAvatar, IonLabel, IonButton, IonIcon, IonMenuToggle } from '@ionic/react';
import { call, videocam, informationCircle } from 'ionicons/icons';

interface ChatHeaderProps {
  avatarUrl: string;
  name: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ avatarUrl, name }) => {
  const toggleMenu = async () => {
    await menuController.toggle();
  };

  return (
    <IonItem lines="none" className="user-chat-bar">
      <IonAvatar slot="start">
        <img src={avatarUrl} alt={name} />
      </IonAvatar>
      <IonLabel>
        <h2>{name}</h2>
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
