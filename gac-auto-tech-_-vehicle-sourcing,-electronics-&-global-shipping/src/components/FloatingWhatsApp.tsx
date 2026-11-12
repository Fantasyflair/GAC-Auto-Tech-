import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { useSite } from './SiteShell';
import { WhatsAppIcon } from './WhatsAppIcon';
import { EASE } from './Reveal';
import { useDialogBehavior } from './ModalShell';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const { whatsappUrl } = useSite();

  useDialogBehavior(isOpen, () => setIsOpen(false), panelRef, { lockScroll: false, trapFocus: false });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const url = whatsappUrl(quickMessage.trim() || 'Hello GAC Auto Tech, I would like to make an enquiry.');
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setQuickMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-labelledby="whatsapp-chat-title"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
            className="mb-3 flex max-h-[calc(100dvh-12rem)] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-panel border border-white/10 bg-[#141416] text-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111113]">
                <WhatsAppIcon className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p id="whatsapp-chat-title" className="font-display text-lg font-bold leading-tight tracking-tight">
                  GAC Auto Tech
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[0.8125rem] font-medium text-white/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden />
                  Usually replies within the day
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
              <label htmlFor="whatsapp-message" className="sr-only">
                Your message
              </label>
              <textarea
                id="whatsapp-message"
                rows={4}
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder="Type your message…"
                className="w-full resize-none rounded-control border border-white/15 bg-white/[0.03] px-3.5 py-3 text-base leading-relaxed text-white placeholder:text-white/45 focus:border-white/45 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-control bg-white px-4 py-3.5 text-[0.9375rem] font-bold text-[#111113] transition-colors hover:bg-[#ececec] cursor-pointer"
              >
                Send on WhatsApp
                <ArrowUpRight className="w-4 h-4" />
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
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
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
