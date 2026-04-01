import type { Variants, Transition } from 'framer-motion';

// ── Easing Curves ──────────────────────────────────────────
export const ease = {
  reveal: [0.16, 1, 0.3, 1] as const,
  drift:  [0.22, 0.68, 0, 1] as const,
  snappy: [0.25, 0.46, 0.45, 0.94] as const,
  glide:  [0.32, 0.72, 0, 1] as const,
} as const;

// ── Entrance Variants ──────────────────────────────────────

/** Confident entrance for headings and display text */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.reveal },
  },
};

/** Subtle float for descriptions, eyebrows, supporting text */
export const drift: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: ease.drift },
  },
};

/** Directional slide for left/right columns */
export const slide = (direction: 'left' | 'right'): Variants => ({
  hidden: { opacity: 0, x: direction === 'left' ? -40 : 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: ease.reveal },
  },
});

/** Cascading grid for card layouts */
export function staggerGrid(staggerInterval = 0.12) {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: staggerInterval },
      },
    } as Variants,
    item: {
      hidden: { opacity: 0, y: 16, scale: 0.97 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: ease.snappy },
      },
    } as Variants,
  };
}

/** Cinematic scale-in for image cards */
export function staggerScaleIn(staggerInterval = 0.08) {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: staggerInterval },
      },
    } as Variants,
    item: {
      hidden: { opacity: 0, scale: 0.93 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: ease.drift },
      },
    } as Variants,
  };
}

// ── Micro-interactions ─────────────────────────────────────

export const tap = { scale: 0.97 };

export const hoverLift = {
  y: -2,
  transition: { duration: 0.2, ease: ease.snappy } as Transition,
};

export const hoverGlow = {
  boxShadow: '0 0 24px rgba(185, 149, 47, 0.3)',
  transition: { duration: 0.3 } as Transition,
};

// ── Viewport defaults ──────────────────────────────────────

export const viewport = {
  once: { once: true } as const,
  onceInset: { once: true, margin: '-80px' } as const,
};
