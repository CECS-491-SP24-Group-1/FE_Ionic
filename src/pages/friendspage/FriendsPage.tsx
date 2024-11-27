import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton } from '@ionic/react';
import taxios from '@/util/token_refresh_hook';
import PageHandler from '@/components/PageHandler';

interface User {
    id: string; 
    display_name: string;
    profilePictureUrl?: string;
    isFriend?: boolean;
}

const FriendsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [perPage, setPerPage] = useState(5);

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch users from backend
    taxios.get(`${api}/users/list?page=${currentPage}&per_page=${perPage}`)
      .then(response => {
        console.log(response.data)
        setUsers(response.data.payloads[0].data);
        setTotalPages(response.data.payloads[0].pagination.total_pages)
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [currentPage, perPage]);

  const handleAddFriend = (userId: string) => {
    /* Implement when friends route works; basic GPT boilerplate here
    taxios.post(`${api}/friends/add`, { userId })
      .then(() => {
        alert('Friend request sent!');
      })
      .catch(error => {
        console.error('Error sending friend request:', error);
      });
    */
  };

  return (
    <IonPage>
      <IonHeader className="grid grid-cols-[1fr_1fr_auto] items-center">
        <IonToolbar>
          <IonTitle>Users</IonTitle>
          <PageHandler 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            totalPages={totalPages} 
            perPage={perPage}
            setPerPage={setPerPage}
            />
        </IonToolbar>
        
      </IonHeader>
      <IonContent>
        {users &&
        <IonList>
          {users.map(user => (
            <IonItem key={user.id}>
              <div>{user.display_name}</div>
              <IonButton slot="end" onClick={() => handleAddFriend(user.id)} >
                Add Friend
              </IonButton>
            </IonItem>
          ))}
        </IonList>}
      </IonContent>
    </IonPage>
  );
};

export default FriendsPage;
