import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** Read once + keep in sync. Used by imperative code (splash engine, cursor). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches

/**
 * React-friendly reduced-motion flag.
 * Motion's own useReducedMotion is SSR/hook based; this one also exposes
 * `isReady` so you can avoid hydration-style flashes of full-motion UI.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
