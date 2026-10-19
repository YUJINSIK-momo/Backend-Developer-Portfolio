import { useMemo, useState } from "react"
import { Container, FilterChips, PageHeader } from "../components/yuyu"
import { ProjectCard } from "../components/sections/ProjectCard"
import { categories, projects } from "../data/projects"
import type { ProjectCategory } from "../types/portfolio"

type Filter = "all" | ProjectCategory

export function WorkPage() {
  const [filter, setFilter] = useState<Filter>("all")

  const options = useMemo(() => [
    { value: "all" as const, label: "전체", count: projects.length },
    ...(Object.keys(categories) as ProjectCategory[]).map((key) => ({
      value: key,
      label: categories[key].label,
      count: projects.filter((p) => p.category === key).length,
    })),
  ], [])

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter)

  return (
    <Container width="wide" className="space-y-8 py-12">
      <PageHeader
        eyebrow="Projects"
        title="프로젝트"
        lead="회사에서 운영 중인 시스템과 개인 프로젝트를 한곳에 모았습니다. 회사 저장소는 비공개라 코드 대신 설계와 운영 방식을 상세 페이지에 적었습니다."
      >
        <FilterChips label="분야로 거르기" options={options} value={filter} onChange={setFilter} />
        {filter !== "all" && (
          <p className="text-sm text-yuyu-fg-subtle">{categories[filter].description}</p>
        )}
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Container>
  )
}
