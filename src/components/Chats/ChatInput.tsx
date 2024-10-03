import React, { useState } from 'react';
import { IonInput, IonButton, IonIcon, IonToolbar, IonFooter } from '@ionic/react';
import { camera, mic, attach } from 'ionicons/icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
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
  );
};

export default ChatInput;
