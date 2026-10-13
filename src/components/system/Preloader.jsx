/**
 * Initial loading screen.
 *
 * Design constraint: never make the user wait. The screen only stays up while
 * the app is genuinely initialising (fonts settling / first paint) and is hard
 * capped at TIMING.preloaderMax. It also unblocks instantly if the document
 * finishes loading first.
 *
 * The bar is driven by real signals:
 *   - document.readyState
 *   - document.fonts.ready
 *   - a rAF ticker that eases toward 90% and parks there until 'done'
 */

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { site } from '../../data/profile'
import { EASE, TIMING } from '../../lib/motion'
import { prefersReducedMotion } from '../../lib/reducedMotion'

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(() => prefersReducedMotion())
  const [hidden, setHidden] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return

    let raf
    let finished = false
    const start = performance.now()

    const tick = () => {
      // ease toward 90% and park — the last 10% is the real "app is ready" signal
      setProgress((p) => (p >= 90 ? 90 : p + (90 - p) * 0.08 + 0.6))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      setProgress(100)
      const wait = Math.max(0, TIMING.preloaderMin - (performance.now() - start))
      setTimeout(() => {
        setDone(true)
        setTimeout(() => setHidden(true), 620)
      }, wait)
    }

    const onReady = () => {
      if (document.fonts?.ready) document.fonts.ready.then(finish, finish)
      else finish()
      if (document.readyState === 'complete') finish()
    }

    if (document.readyState === 'complete') onReady()
    else window.addEventListener('load', onReady, { once: true })

    // hard cap — never trap the user behind an artificial animation
    const cap = setTimeout(finish, TIMING.preloaderMax)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(cap)
      window.removeEventListener('load', onReady)
    }
  }, [])

  if (hidden) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.62, ease: EASE.inOut }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.out }}
            className="flex flex-col items-center"
          >
            <span className="display text-[clamp(2.4rem,9vw,4.4rem)] tracking-[-0.05em] text-bone">
              {site.name}
            </span>
            <span className="eyebrow mt-3 text-[10px] tracking-[0.4em]">
              {site.role.split('&')[0].trim()}
            </span>
          </motion.div>

          <div className="mt-10 h-px w-40 overflow-hidden bg-white/10 sm:w-56">
            <motion.div
              className="h-full bg-accent"
              style={{ scaleX: progress / 100 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            />
          </div>
          <p className="mt-4 font-mono text-[10px] tracking-[0.28em] text-faint">
            {String(Math.round(progress)).padStart(3, '0')}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
