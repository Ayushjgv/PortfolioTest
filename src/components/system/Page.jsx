/**
 * Page shell used by every route.
 *  - sets <title> + meta description per page (SEO)
 *  - fades the page content in after the curtain lifts
 *  - provides the skip link target and a scroll reset
 */

import { useEffect } from 'react'
import { motion } from 'motion/react'

import { EASE } from '../../lib/motion'
import { prefersReducedMotion } from '../../lib/reducedMotion'
import { useTransition } from '../../context/transitionStore'
import { site } from '../../data/profile'

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function Page({ title, description, children, className = '' }) {
  const { nonce } = useTransition()
  const reduced = prefersReducedMotion()

  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`
    const desc = description || site.seoDescription
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', title ? `${title} — ${site.name}` : site.name)
    setMeta('property', 'og:description', desc)
    setMeta('name', 'twitter:title', title ? `${title} — ${site.name}` : site.name)
    setMeta('name', 'twitter:description', desc)
  }, [title, description])

  return (
    <motion.main
      id="main"
      tabIndex={-1}
      key={nonce}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: EASE.out, delay: 0.06 }}
      className={`outline-none ${className}`}
    >
      <motion.div
        initial={reduced ? false : 'hidden'}
        animate="show"
        variants={reduced ? undefined : { show: { transition: { staggerChildren: 0.09 } } }}
      >
        {children}
      </motion.div>
    </motion.main>
  )
}
