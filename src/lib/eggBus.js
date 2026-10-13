/**
 * Minimal pub/sub so components far apart in the tree (Navbar's <Monogram>,
 * the <EasterEggs> overlay) can share one channel without prop drilling or a
 * provider re-render.
 */

const listeners = new Map()

export function onEgg(channel, fn) {
  if (!listeners.has(channel)) listeners.set(channel, new Set())
  listeners.get(channel).add(fn)
  return () => listeners.get(channel)?.delete(fn)
}

export function fireEgg(channel, payload) {
  listeners.get(channel)?.forEach((fn) => {
    try {
      fn(payload)
    } catch {
      /* an easter egg must never break the app */
    }
  })
}
