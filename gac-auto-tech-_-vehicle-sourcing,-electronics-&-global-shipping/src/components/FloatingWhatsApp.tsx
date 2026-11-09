import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';
import { WhatsAppIcon } from './WhatsAppIcon';
import { EASE } from './Reveal';
import { useDialogBehavior } from './ModalShell';

const topics = [
  { label: 'A vehicle', message: "Hello GAC Auto Tech, I'm looking for a vehicle: " },
  { label: 'Electronics', message: "Hello GAC Auto Tech, I'd like a price on: " },
  { label: 'Shipping', message: 'Hello GAC Auto Tech, I need a shipping quote from ' },
];

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useDialogBehavior(isOpen, () => setIsOpen(false), panelRef, { lockScroll: false, trapFocus: false });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const url = getWhatsAppUrl(quickMessage.trim() || 'Hello GAC Auto Tech, I would like to make an enquiry.');
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setQuickMessage('');
  };

  const pickTopic = (message: string) => {
    setQuickMessage(message);
    requestAnimationFrame(() => {
      const field = messageRef.current;
      if (!field) return;
      field.focus();
      field.setSelectionRange(message.length, message.length);
    });
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

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-4">
              {/* Reads as the first message in a chat, so the prompt feels like a conversation. */}
              <div className="max-w-[90%] rounded-media rounded-tl-none bg-white/[0.07] px-4 py-3">
                <p className="text-[0.9375rem] font-semibold leading-snug">Hi, how can we help?</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">
                  Send a car link, a product name, or your shipping route and our team will reply on WhatsApp.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2" aria-label="Quick topics">
                {topics.map((topic) => (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => pickTopic(topic.message)}
                    className="rounded-control border border-white/15 px-3 py-1.5 text-[0.8125rem] font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white cursor-pointer"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="mt-4">
                <label htmlFor="whatsapp-message" className="text-[0.8125rem] font-semibold text-white/70">
                  Your message
                </label>
                <textarea
                  id="whatsapp-message"
                  ref={messageRef}
                  rows={3}
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  placeholder="e.g. 2021 Lexus RX 350, budget $30k, shipping to Tema"
                  className="mt-1.5 w-full resize-none rounded-control border border-white/15 bg-white/[0.03] px-3.5 py-3 text-base leading-relaxed text-white placeholder:text-[0.9375rem] placeholder:text-white/40 focus:border-white/45 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-control bg-white px-4 py-3.5 text-[0.9375rem] font-bold text-[#111113] transition-colors hover:bg-[#ececec] cursor-pointer"
                >
                  Continue in WhatsApp
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <p className="mt-2.5 text-center text-xs text-white/50">Opens WhatsApp in a new tab</p>
              </form>
            </div>
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
