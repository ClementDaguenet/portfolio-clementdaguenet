"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  active: boolean;
  label: string;
};

export function MirrorFlipOverlay({ active, label }: Props) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-primary)]"
          initial={{ rotateY: 0, opacity: 0 }}
          animate={{ rotateY: 180, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          style={{ perspective: 1200, transformStyle: "preserve-3d" }}
          aria-live="polite"
        >
          <motion.div
            className="text-center text-[var(--color-bg)]"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -180 }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="font-[family-name:var(--font-display)] text-3xl md:text-5xl">
              {label}
            </p>
            <p className="mt-3 text-4xl" aria-hidden>
              🎮
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
