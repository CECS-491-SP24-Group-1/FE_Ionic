import { PropsWithChildren, ReactElement } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ParallaxScrollView.css'; // Use CSS or SCSS for styling

import { ThemedView } from '@/components/ThemedView';  // Assuming you have ThemedView in web

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  // Detect color scheme (light/dark)
  const colorScheme = 'light'; // Can replace with useColorScheme hook

  // Scroll event and transforms for parallax effect
  const { scrollY } = useScroll();
  const translateY = useTransform(scrollY, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]);
  const scale = useTransform(scrollY, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]);

  return (
    <div className="parallax-container">
      <motion.div
        className="parallax-header"
        style={{
          backgroundColor: headerBackgroundColor[colorScheme],
          translateY,
          scale,
        }}
      >
        {headerImage}
      </motion.div>
      <div className="parallax-content">
        {children}
      </div>
    </div>
  );
}
