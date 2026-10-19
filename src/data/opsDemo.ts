import type { DemoFrame, DemoScenario, DemoState, StageId } from "../types/opsDemo"

// 운영 대시보드 「앱」 탭을 예시 값으로 다시 그린 것.
// 단계 이름 · 파드 단계 · 교체 순서는 실제 대시보드와 같고, 시각 · 리비전 · 파드 id 는 지어낸 값이다.

export const demoStages: readonly { id: StageId; label: string }[] = [
  { id: "check", label: "사전 확인" },
  { id: "auth", label: "AWS 로그인" },
  { id: "images", label: "이미지" },
  { id: "taskdef", label: "리비전" },
  { id: "migration", label: "마이그레이션" },
  { id: "api", label: "api 교체" },
  { id: "web", label: "web 교체" },
  { id: "smoke", label: "스모크" },
  { id: "etl", label: "ETL" },
  { id: "record", label: "기록" },
]

export const demoInitialState: DemoState = {
  stages: {
    check: "pending", auth: "pending", images: "pending", taskdef: "pending", migration: "pending",
    api: "pending", web: "pending", smoke: "pending", etl: "pending", record: "pending",
  },
  pods: [
    { id: "a71c4e09", service: "api", revision: 28, role: "keep", phase: "running", target: "healthy", steps: [] },
    { id: "5d2b8f13", service: "web", revision: 27, role: "keep", phase: "running", target: "healthy", steps: [] },
  ],
  migration: "idle",
  etlRevision: 27,
  sync: "waiting",
}

// 태그 발행부터 api 새 파드가 뜨기까지는 두 장면이 같다
const untilApiStart: readonly DemoFrame[] = [
  {
    at: "14:00:00",
    stages: { check: "working" },
    sync: "deploying",
    log: { at: "14:00:00", level: "info", text: "사람이 릴리스 v1.0.21 을 발행 — 태그 배포 시작", human: true },
  },
  {
    at: "14:00:12",
    stages: { check: "done", auth: "working" },
    log: { at: "14:00:12", level: "info", text: "태그 꼴 · main 에 든 커밋 · 그 커밋의 CI 성공 · 발행자 권한 확인" },
  },
  {
    at: "14:00:20",
    stages: { auth: "done", images: "working" },
    log: { at: "14:00:20", level: "info", text: "GitHub OIDC 로 임시 자격 증명을 받음 — 장기 키 없음" },
  },
  {
    at: "14:02:45",
    stages: { images: "done", taskdef: "working" },
    log: { at: "14:02:45", level: "info", text: "api · web · etl 이미지를 불변 태그로 ECR 에 올림 (push 시 취약점 스캔)" },
  },
  {
    at: "14:02:55",
    stages: { taskdef: "done", migration: "working" },
    migration: "running",
    log: { at: "14:02:55", level: "info", text: "새 리비전 api :29 · web :28 등록 → 마이그레이션 단발 태스크 실행" },
  },
  {
    at: "14:03:40",
    stages: { migration: "done", api: "working" },
    migration: "done",
    add: [{ id: "c40e7b21", service: "api", revision: 29, role: "new", phase: "starting", target: "none" }],
    pods: {
      c40e7b21: { step: "새 리비전으로 시작" },
      a71c4e09: { role: "old" },
    },
    log: { at: "14:03:40", level: "info", text: "마이그레이션 2개 적용(exit 0) → api 를 :29 로 교체 시작" },
  },
  {
    at: "14:04:05",
    pods: { c40e7b21: { phase: "checking", target: "initial", step: "대상 그룹에 등록 · 헬스 체크 중" } },
    log: { at: "14:04:05", level: "info", text: "새 api 파드 헬스 체크 중 — 그동안 요청은 옛 파드가 받는다" },
  },
]

