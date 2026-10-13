/**
 * Infinite horizontal ticker.
 * Pure CSS transform animation (compositor only) + duplicated track.
 * Pauses on hover/focus so it never fights the user's reading.
 * Under prefers-reduced-motion the track becomes a static, scrollable row.
 */

import { usePrefersReducedMotion } from '../../lib/reducedMotion'

export default function Marquee({ items = [], speed = 42, className = '' }) {
  const reduced = usePrefersReducedMotion()
  if (!items.length) return null

  const track = [...items, ...items]

  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      style={{
        maskImage:
          'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      {reduced ? (
        <ul className="no-scrollbar flex w-full gap-2.5 overflow-x-auto px-6">
          {items.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="shrink-0 rounded-full border border-line px-3.5 py-1.5 font-mono text-[11.5px] text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="flex w-max shrink-0 gap-2.5 pr-2.5 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
          style={{
            animation: `marquee ${speed}s linear infinite`,
          }}
        >
          {track.map((item, i) => (
            <span
              key={`${item}-${i}`}
              aria-hidden={i >= items.length}
              className="shrink-0 rounded-full border border-line px-3.5 py-1.5 font-mono text-[11.5px] text-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      <style>{`@keyframes marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}`}</style>
    </div>
  )
}
