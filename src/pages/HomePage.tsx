import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, Github, Mail } from "lucide-react"
import {
  Badge, Button, Card, Container, Pipeline, SectionHeader, cx, toneText,
} from "../components/yuyu"
import { ProjectCard } from "../components/sections/ProjectCard"
import { featuredProjects, projects } from "../data/projects"
import { principles, profile } from "../data/profile"
import { allNotes } from "../data/notes"

// 제품이 만들어져 운영되기까지의 흐름과, 그 구간을 맡은 하네스
const lifecycle = [
  { label: "요청", sub: "Slack 폼 → issue", tone: "brand", human: true },
  { label: "화면 생성", sub: "에이전트 · 테스트", tone: "ai" },
  { label: "승인", sub: "배포된 화면 보고 버튼", tone: "warning", human: true },
  { label: "리뷰", sub: "GPT 리뷰 · Claude 검증", tone: "ai" },
  { label: "결정", sub: "Slack · 배포 태그", tone: "warning", human: true },
  { label: "배포", sub: "OIDC · ECS 롤링", tone: "infra" },
  { label: "운영", sub: "알림 · 대시보드", tone: "infra" },
] as const

const coverage = [
  { name: "디자인 시스템 하네스", range: "요청 → 화면 생성 → 승인", tone: "ai", to: "/work/design-harness" },
  { name: "릴리스 하네스", range: "리뷰 → 결정 → 배포", tone: "warning", to: "/work/blue-maps#release" },
  { name: "AWS 인프라 · 운영 대시보드", range: "배포 → 운영", tone: "infra", to: "/work/blue-maps" },
] as const

export function HomePage() {
  const aiSideProjects = projects.filter((p) => p.category === "ai" && !p.featured).slice(0, 4)

  return (
    <div className="space-y-20 pb-8">
      {/* 첫 화면 */}
      <section className="border-b border-yuyu-line/40 bg-gradient-to-b from-yuyu-surface/70 to-transparent">
        <Container width="wide" className="space-y-8 py-14 sm:py-20">
          <div className="space-y-5">
            <Badge tone="ai" size="md">{profile.role}</Badge>
            <h1 className="max-w-4xl text-3xl font-bold leading-[1.25] text-yuyu-fg sm:text-5xl">
              {profile.headline}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-yuyu-fg-muted sm:text-lg">{profile.intro}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button to="/work/design-harness" trailingIcon={ArrowRight}>대표 사례 보기</Button>
              <Button to="/work" variant="outline">프로젝트 전체</Button>
              <Button href={profile.github} variant="ghost" icon={Github}>GitHub</Button>
            </div>
          </div>

          <Card padding="lg" className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-yuyu-fg-subtle">Where I work</p>
              <p className="mt-1 text-sm text-yuyu-fg-muted">
                제품이 만들어져 운영되기까지 — 점선은 사람이 결정하는 자리입니다.
              </p>
            </div>
            <Pipeline nodes={lifecycle} />
            <ul className="grid gap-2 border-t border-yuyu-line/50 pt-4 sm:grid-cols-3">
              {coverage.map((c) => (
                <li key={c.name}>
                  <Link to={c.to} className="group -m-2 block rounded-yuyu-md p-2 hover:bg-yuyu-raised">
                    <span className={cx("text-sm font-semibold", toneText[c.tone])}>{c.name}</span>
                    <span className="mt-0.5 block text-xs text-yuyu-fg-subtle">{c.range}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>

      {/* 대표 사례 */}
      <Container width="wide" className="space-y-6">
        <SectionHeader
          eyebrow="Featured"
          title="운영 중인 대표 사례"
          description="회사에서 직접 설계하고 지금도 운영하는 시스템입니다. 저장소는 비공개라 상세 페이지에 설계 · 보안 · 운영 방식을 적었습니다."
          action={<Button to="/work" variant="outline" size="sm" trailingIcon={ArrowRight}>전체 보기</Button>}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} size="large" />
          ))}
        </div>
      </Container>

      {/* 일하는 원칙 */}
      <Container width="wide" className="space-y-6">
        <SectionHeader
          eyebrow="Principles"
          title="AI 와 일하는 원칙"
          description="하네스를 만들 때마다 지키는 네 가지입니다."
          action={<Button to="/ax" variant="outline" size="sm" trailingIcon={ArrowRight}>AI · AX 자세히</Button>}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Card key={p.title} className="h-full">
              <span className={cx("font-mono text-xs font-semibold", toneText[p.tone])}>0{i + 1}</span>
              <h3 className="mt-2 text-sm font-semibold text-yuyu-fg">{p.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-yuyu-fg-muted">{p.body}</p>
            </Card>
          ))}
        </div>
      </Container>

      {/* AI 사이드 프로젝트 */}
      <Container width="wide" className="space-y-6">
        <SectionHeader
          eyebrow="AI projects"
          title="LLM 을 붙여 본 업무 자동화"
          description="상담 · 번역 · 멀티 에이전트 · 사내 시스템에 LLM 을 직접 붙인 작업입니다."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {aiSideProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>

      {/* 학습 노트 · 연락 */}
      <Container width="wide" className="grid gap-4 md:grid-cols-2">
        <Card to="/notes" padding="lg">
          <BookOpen size={20} className="text-yuyu-brand" />
          <h2 className="mt-3 text-base font-semibold text-yuyu-fg">학습 노트 {allNotes.length}편</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-yuyu-fg-muted">
            LLM 흐름, Claude Code 하네스 엔지니어링, AWS · Docker, 소켓 통신까지 — 비개발자 동료에게 설명하려고 정리한 개념과 시뮬레이션.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-yuyu-brand">
            노트 목록 <ArrowRight size={12} />
          </span>
        </Card>
        <Card tone="brand" padding="lg">
          <Mail size={20} className="text-yuyu-brand" />
          <h2 className="mt-3 text-base font-semibold text-yuyu-fg">이야기 나눠요</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-yuyu-fg-muted">
            사내 AX, 에이전트 개발 환경, AWS 인프라, 일본어가 필요한 서비스에 관심이 많습니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button href={`mailto:${profile.email}`} size="sm" icon={Mail}>{profile.email}</Button>
            <Button to="/about" size="sm" variant="outline">About</Button>
          </div>
        </Card>
      </Container>
    </div>
  )
}