export const demoScenarios: readonly DemoScenario[] = [
  {
    id: "rolling",
    label: "정상 배포",
    summary: "새 파드가 정상이 된 뒤에야 옛 파드를 내린다. 두 파드가 잠깐 함께 요청을 받아 끊김이 없다.",
    frames: [
      ...untilApiStart,
      {
        at: "14:04:35",
        pods: {
          c40e7b21: { phase: "running", target: "healthy", step: "헬스 체크 통과 · 실행 중" },
          a71c4e09: { phase: "stopping", target: "draining", step: "내리기 시작 → 대상 해제 · 연결 정리 중" },
        },
        log: { at: "14:04:35", level: "info", text: "새 대상 정상 → 옛 파드 내리기 시작. 연결을 정리하는 동안 둘이 함께 요청을 받는다" },
      },
      {
        at: "14:05:40",
        stages: { api: "done", web: "working" },
        add: [{ id: "e98d3a56", service: "web", revision: 28, role: "new", phase: "starting", target: "none" }],
        pods: {
          a71c4e09: { phase: "stopped", target: "none", step: "연결 정리 끝 · 종료됨" },
          e98d3a56: { step: "새 리비전으로 시작" },
          "5d2b8f13": { role: "old" },
        },
        log: { at: "14:05:40", level: "info", text: "api 교체 끝 — 겹침 1분 05초, 정상 대상 0개 구간 없음 → web 교체 시작" },
      },
      {
        at: "14:06:05",
        pods: { e98d3a56: { phase: "checking", target: "initial", step: "대상 그룹에 등록 · 헬스 체크 중" } },
        log: { at: "14:06:05", level: "info", text: "새 web 파드 헬스 체크 중" },
      },
      {
        at: "14:06:35",
        pods: {
          e98d3a56: { phase: "running", target: "healthy", step: "헬스 체크 통과 · 실행 중" },
          "5d2b8f13": { phase: "stopping", target: "draining", step: "내리기 시작 → 대상 해제 · 연결 정리 중" },
        },
        log: { at: "14:06:35", level: "info", text: "새 web 정상 → 옛 web 내리기 시작" },
      },
      {
        at: "14:07:40",
        stages: { web: "done", smoke: "working" },
        pods: { "5d2b8f13": { phase: "stopped", target: "none", step: "연결 정리 끝 · 종료됨" } },
        log: { at: "14:07:40", level: "info", text: "web 교체 끝 — 겹침 1분 05초 → 스모크 시작" },
      },
      {
        at: "14:07:52",
        stages: { smoke: "done", etl: "working" },
        log: { at: "14:07:52", level: "info", text: "스모크 통과 — 헬스 엔드포인트 · 첫 화면 200" },
      },
      {
        at: "14:08:00",
        stages: { etl: "done", record: "working" },
        etlRevision: 28,
        log: { at: "14:08:00", level: "info", text: "수집 스케줄이 새 etl 리비전 :28 을 부르도록 바꿈" },
      },
      {
        at: "14:08:05",
        stages: { record: "done" },
        sync: "synced",
        log: { at: "14:08:05", level: "info", text: "배포 기록 저장 — 이전 리비전과 되돌리는 명령도 함께 남김" },
      },
    ],
    outcome: { tone: "success", text: "배포 끝 — 8분 5초, 파드 교체 2번, 정상 대상 0개 구간 없음" },
  },
  {
    id: "rollback",
    label: "헬스 체크 실패 → 자동 롤백",
    summary: "새 파드가 정상이 되지 못하면 옛 파드를 내리지 않는다. 서킷 브레이커가 되돌리고, 대시보드는 시도한 버전과 지금 도는 버전을 나란히 보여 준다.",
    frames: [
      ...untilApiStart,
      {
        at: "14:04:35",
        pods: { c40e7b21: { phase: "failing", target: "unhealthy", step: "헬스 체크 실패" } },
        log: { at: "14:04:35", level: "warn", text: "새 api 파드 헬스 체크 실패 — 옛 파드가 계속 요청을 받아 사용자 영향 없음" },
      },
      {
        at: "14:05:20",
        stages: { api: "failed" },
        pods: {
          c40e7b21: { phase: "failed", target: "none", step: "실패가 되풀이돼 종료" },
          a71c4e09: { role: "keep", step: "롤백 — 내리지 않고 그대로 실행 중" },
        },
        log: { at: "14:05:20", level: "error", text: "ECS 서킷 브레이커가 배포 실패로 보고 api 를 :28 로 되돌림" },
      },
      {
        at: "14:05:30",
        stages: { web: "skipped", smoke: "skipped", etl: "skipped", record: "working" },
        sync: "rolledback",
        log: { at: "14:05:30", level: "info", text: "web 은 바꾸지 않음 · 스모크 · ETL 건너뜀" },
      },
      {
        at: "14:05:35",
        stages: { record: "done" },
        log: { at: "14:05:35", level: "warn", text: "롤백 기록 — 시도 :29 · 지금 :28. 마이그레이션은 이미 적용돼, 옛 앱이 새 스키마 위에서 돈다" },
      },
    ],
    outcome: { tone: "danger", text: "롤백 — 요청은 끊기지 않았고 옛 :28 이 계속 돈다. 고친 뒤 다음 태그로 다시 배포" },
  },
]
