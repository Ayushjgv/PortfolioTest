/**
 * Screenshot capture for design review.
 * Usage: node scripts/shots.mjs [baseUrl] [outDir]
 */

import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.argv[2] || 'http://localhost:4173'
const OUT = process.argv[3] || 'shots'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9444
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

mkdirSync(OUT, { recursive: true })

class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data)
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id)
        this.pending.delete(m.id)
        if (m.error) reject(new Error(m.error.message))
        else resolve(m.result)
      }
    })
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((res, rej) => this.pending.set(id, { resolve: res, reject: rej }))
  }
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    return r.result?.value
  }
  async shot(name, full = false) {
    const r = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: full,
      ...(full ? { clip: undefined } : {}),
    })
    writeFileSync(join(OUT, `${name}.png`), Buffer.from(r.data, 'base64'))
    console.log('  →', `${name}.png`)
  }
}

const profile = mkdtempSync(join(tmpdir(), 'shot-'))
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--no-sandbox','--no-first-run','--hide-scrollbars',`--user-data-dir=${profile}`,`--remote-debugging-port=${PORT}`,'about:blank'])
let list
for (let i = 0; i < 40; i++) {
  try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break } catch { await sleep(300) }
}
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r))
const cdp = new CDP(ws)
await cdp.send('Page.enable')
await cdp.send('Runtime.enable')

async function view(w, h, mobile = false) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile })
}

async function settle(ms = 1600) {
  await sleep(ms)
  // trigger every scroll-reveal in the document, then return to the top
  await cdp.eval(`(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
    await new Promise(r => setTimeout(r, 700))
  })()`)
  await sleep(400)
}

const PAGES = [
  ['/', 'home'],
  ['/about', 'about'],
  ['/projects', 'projects'],
  ['/experience', 'experience'],
  ['/skills', 'skills'],
  ['/contact', 'contact'],
  ['/nope', 'notfound'],
]

for (const [w, h, tag, mobile] of [
  [1440, 900, 'desktop', false],
  [768, 1024, 'tablet', false],
  [375, 812, 'mobile', true],
]) {
  console.log(`\n${tag} ${w}x${h}`)
  await view(w, h, mobile)
  for (const [path, name] of PAGES) {
    await cdp.send('Page.navigate', { url: BASE + path })
    await settle()
    await cdp.shot(`${tag}-${name}`)
  }
}

ws.close(); chrome.kill(); try { rmSync(profile, { recursive: true, force: true }) } catch {}
console.log('\ndone')
process.exit(0)
