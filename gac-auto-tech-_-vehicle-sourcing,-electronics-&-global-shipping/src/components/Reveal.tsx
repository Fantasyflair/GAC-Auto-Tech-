import React from 'react';
import { motion } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Entrance for an item in a grid. Plays once, short, and only moves opacity and
 * position so it stays cheap on a phone. Stagger is capped at three steps so a
 * long row never leaves the last card waiting.
 */
export const rise = (index = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.4, delay: Math.min(index, 3) * 0.06, ease: EASE },
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
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.4, delay: Math.min(index, 3) * 0.06, ease: EASE }}
  >
    {children}
  </motion.div>
);
