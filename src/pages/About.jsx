import { GraduationCap } from 'lucide-react'

import Page from '../components/system/Page'
import Photo from '../components/ui/Photo'
import ScrollReveal, { RevealGroup, RevealItem } from '../components/ui/ScrollReveal'
import { Section, SectionHead } from '../components/ui/Section'
import Button from '../components/ui/Button'
import { aboutSections, education, site, stats } from '../data/profile'

export default function About() {
  return (
    <Page title="About" description={`About ${site.name} â€” ${site.tagline}`} className="pt-16 sm:pt-[72px]">
      {/* header */}
      <section className="container-page pb-8 pt-12 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <ScrollReveal variant="fade" duration={0.5}>
              <p className="eyebrow flex items-center gap-3">
                <span className="text-accent">01</span>
                <span className="h-px w-8 bg-line" />
                About me
              </p>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={0.08}>
              <h1 className="display mt-6 text-[clamp(2.2rem,7vw,4.4rem)]">
                The short version of who I am.
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={0.16}>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted">
                {site.shortBio}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/projects" size="md" arrow>
                  See my work
                </Button>
                <Button to="/contact" size="md" variant="outline">
                  Get in touch
                </Button>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="mask" delay={0.12} duration={0.9}>
            <Photo className="mx-auto w-full max-w-sm lg:max-w-none" />
          </ScrollReveal>
        </div>
      </section>

      {/* stats */}
      <section className="container-page py-12 sm:py-16">
        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line lg:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label} className="bg-ink p-6 sm:p-8">
              <p className="display text-[clamp(1.8rem,5vw,2.8rem)]">
                {s.value}
                <span className="text-accent">{s.suffix}</span>
              </p>
              <p className="eyebrow mt-2">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* narrative sections */}
      <Section>
        <div className="container-page space-y-16 sm:space-y-24">
          {aboutSections.map((section, i) => (
            <div
              key={section.key}
              className="grid gap-6 border-t border-line/70 pt-10 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16"
            >
              <ScrollReveal variant="fade">
                <p className="eyebrow">
                  <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>{' '}
                  / {section.label}
                </p>
              </ScrollReveal>
              <ScrollReveal variant="up" delay={0.06}>
                <p className="text-[clamp(1.05rem,2.4vw,1.45rem)] leading-[1.55] text-bone/90">
                  {section.body}
                </p>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </Section>

      {/* education */}
      <Section className="border-t border-line/70 bg-ink-2/30">
        <div className="container-page">
          <SectionHead index="02" label="Education" title="Where I studied." />
          <RevealGroup className="space-y-px overflow-hidden rounded-[14px] border border-line bg-line">
            {education.map((e) => (
              <RevealItem key={`${e.degree}-${e.year}`} className="bg-ink p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="display text-xl">
                    <span className="text-accent">[</span>
                    {e.degree}
                    <span className="text-accent">]</span>
                  </h3>
                  <span className="font-mono text-[12px] text-faint">{e.year}</span>
                </div>
                <p className="mt-2 text-sm text-bone/85">{e.university}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{e.detail}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <ScrollReveal variant="fade" className="mt-8 flex items-center gap-3">
            <GraduationCap size={16} className="text-faint" />
            <p className="font-mono text-[12px] text-faint">
              Replace the entries above in{' '}
              <span className="text-accent">src/data/profile.js</span> â†’ education
            </p>
          </ScrollReveal>
        </div>
      </Section>
    </Page>
  )
}
