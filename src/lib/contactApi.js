/**
 * Contact form submission — the single place where a backend gets plugged in.
 *
 * RIGHT NOW: a simulated request (see MOCK_DELAY) so the UI states —
 * loading, success, error — can be designed and tested without a server.
 *
 * TO GO LIVE: replace the body of `submitContactForm` with a real request,
 * e.g.
 *
 *   const res = await fetch(import.meta.env.VITE_CONTACT_ENDPOINT, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   })
 *   if (!res.ok) throw new Error('Request failed')
 *   return res.json()
 *
 * The form component never needs to change.
 */

/** @typedef {{ name: string; email: string; message: string; company?: string }} ContactPayload */

const MOCK_DELAY = 1400

export const FORM_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || null

export async function submitContactForm(payload) {
  if (FORM_ENDPOINT) {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
    return res.json().catch(() => ({}))
  }

  // ---- mock path (no backend configured) ----
  await new Promise((r) => setTimeout(r, MOCK_DELAY))
  if (!payload.message.trim()) throw new Error('Empty message')
  return { ok: true, simulated: true }
}
