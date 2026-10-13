/**
 * Contact form.
 *  - client-side validation with inline, accessible error messages
 *  - explicit idle / submitting / success / error states
 *  - never posts anywhere unless VITE_CONTACT_ENDPOINT is set (see lib/contactApi)
 *  - the submit button is disabled while sending, so a double-click can't
 *    double-submit and the splash can't fire on a dead button
 */

import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Check, Loader2, Send } from 'lucide-react'

import { EASE } from '../../lib/motion'
import { submitContactForm } from '../../lib/contactApi'

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', placeholder: '[YOUR NAME]', required: true, autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: '[YOUR EMAIL]', required: true, autoComplete: 'email' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const validate = (values) => {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  else if (values.name.trim().length < 2) errors.name = 'That name looks too short.'

  if (!values.email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'That email doesn’t look right.'

  if (!values.message.trim()) errors.message = 'Please add a short message.'
  else if (values.message.trim().length < 12) errors.message = 'A little more detail, please.'

  return errors
}

export default function ContactForm() {
  const uid = useId()
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef(null)

  const update = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const blurValidate = (name) => () => {
    if (status !== 'idle') return
    const next = validate(values)
    setErrors((prev) => ({ ...prev, [name]: next[name] }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0]
      formRef.current?.querySelector(`#${uid}-${first}`)?.focus()
      return
    }

    setStatus('sending')
    setErrorMessage('')
    try {
      await submitContactForm(values)
      setStatus('success')
      setValues({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || 'Something went wrong. Please try again.')
    }
  }

  const reset = () => {
    setStatus('idle')
    setErrors({})
    setErrorMessage('')
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE.out }}
            className="flex min-h-[420px] flex-col items-start justify-center rounded-[14px] border border-line bg-surface/40 p-8 sm:p-12"
            role="status"
            aria-live="polite"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
              <Check size={20} />
            </span>
            <h3 className="display mt-6 text-2xl">Message sent.</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Thanks for reaching out — I’ll get back to you within a couple of days.
            </p>
            <button
              type="button"
              onClick={reset}
              className="link-draw mt-7 font-mono text-[12px] text-accent"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={false}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-[14px] border border-line bg-surface/40 p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <Field
                  key={f.name}
                  {...f}
                  id={`${uid}-${f.name}`}
                  value={values[f.name]}
                  error={errors[f.name]}
                  onChange={update(f.name)}
                  onBlur={blurValidate(f.name)}
                  disabled={status === 'sending'}
                />
              ))}
            </div>

            <div className="mt-5">
              <Field
                name="message"
                label="Message"
                id={`${uid}-message`}
                as="textarea"
                rows={6}
                placeholder="[TELL ME ABOUT YOUR PROJECT, TIMELINE AND BUDGET]"
                value={values.message}
                error={errors.message}
                onChange={update('message')}
                onBlur={blurValidate('message')}
                disabled={status === 'sending'}
              />
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  role="alert"
                  className="mt-5 flex items-center gap-2 overflow-hidden rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-300"
                >
                  <AlertCircle size={15} className="shrink-0" />
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                data-no-splash={status === 'sending' ? '' : undefined}
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-7 text-sm font-medium text-ink transition-all duration-300 hover:bg-accent-soft active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    Send message
                  </>
                )}
              </button>

              <p className="font-mono text-[11px] text-faint">
                {status === 'sending' ? 'Sending your message…' : 'No spam. Ever.'}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  as = 'input',
  rows,
  disabled,
  autoComplete,
}) {
  const Tag = as
  const describedBy = error ? `${id}-error` : undefined

  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        type={as === 'textarea' ? undefined : type}
        rows={as === 'textarea' ? rows : undefined}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`mt-2.5 w-full resize-none rounded-xl border bg-ink/60 px-4 py-3 text-[14.5px] text-bone outline-none transition-colors duration-300 placeholder:text-faint/70 focus:border-accent/60 ${
          error ? 'border-red-500/50' : 'border-line hover:border-line'
        }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 font-mono text-[11px] text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
