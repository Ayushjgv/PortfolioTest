/**
 * Navbar
 *  - desktop: inline links with a shared-layout active indicator
 *  - mobile : full-height sheet, staggered link reveal, body-scroll lock
 *  - hides on scroll-down, returns on scroll-up (never traps the user)
 *  - a thin scroll-progress line sits under the bar
 */

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { Menu, X } from 'lucide-react'

import { navLinks, site } from '../../data/profile'
import { EASE } from '../../lib/motion'
import { useEggCounter } from '../../lib/useEggCounter'
import TransitionLink from '../system/TransitionLink'
import Monogram from '../ui/Monogram'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)
  const toggleRef = useRef(null)
  // easter egg: 5 quick clicks on the logo
  const [onLogoClick, logoPulse] = useEggCounter('logo', 5)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 })

  // scroll direction + "am I scrolled" state
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (open) return
      setHidden(y > lastY.current + 6 && y > 160)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  // lock the body while the sheet is open; return focus to the toggle on close
  useEffect(() => {
    if (!open) return
    const el = toggleRef.current
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      el?.focus()
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.4, ease: EASE.out }}
        className="fixed inset-x-0 top-0 z-[100]"
      >
        <div
          className={`relative transition-colors duration-500 ${
            scrolled || open
              ? 'border-b border-line/70 bg-ink/80 backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <nav
            aria-label="Primary"
            className="container-page flex h-16 items-center justify-between gap-6 sm:h-[72px]"
          >
            <TransitionLink
              to="/"
              onClick={() => {
                onLogoClick()
                close()
              }}
              className="group relative z-10 flex min-h-11 items-center gap-3 rounded-[10px] pr-1"
              aria-label={`${site.name} — home`}
            >
              <Monogram pulse={logoPulse} />
              <span className="hidden text-sm font-medium tracking-[-0.01em] text-bone transition-colors duration-300 group-hover:text-accent sm:block">
                {site.name}
              </span>
            </TransitionLink>

            {/* desktop nav */}
            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavItem to={link.to}>{link.label}</NavItem>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="hidden h-11 items-center gap-2 rounded-full border border-line px-5 text-[13px] text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent lg:inline-flex"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                Available
              </a>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-line text-bone transition-colors duration-300 hover:border-accent/50 hover:text-accent md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? 'x' : 'menu'}
                    initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="grid place-items-center"
                  >
                    {open ? <X size={17} /> : <Menu size={17} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>

          <motion.div
            aria-hidden="true"
            className="h-px origin-left bg-accent"
            style={{ scaleX: progress }}
          />
        </div>
      </motion.header>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="sheet"
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[95] md:hidden"
          >
            <motion.div
              variants={{
                closed: { opacity: 0 },
                open: { opacity: 1, transition: { duration: 0.25 } },
              }}
              className="absolute inset-0 bg-ink/70 backdrop-blur-md"
              onClick={close}
            />
            <motion.div
              variants={{
                closed: { y: '-100%' },
                open: { y: '0%', transition: { duration: 0.5, ease: EASE.out } },
              }}
              className="absolute inset-x-0 top-0 border-b border-line bg-ink px-5 pb-10 pt-20"
            >
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.to}
                    variants={{
                      closed: { opacity: 0, y: -14 },
                      open: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.08 + i * 0.05, duration: 0.4, ease: EASE.out },
                      },
                    }}
                    className="border-b border-line/70 last:border-0"
                  >
                    <TransitionLink
                      to={link.to}
                      onClick={close}
                      className="group flex items-baseline justify-between py-4"
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`display text-[clamp(1.6rem,8vw,2.4rem)] transition-colors duration-300 ${
                              isActive ? 'text-accent' : 'text-bone'
                            }`}
                          >
                            {link.label}
                          </span>
                          <span className="font-mono text-[11px] text-faint">
                            {link.index}
                          </span>
                        </>
                      )}
                    </TransitionLink>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                variants={{
                  closed: { opacity: 0 },
                  open: { opacity: 1, transition: { delay: 0.35, duration: 0.4 } },
                }}
                className="mt-8 flex flex-col gap-1"
              >
                {site.email && (
                  <a href={`mailto:${site.email}`} className="link-draw w-fit text-sm text-muted">
                    {site.email}
                  </a>
                )}
                <span className="eyebrow">{site.location}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavItem({ to, children }) {
  return (
    <TransitionLink
      to={to}
      className="group relative flex min-h-11 items-center px-3.5 text-[13.5px] text-muted transition-colors duration-300 hover:text-bone"
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-bone' : undefined}>{children}</span>
          <span
            className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}
          />
        </>
      )}
    </TransitionLink>
  )
}
