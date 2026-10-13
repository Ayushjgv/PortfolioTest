/**
 * ============================================================
 * EXPERIENCE DATA
 * ============================================================
 * Rendered as a scroll-animated timeline on /experience.
 * Set `type: 'work' | 'education' | 'volunteer'` to change the marker.
 *
 * @typedef {Object} ExperienceItem
 * @property {string} id
 * @property {'work'|'education'|'volunteer'} type
 * @property {string} role
 * @property {string} company
 * @property {string} location
 * @property {string} period      e.g. "Jan 2025 — Present"
 * @property {boolean} [current]
 * @property {string} summary
 * @property {string[]} points
 * @property {string[]} [stack]
 */

/** @type {ExperienceItem[]} */
export const experience = [
  {
    id: 'exp-1',
    type: 'work',
    role: '[ROLE]',
    company: '[COMPANY]',
    location: '[CITY, COUNTRY]',
    period: '[DATE] — Present',
    current: true,
    summary: '[ONE SENTENCE ABOUT YOUR SCOPE OR MANDATE IN THIS ROLE.]',
    points: [
      '[ACHIEVEMENT / RESPONSIBILITY — include a measurable result where you can]',
      '[ACHIEVEMENT / RESPONSIBILITY — what you owned end to end]',
      '[ACHIEVEMENT / RESPONSIBILITY — the hard problem you solved]',
    ],
    stack: ['[TECH]', '[TECH]', '[TECH]'],
  },
  {
    id: 'exp-2',
    type: 'work',
    role: '[ROLE]',
    company: '[COMPANY]',
    location: '[CITY, COUNTRY]',
    period: '[DATE] — [DATE]',
    summary: '[ONE SENTENCE ABOUT YOUR SCOPE OR MANDATE IN THIS ROLE.]',
    points: [
      '[ACHIEVEMENT / RESPONSIBILITY — include a measurable result where you can]',
      '[ACHIEVEMENT / RESPONSIBILITY — what you owned end to end]',
      '[ACHIEVEMENT / RESPONSIBILITY — the hard problem you solved]',
    ],
    stack: ['[TECH]', '[TECH]'],
  },
  {
    id: 'exp-3',
    type: 'work',
    role: '[ROLE]',
    company: '[COMPANY]',
    location: '[CITY, COUNTRY]',
    period: '[DATE] — [DATE]',
    summary: '[ONE SENTENCE ABOUT YOUR SCOPE OR MANDATE IN THIS ROLE.]',
    points: [
      '[ACHIEVEMENT / RESPONSIBILITY — include a measurable result where you can]',
      '[ACHIEVEMENT / RESPONSIBILITY — what you owned end to end]',
      '[ACHIEVEMENT / RESPONSIBILITY — the hard problem you solved]',
    ],
    stack: ['[TECH]', '[TECH]'],
  },
  {
    id: 'exp-4',
    type: 'volunteer',
    role: '[ROLE]',
    company: '[ORGANISATION]',
    location: '[CITY, COUNTRY]',
    period: '[DATE] — [DATE]',
    summary: '[ONE SENTENCE ABOUT YOUR SCOPE OR MANDATE IN THIS ROLE.]',
    points: [
      '[ACHIEVEMENT / RESPONSIBILITY — include a measurable result where you can]',
      '[ACHIEVEMENT / RESPONSIBILITY — what you owned end to end]',
    ],
  },
  {
    id: 'exp-5',
    type: 'education',
    role: '[DEGREE]',
    company: '[UNIVERSITY]',
    location: '[CITY, COUNTRY]',
    period: '[YEAR] — [YEAR]',
    summary: '[FOCUS, THESIS OR SPECIALISATION.]',
    points: ['[RELEVANT COURSEWORK OR ACHIEVEMENT]', '[RELEVANT COURSEWORK OR ACHIEVEMENT]'],
  },
]
