// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AddParticipants = () => {
//   const [chatRooms, setChatRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState('');
//   const [newParticipants, setNewParticipants] = useState('');
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');

//   // Fetch the list of chat rooms
//   useEffect(() => {
//     const fetchChatRooms = async () => {
//       try {
//         const response = await axios.get('/api/chat/rooms'); // Fetch available chat rooms
//         setChatRooms(response.data.payloads);
//       } catch (err) {
//         console.error('Error fetching chat rooms:', err);
//       }
//     };

//     fetchChatRooms();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!selectedRoom) {
//       setError('Please select a chat room.');
//       return;
//     }

//     if (!newParticipants) {
//       setError('Please enter participant UUIDs.');
//       return;
//     }

//     const participantsArray = newParticipants.split(',').map(p => p.trim());

//     try {
//       await axios.post(`/api/chat/room/${selectedRoom}/add-participants`, {
//         participants: participantsArray,
//       });
//       setSuccess('Participants added successfully!');
//       setNewParticipants('');
//     } catch (err) {
//       setError('Failed to add participants. Please try again.');
//       console.error('Error adding participants:', err);
//     }
//   };

//   return (
//     <div>
//       <h2>Add Participants to Chat Room</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}

//       <form onSubmit={handleSubmit}>
//         <label htmlFor="chatRoom">Select Chat Room:</label>
//         <select
//           id="chatRoom"
//           value={selectedRoom}
//           onChange={(e) => setSelectedRoom(e.target.value)}
//           required
//         >
//           <option value="">--Select a Chat Room--</option>
//           {chatRooms.map((room) => (
//             <option key={room.id} value={room.id}>
//               {room.name}
//             </option>
//           ))}
//         </select>

//         <label htmlFor="newParticipants">Add Participants (comma-separated UUIDs):</label>
//         <input
//           id="newParticipants"
//           type="text"
//           value={newParticipants}
//           onChange={(e) => setNewParticipants(e.target.value)}
//           placeholder="UUID1, UUID2, UUID3..."
//           required
//         />

//         <button type="submit">Add Participants</button>
//       </form>
//     </div>
//   );
// };

// export default AddParticipants;
