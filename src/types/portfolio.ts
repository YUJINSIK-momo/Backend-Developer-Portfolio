import type { Tone } from "../components/yuyu"

// 프로젝트 분류 — 필터와 색이 이 값 하나에서 나온다
export type ProjectCategory = "ai" | "infra" | "web"

export type ProjectStatus = "운영 중" | "진행 중" | "완료" | "데모"

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  slug: string
  title: string
  /** 한 줄 소개 — 카드에 그대로 나간다 */
  summary: string
  category: ProjectCategory
  status: ProjectStatus
  period: string
  role: string
  stack: readonly string[]
  /** 카드에 보일 숫자 2~3개 */
  highlights?: readonly string[]
  /** 사이트 안 상세 페이지 경로 */
  detail?: string
  live?: ProjectLink
  repo?: ProjectLink
  /** 회사 비공개 저장소라 코드 링크가 없는 경우 */
  privateRepo?: boolean
  featured?: boolean
}

export interface CategoryMeta {
  label: string
  tone: Tone
  description: string
}

export interface NoteEntry {
  path: string
  title: string
  summary: string
}

export interface NoteGroup {
  id: string
  label: string
  description: string
  tone: Tone
  notes: readonly NoteEntry[]
}

export interface CaseCard {
  title: string
  body: string
  tone?: Tone
  /** 근거가 되는 파일 · 설정 이름 */
  evidence?: string
}

interface CaseSectionBase {
  id: string
  title: string
  description?: string
}

// 사례 페이지의 본문 조각 — 모양(kind)만 정하면 페이지가 알맞게 그린다
export type CaseSection =
  | (CaseSectionBase & { kind: "steps"; steps: readonly { title: string; body: string; note?: string; tone?: Tone }[] })
  | (CaseSectionBase & { kind: "cards"; columns?: 2 | 3; cards: readonly CaseCard[] })
  | (CaseSectionBase & { kind: "table"; head: readonly [string, string]; rows: readonly (readonly [string, string])[] })
  | (CaseSectionBase & { kind: "bullets"; items: readonly string[] })
  | (CaseSectionBase & { kind: "pipeline"; nodes: readonly { label: string; sub?: string; tone?: Tone; human?: boolean }[]; caption?: string })
  /** 데이터 대신 직접 만든 화면을 끼운다 — 지금은 운영 대시보드 미리 보기 하나 */
  | (CaseSectionBase & { kind: "demo"; demo: "ops-dashboard" })

export interface CaseStudy {
  slug: string
  eyebrow: string
  title: string
  lead: string
  facts: readonly { label: string; value: string }[]
  stats: readonly { value: string; label: string; hint?: string; tone?: Tone }[]
  sections: readonly CaseSection[]
  /** 이어서 볼 사례 */
  next?: { label: string; to: string }
}
