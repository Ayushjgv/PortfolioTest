import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Briefcase, GraduationCap, HeartHandshake } from 'lucide-react'

import Page from '../components/system/Page'
import ScrollReveal from '../components/ui/ScrollReveal'
import { Section, Tag } from '../components/ui/Section'
import { EASE, viewportOnceLoose } from '../lib/motion'
import { usePrefersReducedMotion } from '../lib/reducedMotion'
import { experience } from '../data/experience'
import { site } from '../data/profile'

const MARKERS = {
  work: Briefcase,
  education: GraduationCap,
  volunteer: HeartHandshake,
}

export default function Experience() {
  const listRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  // the progress line is bound to the list's own scroll progress
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 65%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const lineScale = reduced ? scrollYProgress : scaleY

  return (
    <Page
      title="Experience"
      description={`Experience and education of ${site.name}.`}
      className="pt-16 sm:pt-[72px]"
    >
      <section className="container-page pb-12 pt-12 sm:pt-20">
        <ScrollReveal variant="fade" duration={0.5}>
          <p className="eyebrow flex items-center gap-3">
            <span className="text-accent">03</span>
            <span className="h-px w-8 bg-line" />
            Experience
          </p>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={0.08}>
          <h1 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,4.4rem)]">
            Where Iâ€™ve been, and what I did there.
          </h1>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={0.16}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
            A timeline of roles, projects and education. The accent line on the left fills
            as you scroll.
          </p>
        </ScrollReveal>
      </section>

      <Section className="!pt-6">
        <div ref={listRef} className="container-page relative">
          {/* spine */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line sm:block"
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-accent sm:block"
            style={{ scaleY: lineScale }}
          />

          <ol className="space-y-12 sm:space-y-16">
            {experience.map((item) => (
              <TimelineItem key={item.id} item={item} />
            ))}
          </ol>

          <ScrollReveal variant="fade" className="mt-14 sm:pl-10">
            <p className="font-mono text-[12px] text-faint">
              Edit this timeline in <span className="text-accent">src/data/experience.js</span>
            </p>
          </ScrollReveal>
        </div>
      </Section>
    </Page>
  )
}

function TimelineItem({ item }) {
  const Marker = MARKERS[item.type] ?? Briefcase

  return (
    <motion.li
      className="relative pl-9 sm:pl-10"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnceLoose}
      transition={{ duration: 0.65, ease: EASE.out, delay: 0.05 }}
    >
      {/* marker */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full border border-line bg-ink sm:left-0"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </span>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Marker size={14} className="text-faint" />
            <h2 className="display text-[clamp(1.35rem,3.4vw,1.9rem)]">{item.role}</h2>
            {item.current && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
                Current
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-bone/85">
            {item.company}
            {item.location && <span className="text-faint"> Â· {item.location}</span>}
          </p>

          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-muted">
            {item.summary}
          </p>

          <ul className="mt-4 space-y-2">
            {item.points.map((p, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-bone/80">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                {p}
              </li>
            ))}
          </ul>

          {item.stack?.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {item.stack.map((s) => (
                <li key={s}>
                  <Tag size="sm">{s}</Tag>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="font-mono text-[12px] tracking-tight text-faint lg:whitespace-nowrap lg:pt-1">
          {item.period}
        </p>
      </div>
    </motion.li>
  )
}
