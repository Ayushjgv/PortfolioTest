/**
 * Design audit: computed styles, contrast, tap targets, stuck-reveal detection.
 * Usage: node scripts/audit.mjs [baseUrl]
 */

import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.argv[2] || 'http://localhost:4173'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9555
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    this.handlers = new Map()
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data)
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id)
        this.pending.delete(m.id)
        if (m.error) reject(new Error(m.error.message))
        else resolve(m.result)
      } else if (m.method) this.handlers.get(m.method)?.forEach((f) => f(m.params))
    })
  }
  on(m, f) {
    if (!this.handlers.has(m)) this.handlers.set(m, new Set())
    this.handlers.get(m).add(f)
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((res, rej) => this.pending.set(id, { resolve: res, reject: rej }))
  }
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''))
    return r.result.value
  }
}

const AUDIT = `(() => {
  const out = {}
  const px = (v) => parseFloat(v) || 0

  /* ---- helpers ---- */
  const srgb = (c) => { c /= 255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4) }
  const lum = ([r,g,b]) => 0.2126*srgb(r) + 0.7152*srgb(g) + 0.0722*srgb(b)
  const parse = (s) => {
    const m = s && s.match(/rgba?\\(([^)]+)\\)/)
    if (!m) return null
    const p = m[1].split(',').map(x => parseFloat(x))
    return { rgb: [p[0],p[1],p[2]], a: p.length > 3 ? p[3] : 1 }
  }
  const over = (fg, bg, a) => fg.map((c,i) => c*a + bg[i]*(1-a))
  // walk ancestors until we find a non-transparent background
  const bgOf = (el) => {
    let acc = [8,8,10]
    const stack = []
    let n = el
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break }
      n = n.parentElement
    }
    for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i].rgb, acc, stack[i].a)
    return acc
  }
  const ratio = (a, b) => { const [x,y] = [lum(a), lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05) }

  const visible = (el) => {
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden') return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }
  const text = (el) => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)

  /* ---- 1. stuck reveals: should never be visible at opacity 0 ---- */
  out.stuck = [...document.querySelectorAll('main *')]
    .filter(el => visible(el) && text(el) && px(getComputedStyle(el).opacity) < 0.05)
    .slice(0, 6)
    .map(el => el.tagName + ' "' + el.textContent.trim().slice(0, 40) + '"')

  /* ---- 2. contrast of every visible text node ---- */
  const low = []
  const seen = new Set()
  document.querySelectorAll('main *, header *, footer *').forEach(el => {
    if (!visible(el) || !text(el)) return
    const s = getComputedStyle(el)
    const key = s.color + '|' + s.fontSize + '|' + el.className
    if (seen.has(key)) return
    seen.add(key)
    const fg = parse(s.color)
    if (!fg) return
    const bg = bgOf(el)
    const eff = fg.a < 1 ? over(fg.rgb, bg, fg.a) : fg.rgb
    const r = ratio(eff, bg)
    const size = px(s.fontSize)
    const bold = px(s.fontWeight) >= 700
    const large = size >= 24 || (size >= 18.66 && bold)
    const need = large ? 3 : 4.5
    if (r < need) low.push({
      t: el.textContent.trim().slice(0, 38),
      ratio: +r.toFixed(2), need, size: +size.toFixed(1), color: s.color, large
    })
  })
  out.lowContrast = low.sort((a,b) => a.ratio - b.ratio).slice(0, 10)

  /* ---- 3. body copy legibility ---- */
  const paras = [...document.querySelectorAll('main p, main li')]
    .filter(el => visible(el) && el.textContent.trim().length > 80)
    .map(el => px(getComputedStyle(el).fontSize))
  out.bodyFontSizes = [...new Set(paras)].sort((a,b)=>a-b).slice(0, 8)
  out.bodyTooSmall = paras.filter(s => s < 15).length

  /* ---- 4. tap targets (effective hit area, not just the box) ----
     .link-draw grows its hit area with a transparent ::before overlay of
     inset -13px, so measure that too. WCAG 2.5.8 AA floor is 24x24;
     we report under 44 as a comfort warning. */
  const AA = 24
  const COMFY = 44
  out.smallTargets = [...document.querySelectorAll('a, button, input, textarea, [role="button"]')]
    .filter(visible)
    .map(el => {
      const r = el.getBoundingClientRect()
      let h = r.height
      let w = r.width
      const ld = el.classList.contains('link-draw') || el.querySelector(':scope > .link-draw')
      if (ld) { h += 26; w += 10 }
      return { r, el, h, w }
    })
    .filter(({ r, el, h, w }) => {
      if (el.tagName === 'A' && el.closest('p, li, .marquee-track')) return false
      if (el.classList.contains('sr-only')) return false
      return h < COMFY || w < COMFY
    })
    .map(({ el, h, w }) => {
      const aaa = h >= AA && w >= AA
      return (aaa ? 'aa-pass ' : 'AA-FAIL ') + el.tagName + ' ' + Math.round(w) + 'x' + Math.round(h) +
        '  "' + el.textContent.trim().slice(0, 24) + '"'
    })

  /* ---- 5. rhythm: vertical gap between major sections ---- */
  out.sectionGaps = [...document.querySelectorAll('main > section, main > div > section')]
    .filter(visible)
    .slice(0, 10)
    .map(el => {
      const s = getComputedStyle(el)
      return { padY: Math.round(px(s.paddingTop)) + '/' + Math.round(px(s.paddingBottom)), id: el.id || el.className.slice(0, 24) }
    })

  /* ---- 6. design tokens actually applied ---- */
  const root = getComputedStyle(document.documentElement)
  out.tokens = {
    accent: root.getPropertyValue('--color-accent').trim(),
    bg: root.getPropertyValue('--color-bg').trim(),
    surface: root.getPropertyValue('--color-surface').trim(),
    bodyFont: root.getPropertyValue('--font-body').trim().slice(0, 40),
  }
  out.accentUsed = [...document.querySelectorAll('*')].filter(el => {
    const s = getComputedStyle(el)
    return visible(el) && (s.color.includes('201, 242, 77') || s.backgroundColor.includes('201, 242, 77'))
  }).length

  /* ---- 7. line lengths on long-form text ---- */
  out.longMeasures = [...document.querySelectorAll('main p')]
    .filter(el => visible(el) && el.textContent.trim().length > 160)
    .map(el => Math.round(el.getBoundingClientRect().width))
    .filter(w => w > 760)
    .slice(0, 6)

  /* ---- 8. font families actually loading ---- */
  out.fontsLoaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight)
  out.fontsTotal = document.fonts.size

  return JSON.stringify(out)
})()`

