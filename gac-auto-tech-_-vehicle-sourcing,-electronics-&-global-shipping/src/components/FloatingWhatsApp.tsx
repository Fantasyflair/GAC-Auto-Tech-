import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';
import { WhatsAppIcon } from './WhatsAppIcon';
import { EASE } from './Reveal';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const url = getWhatsAppUrl(quickMessage || 'Hello GAC Auto Tech, I would like to make an enquiry.');
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setQuickMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
            className="mb-3 w-80 sm:w-88 bg-[#141416] text-white rounded-panel p-5 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#111113]">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">GAC Auto Tech</div>
                  <div className="text-xs text-white/70">Usually replies within the day</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Close WhatsApp chat popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-white/80 mb-3">
              Send auction links, electronics questions, or shipping details straight to our team.
            </p>

            <form onSubmit={handleSend} className="space-y-2.5">
              <textarea
                rows={3}
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder="Type your vehicle or shipping question..."
                className="w-full px-3 py-2.5 text-base bg-transparent border border-white/15 rounded-control text-white placeholder:text-white/45 focus:border-white/45 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-3 text-sm font-bold text-[#111113] bg-white hover:bg-white/90 rounded-full transition-colors cursor-pointer"
              >
                <span>Open in WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.6, ease: EASE }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#111113] text-white ring-1 ring-white/15 shadow-lg shadow-black/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:bg-white dark:text-[#111113] dark:ring-black/10"
        aria-label="Open WhatsApp conversation"
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            {isOpen ? <X className="w-6 h-6" /> : <WhatsAppIcon className="w-6 h-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
