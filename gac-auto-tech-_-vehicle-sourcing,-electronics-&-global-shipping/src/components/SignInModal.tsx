import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { GacLogo } from './GacLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getWhatsAppUrl } from '../data/mockData';
import { EASE } from './Reveal';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sign-in-title"
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-[#18181B] shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#09090B] px-7 pb-6 pt-7 text-white">
              <GacLogo size="sm" />
              <h2 id="sign-in-title" className="mt-5 font-display text-2xl font-semibold">Sign in</h2>
              <p className="mt-1 text-sm text-white/70">Track your enquiries, saved vehicles, and shipments.</p>
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 cursor-pointer"
                aria-label="Close sign in"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-7 py-6">
              {submitted ? (
                <div className="text-center">
                  <CheckCircle2 className="mx-auto w-10 h-10" />
                  <p className="mt-3 font-display text-lg font-semibold">Customer accounts are coming soon</p>
                  <p className="mt-1 text-sm text-muted">
                    Online sign-in isn't live yet. Our team can update you on any enquiry over WhatsApp in the meantime.
                  </p>
                  <a
                    href={getWhatsAppUrl(`Hello GAC Auto Tech, I would like an update on my enquiry. My email is ${email}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold hover:bg-black/5"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Message us on WhatsApp
                  </a>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) setSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold">Email address</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm focus:border-[#111113] focus:outline-none"
                    />
                  </label>
                  <button type="submit" className="btn-ink w-full rounded-full py-3 text-sm font-semibold cursor-pointer">
                    Continue
                  </button>
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-muted">
                    <span className="h-px flex-1 bg-black/10" />
                    or
                    <span className="h-px flex-1 bg-black/10" />
                  </div>
                  <a
                    href={getWhatsAppUrl('Hello GAC Auto Tech, I would like an update on my enquiry.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-black/15 py-3 text-sm font-semibold hover:bg-black/5"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Check an enquiry on WhatsApp
                  </a>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
