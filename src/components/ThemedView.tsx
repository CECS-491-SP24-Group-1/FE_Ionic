import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';  // Assuming useThemeColor is already ported
import './ThemedView.css';  // Import the CSS file for ThemedView

export type ThemedViewProps = React.HTMLAttributes<HTMLDivElement> & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ className, lightColor, darkColor, style, ...otherProps }: ThemedViewProps) {
  // Get the appropriate background color based on the theme
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <div
      className={['themed-view', className].join(' ')}  // Allow passing custom classes
      style={{ backgroundColor, ...style }}  // Apply dynamic background color and custom styles
      {...otherProps}  // Pass remaining props
    />
  );
}
