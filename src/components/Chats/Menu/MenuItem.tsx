import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';

interface MenuItemProps {
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ label }) => {
  return (
    <IonItem>
      <IonLabel>{label}</IonLabel>
    </IonItem>
  );
};

export default MenuItem;
