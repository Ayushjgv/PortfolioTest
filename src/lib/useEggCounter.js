/**
 * Easter-egg click counters.
 *
 * A ref-based counter: clicking the logo 5× in a row fires the 'logo' channel.
 * Using a ref (not state) means the click counter never causes a re-render —
 * the ping animation is driven by a separate, tiny state in <Navbar>.
 */

import { useCallback, useRef, useState } from 'react'

import { fireEgg } from './eggBus'

const WINDOW_MS = 1400

export function useEggCounter(id, needed = 5) {
  const state = useRef({ count: 0, last: 0 })
  const [pulse, setPulse] = useState(0)

  const onHit = useCallback(() => {
    const now = Date.now()
    const s = state.current
    s.count = now - s.last < WINDOW_MS ? s.count + 1 : 1
    s.last = now
    setPulse((p) => p + 1)

    if (s.count >= needed) {
      s.count = 0
      fireEgg(id)
    }
  }, [id, needed])

  return [onHit, pulse]
}
