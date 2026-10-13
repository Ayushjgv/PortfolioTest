/**
 * ============================================================
 * SITE / PERSONAL DATA
 * ============================================================
 * This is the single place to edit all personal information.
 * Every page reads from here. Replace the [PLACEHOLDER] strings
 * with your real content.
 *
 * @typedef {'live' | 'soon' | 'placeholder'} BadgeKind
 */

export const site = {
  /** Monogram shown in the logo / loader. Use 1–2 letters. */
  monogram: '[YN]',
  name: '[YOUR NAME]',
  /** Full name used in <title>, OG tags, footer. */
  fullName: '[YOUR NAME]',
  role: 'Software Engineer & Creative Developer',
  tagline: '[YOUR TAGLINE — e.g. I build fast, accessible web products and AI systems.]',
  shortBio:
    "[YOUR BIO — two or three sentences. What you build, what you care about, and the kind of problems you want to work on. Keep it specific and confident.]",
  seoDescription:
    '[SEO DESCRIPTION — a single sentence describing who you are and what you build, used for meta tags.]',
  url: 'https://example.com',
  email: '[YOUR EMAIL]',
  location: '[YOUR CITY, COUNTRY]',
  availability: '[AVAILABLE FOR NEW WORK — 2026]',
  avatar: '/images/profile.jpg',
  resumeUrl: '', // e.g. '/resume.pdf' — leave empty to hide the button
  copyright: '© [YEAR] [YOUR NAME]. All rights reserved.',
}

export const socials = [
  { label: 'GitHub', handle: '[YOUR GITHUB]', href: '[YOUR GITHUB URL]', icon: 'github' },
  { label: 'LinkedIn', handle: '[YOUR LINKEDIN]', href: '[YOUR LINKEDIN URL]', icon: 'linkedin' },
  { label: 'Email', handle: '[YOUR EMAIL]', href: 'mailto:[YOUR EMAIL]', icon: 'mail' },
  { label: 'Blog', handle: '[OPTIONAL LINK]', href: '#', icon: 'globe' },
]

export const navLinks = [
  { label: 'About', to: '/about', index: '01' },
  { label: 'Projects', to: '/projects', index: '02' },
  { label: 'Experience', to: '/experience', index: '03' },
  { label: 'Skills', to: '/skills', index: '04' },
  { label: 'Contact', to: '/contact', index: '05' },
]

/** Shown in the "Currently" block on the home page. */
export const currently = {
  building: '[WHAT YOU ARE CURRENTLY WORKING ON]',
  learning: '[WHAT YOU ARE LEARNING RIGHT NOW]',
  reading: '[BOOK / PAPER / ARTICLE YOU ARE READING]',
  status: '[SHORT STATUS LINE, e.g. Shipping v2 this month]',
}

export const stats = [
  { value: '[X]', suffix: '+', label: 'Projects' },
  { value: '[X]', suffix: '+', label: 'LeetCode Problems' },
  { value: '[X]', suffix: '', label: 'Hackathons' },
  { value: '[X]', suffix: '', label: 'Years Coding' },
]

export const education = [
  {
    degree: '[DEGREE]',
    university: '[UNIVERSITY]',
    year: '[YEAR]',
    detail: '[ADDITIONAL INFORMATION — focus, honours, coursework, grade]',
  },
  {
    degree: '[DEGREE]',
    university: '[UNIVERSITY]',
    year: '[YEAR]',
    detail: '[ADDITIONAL INFORMATION — school, board, specialisation]',
  },
]

export const aboutSections = [
  {
    key: 'intro',
    label: 'Introduction',
    body: '[WRITE YOUR INTRODUCTION HERE]',
  },
  {
    key: 'story',
    label: 'Personal Story',
    body: '[PLACEHOLDER — how did you get into software? What moments shaped how you work?]',
  },
  {
    key: 'work',
    label: 'What I Do',
    body: '[PLACEHOLDER — the kind of problems you take on, the stack you reach for, how you scope and ship work.]',
  },
  {
    key: 'interests',
    label: "What I'm Interested In",
    body: '[PLACEHOLDER — the domains, tools, ideas and people that keep you curious outside of work.]',
  },
]

/** Easter eggs. Rendered as a toast by <EasterEggs>. */
export const easterEggs = [
  {
    id: 'logo',
    code: 'LOGO',
    hint: 'Five clicks on the monogram',
    message: "You clicked the logo five times. That is dedication. — You're still on the home page.",
  },
  {
    id: 'konami',
    code: 'KONAMI',
    hint: 'Try ↑ ↑ ↓ ↓ ← → ← → B A on your keyboard',
    message: 'Konami accepted. Extended childhood. ↑↑↓↓←→←→BA',
  },
  {
    id: 'terminal',
    code: 'IDK',
    hint: 'Type "idk" anywhere on the site',
    message: "idk either. Shipping anyway.",
  },
]
