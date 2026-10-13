/**
 * Shared motion language.
 * Every animation in the app pulls its easing / duration from here so the
 * site feels like one system. Keep it that way — do not inline random
 * cubic-beziers inside components.
 */

export const EASE = {
  out: [0.16, 1, 0.3, 1], // expo out  — most reveals
  inOut: [0.76, 0, 0.24, 1], // quart in-out — transitions
  in: [0.5, 0, 0.75, 0],
  soft: [0.32, 0.72, 0, 1],
}

/** Page transition timings (ms). Splash and curtain overlap slightly. */
export const TIMING = {
  splash: 520,
  cover: 340,
  reveal: 440,
  curtainHold: 40,
  preloaderMin: 900,
  preloaderMax: 2600,
}

/** Standard fade-up used by ScrollReveal. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.out },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE.out } },
}

/** Parent container for staggered children. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/** Word-by-word heading reveal. */
export const lineReveal = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export const wordChild = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.8, ease: EASE.out },
  },
}

export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -12% 0px' }
export const viewportOnceLoose = { once: true, amount: 0.1, margin: '0px 0px -8% 0px' }
