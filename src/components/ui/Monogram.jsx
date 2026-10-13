import { forwardRef } from 'react'
import { motion } from 'motion/react'

import { site } from '../../data/profile'
import { prefersReducedMotion } from '../../lib/reducedMotion'

/**
 * Monogram / logo mark — purely presentational.
 *
 * It is a <span>, not a <button>: the clickable logo is the <TransitionLink>
 * that wraps it in <Navbar>, and nesting a button inside an anchor is invalid
 * HTML and breaks keyboard/AT behaviour.
 *
 * `pulse` increments on every logo click to re-trigger the ping animation
 * (the easter-egg counter lives in Navbar, which owns the link).
 */
const Monogram = forwardRef(function Monogram({ pulse = 0, className = '' }, ref) {
  const reduced = prefersReducedMotion()

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-line bg-white/[0.03] font-display text-[13px] font-semibold tracking-tight text-bone transition-colors duration-300 group-hover:border-accent/60 group-hover:text-accent ${className}`}
    >
      <span className="relative z-10">{site.monogram}</span>
      {!reduced && pulse > 0 && (
        <motion.span
          key={pulse}
          className="pointer-events-none absolute inset-0 bg-accent/25"
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </span>
  )
})

export default Monogram
