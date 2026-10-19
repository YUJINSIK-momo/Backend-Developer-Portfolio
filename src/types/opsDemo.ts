// 운영 대시보드 미리 보기 — 배포 한 번을 장면(frame)으로 나눠 다시 그린다

export type StageId =
  | "check" | "auth" | "images" | "taskdef" | "migration"
  | "api" | "web" | "smoke" | "etl" | "record"

export type StageState = "pending" | "working" | "done" | "failed" | "skipped"

/** 파드(ECS 태스크)의 단계 — 실제 대시보드와 같은 이름을 쓴다 */
export type PodPhase = "starting" | "checking" | "running" | "failing" | "stopping" | "stopped" | "failed"

/** 대상 그룹에서 이 파드가 놓인 자리 */
export type TargetState = "none" | "initial" | "healthy" | "unhealthy" | "draining"

/** 이번 배포에서 맡은 역할 — 새로 뜬 것 · 내려갈 옛것 · 손대지 않은 것 */
export type PodRole = "new" | "old" | "keep"

export type DemoService = "api" | "web"

export interface DemoPod {
  id: string
  service: DemoService
  revision: number
  role: PodRole
  phase: PodPhase
  target: TargetState
  /** 지나온 단계 — 시각과 한 줄 */
  steps: readonly { at: string; text: string }[]
}

export type JobState = "idle" | "running" | "done" | "failed"

export interface DemoState {
  stages: Record<StageId, StageState>
  pods: readonly DemoPod[]
  migration: JobState
  /** 수집 스케줄이 부르는 etl 리비전 */
  etlRevision: number
  /** 앱 동기화 — 배포 대기 · 배포 중 · 동기화됨 · 롤백됨 */
  sync: "waiting" | "deploying" | "synced" | "rolledback"
}

export interface DemoLog {
  at: string
  level: "info" | "warn" | "error"
  text: string
  /** 사람이 결정한 장면 */
  human?: boolean
}

export interface DemoPodPatch {
  phase?: PodPhase
  target?: TargetState
  role?: PodRole
  step?: string
}

export interface DemoFrame {
  at: string
  stages?: Partial<Record<StageId, StageState>>
  /** 새로 뜨는 파드 */
  add?: readonly Omit<DemoPod, "steps">[]
  pods?: Readonly<Record<string, DemoPodPatch>>
  migration?: JobState
  etlRevision?: number
  sync?: DemoState["sync"]
  log: DemoLog
}

export interface DemoScenario {
  id: string
  label: string
  summary: string
  frames: readonly DemoFrame[]
  /** 끝난 뒤 보여 줄 한 줄 정리 */
  outcome: { tone: "success" | "danger"; text: string }
}
