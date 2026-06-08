"use client";

import { AnimatePresence, motion } from "framer-motion";

type CartToastProps = {
  message: string;
};

export default function CartToast({ message }: CartToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 border border-line bg-white px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-ink luxury-shadow"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
