/**
 * The full-screen curtain used for every route change.
 *
 * Three stacked layers, all transform/opacity only:
 *   1. ink      — the solid panel that covers the viewport
 *   2. scanline — a hairline grid that scrolls inside the panel (depth, not noise)
 *   3. meta     — the destination label + a progress hairline
 *
 * Mounted permanently (not conditionally) so there is never a mount cost
 * mid-transition, but `pointer-events: none` + visibility when idle.
 */

import { motion } from 'motion/react'

import { EASE, TIMING } from '../../lib/motion'
import { useTransition } from '../../context/transitionStore'
import { prefersReducedMotion } from '../../lib/reducedMotion'

const PANEL_BG =
  'linear-gradient(180deg, #101018 0%, #08080b 55%, #0b0f08 100%)'

export default function TransitionCurtain() {
  const { phase, label } = useTransition()
  const reduced = prefersReducedMotion()

  const active = phase !== 'idle'
  // covering  → y: 100% → 0%  (rises from the bottom)
  // revealing → 0% → -100%    (continues out through the top)
  const y =
    phase === 'covering' ? '100%' : phase === 'revealing' ? '-100%' : '100%'

  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden"
      style={{ visibility: active ? 'visible' : 'hidden' }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-full"
        style={{ background: PANEL_BG, willChange: 'transform' }}
        initial={false}
        animate={{ y }}
        transition={{
          duration: phase === 'covering' ? TIMING.cover : TIMING.reveal,
          ease: EASE.inOut,
        }}
      >
        {/* scanlines */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,.045) 0px, rgba(255,255,255,.045) 1px, transparent 1px, transparent 4px)',
          }}
        />
        {/* accent bloom, drifts across the panel */}
        <motion.div
          className="absolute -top-1/3 left-1/2 h-[140%] w-[140%] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(closest-side, rgba(201,242,77,.10), rgba(201,242,77,0))',
          }}
          animate={{ x: ['-46%', '46%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* meta block */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
          <motion.span
            className="eyebrow text-[10px] tracking-[0.4em] text-white/35"
            initial={false}
            animate={{
              opacity: phase === 'covering' ? 1 : 0,
              y: phase === 'covering' ? 0 : -10,
            }}
            transition={{ duration: 0.28, ease: EASE.out }}
          >
            {label}
          </motion.span>

          <div className="h-px w-40 overflow-hidden bg-white/12 sm:w-56">
            <motion.div
              className="h-full w-full origin-left bg-accent"
              initial={false}
              animate={{ scaleX: phase === 'revealing' ? 0 : 1 }}
              transition={{
                duration: phase === 'covering' ? 0.34 : 0.22,
                ease: EASE.inOut,
              }}
            />
          </div>

          <motion.span
            className="font-mono text-[10px] tracking-[0.28em] text-white/20"
            initial={false}
            animate={{ opacity: phase === 'covering' ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {phase === 'covering' ? 'LOADING' : ''}
          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}
