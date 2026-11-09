'use client';

import React from 'react';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from '../context/ThemeContext';
import { EnquiryListProvider } from '../context/EnquiryListContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <EnquiryListProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </EnquiryListProvider>
    </ThemeProvider>
  );
}
