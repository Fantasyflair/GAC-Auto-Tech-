import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus } from 'lucide-react';
import { EnquiryItem, useEnquiryList } from '../context/EnquiryListContext';

export const AddToListButton: React.FC<{ item: EnquiryItem }> = ({ item }) => {
  const list = useEnquiryList();
  const added = list.has(item.id);

  return (
    <motion.button
      type="button"
      onClick={() => (added ? list.remove(item.id) : list.add(item))}
      whileTap={{ scale: 0.9 }}
      className="ui-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full cursor-pointer"
      aria-label={added ? `Remove ${item.title} from cart` : `Add ${item.title} to cart`}
      aria-pressed={added}
      title={added ? 'In your cart' : 'Add to cart'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={added ? 'added' : 'add'}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};
