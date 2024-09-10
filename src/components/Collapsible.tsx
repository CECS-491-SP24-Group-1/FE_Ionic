import { PropsWithChildren, useState } from 'react';
import { IoChevronDown, IoChevronForwardOutline } from 'react-icons/io5';  // react-icons for web
import './Collapsible.css';  // Assuming we use CSS or SCSS for styling

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';  // useThemeColor hook
import { Colors } from '@/constants/Colors';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useThemeColor({}, 'icon');  // Get theme color for icons

  return (
    <div className="themed-view">  {/* Replace ThemedView with div */}
      <button
        className="collapsible-heading"  // CSS class for styling
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? (
          <IoChevronDown size={18} color={theme} />  {/* Use react-icons */}
        ) : (
          <IoChevronForwardOutline size={18} color={theme} />  {/* Use react-icons */}
        )}
        <ThemedText type="defaultSemiBold">{title}</ThemedText>  {/* Keep ThemedText if ported */}
      </button>
      {isOpen && <div className="collapsible-content">{children}</div>}  {/* Replace ThemedView with div */}
    </div>
  );
}
