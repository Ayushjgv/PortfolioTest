import { ArrowUpRight, Globe, Mail } from 'lucide-react'

import { Github, Linkedin } from '../components/ui/BrandIcons'

import Page from '../components/system/Page'
import ContactForm from '../components/contact/ContactForm'
import ScrollReveal from '../components/ui/ScrollReveal'
import { Section } from '../components/ui/Section'
import { site, socials } from '../data/profile'

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail, globe: Globe }

export default function Contact() {
  return (
    <Page
      title="Contact"
      description={`Contact ${site.name} â€” available for freelance work, internships and collaborations.`}
      className="pt-16 sm:pt-[72px]"
    >
      <section className="container-page pb-10 pt-12 sm:pt-20">
        <ScrollReveal variant="fade" duration={0.5}>
          <p className="eyebrow flex items-center gap-3">
            <span className="text-accent">05</span>
            <span className="h-px w-8 bg-line" />
            Contact
          </p>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={0.08}>
          <h1 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,4.4rem)]">
            Letâ€™s work together.
          </h1>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={0.16}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
            [SHORT CONTACT MESSAGE â€” tell them what you can help with, what youâ€™re
            looking for, and when you usually reply. Keep it to two sentences.]
          </p>
        </ScrollReveal>
      </section>

      <Section className="!pt-6">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* details */}
          <div className="space-y-8">
            <ScrollReveal variant="up">
              <div className="rounded-[14px] border border-line bg-surface/40 p-6">
                <p className="eyebrow">Direct</p>
                <a
                  href={`mailto:${site.email}`}
                  className="link-draw mt-3 inline-block break-all text-lg text-bone transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
                <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
                  {site.availability}
                </p>
                <p className="mt-1 text-[13.5px] text-faint">{site.location}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={0.08}>
              <ul className="space-y-px overflow-hidden rounded-[14px] border border-line bg-line">
                {socials.map((s) => {
                  const Icon = ICONS[s.icon] ?? Globe
                  const external = s.href?.startsWith('http')
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                        className="group flex items-center gap-4 bg-ink px-5 py-4 transition-colors duration-300 hover:bg-surface"
                      >
                        <Icon size={16} className="shrink-0 text-faint transition-colors group-hover:text-accent" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13.5px] text-bone">{s.label}</span>
                          <span className="block truncate font-mono text-[12px] text-faint">
                            {s.handle}
                          </span>
                        </span>
                        {external && (
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                          />
                        )}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </ScrollReveal>

            <ScrollReveal variant="fade" delay={0.16}>
              <p className="font-mono text-[12px] leading-relaxed text-faint">
                The form below is wired for a future backend. Set{' '}
                <span className="text-accent">VITE_CONTACT_ENDPOINT</span> to enable real
                submissions â€” see <span className="text-muted">src/lib/contactApi.js</span>.
              </p>
            </ScrollReveal>
          </div>

          {/* form */}
          <ScrollReveal variant="up" delay={0.06}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </Section>
    </Page>
  )
}
