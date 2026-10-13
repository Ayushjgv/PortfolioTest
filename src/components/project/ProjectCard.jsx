/**
 * ProjectCard
 *  - index number + year in the corner
 *  - image zooms slowly and desaturates → colour on hover
 *  - a "View project" affordance appears on hover (and is always visible on touch)
 *  - clicking opens the detail modal (see <ProjectModal>)
 */

import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

import { Github } from '../ui/BrandIcons'
import { Tag } from '../ui/Section'

export default function ProjectCard({ project, onOpen, index = 0, className = '' }) {
  const { id, title, description, image, technologies, tags, year, category } = project
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className={`group h-full ${className}`}>
      <button
        type="button"
        onClick={() => onOpen?.(project)}
        aria-label={`Open details for ${title}`}
        data-no-splash={onOpen ? undefined : ''}
        className="relative block w-full cursor-pointer overflow-hidden rounded-[14px] border border-line bg-surface text-left transition-colors duration-500 hover:border-accent/35 focus-visible:border-accent/50"
      >
        {/* image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-2">
          <motion.img
            layoutId={`project-image-${id}`}
            src={image}
            alt={`${title} — project preview`}
            loading="lazy"
            decoding="async"
            width={800}
            height={500}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] group-hover:opacity-100 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

          {/* skeleton shown if the image is missing */}
          <div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center bg-[linear-gradient(140deg,#121218,#0b0b10)] font-mono text-[10px] tracking-[0.2em] text-faint"
          >
            {image.split('/').pop()}
          </div>

          <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/60">
            {num}
          </span>
          <span className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/40">
            {year}
          </span>

          {/* hover affordance */}
          <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-accent text-ink opacity-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <ArrowUpRight size={17} />
          </span>
        </div>

        {/* body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <h3 className="display text-xl transition-colors duration-300 group-hover:text-accent">
              {title}
            </h3>
            {category && (
              <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                {category}
              </span>
            )}
          </div>

          <p className="mt-3 line-clamp-2 text-[13.5px] leading-relaxed text-muted">
            {description}
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {technologies.map((t) => (
              <li key={t}>
                <Tag size="sm">{t}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </button>

      {/* persistent quick links (always reachable, keyboard + touch) */}
      <div className="mt-3 flex items-center gap-4 px-1">
        {project.github && project.github !== '#' && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer noopener"
            className="link-draw inline-flex items-center gap-1.5 font-mono text-[11px] text-faint transition-colors hover:text-accent"
          >
            <Github size={12} /> Source
          </a>
        )}
        {project.live && project.live !== '#' && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer noopener"
            className="link-draw inline-flex items-center gap-1.5 font-mono text-[11px] text-faint transition-colors hover:text-accent"
          >
            <ArrowUpRight size={12} /> Live
          </a>
        )}
        {tags?.length > 0 && (
          <span className="ml-auto truncate font-mono text-[10px] text-faint/70">
            {tags.join(' · ')}
          </span>
        )}
      </div>
    </article>
  )
}
