import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { EASE } from './Reveal';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Dialogs can overlap while one animates out, so the page unlocks only when the last one closes.
let scrollLocks = 0;
const lockPageScroll = () => {
  if (scrollLocks++ === 0) document.body.style.overflow = 'hidden';
};
const unlockPageScroll = () => {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.body.style.overflow = '';
};

/**
 * Shared dialog behaviour: Escape closes, Tab stays inside the panel, the page
 * behind stops scrolling, and focus returns to whatever opened the dialog.
 */
export const useDialogBehavior = (
  open: boolean,
  onClose: () => void,
  panelRef: React.RefObject<HTMLElement | null>,
  { lockScroll = true, trapFocus = true }: { lockScroll?: boolean; trapFocus?: boolean } = {}
) => {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    if (lockScroll) lockPageScroll();

    const focusFirst = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const preferred = panel.querySelector<HTMLElement>('[data-autofocus]');
      (preferred ?? panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel).focus();
    }, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (!trapFocus || e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener('keydown', onKey);
      if (lockScroll) unlockPageScroll();
      // Without preventScroll, refocusing the opener would cancel a scroll the close action started.
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, panelRef, lockScroll, trapFocus]);
};

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  label?: string;
  /** Tailwind max-width class for the panel. */
  width?: string;
  closeLabel?: string;
  children: React.ReactNode;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  open,
  onClose,
  labelledBy,
  label,
  width = 'max-w-2xl',
  closeLabel = 'Close dialog',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehavior(open, onClose, panelRef);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-label={label}
            tabIndex={-1}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full ${width} flex-col overflow-hidden rounded-panel bg-white text-[#111113] shadow-2xl focus:outline-none sm:max-h-[calc(100dvh-3rem)]`}
          >
            {/* Pinned to the panel, not the scrolling content, so it never scrolls out of reach. */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111113] shadow-[0_2px_10px_rgba(0,0,0,0.25)] ring-1 ring-black/10 transition-colors hover:bg-[#ececec] cursor-pointer"
              aria-label={closeLabel}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
