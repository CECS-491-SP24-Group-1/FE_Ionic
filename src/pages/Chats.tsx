import React, { KeyboardEventHandler, useEffect, useState } from "react";
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonFooter, IonInput, IonButton, IonIcon } from "@ionic/react";
import { send, attach, mic } from "ionicons/icons";
import ChatList from "../components/Chats/ChatList/ChatList";
import ChatMessages from "../components/Chats/ChatMessages";
import ChatHeader from "../components/Chats/ChatHeader";
import ChatMenu from "../components/Chats/Menu/ChatMenu";
import "./Chats.scss";
import useVaultStore from "@/stores/vault_store";

const Chats: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<{ [key: number]: { to: string; from: string; text: string; time: string; }[] }>({}); // Object to hold messages by chatId

  useEffect(() => {
    if (ws) ws.close();

    const socket = new WebSocket('wss://echo.websocket.org');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      if (selectedChatId) {
		// TODO: change this to real data
        setMessages(prevMessages => ({
          ...prevMessages,
          [selectedChatId]: [
            ...(prevMessages[selectedChatId] || []),
            {
              to: "Me",
              from: "WebSocket",
              text: event.data,
              time: "Now",
            },
          ],
        }));
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);
  }, [selectedChatId]);

  // Function to handle chat selection
  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  // Function to handle sending messages
  const handleSendMessage = (message: string) => {
    if (selectedChatId) {
      ws?.send(message);
	  // TODO: change this to real data and make an API call to send message
      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedChatId]: [
          ...(prevMessages[selectedChatId] || []), 
          {
            to: "Server",
            from: "Me",
            text: message,
            time: "Now",
          },
        ],
      }));

      setInputMessage(""); // Clear the input field after sending
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
	const inputElement = event.target as HTMLIonInputElement;
	const message = inputElement.value?.toString().trim();
  
	if (event.key === "Enter" && message) {
	  event.preventDefault(); // Prevent any unwanted default behavior
	  handleSendMessage(message); // Trigger the send message logic directly
	  setInputMessage(""); // Clear the input field after sending
	}
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Chats</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent id="main-content">
        <div className="chat-container">
          {/* Chat list (left sidebar) */}
          <div className="chat-list">
            <ChatList onChatSelect={handleChatSelect} />
          </div>

          {/* Chat view (right side) */}
          <div className="chat-view">
            {selectedChatId !== null ? (
              <>
                {/* Header stays fixed at the top */}
                <div className="chat-header">
                  <ChatHeader selectedChatId={selectedChatId} />
                </div>

                {/* Scrollable messages section */}
                <div className="chat-messages">
                  <ChatMessages messages={messages[selectedChatId] || []} /> {/* Pass only messages for the selected chat */}
                </div>

                {/* Input stays fixed at the bottom */}
                <div className="chat-input">
                  <IonFooter className="chat-input">
                    <IonToolbar>
                      <IonInput
                        value={inputMessage}
                        placeholder="Write a message..."
                        onIonChange={(e: CustomEvent) => setInputMessage(e.detail.value!)}
						onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent)}
                      />
                      <IonButton onClick={() => handleSendMessage(inputMessage)} slot="end" fill="clear">
                        <IonIcon icon={send} />
                      </IonButton>
                      <IonButton slot="end" fill="clear">
                        <IonIcon icon={mic} />
                      </IonButton>
                      <IonButton slot="end" fill="clear">
                        <IonIcon icon={attach} />
                      </IonButton>
                    </IonToolbar>
                  </IonFooter>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Please select a chat to view messages.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Menu (right side menu) */}
        <ChatMenu selectedChatId={selectedChatId} />
      </IonContent>
    </IonPage>
  );
};

export default Chats;
