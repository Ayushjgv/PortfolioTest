/**
 * ============================================================
 * SKILLS DATA
 * ============================================================
 * `level` is 1–100 and drives the proficiency bars on /skills.
 * Set it to null to show the skill as a plain tag with no bar.
 * Delete any skill you don't want — nothing else needs to change.
 *
 * @typedef {Object} Skill
 * @property {string} name
 * @property {number|null} level
 * @property {string} [note]
 */

/** @type {{ title: string; blurb: string; skills: Skill[] }[]} */
export const skillGroups = [
  {
    title: 'Languages',
    blurb: 'Primary languages I reach for daily.',
    skills: [
      { name: 'C', level: 75 },
      { name: 'C++', level: 85 },
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 88 },
      { name: 'TypeScript', level: 78 },
      { name: 'SQL', level: 72 },
      { name: 'Java', level: 60 },
    ],
  },
  {
    title: 'Frontend',
    blurb: 'Interfaces that stay fast and accessible.',
    skills: [
      { name: 'React', level: 92 },
      { name: 'React Native', level: 74 },
      { name: 'Next.js', level: 78 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS / Tailwind', level: 90 },
      { name: 'Framer Motion', level: 82 },
      { name: 'Three.js / R3F', level: 62 },
    ],
  },
  {
    title: 'Backend',
    blurb: 'APIs, services and the data behind them.',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 82 },
      { name: 'REST APIs', level: 86 },
      { name: 'PostgreSQL', level: 74 },
      { name: 'MongoDB', level: 76 },
      { name: 'Firebase', level: 68 },
      { name: 'Prisma / Drizzle', level: 66 },
    ],
  },
  {
    title: 'AI / ML',
    blurb: 'Models, pipelines and vision work.',
    skills: [
      { name: 'PyTorch', level: 80 },
      { name: 'TensorFlow', level: 72 },
      { name: 'OpenCV', level: 78 },
      { name: 'MediaPipe', level: 74 },
      { name: 'scikit-learn', level: 76 },
      { name: 'LLM / RAG apps', level: 70 },
    ],
  },
  {
    title: 'Tools & Platforms',
    blurb: 'The day-to-day toolkit.',
    skills: [
      { name: 'Git & GitHub', level: 90 },
      { name: 'Docker', level: 70 },
      { name: 'Linux', level: 76 },
      { name: 'Vite', level: 88 },
      { name: 'VS Code', level: 94 },
      { name: 'Figma', level: 70 },
      { name: 'Postman / Insomnia', level: 72 },
    ],
  },
  {
    title: 'Practices',
    blurb: 'How I like to work with a team.',
    skills: [
      { name: 'Git branching & code review', level: 85, note: 'small PRs, early review' },
      { name: 'Testing & CI', level: 72 },
      { name: 'Performance profiling', level: 78 },
      { name: 'Accessibility (WCAG)', level: 74 },
      { name: 'Technical writing', level: 70 },
    ],
  },
]

/** Flat list of every technology name — used by the home page ticker. */
export const allSkillNames = skillGroups.flatMap((g) => g.skills.map((s) => s.name))
