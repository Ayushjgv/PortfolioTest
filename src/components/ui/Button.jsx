import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

import { useTransition } from '../../context/transitionStore'

/**
 * One button component for every CTA on the site.
 * Variants: primary | ghost | outline
 * Sizes:    sm | md | lg
 *
 * Rendered as <button>, <Link> or <a> depending on the props you pass.
 * The arrow icon slides on hover; the label gets a subtle squeeze on active.
 */

const VARIANTS = {
  primary:
    'bg-accent text-[#0b0d06] hover:bg-accent-soft shadow-[0_8px_30px_-12px_rgba(201,242,77,.6)]',
  outline:
    'border border-line bg-transparent text-bone hover:border-accent/60 hover:text-accent',
  ghost: 'bg-transparent text-muted hover:text-bone',
  solid: 'bg-bone text-ink hover:bg-white',
}

const SIZES = {
  // heights stay >= 40px so every button clears comfortable touch ergonomics
  // (WCAG 2.5.8 AA only requires 24px, but 40+ feels right on real devices)
  sm: 'h-10 px-5 text-[13px] gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-7 text-[15px] gap-2.5',
}

const BASE =
  'group relative inline-flex items-center justify-center rounded-full font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] active:scale-[.97] will-change-transform whitespace-nowrap'

function Inner({ children, arrow, arrowLeft }) {
  return (
    <>
      {arrowLeft && (
        <span className="transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-x-1">
          ←
        </span>
      )}
      <span className="relative">{children}</span>
      {arrow && (
        <span
          className="transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </>
  )
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    to,
    href,
    className = '',
    arrow = false,
    arrowLeft = false,
    type = 'button',
    ...rest
  },
  ref,
) {
  const { navigateTo } = useTransition()
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (to) {
    return (
      <Link
        ref={ref}
        to={to}
        className={cls}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
          e.preventDefault()
          navigateTo(to)
        }}
        {...rest}
      >
        <Inner arrow={arrow} arrowLeft={arrowLeft}>
          {children}
        </Inner>
      </Link>
    )
  }

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={cls}
        {...(href.startsWith('http')
          ? { target: '_blank', rel: 'noreferrer noopener' }
          : {})}
        {...rest}
      >
        <Inner arrow={arrow} arrowLeft={arrowLeft}>
          {children}
        </Inner>
      </a>
    )
  }

  return (
    <button ref={ref} type={type} className={cls} {...rest}>
      <Inner arrow={arrow} arrowLeft={arrowLeft}>
        {children}
      </Inner>
    </button>
  )
})

export default Button
