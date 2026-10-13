import { useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'motion/react'

import Page from '../components/system/Page'
import Button from '../components/ui/Button'
import TransitionLink from '../components/system/TransitionLink'
import { EASE } from '../lib/motion'
import { navLinks, site } from '../data/profile'

export default function NotFound() {
  // The glow follows the pointer through motion values, not state, so
  // pointermove never triggers a React render.
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const glow = useTransform(
    [mx, my],
    ([x, y]) => `radial-gradient(38% 38% at ${x}% ${y}%, rgba(201,242,77,.09), transparent 70%)`,
  )

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 100)
      my.set((e.clientY / window.innerHeight) * 100)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  return (
    <Page
      title="404"
      description="This page does not exist. Head back to the homepage."
      className="pt-16 sm:pt-[72px]"
    >
      <section className="container-page relative flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: glow }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE.out }}
          className="display text-[clamp(6rem,26vw,15rem)] leading-[0.8] text-bone"
        >
          4
          <span className="text-accent">0</span>
          4
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE.out, delay: 0.1 }}
          className="display mt-8 text-[clamp(1.5rem,5vw,2.6rem)]"
        >
          Looks like you got lost.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE.out, delay: 0.18 }}
          className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted"
        >
          The page youâ€™re looking for doesnâ€™t exist, moved, or never did. Hereâ€™s the way
          back.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE.out, delay: 0.26 }}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Button to="/" size="lg" arrow>
            Go home
          </Button>
          <Button href={`mailto:${site.email}`} size="lg" variant="outline">
            Email me
          </Button>
        </motion.div>

        <motion.nav
          aria-label="Suggested pages"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE.out, delay: 0.36 }}
          className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {navLinks.map((l) => (
            <TransitionLink
              key={l.to}
              to={l.to}
              className="link-draw font-mono text-[12px] tracking-tight text-faint transition-colors hover:text-accent"
            >
              {l.index} {l.label}
            </TransitionLink>
          ))}
        </motion.nav>
      </section>
    </Page>
  )
}
