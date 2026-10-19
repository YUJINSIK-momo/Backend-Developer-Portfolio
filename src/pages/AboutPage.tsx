import { Github, Languages, Mail, MapPin, MessageCircle } from "lucide-react"
import {
  Badge, Button, Card, Container, PageHeader, SectionHeader, TagList, toneSoft, cx,
} from "../components/yuyu"
import { career, profile, skillGroups } from "../data/profile"

export function AboutPage() {
  return (
    <Container className="space-y-14 py-12">
      <PageHeader
        eyebrow="About"
        title={<>{profile.name} <span className="text-xl font-normal text-yuyu-fg-subtle">{profile.nameEn}</span></>}
        lead={profile.intro}
      >
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-yuyu-fg-muted">
          <span className="flex items-center gap-1.5"><MapPin size={13} /> {profile.location}</span>
          <span className="flex items-center gap-1.5"><Languages size={13} /> {profile.languages.join(" · ")}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button href={`mailto:${profile.email}`} icon={Mail}>메일 보내기</Button>
          <Button href={profile.github} icon={Github} variant="outline">GitHub</Button>
          <Button href={profile.line.href} icon={MessageCircle} variant="ghost">LINE {profile.line.id}</Button>
        </div>
      </PageHeader>

      <section className="space-y-5">
        <SectionHeader eyebrow="Career" title="걸어온 길" description="QA 에서 시작해 커머스 · 자동화를 거쳐 지금은 AI 하네스와 인프라를 만듭니다." />
        <ol className="grid gap-3 md:grid-cols-2">
          {career.map((step) => (
            <li key={step.title}>
              <Card className="h-full">
                <Badge tone={step.tone}>{step.phase}</Badge>
                <h3 className="mt-2.5 text-sm font-semibold text-yuyu-fg">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-yuyu-fg-muted">{step.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-5">
        <SectionHeader eyebrow="Skills" title="쓰는 기술" description="실무에서 직접 구축하고 운영한 것만 적었습니다." />
        <div className="grid gap-3 md:grid-cols-2">
          {skillGroups.map((group) => (
            <Card key={group.label}>
              <span className={cx("inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold", toneSoft[group.tone])}>
                {group.label}
              </span>
              <TagList items={group.items} className="mt-3" />
            </Card>
          ))}
        </div>
      </section>

      <Card tone="brand" padding="lg" className="text-center">
        <h2 className="text-lg font-bold text-yuyu-fg">함께 일해 보고 싶으시다면</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-yuyu-fg-muted">
          사내 AX(에이전트 개발 환경 · 업무 자동화), AWS 인프라 구축 · 운영, 일본어가 필요한 서비스에 관심이 많습니다. 짧은 메시지도 환영합니다.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button href={`mailto:${profile.email}`} icon={Mail}>{profile.email}</Button>
        </div>
      </Card>
    </Container>
  )
}
