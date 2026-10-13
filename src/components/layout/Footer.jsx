import { useState } from 'react'
import { Mail, Globe, ArrowUpRight } from 'lucide-react'

import { Github, Linkedin } from '../ui/BrandIcons'
import { site, socials } from '../../data/profile'
import { navLinks } from '../../data/profile'
import TransitionLink from '../system/TransitionLink'

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail, globe: Globe }

export default function Footer() {
  // computed once on mount — the copyright year never changes mid-session
  const [year] = useState(() => new Date().getFullYear())

  return (
    <footer className="relative mt-10 border-t border-line/70">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="eyebrow">Let’s work together</p>
            <p className="display mt-4 max-w-xs text-[clamp(1.6rem,4vw,2.2rem)]">
              Have something in mind?
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-draw mt-5 inline-block text-sm text-accent"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Index</p>
            <ul className="mt-4 space-y-2.5">
              {[{ label: 'Home', to: '/' }, ...navLinks].map((l) => (
                <li key={l.to}>
                  <TransitionLink
                    to={l.to}
                    className="link-draw text-sm text-muted transition-colors hover:text-bone"
                  >
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {socials.map((s) => {
                const Icon = ICONS[s.icon] ?? Globe
                const external = s.href?.startsWith('http')
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                      className="group inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-bone"
                    >
                      <Icon size={14} className="text-faint transition-colors group-hover:text-accent" />
                      <span className="link-draw">{s.label}</span>
                      {external && (
                        <ArrowUpRight
                          size={12}
                          className="translate-y-px opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line/70 pt-6 text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono tracking-tight">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono tracking-tight">
            Built with React · Vite · Tailwind · Motion — {site.location}
          </p>
        </div>
      </div>
    </footer>
  )
}
