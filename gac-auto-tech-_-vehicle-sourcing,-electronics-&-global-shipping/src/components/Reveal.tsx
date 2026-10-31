import React from 'react';
import { motion } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;

export const rise = (index = 0, distance = 20) => ({
  initial: { opacity: 0, y: distance, scale: 0.97, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay: index * 0.08, ease: EASE },
});

export const trackSpotlight = (e: React.MouseEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export const Reveal: React.FC<RevealProps> = ({ children, className, index = 0 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
  >
    {children}
  </motion.div>
);
