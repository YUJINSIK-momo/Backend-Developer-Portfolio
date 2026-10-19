import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Badge, Container, PageHeader, SectionHeader } from "../components/yuyu"
import { allNotes, noteGroups } from "../data/notes"

export function NotesPage() {
  return (
    <Container width="wide" className="space-y-12 py-12">
      <PageHeader
        eyebrow="Notes"
        title="학습 노트"
        lead={`일하면서 정리한 개념과 시뮬레이션 ${allNotes.length}편. 비개발자 동료에게 설명할 때 쓰려고 만든 것이 많아 비유와 그림이 많습니다.`}
      />

      {noteGroups.map((group) => (
        <section key={group.id} id={group.id} className="scroll-mt-20 space-y-4">
          <SectionHeader
            title={group.label}
            description={group.description}
            action={<Badge tone={group.tone}>{group.notes.length}편</Badge>}
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.notes.map((note) => (
              <li key={note.path}>
                <Link
                  to={note.path}
                  className="group flex h-full flex-col rounded-yuyu-lg border border-yuyu-line/60 bg-yuyu-surface p-4 transition-colors hover:border-yuyu-brand/45 hover:bg-yuyu-raised"
                >
                  <span className="text-sm font-semibold text-yuyu-fg">{note.title}</span>
                  <span className="mt-1 flex-1 text-xs leading-relaxed text-yuyu-fg-muted">{note.summary}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-yuyu-fg-subtle group-hover:text-yuyu-brand">
                    읽기 <ArrowRight size={12} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Container>
  )
}
