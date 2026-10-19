import { ArrowRight, BookOpen, ExternalLink } from "lucide-react"
import {
  Badge, Button, Card, Container, PageHeader, Pipeline, SectionHeader, cx, toneText,
} from "../components/yuyu"
import { harnessComparison, harnessParts, toolUses } from "../data/ax"
import { principles } from "../data/profile"
import { noteGroups } from "../data/notes"

const pipelineDocsUrl = "https://yujinsik-momo.github.io/Design-Dev-Infra-Pipeline/"

export function AxPage() {
  const aiNotes = noteGroups.find((g) => g.id === "ai")?.notes ?? []

  return (
    <Container width="wide" className="space-y-16 py-12">
      <PageHeader
        eyebrow="AI · AX"
        title="하네스 엔지니어링"
        lead="AI 에게 일을 시키는 「작업 환경」을 설계합니다. 프롬프트를 잘 쓰는 것보다, 에이전트가 틀릴 수 없는 길을 깔고 사람이 결정해야 할 자리를 분명히 하는 데 시간을 씁니다."
      >
        <div className="flex flex-wrap gap-2">
          <Button href={pipelineDocsUrl} icon={ExternalLink}>하네스 사용 설명서</Button>
          <Button to="/work/design-harness" variant="outline" trailingIcon={ArrowRight}>디자인 시스템 하네스</Button>
          <Button to="/work/trade-area#release" variant="ghost" trailingIcon={ArrowRight}>릴리스 하네스</Button>
        </div>
      </PageHeader>

      <section className="space-y-5">
        <SectionHeader eyebrow="Principles" title="원칙" />
        <div className="grid gap-3 md:grid-cols-2">
          {principles.map((p, i) => (
            <Card key={p.title}>
              <span className={cx("font-mono text-xs font-semibold", toneText[p.tone])}>0{i + 1}</span>
              <h3 className="mt-2 text-base font-semibold text-yuyu-fg">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-yuyu-fg-muted">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Anatomy"
          title="하네스를 이루는 여섯 부품"
          description="두 하네스 모두 같은 부품으로 만들었습니다. 새 프로젝트에도 이 순서대로 붙입니다."
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {harnessParts.map((part) => (
            <Card key={part.name} className="h-full">
              <Badge tone={part.tone}>{part.name}</Badge>
              <p className="mt-3 text-sm leading-relaxed text-yuyu-fg">{part.role}</p>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-yuyu-fg-subtle">{part.example}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Two harnesses"
          title="디자인 하네스와 릴리스 하네스"
          description="앞쪽(기획 → 코드)과 뒤쪽(리뷰 → 배포)을 나눠 맡습니다."
        />
        <Card padding="lg">
          <Pipeline
            nodes={[
              { label: "기획자 요청", sub: "Slack 폼", tone: "brand", human: true },
              { label: "디자인 하네스", sub: "화면 · PR · 배포", tone: "ai" },
              { label: "기획자 승인", sub: "Slack 버튼", tone: "warning", human: true },
              { label: "릴리스 하네스", sub: "GPT 리뷰 · 수정", tone: "ai" },
              { label: "Slack 승인 · 태그", tone: "warning", human: true },
              { label: "운영", sub: "ECS · 알림", tone: "infra" },
            ]}
          />
        </Card>
        <div className="overflow-x-auto rounded-yuyu-lg border border-yuyu-line/60">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-yuyu-raised text-xs text-yuyu-fg-subtle">
              <tr>
                <th scope="col" className="w-40 px-4 py-2.5 font-medium" />
                <th scope="col" className="px-4 py-2.5 font-medium text-yuyu-ai">디자인 시스템 하네스</th>
                <th scope="col" className="px-4 py-2.5 font-medium text-yuyu-warning">릴리스 하네스</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yuyu-line/50 bg-yuyu-surface">
              {harnessComparison.map((row) => (
                <tr key={row.aspect} className="align-top">
                  <th scope="row" className="px-4 py-3 text-xs font-semibold text-yuyu-fg">{row.aspect}</th>
                  <td className="px-4 py-3 text-yuyu-fg-muted">{row.design}</td>
                  <td className="px-4 py-3 text-yuyu-fg-muted">{row.release}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader eyebrow="Toolchain" title="쓰는 도구와 쓰는 이유" />
        <dl className="grid gap-3 md:grid-cols-2">
          {toolUses.map((t) => (
            <Card key={t.tool}>
              <dt className="text-sm font-semibold text-yuyu-fg">{t.tool}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-yuyu-fg-muted">{t.use}</dd>
            </Card>
          ))}
        </dl>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Notes"
          title="함께 읽을 노트"
          action={<Button to="/notes#ai" size="sm" variant="outline" icon={BookOpen}>AI 노트 전체</Button>}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aiNotes.map((note) => (
            <Card key={note.path} to={note.path}>
              <p className="text-sm font-semibold text-yuyu-fg">{note.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-yuyu-fg-muted">{note.summary}</p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  )
}
