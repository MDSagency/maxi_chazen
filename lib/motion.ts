/** Premium motion tokens — luxury editorial easing */
export const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;
export const SOFT_EASE = [0.25, 0.1, 0.25, 1] as const;

export const MOTION = {
  duration: {
    fast: 0.45,
    base: 0.85,
    slow: 1.15,
    reveal: 1.35,
  },
  stagger: {
    tight: 0.06,
    base: 0.1,
    wide: 0.14,
  },
} as const;

export const staggerContainer = (
  stagger: number = MOTION.stagger.base,
  delay = 0.08,
) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const fadeUpItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration.reveal, ease: PREMIUM_EASE },
  },
};

export const clipFromLeft = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: MOTION.duration.slow, ease: PREMIUM_EASE },
  },
};

export const clipFromBottom = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: {
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: MOTION.duration.slow, ease: PREMIUM_EASE },
  },
};
