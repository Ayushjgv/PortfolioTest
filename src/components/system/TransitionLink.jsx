/**
 * <TransitionLink> — a NavLink that plays the page transition.
 *
 * Regular <NavLink> would change the URL instantly, which is exactly what the
 * curtain is designed to hide. Instead we call navigateTo(), which swaps the
 * location only while the screen is covered.
 *
 * Also handles:
 *  - middle-click / ctrl-click / shift-click / target=_blank → default browser
 *  - external hrefs → normal link
 *  - hash links on the same page → smooth scroll, no curtain
 */

import { forwardRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { useTransition } from '../../context/transitionStore'

const TransitionLink = forwardRef(function TransitionLink(
  { to, children, className = '', onClick, focus = true, ...rest },
  ref,
) {
  const { navigateTo } = useTransition()
  const location = useLocation()

  const isModified = (e) =>
    e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (isModified(e) || rest.target === '_blank') return // let the browser handle it
    if (!to || !to.startsWith('/')) return // external link

    const [path, hash] = to.split('#')
    const samePage = (path || location.pathname) === location.pathname

    if (hash && samePage) {
      e.preventDefault()
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    e.preventDefault()
    navigateTo(path, { focus })
  }

  return (
    <NavLink ref={ref} to={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </NavLink>
  )
})

export default TransitionLink
