import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useEnquiryList } from '../context/EnquiryListContext';
import { useTheme } from '../context/ThemeContext';
import { ServiceType } from '../types';
import { EASE } from './Reveal';

interface EnquiryDrawerProps {
  onRequestQuote: (service: ServiceType, details: string) => void;
}

export const EnquiryDrawer: React.FC<EnquiryDrawerProps> = ({ onRequestQuote }) => {
  const { items, isOpen, close, remove, clear } = useEnquiryList();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const submit = () => {
    if (!items.length) return;
    const services = new Set(items.map((i) => i.service));
    const service: ServiceType = services.size === 1 ? items[0].service : 'general_merchandise';
    const details = items.map((i) => `${i.title} (Ref: ${i.reference})`).join('; ');
    close();
    onRequestQuote(service, details);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className={`fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col shadow-2xl ${
              dark ? 'bg-[#0B0B0D] text-white' : 'bg-white text-[#18181B]'
            }`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
          >
            <div className={`flex items-center justify-between border-b px-6 py-5 ${dark ? 'border-white/10' : 'border-black/10'}`}>
              <div>
                <h2 className="text-xl font-semibold">Your cart</h2>
                <p className="text-xs text-muted">
                  {items.length ? `${items.length} item${items.length > 1 ? 's' : ''}` : 'No items yet'}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className={`flex h-9 w-9 items-center justify-center rounded-full cursor-pointer ${dark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="ui-icon flex h-14 w-14 items-center justify-center rounded-2xl">
                    <ShoppingCart className="w-6 h-6" strokeWidth={1.6} />
                  </span>
                  <p className="mt-4 text-lg font-semibold">Your cart is empty</p>
                  <p className="mt-1 max-w-xs text-sm text-muted">
                    Add electronics or vehicles, then check out with one quote for everything.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        className={`flex items-center gap-3 rounded-2xl border p-3 ${dark ? 'border-white/10' : 'border-black/10'}`}
                      >
                        <img src={item.imageUrl} alt="" className="h-14 w-20 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{item.title}</p>
                          <p className="text-[11px] text-muted">Ref: {item.reference} · Price on request</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted cursor-pointer ${dark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className={`border-t px-6 py-5 ${dark ? 'border-white/10' : 'border-black/10'}`}>
                <p className="mb-3 text-xs text-muted">
                  Prices depend on quantity and destination, so checkout sends your cart to our team for a full quote.
                </p>
                <button
                  type="button"
                  onClick={submit}
                  className="btn-theme flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold cursor-pointer"
                >
                  Check out with a quote
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="mt-3 w-full text-center text-xs font-semibold text-muted hover:underline cursor-pointer"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
