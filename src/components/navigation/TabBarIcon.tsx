import React from 'react';
import { IconBaseProps } from 'react-icons';
import * as IoIcons from 'react-icons/io5'; // Import Ionicons from react-icons

type TabBarIconProps = {
  name: keyof typeof IoIcons;
  color?: string;
} & Omit<IconBaseProps, 'name'>;

export function TabBarIcon({ name, color, style, ...rest }: TabBarIconProps) {
  const IconComponent = IoIcons[name];

  if (!IconComponent) {
    console.warn(`Icon ${name} not found`);
    return null;
  }

  return (
    <IconComponent
      size={28}
      color={color}
      style={{ marginBottom: -3, ...(style as React.CSSProperties) }}
      {...rest}
    />
  );
}