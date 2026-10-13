import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Sparkles, BookOpen, Hammer, Radio } from 'lucide-react'

import Page from '../components/system/Page'
import Button from '../components/ui/Button'
import Photo from '../components/ui/Photo'
import ProjectCard from '../components/project/ProjectCard'
import ProjectModal from '../components/project/ProjectModal'
import ScrollReveal, { RevealGroup, RevealItem } from '../components/ui/ScrollReveal'
import { Rule, Section, SectionHead, Tag } from '../components/ui/Section'
import { currently, site, socials } from '../data/profile'
import { getFeaturedProjects } from '../data/projects'
import { allSkillNames } from '../data/skills'
import Marquee from '../components/ui/Marquee'

export default function Home() {
  const featured = getFeaturedProjects()
  const [activeProject, setActiveProject] = useState(null)

  return (
    <Page
      title="Home"
      description={`${site.name} â€” ${site.tagline}`}
      className="pt-16 sm:pt-[72px]"
    >
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="container-page relative pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <ScrollReveal variant="fade" duration={0.5}>
              <p className="eyebrow flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  {site.availability}
                </span>
                <span className="h-3 w-px bg-line" />
                <span>{site.location}</span>
              </p>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={0.08}>
              <h1 className="display mt-6 text-[clamp(2.6rem,8.4vw,5.6rem)]">
                Hi, Iâ€™m{' '}
                <span className="relative inline-block">
                  {site.name}
                  <motion.span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                  />
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={0.16}>
              <p className="mt-7 max-w-xl text-lg leading-snug text-bone/90 sm:text-xl">
                {site.tagline}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={0.24}>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
                {site.shortBio}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={0.32}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button to="/projects" size="lg" arrow>
                  View projects
                </Button>
                <Button to="/contact" size="lg" variant="outline">
                  Contact me
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade" delay={0.42}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                {socials.slice(0, 3).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    {...(s.href.startsWith('http')
                      ? { target: '_blank', rel: 'noreferrer noopener' }
                      : {})}
                    className="group inline-flex min-h-11 items-center gap-1.5 font-mono text-[12px] tracking-tight text-faint transition-colors hover:text-accent"
                  >
                    {s.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="mask" delay={0.15} duration={0.9}>
            <Photo className="mx-auto w-full max-w-sm lg:max-w-none" />
          </ScrollReveal>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ TECH STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="border-y border-line/70 bg-ink-2/40 py-4">
        <Marquee items={allSkillNames} />
      </div>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ SELECTED PROJECTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Section id="selected-projects">
        <div className="container-page">
          <SectionHead
            index="01"
            label="Selected work"
            title="Projects Iâ€™m proud of."
            description="A few things Iâ€™ve designed, built and shipped. Each one started as a problem I wanted to solve properly."
            align="between"
            action={
              <Button to="/projects" variant="outline" size="sm" arrow>
                All projects
              </Button>
            }
          />

          <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <RevealItem key={p.id}>
                <ProjectCard project={p} onOpen={setActiveProject} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ ABOUT PREVIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Section className="border-y border-line/70 bg-ink-2/30">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <ScrollReveal variant="up">
            <p className="eyebrow flex items-center gap-3">
              <span className="text-accent">02</span>
              <span className="h-px w-8 bg-line" />
              About me
            </p>
            <h2 className="display mt-5 text-[clamp(1.9rem,4.6vw,3.2rem)]">
              I care about the details most people never see.
            </h2>
          </ScrollReveal>

          <div>
            <ScrollReveal variant="up" delay={0.08}>
              <p className="text-[15px] leading-relaxed text-muted">{site.shortBio}</p>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={0.14}>
              <p className="mt-5 text-[15px] leading-relaxed text-muted">
                I work end to end: shaping the idea, designing the interface, writing the
                code, and keeping it fast and accessible after launch. The best part is
                the part most people skip â€” the loading state, the empty state, the
                keyboard path, the 320px viewport.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={0.2}>
              <div className="mt-8">
                <Button to="/about" variant="outline" size="sm" arrow>
                  Read more
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ SKILLS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Section id="stack">
        <div className="container-page">
          <SectionHead
            index="03"
            label="Tech"
            title="Tools I reach for."
            description="A working stack, not a rÃ©sumÃ© keyword list. Everything below has shipped real work."
            align="between"
            action={
              <Button to="/skills" variant="outline" size="sm" arrow>
                All skills
              </Button>
            }
          />

          <RevealGroup className="flex flex-wrap gap-2.5">
            {allSkillNames.slice(0, 18).map((name) => (
              <RevealItem key={name}>
                <Tag className="px-3.5 py-2 text-[12.5px] transition-colors duration-300 hover:border-accent/40 hover:text-accent">
                  {name}
                </Tag>
              </RevealItem>
            ))}
            <RevealItem>
              <Tag accent className="px-3.5 py-2 text-[12.5px]">
                + more
              </Tag>
            </RevealItem>
          </RevealGroup>
        </div>
      </Section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ CURRENTLY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Section className="border-t border-line/70">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <ScrollReveal variant="up">
              <p className="eyebrow flex items-center gap-3">
                <Radio size={13} className="text-accent" />
                Currently
              </p>
              <h2 className="display mt-5 text-[clamp(1.8rem,4.2vw,2.8rem)]">
                What Iâ€™m up to right now.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                {currently.status}
              </p>
            </ScrollReveal>

            <RevealGroup className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3">
              {[
                { icon: Hammer, label: 'Building', value: currently.building },
                { icon: Sparkles, label: 'Learning', value: currently.learning },
                { icon: BookOpen, label: 'Reading', value: currently.reading },
              ].map(({ icon: Icon, label, value }) => (
                <RevealItem key={label} className="bg-ink p-6">
                  <Icon size={16} className="text-accent" />
                  <p className="eyebrow mt-4">{label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-bone/90">{value}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Section className="overflow-hidden">
        <div className="container-page">
          <Rule label="Next" className="mb-14" />
          <ScrollReveal variant="mask" duration={0.9}>
            <h2 className="display text-center text-[clamp(2.2rem,9vw,6.5rem)]">
              Letâ€™s build{' '}
              <span className="relative inline-block text-accent">
                something
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-[3px] origin-left bg-accent/40"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                />
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={0.15} className="mt-10 flex justify-center">
            <Button to="/contact" size="lg" arrow>
              Contact me
            </Button>
          </ScrollReveal>
        </div>
      </Section>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </Page>
  )
}
