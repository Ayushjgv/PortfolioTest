import { motion } from 'motion/react'

import Page from '../components/system/Page'
import ScrollReveal, { RevealGroup, RevealItem } from '../components/ui/ScrollReveal'
import { Section } from '../components/ui/Section'
import Marquee from '../components/ui/Marquee'
import { EASE, viewportOnceLoose } from '../lib/motion'
import { usePrefersReducedMotion } from '../lib/reducedMotion'
import { allSkillNames, skillGroups } from '../data/skills'
import { site } from '../data/profile'

export default function Skills() {
  return (
    <Page
      title="Skills"
      description={`Technologies and tools used by ${site.name}.`}
      className="pt-16 sm:pt-[72px]"
    >
      <section className="container-page pb-12 pt-12 sm:pt-20">
        <ScrollReveal variant="fade" duration={0.5}>
          <p className="eyebrow flex items-center gap-3">
            <span className="text-accent">04</span>
            <span className="h-px w-8 bg-line" />
            Skills
          </p>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={0.08}>
          <h1 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,4.4rem)]">
            The tools behind the work.
          </h1>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={0.16}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
            Grouped by role rather than by alphabet. Levels are rough self-assessments
            used as a visual anchor â€” edit them freely in{' '}
            <span className="font-mono text-accent">src/data/skills.js</span>, or set a
            level to <span className="font-mono text-accent">null</span> to drop the bar.
          </p>
        </ScrollReveal>
      </section>

      <div className="border-y border-line/70 bg-ink-2/40 py-4">
        <Marquee items={allSkillNames} speed={54} />
      </div>

      <Section>
        <div className="container-page grid gap-x-8 gap-y-14 md:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <RevealGroup
              key={group.title}
              stagger={0.05}
              className="rounded-[14px] border border-line bg-surface/40 p-6 sm:p-8"
            >
              <RevealItem>
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                  <h2 className="display text-xl">
                    <span className="mr-2 font-mono text-[12px] text-accent">
                      {String(gi + 1).padStart(2, '0')}
                    </span>
                    {group.title}
                  </h2>
                </div>
                {group.blurb && (
                  <p className="mt-3 text-[13px] leading-relaxed text-faint">{group.blurb}</p>
                )}
              </RevealItem>

              <ul className="mt-6 space-y-4">
                {group.skills.map((skill) => (
                  <RevealItem key={skill.name}>
                    <SkillRow skill={skill} />
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>
          ))}
        </div>
      </Section>
    </Page>
  )
}

function SkillRow({ skill }) {
  const reduced = usePrefersReducedMotion()

  return (
    <li>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[14px] text-bone/90">
          {skill.name}
          {skill.note && <span className="ml-2 font-mono text-[12px] text-faint">{skill.note}</span>}
        </span>
        {skill.level != null && (
          <span className="font-mono text-[12px] text-faint">{skill.level}</span>
        )}
      </div>

      {skill.level != null && (
        <div
          className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line/80"
          role="meter"
          aria-valuenow={skill.level}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill.name} proficiency`}
        >
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={reduced ? { width: `${skill.level}%` } : { width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={viewportOnceLoose}
            transition={{ duration: 1, ease: EASE.out }}
          />
        </div>
      )}
    </li>
  )
}
