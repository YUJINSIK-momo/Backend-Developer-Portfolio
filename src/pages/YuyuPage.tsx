import { useState } from "react"
import { ArrowRight, Github, Info, ShieldCheck } from "lucide-react"
import {
  Badge, Button, Callout, Card, Container, FilterChips, PageHeader, Pipeline,
  SectionHeader, Stat, Steps, TagList, type Tone,
} from "../components/yuyu"

// 토큰 표 — 색 이름은 yuyu-tokens.css 와 같아야 한다
const colorTokens: readonly { name: string; role: string }[] = [
  { name: "bg", role: "페이지 바탕" },
  { name: "surface", role: "카드" },
  { name: "raised", role: "눌림 · 강조 바탕" },
  { name: "overlay", role: "떠 있는 층" },
  { name: "line", role: "기본 선" },
  { name: "fg", role: "본문 글자" },
  { name: "fg-muted", role: "보조 글자" },
  { name: "fg-subtle", role: "흐린 글자" },
  { name: "brand", role: "브랜드 · 링크" },
  { name: "ai", role: "분야: AI · AX" },
  { name: "infra", role: "분야: 인프라" },
  { name: "web", role: "분야: 웹 · 앱" },
  { name: "success", role: "상태: 정상" },
  { name: "warning", role: "상태: 주의 · 사람 결정" },
  { name: "danger", role: "상태: 실패" },
]

const tones: readonly Tone[] = ["neutral", "brand", "ai", "infra", "web", "success", "warning", "danger"]

export function YuyuPage() {
  const [filter, setFilter] = useState<"all" | "ai" | "infra">("all")

  return (
    <Container className="space-y-14 py-12">
      <PageHeader
        eyebrow="Design system"
        title="yuyu UI"
        lead="이 포트폴리오를 그리는 토큰과 컴포넌트입니다. 화면 코드는 hex 색을 직접 쓰지 않고 --yuyu-* 토큰 이름만 쓰며, 새 화면은 src/components/yuyu 에서만 부품을 가져옵니다."
      >
        <TagList items={["--yuyu-* CSS 변수", "Tailwind yuyu-* 색", "React 컴포넌트 12종", "다크 기본"]} />
      </PageHeader>

      <section className="space-y-4">
        <SectionHeader title="색 토큰" description="R G B 채널로 정의해 bg-yuyu-surface/80 처럼 투명도를 붙여 쓴다." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {colorTokens.map((t) => (
            <div key={t.name} className="overflow-hidden rounded-yuyu-md border border-yuyu-line/60 bg-yuyu-surface">
              <div className="h-12 border-b border-yuyu-line/60" style={{ background: `rgb(var(--yuyu-${t.name}))` }} />
              <div className="p-2.5">
                <div className="font-mono text-[11px] text-yuyu-fg">--yuyu-{t.name}</div>
                <div className="mt-0.5 text-[11px] text-yuyu-fg-subtle">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Button" />
        <div className="flex flex-wrap items-center gap-2">
          <Button>기본</Button>
          <Button variant="outline" trailingIcon={ArrowRight}>외곽선</Button>
          <Button variant="ghost">고스트</Button>
          <Button size="sm" icon={Github} variant="outline">작게</Button>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Badge · tone" description="분야 색(ai · infra · web)은 프로젝트 분류에만, 상태 색은 상태에만 쓴다." />
        <div className="flex flex-wrap gap-2">
          {tones.map((tone) => <Badge key={tone} tone={tone}>{tone}</Badge>)}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Card · Stat" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat value="27 / 27" label="화면 요청 처리" hint='tone="ai"' tone="ai" />
          <Stat value="3,059" label="자동 테스트" hint='tone="infra"' tone="infra" />
          <Card tone="brand">
            <p className="text-sm font-semibold text-yuyu-fg">Card</p>
            <p className="mt-1 text-xs text-yuyu-fg-muted">to 나 href 를 주면 카드 전체가 링크가 된다.</p>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="FilterChips" />
        <FilterChips
          label="예시 필터"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "전체", count: 3 },
            { value: "ai", label: "AI · AX", count: 2 },
            { value: "infra", label: "인프라", count: 1 },
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeader title="Pipeline · Steps" description="사람이 결정하는 단계는 점선과 꼬리표로 구분한다." />
        <Card>
          <Pipeline
            nodes={[
              { label: "요청", sub: "기획자 프롬프트", tone: "brand" },
              { label: "생성", sub: "에이전트", tone: "ai" },
              { label: "검증", sub: "스크립트 · 테스트", tone: "infra" },
              { label: "승인", sub: "사람", tone: "warning", human: true },
            ]}
          />
        </Card>
        <Card>
          <Steps
            steps={[
              { title: "요청을 받는다", body: "무엇을 만들지 글로 적는다." },
              { title: "에이전트가 만든다", body: "정해진 부품과 규칙 안에서만.", tone: "ai" },
              { title: "사람이 합친다", body: "되돌리기 어려운 일은 사람이 누른다.", tone: "warning", note: "사람 결정" },
            ]}
          />
        </Card>
      </section>

      <section className="space-y-3">
        <SectionHeader title="Callout" />
        <Callout title="정보" icon={Info}>배경 설명이나 맥락을 짧게.</Callout>
        <Callout title="보안" icon={ShieldCheck} tone="infra">권한 · 비밀값 같은 결정의 근거.</Callout>
      </section>
    </Container>
  )
}
