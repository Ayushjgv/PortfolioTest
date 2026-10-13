/**
 * ScrollReveal — wraps children and animates them into view once.
 * Uses a single IntersectionObserver per instance (motion's whileInView) and
 * degrades to a plain render when the user prefers reduced motion.
 *
 * `variant`: 'up' | 'fade' | 'left' | 'right' | 'scale' | 'mask'
 */

import { motion } from 'motion/react'

import { EASE, stagger, viewportOnce, viewportOnceLoose } from '../../lib/motion'
import { usePrefersReducedMotion } from '../../lib/reducedMotion'

const OFFSET = {
  up: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  left: { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 28 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } },
  mask: { hidden: { opacity: 0, y: 20, clipPath: 'inset(0 0 100% 0)' }, show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' } },
}

export default function ScrollReveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  as = 'div',
  loose = false,
  ...rest
}) {
  const reduced = usePrefersReducedMotion()
  const MotionTag = motion[as] ?? motion.div

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: OFFSET[variant].hidden,
        show: {
          ...OFFSET[variant].show,
          transition: { duration, delay, ease: EASE.out },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={loose ? viewportOnceLoose : viewportOnce}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/**
 * <RevealGroup> — one observer for a whole list, children stagger.
 * Cheaper than N observers and keeps the rhythm consistent.
 */
export function RevealGroup({
  children,
  className = '',
  stagger: s = 0.08,
  delay = 0,
  as = 'div',
  loose = false,
  ...rest
}) {
  const reduced = usePrefersReducedMotion()
  const MotionTag = motion[as] ?? motion.div

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      variants={stagger(s, delay)}
      initial="hidden"
      whileInView="show"
      viewport={loose ? viewportOnceLoose : viewportOnce}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({ children, className = '', as = 'div', ...rest }) {
  const reduced = usePrefersReducedMotion()
  const MotionTag = motion[as] ?? motion.div

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE.out } },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
