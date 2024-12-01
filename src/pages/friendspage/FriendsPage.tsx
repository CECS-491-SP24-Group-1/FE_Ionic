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
    <IonPage id="friends-page">
      <IonHeader className="dark:bg-primary-light">
        <IonToolbar>
          <IonTitle className="text-center text-gray-200 dark:text-gray-100">
            Users
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="bg-secondary dark:bg-white">
        <div className="friends-container flex h-full flex-col gap-4 bg-secondary dark:bg-white">
          {/* Pagination Bar */}
          <div className="flex justify-between items-center mb-4 bg-borderPrimary dark:bg-borderPrimary-light p-2 rounded-lg">
            <PageHandler
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              perPage={perPage}
              setPerPage={setPerPage}
            />
          </div>
          {/* Users List */}
          <div className="friends-list-container max-h-full w-full overflow-y-auto rounded-lg p-4 dark:bg-primary-light sm:rounded-2xl">
            {users.length > 0 ? (
              <IonList className="space-y-4">
                {users.map((user) => (
                  <IonItem
                    key={user.id}
                    className="flex items-center gap-4 rounded-lg bg-borderPrimary dark:bg-borderPrimary-light p-4"
                  >
                    <div className="flex-grow">
                      <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-100">
                        {user.display_name}
                      </h2>
                    </div>
                    <IonButton
                      className="ml-auto rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700"
                      onClick={() => handleAddFriend(user.id)}
                    >
                      Add Friend
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No users found.
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FriendsPage;
