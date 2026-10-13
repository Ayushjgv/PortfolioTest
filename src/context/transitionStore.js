import { createContext, useContext } from 'react'

/**
 * The transition context object lives on its own so <TransitionProvider>
 * (a component file) and useTransition() (a hook file) can live separately —
 * keeps React Fast Refresh working for both.
 */
export const TransitionContext = createContext(null)

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside <TransitionProvider>')
  return ctx
}
