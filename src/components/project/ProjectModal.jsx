/**
 * ProjectModal — the expanded project detail.
 *
 * Built as an accessible dialog:
 *  - role="dialog" aria-modal, labelled by the project title
 *  - focus moves into the panel on open and returns to the trigger on close
 *  - Tab is trapped inside, Escape closes, body scroll is locked
 *  - backdrop click closes, content scroll does NOT close
 *
 * Animation: shared layoutId between the card image and the modal hero, so
 * the image appears to travel from the card to the panel.
 */

import { useCallback, useEffect, useId, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'

import { Github } from '../ui/BrandIcons'
import { EASE } from '../../lib/motion'
import { prefersReducedMotion } from '../../lib/reducedMotion'
import { Tag } from '../ui/Section'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const returnFocus = useRef(null)
  const titleId = useId()
  const reduced = prefersReducedMotion()

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter(
        (n) => n.offsetParent !== null,
      )
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!project) return
    returnFocus.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus()
    }
  }, [project])

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center p-0 sm:items-center sm:p-6"
          onKeyDown={handleKey}
        >
          <motion.button
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 cursor-default bg-ink/85 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.985 }}
            transition={{ duration: 0.45, ease: EASE.out }}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[18px] border border-line bg-ink-2 sm:rounded-[18px]"
          >
            {/* hero image */}
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-ink">
              <motion.img
                layoutId={reduced ? undefined : `project-image-${project.id}`}
                src={project.image}
                alt={`${project.title} — project preview`}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-transparent" />

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-ink/60 text-bone backdrop-blur transition-colors hover:border-accent/60 hover:text-accent"
              >
                <X size={16} />
              </button>
            </div>

            {/* content */}
            <div className="-mt-10 flex-1 overflow-y-auto px-5 pb-8 pt-6 sm:px-8">
              <p className="eyebrow">
                {project.category} · {project.year}
              </p>
              <h2 id={titleId} className="display mt-3 text-[clamp(1.6rem,4.4vw,2.4rem)]">
                {project.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {project.description}
              </p>

              {project.highlights?.length > 0 && (
                <ul className="mt-7 space-y-3 border-l border-line pl-5">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="text-[14px] leading-relaxed text-bone/85">
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {project.long && (
                <div className="mt-7 space-y-4 text-[14.5px] leading-relaxed text-muted">
                  {String(project.long)
                    .split('\n')
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-2">
                {project.technologies.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
                {project.github && project.github !== '#' && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-5 text-[13px] text-bone transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <Github size={14} /> View source
                  </a>
                )}
                {project.live && project.live !== '#' && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-[13px] font-medium text-ink transition-colors hover:bg-accent-soft"
                  >
                    Live demo <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
