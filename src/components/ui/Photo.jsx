/**
 * <Photo> — the profile image treatment.
 *
 * REPLACE YOUR PHOTO:
 *   drop the file at  public/images/profile.jpg
 *   (change the path in src/data/profile.js → site.avatar if you use a
 *    different filename)
 *
 * Design: an editorial portrait block, not a round avatar.
 *   - a masked reveal on first paint
 *   - a subtle pointer parallax (transform only, no layout thrash)
 *   - a duotone/accent bloom that lifts on hover
 *   - a layered frame with corner ticks
 *   - a graceful "[YOUR PHOTO HERE]" fallback if the file is missing
 */

import { useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'

import { site } from '../../data/profile'
import { EASE } from '../../lib/motion'
import { prefersReducedMotion } from '../../lib/reducedMotion'

const isRealImage = (src) => typeof src === 'string' && !src.includes('[YOUR')

export default function Photo({
  src = site.avatar,
  alt = `${site.name} — portrait`,
  className = '',
  parallax = 26,
  label = '[YOUR PHOTO HERE]',
  hint = 'public/images/profile.jpg',
}) {
  const wrapRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const reduced = prefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax])

  // pointer parallax runs through motion values → zero React re-renders
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const shiftX = useSpring(useTransform(px, (v) => v * 16), { stiffness: 120, damping: 20 })
  const shiftY = useSpring(useTransform(py, (v) => v * 12), { stiffness: 120, damping: 20 })

  const onPointerMove = (e) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
  }

  const missing = failed || !isRealImage(src)

  return (
    <div
      ref={wrapRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`group relative ${className}`}
    >
      {/* offset accent plate behind the frame */}
      <div
        aria-hidden="true"
        className="absolute -right-3 -top-3 bottom-6 left-6 rounded-[18px] border border-line/60 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
      />

      <motion.div
        initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)' }}
        animate={reduced ? {} : { clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: 1.1, ease: EASE.out, delay: 0.15 }}
        className="relative overflow-hidden rounded-[14px] border border-line bg-surface"
      >
        <motion.div
          className="relative aspect-[4/5] w-full overflow-hidden"
          style={reduced ? {} : { y }}
        >
          {missing ? (
            <Placeholder label={label} hint={hint} />
          ) : (
            <motion.img
              src={src}
              alt={alt}
              width={900}
              height={1125}
              loading="eager"
              decoding="async"
              onError={() => setFailed(true)}
              initial={{ scale: 1.12, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE.out, delay: 0.1 }}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={reduced ? undefined : { x: shiftX, y: shiftY, scale: 1.04 }}
            />
          )}

          {/* vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10"
          />
          {/* accent bloom on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(70% 55% at 50% 25%, rgba(201,242,77,.55), transparent 70%)',
            }}
          />
          {/* fine grain, keeps flat photos from looking digital */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </motion.div>
      </motion.div>

      {/* corner ticks */}
      <Corner className="left-[-7px] top-[-7px]" />
      <Corner className="right-[-7px] top-[-7px]" flip />
      <Corner className="bottom-[-7px] left-[-7px]" flip />
      <Corner className="bottom-[-7px] right-[-7px]" />

      {/* caption strip */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] leading-relaxed text-faint">
          {missing ? (
            <>
              <span className="text-accent">{label}</span>
              <br />
              drop an image at <span className="text-muted">{hint}</span>
            </>
          ) : (
            <>
              {site.name}
              <br />
              <span className="text-muted">{site.role}</span>
            </>
          )}
        </p>
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_rgba(201,242,77,.12)]"
        />
      </div>
    </div>
  )
}

function Corner({ className = '', flip = false }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-3 w-3 border-accent/60 ${
        flip ? 'border-b border-r' : 'border-t border-l'
      } ${className}`}
    />
  )
}

function Placeholder({ label, hint }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[linear-gradient(160deg,#121218_0%,#0b0b10_60%,#10130c_100%)] px-6 text-center">
      <div
        aria-hidden="true"
        className="h-16 w-16 rounded-full border border-dashed border-accent/40"
      />
      <div>
        <p className="font-mono text-[12px] tracking-[0.16em] text-accent">{label}</p>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-faint">{hint}</p>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  )
}
