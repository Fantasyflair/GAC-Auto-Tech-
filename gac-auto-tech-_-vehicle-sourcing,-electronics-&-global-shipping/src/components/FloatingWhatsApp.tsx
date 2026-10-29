import React, { useState } from 'react';
import { MessageCircle, X, ArrowUpRight, Send } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_NUMBER_DISPLAY } from '../data/mockData';

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
      {/* Expanded Quick Message Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-[#121316] text-white rounded-2xl p-4 shadow-2xl border border-[#272832] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#22232B] mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">GAC Auto Tech WhatsApp</div>
                <div className="text-[10px] text-[#8E939D]">Direct Enquiries Gateway</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[#8E939D] hover:text-white transition-colors cursor-pointer"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#BFC2C8] leading-relaxed mb-3">
            Chat directly with our team regarding vehicle auction links, electronics pricing, or shipping queries.
          </p>

          <form onSubmit={handleSend} className="space-y-2">
            <textarea
              rows={2}
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              placeholder="Type your vehicle or shipping question..."
              className="w-full px-3 py-2 text-xs bg-[#1A1B22] border border-[#2A2B36] rounded-xl text-white placeholder:text-[#606570] focus:border-[#25D366] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-xl transition-colors cursor-pointer"
            >
              <span>Open in WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Open WhatsApp conversation"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
          Chat With Us
        </span>
      </button>
    </div>
  );
};
