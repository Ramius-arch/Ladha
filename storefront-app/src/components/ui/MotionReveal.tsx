import React from 'react';
import { motion } from 'framer-motion';

interface MotionRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export const MotionReveal: React.FC<MotionRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.8,
  className = '',
  once = true,
}) => {
  const offset =
    direction === 'up'
      ? { y: distance, x: 0 }
      : direction === 'down'
      ? { y: -distance, x: 0 }
      : direction === 'left'
      ? { x: distance, y: 0 }
      : direction === 'right'
      ? { x: -distance, y: 0 }
      : { x: 0, y: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{
        type: 'spring',
        damping: 17,
        stiffness: 172,
        mass: 0.3,
        delay,
        duration,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
