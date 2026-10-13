/**
 * ============================================================
 * PROJECTS DATA
 * ============================================================
 * Add / remove / reorder projects here — the grid, filters, home page
 * selection and the project modal all read from this array.
 *
 * @typedef {Object} Project
 * @property {string} id           unique slug (used in the URL hash)
 * @property {string} title
 * @property {string} description  one-line summary (cards)
 * @property {string} long         2–3 paragraph detail (modal)
 * @property {string} image        path in /public/images
 * @property {string[]} technologies
 * @property {string} github
 * @property {string} live
 * @property {string[]} tags
 * @property {string} year
 * @property {'web'|'ai'|'systems'|'design'} category
 * @property {boolean} featured    shown on the home page
 * @property {string[]} highlights bullet points for the modal
 */

/** @type {Project[]} */
export const projects = [
  {
    id: 'project-1',
    title: '[PROJECT NAME]',
    description: '[ONE LINE SUMMARY OF THE PROJECT — what it does and why it exists.]',
    long: '[DETAILED PROJECT DESCRIPTION. Explain the problem, the constraints, and the approach you took. What did you build yourself, which trade-offs did you make, and what did you learn? Two or three short paragraphs works best.]',
    image: '/images/project-1.jpg',
    technologies: ['React', 'Node.js', 'MongoDB'],
    tags: ['[TAG]', '[TAG]'],
    github: '#',
    live: '#',
    year: '[YEAR]',
    category: 'web',
    featured: true,
    highlights: [
      '[ACHIEVEMENT / HIGHLIGHT ONE]',
      '[ACHIEVEMENT / HIGHLIGHT TWO]',
      '[ACHIEVEMENT / HIGHLIGHT THREE]',
    ],
  },
  {
    id: 'project-2',
    title: '[PROJECT NAME]',
    description: '[ONE LINE SUMMARY OF THE PROJECT — what it does and why it exists.]',
    long: '[DETAILED PROJECT DESCRIPTION. Explain the problem, the constraints, and the approach you took. What did you build yourself, which trade-offs did you make, and what did you learn? Two or three short paragraphs works best.]',
    image: '/images/project-2.jpg',
    technologies: ['Python', 'PyTorch', 'FastAPI'],
    tags: ['[TAG]', '[TAG]'],
    github: '#',
    live: '#',
    year: '[YEAR]',
    category: 'ai',
    featured: true,
    highlights: [
      '[ACHIEVEMENT / HIGHLIGHT ONE]',
      '[ACHIEVEMENT / HIGHLIGHT TWO]',
      '[ACHIEVEMENT / HIGHLIGHT THREE]',
    ],
  },
  {
    id: 'project-3',
    title: '[PROJECT NAME]',
    description: '[ONE LINE SUMMARY OF THE PROJECT — what it does and why it exists.]',
    long: '[DETAILED PROJECT DESCRIPTION. Explain the problem, the constraints, and the approach you took. What did you build yourself, which trade-offs did you make, and what did you learn? Two or three short paragraphs works best.]',
    image: '/images/project-3.jpg',
    technologies: ['C++', 'OpenCV', 'CMake'],
    tags: ['[TAG]', '[TAG]'],
    github: '#',
    live: '',
    year: '[YEAR]',
    category: 'systems',
    featured: true,
    highlights: [
      '[ACHIEVEMENT / HIGHLIGHT ONE]',
      '[ACHIEVEMENT / HIGHLIGHT TWO]',
      '[ACHIEVEMENT / HIGHLIGHT THREE]',
    ],
  },
  {
    id: 'project-4',
    title: '[PROJECT NAME]',
    description: '[ONE LINE SUMMARY OF THE PROJECT — what it does and why it exists.]',
    long: '[DETAILED PROJECT DESCRIPTION. Explain the problem, the constraints, and the approach you took. What did you build yourself, which trade-offs did you make, and what did you learn? Two or three short paragraphs works best.]',
    image: '/images/project-4.jpg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    tags: ['[TAG]', '[TAG]'],
    github: '#',
    live: '#',
    year: '[YEAR]',
    category: 'web',
    featured: false,
    highlights: [
      '[ACHIEVEMENT / HIGHLIGHT ONE]',
      '[ACHIEVEMENT / HIGHLIGHT TWO]',
      '[ACHIEVEMENT / HIGHLIGHT THREE]',
    ],
  },
  {
    id: 'project-5',
    title: '[PROJECT NAME]',
    description: '[ONE LINE SUMMARY OF THE PROJECT — what it does and why it exists.]',
    long: '[DETAILED PROJECT DESCRIPTION. Explain the problem, the constraints, and the approach you took. What did you build yourself, which trade-offs did you make, and what did you learn? Two or three short paragraphs works best.]',
    image: '/images/project-5.jpg',
    technologies: ['MediaPipe', 'TensorFlow', 'Python'],
    tags: ['[TAG]', '[TAG]'],
    github: '#',
    live: '',
    year: '[YEAR]',
    category: 'ai',
    featured: false,
    highlights: [
      '[ACHIEVEMENT / HIGHLIGHT ONE]',
      '[ACHIEVEMENT / HIGHLIGHT TWO]',
      '[ACHIEVEMENT / HIGHLIGHT THREE]',
    ],
  },
  {
    id: 'project-6',
    title: '[PROJECT NAME]',
    description: '[ONE LINE SUMMARY OF THE PROJECT — what it does and why it exists.]',
    long: '[DETAILED PROJECT DESCRIPTION. Explain the problem, the constraints, and the approach you took. What did you build yourself, which trade-offs did you make, and what did you learn? Two or three short paragraphs works best.]',
    image: '/images/project-6.jpg',
    technologies: ['React Native', 'Expo', 'Firebase'],
    tags: ['[TAG]', '[TAG]'],
    github: '#',
    live: '#',
    year: '[YEAR]',
    category: 'design',
    featured: false,
    highlights: [
      '[ACHIEVEMENT / HIGHLIGHT ONE]',
      '[ACHIEVEMENT / HIGHLIGHT TWO]',
      '[ACHIEVEMENT / HIGHLIGHT THREE]',
    ],
  },
]

export const projectFilters = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'systems', label: 'Systems' },
  { id: 'design', label: 'Design' },
]

export const getFeaturedProjects = () => projects.filter((p) => p.featured)
