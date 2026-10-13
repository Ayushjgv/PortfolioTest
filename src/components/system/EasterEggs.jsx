/**
 * Easter eggs.
 *
 *  1. Konami code (↑↑↓↓←→←→BA) → toast
 *  2. Typing "idk" anywhere → toast
 *  3. Clicking the logo 5× → toast (handled in <Monogram>, routed here)
 *
 * None of them block navigation, steal focus, or change state.
 * Disabled entirely under prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from 'react'

import { easterEggs } from '../../data/profile'
import { onEgg } from '../../lib/eggBus'
import { prefersReducedMotion } from '../../lib/reducedMotion'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

const TYPED = 'idk'

export default function EasterEggs({ children }) {
  const [toast, setToast] = useState(null)
  const konami = useRef([])
  const typed = useRef('')
  const timer = useRef(null)

  const fire = (id) => {
    const egg = easterEggs.find((e) => e.id === id)
    if (!egg) return
    setToast(egg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }

  // easter egg #3: five clicks on the logo (fired from <Monogram>)
  useEffect(() => onEgg('logo', () => fire('logo')), [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const onKey = (e) => {
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      konami.current = [...konami.current, key].slice(-KONAMI.length)
      if (konami.current.join(',') === KONAMI.join(',')) {
        konami.current = []
        fire('konami')
      }

      if (key.length === 1) {
        typed.current = (typed.current + key).slice(-TYPED.length)
        if (typed.current === TYPED) {
          typed.current = ''
          fire('terminal')
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <>
      {children}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </>
  )
}

function Toast({ toast, onClose }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[9995] flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        data-no-splash=""
        className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border border-line bg-surface/90 px-4 py-3 backdrop-blur-xl"
        style={{ animation: 'toastIn 480ms cubic-bezier(.16,1,.3,1)' }}
      >
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Easter egg
          </p>
          <p className="mt-1 text-[13px] leading-snug text-bone">{toast.message}</p>
          <p className="mt-1 font-mono text-[10px] text-faint">{toast.hint}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 shrink-0 font-mono text-[10px] text-faint transition-colors hover:text-accent"
          aria-label="Dismiss"
        >
          ESC
        </button>
      </div>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
