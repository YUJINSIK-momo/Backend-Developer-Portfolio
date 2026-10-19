import { Link } from "react-router-dom"
import { ArrowRight, ExternalLink, Github, Lock } from "lucide-react"
import { Badge, TagList, cx, toneTopBorder } from "../yuyu"
import { categories } from "../../data/projects"
import type { Project } from "../../types/portfolio"

const statusTone = {
  "운영 중": "success",
  "진행 중": "warning",
  "완료": "neutral",
  "데모": "brand",
} as const

interface ProjectCardProps {
  project: Project
  /** 대표 사례는 더 크게 그린다 */
  size?: "default" | "large"
}

export function ProjectCard({ project, size = "default" }: ProjectCardProps) {
  const category = categories[project.category]
  return (
    <article
      className={cx(
        "flex h-full flex-col rounded-yuyu-lg border border-t-2 bg-yuyu-surface p-5 shadow-yuyu-raised",
        "border-yuyu-line/60",
        toneTopBorder[category.tone],
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={category.tone}>{category.label}</Badge>
        <Badge tone={statusTone[project.status]}>{project.status}</Badge>
        <span className="ml-auto font-mono text-[11px] text-yuyu-fg-subtle">{project.period}</span>
      </div>

      <h3 className={cx("mt-3 font-semibold text-yuyu-fg", size === "large" ? "text-lg" : "text-base")}>
        {project.detail ? (
          <Link to={project.detail} className="hover:text-yuyu-brand">{project.title}</Link>
        ) : project.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-yuyu-fg-muted">{project.summary}</p>

      {project.highlights && (
        <ul className="mt-3 space-y-1">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-xs text-yuyu-fg">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-yuyu-brand" aria-hidden />
              {h}
            </li>
          ))}
        </ul>
      )}

      <TagList items={project.stack} className="mt-4" />

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-xs font-medium">
        {project.detail && (
          <Link to={project.detail} className="inline-flex items-center gap-1 text-yuyu-brand hover:underline">
            자세히 <ArrowRight size={12} />
          </Link>
        )}
        {project.live && (
          <a
            href={project.live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-yuyu-fg-muted hover:text-yuyu-fg"
          >
            <ExternalLink size={12} /> {project.live.label}
          </a>
        )}
        {project.repo && (
          <a
            href={project.repo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-yuyu-fg-muted hover:text-yuyu-fg"
          >
            <Github size={12} /> {project.repo.label}
          </a>
        )}
        {project.privateRepo && (
          <span className="inline-flex items-center gap-1 text-yuyu-fg-subtle">
            <Lock size={12} /> 비공개 저장소
          </span>
        )}
      </div>
    </article>
  )
}
