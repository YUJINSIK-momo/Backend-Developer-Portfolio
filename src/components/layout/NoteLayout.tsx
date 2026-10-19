import { Link, Outlet, useLocation } from "react-router-dom"
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight } from "lucide-react"
import { findNote } from "../../data/notes"
import { toneText } from "../yuyu"

// 학습 노트 공통 틀 — 위에는 어느 묶음의 노트인지, 아래에는 같은 묶음의 앞뒤 노트를 보여 준다
export function NoteLayout() {
  const { pathname } = useLocation()
  const note = findNote(pathname)

  if (!note) return <Outlet />

  const siblings = note.group.notes
  const index = siblings.findIndex((n) => n.path === note.path)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]

  return (
    <>
      <div className="border-b border-yuyu-line/40 bg-yuyu-surface/40">
        <nav
          aria-label="노트 위치"
          className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-2.5 text-xs text-yuyu-fg-subtle sm:px-6"
        >
          <BookOpen size={13} aria-hidden />
          <Link to="/notes" className="hover:text-yuyu-fg">학습 노트</Link>
          <ChevronRight size={12} aria-hidden />
          <Link to={`/notes#${note.group.id}`} className={`${toneText[note.group.tone]} hover:underline`}>
            {note.group.label}
          </Link>
          <ChevronRight size={12} aria-hidden />
          <span className="truncate text-yuyu-fg-muted">{note.title}</span>
        </nav>
      </div>

      <Outlet />

      <nav aria-label="같은 묶음의 노트" className="mx-auto mt-4 grid max-w-7xl gap-3 px-4 sm:grid-cols-2 sm:px-6">
        {prev ? (
          <Link
            to={prev.path}
            className="group rounded-yuyu-lg border border-yuyu-line/60 bg-yuyu-surface p-4 transition-colors hover:border-yuyu-brand/45"
          >
            <span className="flex items-center gap-1 text-xs text-yuyu-fg-subtle">
              <ArrowLeft size={12} /> 이전 노트
            </span>
            <span className="mt-1 block text-sm font-semibold text-yuyu-fg">{prev.title}</span>
          </Link>
        ) : <span className="hidden sm:block" />}
        {next && (
          <Link
            to={next.path}
            className="group rounded-yuyu-lg border border-yuyu-line/60 bg-yuyu-surface p-4 text-right transition-colors hover:border-yuyu-brand/45"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-yuyu-fg-subtle">
              다음 노트 <ArrowRight size={12} />
            </span>
            <span className="mt-1 block text-sm font-semibold text-yuyu-fg">{next.title}</span>
          </Link>
        )}
      </nav>
    </>
  )
}
