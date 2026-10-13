import { useId } from 'react'

import ScrollReveal from './ScrollReveal'

/**
 * Section primitives that enforce the site's spacing + rhythm so no page
 * invents its own layout. This is the main guard against "each page looks
 * like a different template".
 */

export function Section({ children, className = '', id, as = 'section', ...rest }) {
  const Tag = as
  return (
    <Tag id={id} className={`relative py-20 sm:py-24 lg:py-32 ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function SectionHead({ index, label, title, description, action, align = 'left' }) {
  return (
    <div
      className={`mb-12 flex flex-col gap-6 sm:mb-16 ${
        align === 'between' ? 'md:flex-row md:items-end md:justify-between' : ''
      }`}
    >
      <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
        <ScrollReveal variant="fade" duration={0.5}>
          <p className="eyebrow flex items-center gap-3">
            {index && <span className="text-accent">{index}</span>}
            <span className="h-px w-8 bg-line" />
            {label}
          </p>
        </ScrollReveal>
        {title && (
          <ScrollReveal variant="up" delay={0.06}>
            <h2 className="display mt-5 text-[clamp(2rem,5.2vw,3.6rem)]">{title}</h2>
          </ScrollReveal>
        )}
        {description && (
          <ScrollReveal variant="up" delay={0.12}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
              {description}
            </p>
          </ScrollReveal>
        )}
      </div>
      {action && (
        <ScrollReveal variant="fade" delay={0.16} className="shrink-0">
          {action}
        </ScrollReveal>
      )}
    </div>
  )
}

/** Small pill / chip used for technologies, tags and metadata. */
export function Tag({ children, className = '', accent = false, size = 'md' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono tracking-tight ${
        accent
          ? 'border-accent/30 bg-accent/10 text-accent'
          : 'border-line bg-white/[0.02] text-muted'
      } ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}

/** A hairline horizontal rule with a label slot — editorial separator. */
export function Rule({ label, className = '' }) {
  const id = useId()
  return (
    <div className={`flex items-center gap-5 ${className}`} id={id}>
      <span className="h-px flex-1 bg-line" />
      {label && <span className="eyebrow">{label}</span>}
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
