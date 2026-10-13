/**
 * Headless smoke test over the Chrome DevTools Protocol.
 * Usage: node scripts/smoke.mjs [baseUrl]
 *
 * Checks, per route:
 *   - page renders (expected heading text present)
 *   - document.title updated
 *   - no console errors / uncaught exceptions
 *   - no horizontal overflow at 320 / 375 / 768 / 1024 / 1440
 * Then exercises:
 *   - splash layer is created on click
 *   - in-app navigation actually changes the route + title
 *   - project modal opens and closes
 *   - easter egg toast appears
 */

import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.argv[2] || 'http://localhost:4173'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9222

const ROUTES = [
  { path: '/', expect: 'Hi, I' },
  { path: '/about', expect: 'The short version' },
  { path: '/projects', expect: 'Things I' },
  { path: '/experience', expect: 'Where I' },
  { path: '/skills', expect: 'The tools behind' },
  { path: '/contact', expect: 'Let' },
  { path: '/this-route-does-not-exist', expect: 'Looks like you got lost' },
]

const WIDTHS = [320, 375, 768, 1024, 1440]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ── minimal CDP client ─────────────────────────────────────────── */
class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    this.handlers = new Map()
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        if (msg.error) reject(new Error(msg.error.message))
        else resolve(msg.result)
      } else if (msg.method) {
        this.handlers.get(msg.method)?.forEach((fn) => fn(msg.params))
      }
    })
  }
  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, new Set())
    this.handlers.get(method).add(fn)
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }))
  }
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + expression)
    return r.result.value
  }
  async goto(url) {
    await this.send('Page.navigate', { url })
    await sleep(1200)
  }
}

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'cdp-'))
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--disable-extensions',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ])

  let wsUrl
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      wsUrl = (await r.json()).webSocketDebuggerUrl
      break
    } catch {
      await sleep(300)
    }
  }
  if (!wsUrl) throw new Error('Chrome did not start')

  const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
  const page = targets.find((t) => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r))
  const cdp = new CDP(ws)

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Log.enable')
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })

  let problems = []
  let currentRoute = '/'
  cdp.on('Runtime.exceptionThrown', (p) =>
    problems.push(`[${currentRoute}] EXCEPTION: ${p.exceptionDetails.text}`),
  )
  cdp.on('Runtime.consoleAPICalled', (p) => {
    if (p.type === 'error' || p.type === 'warning') {
      const text = p.args.map((a) => a.value ?? a.description ?? a.type).join(' ')
      problems.push(`[${currentRoute}] CONSOLE ${p.type}: ${text}`)
    }
  })
  cdp.on('Log.entryAdded', (p) => {
    if (p.entry.level === 'error') problems.push(`[${currentRoute}] LOG: ${p.entry.text}`)
  })

  /* ── 1. every route ─────────────────────────────────────────── */
  for (const r of ROUTES) {
    currentRoute = r.path
    await cdp.goto(BASE + r.path)
    const text = await cdp.eval('document.body.innerText')
    const title = await cdp.eval('document.title')
    const h1 = await cdp.eval('document.querySelector("h1")?.innerText ?? ""')
    const landmarks = await cdp.eval(
      'JSON.stringify({main:!!document.querySelector("main#main"),nav:!!document.querySelector("nav[aria-label]"),footer:!!document.querySelector("footer")})',
    )
    const ok = text.includes(r.expect)
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${r.path.padEnd(28)} h1="${h1.replace(/\n/g, ' ').slice(0, 44)}"  title="${title.slice(0, 40)}"  ${landmarks}`,
    )
    if (!ok) problems.push(`[${r.path}] expected text not found: ${r.expect}`)
    if (!title || title.includes('[YOUR NAME]') === false && r.path !== '/')
      problems.push(`[${r.path}] title not set: ${title}`)
  }

  /* ── 2. horizontal overflow at each breakpoint ───────────────── */
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  for (const w of WIDTHS) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 900,
      deviceScaleFactor: 1,
      mobile: w < 768,
    })
    for (const r of ['/', '/projects', '/skills', '/experience', '/contact']) {
      currentRoute = r
      await cdp.goto(BASE + r)
      const over = await cdp.eval(
        'document.documentElement.scrollWidth - document.documentElement.clientWidth',
      )
      if (over > 1) problems.push(`OVERFLOW ${w}px on ${r}: ${over}px`)
    }
    console.log(`overflow check @ ${w}px — done`)
  }

  /* ── 3. interactions ────────────────────────────────────────── */
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  await sleep(1400) // let the preloader finish

  // 3a. splash layer + splash node on a real click
  const splashInfo = await cdp.eval(`(() => {
    const btn = [...document.querySelectorAll('a[href]')].find(a => a.textContent.includes('View projects'))
    if (!btn) return JSON.stringify({found:false})
    const r = btn.getBoundingClientRect()
    const x = r.left + r.width/2, y = r.top + r.height/2
    btn.dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, clientX:x, clientY:y, button:0, pointerType:'mouse'}))
    return new Promise(res => setTimeout(() => res(JSON.stringify({
      found:true,
      layer: !!document.querySelector('.splash-layer'),
      nodes: document.querySelectorAll('.splash-layer > div').length
    })), 100))
  })()`)
  console.log('splash ->', splashInfo)
  if (JSON.parse(splashInfo).nodes < 1) problems.push('click splash did not spawn a node')

  // 3b. the same click completes navigation (wait out the curtain)
  await cdp.eval(`[...document.querySelectorAll('a[href]')].find(a => a.textContent.includes('View projects')).click()`)
  await sleep(1400)
  const afterNav = await cdp.eval(
    'JSON.stringify({path: location.pathname, h1: document.querySelector("h1")?.innerText})',
  )
  console.log('after nav ->', afterNav)
  if (!JSON.parse(afterNav).path.includes('projects'))
    problems.push('in-app navigation did not reach /projects')

  // 3c. project modal (on the home page — featured cards are clickable too)
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  await sleep(1200)
  const modal = await cdp.eval(`(() => {
    const card = document.querySelector('article button[aria-label^="Open details"]')
    if (!card) return JSON.stringify({found:false})
    card.click()
    return new Promise(res => setTimeout(() => res(JSON.stringify({
      found:true,
      dialog: !!document.querySelector('[role="dialog"]'),
      locked: document.body.style.overflow
    })), 600))
  })()`)
  console.log('modal ->', modal)
  const m = JSON.parse(modal)
  if (!m.dialog) problems.push('project modal did not open')
  if (m.locked !== 'hidden') problems.push(`body scroll not locked (got "${m.locked}")`)

  // close with Escape
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await sleep(600)
  const closed = await cdp.eval('!document.querySelector(\'[role="dialog"]\')')
  if (!closed) problems.push('Escape did not close the project modal')
  console.log('modal closed ->', closed)

  // 3d. filters on /projects
  currentRoute = '/projects'
  await cdp.goto(BASE + '/projects')
  await sleep(900)
  const filter = await cdp.eval(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'AI / ML')
    if (!b) return 'no filter'
    b.click()
    return new Promise(res => setTimeout(() => res(document.querySelectorAll('article').length), 600))
  })()`)
  console.log('AI/ML filter -> project cards:', filter)
  if (filter !== 2) problems.push(`AI/ML filter expected 2 cards, got ${filter}`)

  // 3e. contact form validation + states
  currentRoute = '/contact'
  await cdp.goto(BASE + '/contact')
  await sleep(900)
  const validation = await cdp.eval(`(() => {
    const form = document.querySelector('form')
    form.querySelector('button[type=submit]').click()
    return new Promise(res => setTimeout(() => res(JSON.stringify({
      errors: [...document.querySelectorAll('[id$="-error"]')].map(e => e.textContent),
      invalid: form.querySelectorAll('[aria-invalid="true"]').length
    })), 300))
  })()`)
  console.log('form validation ->', validation)
  if (JSON.parse(validation).invalid < 3) problems.push('form validation did not flag all fields')

  const submission = await cdp.eval(`(() => {
    const set = (n,v) => { const el = document.querySelector('[id$="-'+n+'"]'); 
      const proto = el.tagName==='TEXTAREA'?HTMLTextAreaElement:HTMLInputElement
      Object.getOwnPropertyDescriptor(proto.prototype,'value').set.call(el,v)
      el.dispatchEvent(new Event('input',{bubbles:true})) }
    set('name','Ada Lovelace')
    set('email','ada@example.com')
    set('message','Hello there, this is a long enough test message.')
    document.querySelector('form button[type=submit]').click()
    return new Promise(res => setTimeout(() => res(JSON.stringify({
      success: document.body.innerText.includes('Message sent.'),
      hasForm: !!document.querySelector('form')
    })), 2200))
  })()`)
  console.log('form submit ->', submission)
  if (!JSON.parse(submission).success) problems.push('contact form did not reach the success state')

  // 3f. easter egg
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  await sleep(1200)
  const egg = await cdp.eval(`(() => {
    const logo = document.querySelector('header a[aria-label*="home"]')
    if (!logo) return 'no logo'
    for (let i=0;i<5;i++) logo.click()
    return new Promise(res => setTimeout(() => {
      // innerText reflects CSS text-transform, so compare case-insensitively
      res(String(/easter egg/i.test(document.body.innerText)))
    }, 500))
  })()`)
  console.log('easter egg toast ->', egg)
  if (egg !== 'true') problems.push(`easter egg did not fire after 5 logo clicks (got ${egg})`)

  // 3g. back/forward through the transition system
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  await sleep(1000)
  await cdp.eval(`[...document.querySelectorAll('a[href]')].find(a=>a.getAttribute('href')==='/skills').click()`)
  await sleep(1400)
  const onSkills = await cdp.eval('location.pathname')
  await cdp.eval('history.back()')
  await sleep(1600)
  const afterBack = await cdp.eval('JSON.stringify({path: location.pathname, h1: document.querySelector("h1")?.innerText})')
  console.log('history: click ->', onSkills, '| back ->', afterBack)
  if (onSkills !== '/skills') problems.push(`nav click did not reach /skills (got ${onSkills})`)
  if (!JSON.parse(afterBack).path.includes('/') || JSON.parse(afterBack).path.includes('skills'))
    problems.push(`history.back() did not return home (got ${afterBack})`)
  await cdp.eval('history.forward()')
  await sleep(1600)
  const afterFwd = await cdp.eval('location.pathname')
  console.log('history forward ->', afterFwd)
  if (afterFwd !== '/skills') problems.push(`history.forward() did not reach /skills (got ${afterFwd})`)

  // 3h. mobile menu at 375px
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 780,
    deviceScaleFactor: 2,
    mobile: true,
  })
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  await sleep(1200)
  const menu = await cdp.eval(`(() => {
    const btn = document.querySelector('button[aria-controls="mobile-menu"]')
    if (!btn) return JSON.stringify({found:false})
    btn.click()
    return new Promise(res => setTimeout(() => {
      const sheet = document.getElementById('mobile-menu')
      res(JSON.stringify({
        found:true,
        expanded: btn.getAttribute('aria-expanded'),
        sheet: !!sheet,
        links: sheet ? sheet.querySelectorAll('a[href^="/"]').length : 0,
        locked: document.body.style.overflow
      }))
    }, 700))
  })()`)
  console.log('mobile menu ->', menu)
  const mm = JSON.parse(menu)
  if (!mm.sheet) problems.push('mobile menu did not open')
  if (mm.links < 5) problems.push(`mobile menu has ${mm.links} links, expected 5`)
  if (mm.locked !== 'hidden') problems.push('body not scroll-locked by mobile menu')

  // navigate from the mobile sheet
  const mobileNav = await cdp.eval(`(() => {
    const link = [...document.querySelectorAll('#mobile-menu a[href="/projects"]')][0]
    if (!link) return 'no link'
    link.click()
    return new Promise(res => setTimeout(() => res(location.pathname), 1400))
  })()`)
  console.log('mobile menu nav ->', mobileNav)
  if (mobileNav !== '/projects') problems.push(`mobile menu navigation failed (got ${mobileNav})`)

  // Escape closes the sheet
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  await sleep(1100)
  await cdp.eval(`document.querySelector('button[aria-controls="mobile-menu"]').click()`)
  await sleep(600)
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await sleep(600)
  const sheetClosed = await cdp.eval('!document.getElementById("mobile-menu")')
  if (!sheetClosed) problems.push('Escape did not close the mobile menu')
  console.log('mobile menu escape ->', sheetClosed)

  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })

  /* ── 4. reduced motion ──────────────────────────────────────── */
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  })
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  await sleep(900)
  const rm = await cdp.eval(
    "JSON.stringify({ curtainMounted: document.querySelectorAll('div[style*=\"visibility\"]').length, preloaderGone: !document.body.innerText.includes('%') })",
  )
  console.log('reduced motion ->', rm)
  const rmNav = await cdp.eval(`(() => {
    [...document.querySelectorAll('a[href]')].find(a=>a.getAttribute('href')==='/about').click()
    return new Promise(r => setTimeout(() => r(location.pathname), 400))
  })()`)
  console.log('reduced motion nav ->', rmNav)
  if (rmNav !== '/about') problems.push('navigation broken under prefers-reduced-motion')
  await cdp.send('Emulation.setEmulatedMedia', { features: [] })

  /* ── 5. a11y spot checks ────────────────────────────────────── */
  currentRoute = '/'
  await cdp.goto(BASE + '/')
  const a11y = await cdp.eval(`JSON.stringify({
    imgsNoAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
    imgs: document.images.length,
    buttonsNoName: [...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length,
    linksNoName: [...document.querySelectorAll('a[href]')].filter(a => !a.textContent.trim() && !a.getAttribute('aria-label')).length,
    h1count: document.querySelectorAll('h1').length,
    skipLink: !!document.querySelector('a[href="#main"]'),
    langAttr: document.documentElement.lang
  })`)
  console.log('a11y ->', a11y)
  const ax = JSON.parse(a11y)
  if (ax.imgsNoAlt) problems.push(`${ax.imgsNoAlt} images without alt`)
  if (ax.buttonsNoName) problems.push(`${ax.buttonsNoName} buttons without accessible name`)
  if (ax.linksNoName) problems.push(`${ax.linksNoName} links without accessible name`)
  if (ax.h1count !== 1) problems.push(`expected exactly 1 h1, got ${ax.h1count}`)

  console.log('\n──────── RESULT ────────')
  if (problems.length === 0) console.log('ALL CHECKS PASSED')
  else problems.forEach((p) => console.log('✗ ' + p))

  ws.close()
  chrome.kill()
  try { rmSync(profile, { recursive: true, force: true }) } catch {}
  process.exit(problems.length ? 1 : 0)
}

main().catch((e) => {
  console.error('SMOKE TEST CRASHED:', e)
  process.exit(2)
})