const profile = mkdtempSync(join(tmpdir(), 'audit-'))
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--no-sandbox','--no-first-run',`--user-data-dir=${profile}`,`--remote-debugging-port=${PORT}`,'about:blank'])
let list
for (let i = 0; i < 40; i++) {
  try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break } catch { await sleep(300) }
}
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r))
const cdp = new CDP(ws)
await cdp.send('Page.enable'); await cdp.send('Runtime.enable')
const noise = []
cdp.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error' || p.type === 'warning') noise.push(p.type + ': ' + p.args.map(a=>a.value).join(' ')) })
cdp.on('Runtime.exceptionThrown', (p) => noise.push('exception: ' + (p.exceptionDetails.exception?.description || p.exceptionDetails.text)))

async function view(w, h, mobile = false) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile })
}
async function settle() {
  await sleep(1500)
  await cdp.eval(`(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,110)) }
    window.scrollTo(0,0); await new Promise(r=>setTimeout(r,650))
  })()`)
  await sleep(350)
}

const PAGES = ['/', '/about', '/projects', '/experience', '/skills', '/contact']
for (const [w, h, tag, mobile] of [[1440, 900, 'DESKTOP', false], [375, 812, 'MOBILE', true]]) {
  await view(w, h, mobile)
  for (const path of PAGES) {
    await cdp.send('Page.navigate', { url: BASE + path })
    await settle()
    const raw = await cdp.eval(AUDIT)
    const a = JSON.parse(raw)
    console.log(`\n── ${tag} ${path} ${'─'.repeat(Math.max(0, 44 - path.length))}`)
    if (a.stuck.length) console.log('  STUCK REVEAL :', a.stuck)
    if (a.lowContrast.length) {
      console.log('  LOW CONTRAST :')
      a.lowContrast.forEach(c => console.log(`     ${c.ratio} (need ${c.need}) ${c.size}px "${c.t}" ${c.color}`))
    } else console.log('  contrast     : ok')
    if (a.bodyTooSmall) console.log('  body <15px   :', a.bodyTooSmall, '| sizes seen:', a.bodyFontSizes.join(', '))
    if (a.smallTargets.length) { console.log('  SMALL TARGETS:'); a.smallTargets.forEach(t => console.log('     ', t)) }
    if (a.longMeasures.length) console.log('  long measure :', a.longMeasures.join(', '))
    if (a.sectionGaps?.length) console.log('  section padY :', a.sectionGaps.map(s => s.padY).join(' '))
  }
}
console.log('\n── TOKENS / FONTS ──')
await cdp.send('Page.navigate', { url: BASE + '/' }); await settle()
const a = JSON.parse(await cdp.eval(AUDIT))
console.log('  tokens    :', JSON.stringify(a.tokens))
console.log('  accentUsed:', a.accentUsed)
console.log('  fonts     :', a.fontsTotal, 'total,', a.fontsLoaded.length, 'loaded ->', [...new Set(a.fontsLoaded.map(f=>f.split(' ')[0]))].join(', '))
console.log('\n── CONSOLE NOISE ──')
console.log(noise.length ? noise.join('\n') : '  none')

ws.close(); chrome.kill(); try { rmSync(profile, { recursive: true, force: true }) } catch {}
process.exit(0)
