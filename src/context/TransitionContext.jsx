/**
 * ============================================================
 * PAGE TRANSITION SYSTEM
 * ============================================================
 * A small state machine that owns every route change:
 *
 *   idle ──navigateTo()──▶ covering ──▶ revealing ──▶ idle
 *                            │             │
 *                            │ curtain     │ new page is already mounted and
 *                            │ rises (340ms)│ starts fading in behind it
 *                            │             │
 *                            └─ router location is swapped HERE,
 *                               while the screen is fully covered
 *
 * WHY a curtain instead of a fade: cross-fading two full pages means both
 * trees are mounted at once and the swap is visible as a "load". An opaque
 * curtain makes the swap physically invisible, so the new page is *revealed*
 * rather than *loaded*.
 *
 * Back / forward navigation and any external location change run through the
 * exact same state machine, so browser history feels identical to clicks.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { TIMING } from '../lib/motion'
import { prefersReducedMotion } from '../lib/reducedMotion'
import { setSplashEnabled } from '../lib/clickSplash'
import { TransitionContext } from './transitionStore'

const keyOf = (loc) => `${loc.pathname}${loc.search ?? ''}${loc.hash ?? ''}`

/** Human label shown on the curtain, derived from the path. */
const labelFor = (pathname) => {
  const seg = pathname.split('/').filter(Boolean)[0] || 'home'
  return seg.replace(/-/g, ' ')
}

export function TransitionProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [display, setDisplay] = useState(location)
  const [phase, setPhase] = useState('idle') // 'idle' | 'covering' | 'revealing'
  const [label, setLabel] = useState('home')
  const [nonce, setNonce] = useState(0)

  const locked = useRef(false)
  const timers = useRef([])
  const lastKey = useRef(keyOf(location))

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const after = (ms, fn) => {
    timers.current.push(setTimeout(fn, ms))
  }

  /**
   * cover → swap the route → reveal
   *
   * `commit` is what actually writes the URL. It differs by trigger:
   *   - a click pushes a new history entry (so Back returns to where you were)
   *   - an external change (Back/Forward) has already changed the URL, so
   *     commit is a no-op and we must not push a duplicate entry
   */
  const runSequence = useCallback(
    (destination, { focus = false, commit = true } = {}) => {
      const focusMain = () => {
        if (focus) document.getElementById('main')?.focus?.({ preventScroll: true })
      }

      if (prefersReducedMotion()) {
        setDisplay(destination)
        if (commit) navigate(keyOf(destination))
        setPhase('idle')
        focusMain()
        return
      }

      setSplashEnabled(false)
      setLabel(labelFor(destination.pathname))
      setPhase('covering')

      after(TIMING.cover, () => {
        setDisplay(destination)
        setNonce((n) => n + 1)
        if (commit) navigate(keyOf(destination))
        // wait for the new page to commit before it starts revealing
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setPhase('revealing')
            after(TIMING.reveal, () => {
              setPhase('idle')
              locked.current = false
              setSplashEnabled(true)
              focusMain()
            })
          }),
        )
      })
    },
    [navigate],
  )

  /**
   * Programmatic navigation with the full transition.
   * Returns false when the navigation is ignored (same page, or one in flight)
   * so callers can decide what to do — navigation is never blocked from
   * completing, it is only ever collapsed.
   */
  const navigateTo = useCallback(
    (to, options = {}) => {
      if (typeof to !== 'string' || !to.startsWith('/')) {
        window.open?.(to, '_blank', 'noopener,noreferrer')
        return false
      }
      if (locked.current) return false
      const current = keyOf(location)
      if (to === current) return false

      locked.current = true
      clearTimers()
      runSequence({ pathname: to, search: '', hash: '' }, options)
      return true
    },
    [location, runSequence],
  )

  // External location changes: back / forward, manual URL, a non-transitioned
  // <Link> somewhere. These get the identical treatment.
  useEffect(() => {
    const nextKey = keyOf(location)
    if (nextKey === lastKey.current) return
    lastKey.current = nextKey

    if (locked.current) return // our own navigate() call — already sequenced

    // hash-only change on the same page: let the browser scroll, no curtain
    if (location.hash && location.pathname === display.pathname) return

    clearTimers()
    locked.current = true
    // the URL already changed (Back / Forward / manual entry) — do not push again
    runSequence(location, { commit: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useEffect(() => clearTimers, [])

  const value = useMemo(
    () => ({ navigateTo, phase, label, display, nonce }),
    [navigateTo, phase, label, display, nonce],
  )

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>
}
