import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, ExternalLink, Lock } from "lucide-react"
import {
  Badge, Button, Card, Container, PageHeader, Pipeline, SectionHeader, Stat, Steps, TagList, cx, toneText,
} from "../components/yuyu"
import { OpsDashboardDemo } from "../components/ops/OpsDashboardDemo"
import { caseStudies } from "../data/caseStudies"
import { categories, findProject } from "../data/projects"
import type { CaseSection } from "../types/portfolio"
import { NotFoundPage } from "./NotFoundPage"

function SectionBody({ section }: { section: CaseSection }) {
  switch (section.kind) {
    case "steps":
      return <Card padding="lg"><Steps steps={section.steps} /></Card>
    case "pipeline":
      return (
        <Card padding="lg" className="space-y-3">
          <Pipeline nodes={section.nodes} />
          {section.caption && <p className="text-xs text-yuyu-fg-subtle">{section.caption}</p>}
        </Card>
      )
    case "cards":
      return (
        <div className={cx("grid gap-3", section.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3")}>
          {section.cards.map((card) => (
            <Card key={card.title} className="h-full">
              <h3 className={cx("text-sm font-semibold", card.tone ? toneText[card.tone] : "text-yuyu-fg")}>{card.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-yuyu-fg-muted">{card.body}</p>
              {card.evidence && (
                <p className="mt-3 font-mono text-[11px] text-yuyu-fg-subtle">{card.evidence}</p>
              )}
            </Card>
          ))}
        </div>
      )
    case "table":
      return (
        <div className="overflow-hidden rounded-yuyu-lg border border-yuyu-line/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-yuyu-raised text-xs text-yuyu-fg-subtle">
              <tr>
                <th scope="col" className="w-1/3 px-4 py-2.5 font-medium">{section.head[0]}</th>
                <th scope="col" className="px-4 py-2.5 font-medium">{section.head[1]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yuyu-line/50 bg-yuyu-surface">
              {section.rows.map(([key, value]) => (
                <tr key={key} className="align-top">
                  <th scope="row" className="px-4 py-3 font-mono text-xs font-medium text-yuyu-fg">{key}</th>
                  <td className="px-4 py-3 text-sm leading-relaxed text-yuyu-fg-muted">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "demo":
      return <OpsDashboardDemo />
    case "bullets":
      return (
        <Card padding="lg">
          <ul className="space-y-2.5">
            {section.items.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-yuyu-fg-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yuyu-brand" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      )
  }
}

export function CaseStudyPage() {
  const { slug = "" } = useParams()
  const study = caseStudies[slug]
  const project = findProject(slug)
  if (!study || !project) return <NotFoundPage />

  const category = categories[project.category]

  return (
    <Container width="wide" className="py-12">
      <Link to="/work" className="inline-flex items-center gap-1 text-xs text-yuyu-fg-subtle hover:text-yuyu-fg">
        <ArrowLeft size={12} /> 프로젝트 목록
      </Link>

      <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-10">
        <div className="min-w-0 space-y-14">
          <PageHeader eyebrow={study.eyebrow} title={study.title} lead={study.lead}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={category.tone}>{category.label}</Badge>
              <Badge tone="success">{project.status}</Badge>
              {project.privateRepo && (
                <span className="inline-flex items-center gap-1 text-xs text-yuyu-fg-subtle"><Lock size={12} /> 회사 비공개 저장소</span>
              )}
              {project.live && (
                <Button href={project.live.href} size="sm" variant="outline" icon={ExternalLink}>{project.live.label}</Button>
              )}
            </div>
            <dl className="grid gap-x-6 gap-y-3 pt-2 sm:grid-cols-3">
              {study.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs text-yuyu-fg-subtle">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm text-yuyu-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <TagList items={project.stack} />
          </PageHeader>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {study.stats.map((stat) => <Stat key={stat.label} {...stat} />)}
          </div>

          {study.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20 space-y-4">
              <SectionHeader title={section.title} description={section.description} />
              <SectionBody section={section} />
            </section>
          ))}

          {study.next && (
            <Card to={study.next.to} padding="lg" className="flex items-center justify-between">
              <span>
                <span className="block text-xs text-yuyu-fg-subtle">다음 사례</span>
                <span className="mt-1 block text-base font-semibold text-yuyu-fg">{study.next.label}</span>
              </span>
              <ArrowRight size={18} className="text-yuyu-brand" />
            </Card>
          )}
        </div>

        <aside className="hidden lg:block">
          <nav aria-label="이 페이지 목차" className="sticky top-20 space-y-1 border-l border-yuyu-line/50 pl-4 text-xs">
            <p className="pb-1 font-semibold text-yuyu-fg-subtle">목차</p>
            {study.sections.map((section) => (
              <Link key={section.id} to={`#${section.id}`} className="block py-1 text-yuyu-fg-muted hover:text-yuyu-fg">
                {section.title}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </Container>
  )
}
