import React, { useState } from 'react';
import axios from 'axios'; 

const CreateChatRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Make the API call to create the chat room using axios
      const response = await axios.post('/api/chatrooms', { name: roomName });
      setSuccess('Chat room created successfully!');
      // Optionally clear the input field
      setRoomName('');
      // You can add logic here to update the UI, like showing the new chat room in a list
    } catch (error) {
      setError('Failed to create chat room. Please try again.');
      console.error('Error creating chat room:', error);
    }
  };

  return (
    <div>
      <h2>Create a New Chat Room</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="chatRoomName">Chat Room Name:</label>
        <input
          id="chatRoomName"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <button type="submit">Create Chat Room</button>
      </form>
    </div>
  );
};

export default CreateChatRoom;
