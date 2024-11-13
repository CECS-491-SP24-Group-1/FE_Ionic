// PersonalInfoList.tsx

import React from 'react';

interface InfoFieldProps {
  label: string;
  value: string;
  isEditable: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isEditable }) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <p className="text-gray-600">{label}</p>
      <p className="text-gray-800">{value}</p>
      {isEditable && (
        <a href="#" className="text-blue-600 hover:underline text-sm">
          Edit
        </a>
      )}
    </div>
  );
};

const PersonalInfoList: React.FC = () => {
  const infoFields = [
    { label: 'Name', value: 'David', isEditable: true },
    { label: 'Country', value: 'Italy', isEditable: true },
    { label: 'Timezone', value: 'Europe/Rome', isEditable: true },
    { label: 'About', value: "Hey, it's me :)", isEditable: true },
    { label: 'Phone number', value: 'N/A', isEditable: true },
    { label: 'Pronouns', value: 'N/A', isEditable: true },
    { label: 'Languages spoken', value: 'Italian', isEditable: true },
    { label: 'Industry', value: 'N/A', isEditable: true },
    { label: 'Interests', value: 'N/A', isEditable: true },
  ];

  return (
    <div className="flex flex-col space-y-2">
      {infoFields.map((field) => (
        <InfoField
          key={field.label}
          label={field.label}
          value={field.value}
          isEditable={field.isEditable}
        />
      ))}
    </div>
  );
};

export default PersonalInfoList;
