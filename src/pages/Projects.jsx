import { useMemo, useState } from 'react'
import { motion } from 'motion/react'

import Page from '../components/system/Page'
import ProjectCard from '../components/project/ProjectCard'
import ProjectModal from '../components/project/ProjectModal'
import ScrollReveal from '../components/ui/ScrollReveal'
import { Section } from '../components/ui/Section'
import { EASE } from '../lib/motion'
import { usePrefersReducedMotion } from '../lib/reducedMotion'
import { projectFilters, projects } from '../data/projects'
import { site } from '../data/profile'

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const reduced = usePrefersReducedMotion()

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <Page
      title="Projects"
      description={`Selected projects by ${site.name} â€” web, AI/ML and systems work.`}
      className="pt-16 sm:pt-[72px]"
    >
      <section className="container-page pb-10 pt-12 sm:pt-20">
        <ScrollReveal variant="fade" duration={0.5}>
          <p className="eyebrow flex items-center gap-3">
            <span className="text-accent">02</span>
            <span className="h-px w-8 bg-line" />
            Projects
          </p>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={0.08}>
          <h1 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,4.4rem)]">
            Things Iâ€™ve built, broken, and rebuilt.
          </h1>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={0.16}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
            Every project below is editable from a single data file. Replace the
            placeholders, drop images into <span className="font-mono text-accent">/public/images</span>,
            and the grid, filters and detail view update automatically.
          </p>
        </ScrollReveal>
      </section>

      <Section className="!pt-4">
        <div className="container-page">
          {/* filters */}
          <ScrollReveal variant="fade" className="mb-10 flex flex-wrap items-center gap-2">
            {projectFilters.map((f) => {
              const isActive = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={isActive}
                  className={`relative min-h-11 rounded-full border px-5 py-2 text-[13px] transition-colors duration-300 ${
                    isActive
                      ? 'border-accent/50 text-ink'
                      : 'border-line text-muted hover:border-accent/30 hover:text-bone'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-filter-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ duration: 0.4, ease: EASE.out }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              )
            })}
            <span className="ml-auto font-mono text-[12px] text-faint">
              {String(visible.length).padStart(2, '0')} projects
            </span>
          </ScrollReveal>

          {/* grid â€” layout animation makes filtering re-flow smoothly.
              No <AnimatePresence> here on purpose: popLayout leaves exited
              cards in the DOM (and in the a11y tree) while they animate out,
              which is confusing for keyboard/screen-reader users. Items
              animate in; removal is instant. */}
          <motion.div layout={!reduced} className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {visible.map((p, i) => (
              <motion.div
                key={p.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.45,
                  ease: EASE.out,
                  delay: reduced ? 0 : Math.min(i * 0.04, 0.24),
                }}
              >
                <ProjectCard project={p} index={i} onOpen={setActive} />
              </motion.div>
            ))}
          </motion.div>

          {visible.length === 0 && (
            <p className="py-20 text-center text-sm text-faint">
              No projects in this category yet.
            </p>
          )}
        </div>
      </Section>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </Page>
  )
}
