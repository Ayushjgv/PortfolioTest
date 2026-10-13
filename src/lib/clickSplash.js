/**
 * ============================================================
 * CLICK SPLASH ENGINE  (imperative, zero React re-renders)
 * ============================================================
 * A single global listener on `document` (pointerdown, capture phase)
 * spawns a liquid splash at the exact click coordinates for any
 * element matching SELECTOR.
 *
 * Why imperative instead of a React <Splash onClick> prop on every button?
 *  - 1 listener for the whole app instead of hundreds of handlers
 *  - the splash DOM lives outside React, so spawning one never triggers
 *    a re-render anywhere (important: 60fps clicks during page transitions)
 *  - it automatically covers third-party markup and future components
 *
 * ANIMATION: Web Animations API (compositor-friendly transform + opacity only).
 * If the browser lacks element.animate we silently no-op.
 */

import { prefersReducedMotion } from './reducedMotion'

const SELECTOR = 'a[href], button, [data-splash], input[type="submit"], summary, [role="button"]'
const MAX_SPLASHES = 12 // hard cap so spam-clicking can never flood the DOM
const LIFETIME = 620

let layer = null
let active = 0
let enabled = true

const isDisabled = (el) =>
  el.hasAttribute('data-no-splash') ||
  el.closest('[data-no-splash]') ||
  el.getAttribute('aria-disabled') === 'true' ||
  el.disabled === true

const buildSplash = (x, y) => {
  const host = document.createElement('div')
  host.className = 'splash-root'
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = `position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:10000;`

  // 1. filled ink blob (expands fast, then falls away)
  const blob = document.createElement('span')
  blob.style.cssText = `position:absolute;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:9999px;transform:translate3d(${x}px,${y}px,0) scale(0);background:radial-gradient(circle at 50% 50%, rgba(201,242,77,.95) 0%, rgba(201,242,77,.35) 45%, rgba(201,242,77,0) 70%);will-change:transform,opacity;`

  // 2. thin wave ring (slower, larger, the "ripple")
  const ring = document.createElement('span')
  ring.style.cssText = `position:absolute;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:9999px;border:1.5px solid rgba(201,242,77,.9);transform:translate3d(${x}px,${y}px,0) scale(.2);opacity:.9;will-change:transform,opacity;`

  // 3. offset echo ring for a liquid, non-mechanical double pulse
  const echo = document.createElement('span')
  echo.style.cssText = `position:absolute;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:9999px;border:1px solid rgba(237,236,240,.35);transform:translate3d(${x}px,${y}px,0) scale(.2);opacity:.5;will-change:transform,opacity;`

  host.append(blob, ring, echo)
  return { host, blob, ring, echo }
}

const run = ({ x, y }) => {
  if (typeof Element === 'undefined' || !Element.prototype.animate || !layer) return

  const { host, blob, ring, echo } = buildSplash(x, y)
  layer.appendChild(host)
  active += 1

  blob.animate(
    [
      { transform: `translate3d(${x}px,${y}px,0) scale(0)`, opacity: 0 },
      { transform: `translate3d(${x}px,${y}px,0) scale(1)`, opacity: 1, offset: 0.22 },
      { transform: `translate3d(${x}px,${y}px,0) scale(1.55)`, opacity: 0 },
    ],
    { duration: LIFETIME, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' },
  )

  ring.animate(
    [
      { transform: `translate3d(${x}px,${y}px,0) scale(.2)`, opacity: 0.9 },
      { transform: `translate3d(${x}px,${y}px,0) scale(2.6)`, opacity: 0 },
    ],
    { duration: LIFETIME, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' },
  )

  echo.animate(
    [
      { transform: `translate3d(${x}px,${y}px,0) scale(.2)`, opacity: 0.5 },
      { transform: `translate3d(${x}px,${y}px,0) scale(3.6)`, opacity: 0 },
    ],
    { duration: LIFETIME + 140, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' },
  )

  window.setTimeout(() => {
    host.remove()
    active -= 1
  }, LIFETIME + 60)
}

const onPointerDown = (e) => {
  if (!enabled) return
  if (e.button !== undefined && e.button !== 0) return
  if (active >= MAX_SPLASHES) return
  if (prefersReducedMotion()) return
  const target = e.target
  if (!(target instanceof Element)) return
  const el = target.closest(SELECTOR)
  if (!el || isDisabled(el)) return
  run({ x: e.clientX, y: e.clientY })
}

/** Mount the splash layer. Call once, from the app root. */
export function initClickSplash(root) {
  if (layer) return
  layer = document.createElement('div')
  layer.className = 'splash-layer'
  layer.setAttribute('aria-hidden', 'true')
  root.appendChild(layer)
  document.addEventListener('pointerdown', onPointerDown, true)
}

export function destroyClickSplash() {
  document.removeEventListener('pointerdown', onPointerDown, true)
  layer?.remove()
  layer = null
  active = 0
}

/** Temporarily disable splashes (used while the page curtain is covering). */
export function setSplashEnabled(next) {
  enabled = next
}

/** Fire a splash manually (e.g. from a custom control). */
export function splashAt(x, y) {
  if (active >= MAX_SPLASHES || prefersReducedMotion()) return
  run({ x, y })
}
