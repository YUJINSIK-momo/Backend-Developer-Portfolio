import { useState } from "react"
import {
  Workflow,
  Repeat,
  Timer,
  CalendarClock,
  Server,
  Terminal,
  Copy,
  Check,
  Sparkles,
  ArrowDown,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Bell,
  Activity,
  GitPullRequest,
  Zap,
  Rocket,
  Square,
  ArrowRight,
  Database,
  Trash2,
  FileBarChart,
  ShieldAlert,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

type MechId = "loop" | "selfpace" | "schedule" | "background"

const mechanisms: {
  id: MechId
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  subtitle: string
  color: string
  border: string
  bg: string
  badge: "blue" | "purple" | "cyan" | "amber"
  whatIs: string
  whenUse: string
  commands: string[]
  example: { label: string; flow: string[] }
}[] = [
  {
    id: "loop",
    icon: Repeat,
    title: "1. /loop — 고정 간격 반복",
    subtitle: "정해진 주기마다 같은 작업을 다시 실행",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "blue",
    whatIs:
      "프롬프트나 슬래시 명령을 정해진 간격으로 반복 실행한다. `/loop 5m /check-ci`처럼 간격 + 할 일을 주면, 매 주기마다 같은 작업을 다시 돈다. 멈추라고 할 때까지 계속.",
    whenUse:
      "외부 상태가 시간이 지나야 바뀌는데, 그 변화를 일정한 주기로 확인하고 싶을 때. CI 실행, 배포 롤아웃, 큐 적체, 외부 API 상태 폴링 등.",
    commands: [
      "/loop 5m /babysit-prs",
      "/loop 30s 빌드 로그 확인하고 에러 있으면 요약해줘",
      "/loop 10m main 브랜치 새 커밋 있으면 빌드 깨졌는지 확인",
    ],
    example: {
      label: "배포 후 헬스체크 폴링",
      flow: [
        "/loop 1m 프로덕션 /health 응답 확인",
        "200 아니면 → 에러 응답 본문 요약",
        "200이고 3회 연속 정상 → 정상 보고 후 루프 종료",
      ],
    },
  },
  {
    id: "selfpace",
    icon: Timer,
    title: "2. 자율 페이스 — 간격 생략",
    subtitle: "다음 실행 시점을 모델이 스스로 결정",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    badge: "purple",
    whatIs:
      "`/loop`에서 간격을 빼면 동적 모드가 된다. 모델이 “지금 무엇을 기다리는가”를 보고 다음에 깨어날 시점을 스스로 정한다(ScheduleWakeup). 빠르게 변하면 짧게, 한참 걸리면 길게.",
    whenUse:
      "확인 주기가 일정하지 않은 작업. “8분짜리 CI면 270초씩, 끝나갈 때쯤엔 더 짧게”처럼 상황에 따라 간격이 달라져야 자연스러운 경우.",
    commands: [
      "/loop 마이그레이션 끝까지 지켜보다 완료되면 리포트 작성",
      "/loop 외부 번역 잡이 끝날 때까지 상태 확인하고 끝나면 결과 정리",
    ],
    example: {
      label: "긴 데이터 마이그레이션 감시",
      flow: [
        "/loop (간격 없음) 마이그레이션 진행률 확인",
        "진행률 < 90% → 길게(20분) 뒤 재확인",
        "진행률 > 95% → 짧게(1분) 뒤 재확인",
        "완료 → 검증 쿼리 실행 후 종료",
      ],
    },
  },
  {
    id: "schedule",
    icon: CalendarClock,
    title: "3. /schedule — cron 예약",
    subtitle: "정해진 시각·주기에 원격에서 자동 실행",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "cyan",
    whatIs:
      "cron 스케줄로 도는 원격 에이전트(루틴)를 만든다. 내 터미널이 꺼져 있어도 정해진 시각에 클라우드에서 실행된다. 일회성 예약(“내일 3시에 한 번”)과 반복 예약(“매일 9시”) 모두 가능.",
    whenUse:
      "사람 없이 정기적으로 돌아야 하는 운영 작업. 매일 아침 PR 요약, 주간 의존성 취약점 점검, 매시간 헬스체크 리포트 같은 루틴.",
    commands: [
      "/schedule 매일 오전 9시에 열린 PR 요약해서 알려줘",
      "/schedule 매주 월요일 의존성 업데이트·취약점 점검",
      "/schedule 목록 보여줘 / 방금 만든 루틴 지금 한 번 실행",
    ],
    example: {
      label: "매일 아침 운영 리포트",
      flow: [
        "/schedule 평일 08:30 실행",
        "전날 배포 결과 + 에러 로그 집계",
        "WooCommerce 이상 주문 건 추출",
        "요약을 슬랙/메일로 발송",
      ],
    },
  },
  {
    id: "background",
    icon: Server,
    title: "4. 백그라운드 실행",
    subtitle: "오래 걸리는 작업을 띄워두고 계속 진행",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "amber",
    whatIs:
      "긴 명령이나 서브에이전트를 분리해서 백그라운드로 돌린다(run_in_background). 그동안 다른 작업을 계속하고, 끝나면 하네스가 자동으로 알려준다. 끝날 때까지 멍하니 기다리지 않는다.",
    whenUse:
      "빌드·E2E 테스트·배포·대량 스크립트처럼 수 분 이상 걸리는 단일 작업. “돌려놓고 다른 일 하다가 끝나면 결과 확인” 패턴.",
    commands: [
      "e2e 테스트를 백그라운드로 돌리고 그동안 문서 정리 계속해줘",
      "프로덕션 배포 스크립트 백그라운드 실행, 끝나면 결과 보고",
    ],
    example: {
      label: "긴 테스트와 작업 병행",
      flow: [
        "npm run test:e2e 를 백그라운드로 시작",
        "그동안 메인은 README 정리 진행",
        "테스트 종료 알림 수신",
        "실패 케이스만 모아 원인 분석",
      ],
    },
  },
]

const suitable = [
  {
    icon: Activity,
    title: "외부 상태를 기다리는 작업",
    detail: "CI 실행, 배포 롤아웃, 메시지 큐 처리, 외부 잡 완료처럼 시간이 지나야 결과가 바뀌는 경우.",
  },
  {
    icon: CalendarClock,
    title: "정기 운영 루틴",
    detail: "매일 PR 요약, 주간 의존성·취약점 점검, 일일 운영 리포트처럼 사람 없이 반복돼야 하는 작업.",
  },
  {
    icon: Clock,
    title: "오래 걸리는 단일 작업",
    detail: "대용량 마이그레이션, 긴 테스트 스위트, 대량 배치 — 띄워두고 끝나면 받는 게 효율적.",
  },
  {
    icon: Bell,
    title: "감시 후 조건부 행동",
    detail: "로그·지표를 지켜보다 에러율 급증 같은 조건이 충족되면 알림·자동 대응으로 이어지는 흐름.",
  },
]

const notSuitable = [
  {
    title: "한 번에 끝나는 단순 작업",
    detail: "“이 버그 고쳐줘”처럼 즉시 끝나는 일은 그냥 일반 프롬프트가 맞다. 루프는 오히려 낭비.",
  },
  {
    title: "즉시 결과가 필요한 동기 작업",
    detail: "지금 답이 필요한데 다음 깨어날 때까지 기다리는 구조는 부적합. 바로 실행이 정답.",
  },
  {
    title: "하네스가 이미 추적하는 백그라운드 작업 폴링",
    detail: "백그라운드 작업은 끝나면 자동으로 깨워준다. 그걸 짧은 주기로 다시 확인하는 루프는 비용만 태운다.",
  },
]

const examples = [
  {
    icon: GitPullRequest,
    title: "PR 자동 트리아지",
    mech: "/loop · 고정 간격",
    badge: "blue" as const,
    command: "/loop 10m /babysit-prs",
    desc: "10분마다 열린 PR을 점검 — CI 깨진 PR, 리뷰 대기 PR, 충돌난 PR을 분류해 요약. 멈추라고 할 때까지 지속.",
  },
  {
    icon: Activity,
    title: "배포 모니터링",
    mech: "자율 페이스",
    badge: "purple" as const,
    command: "/loop 방금 올린 배포가 안정될 때까지 헬스체크·에러율 감시",
    desc: "롤아웃 직후엔 자주, 안정되면 뜸하게 확인하다가 5분 연속 정상이면 “배포 성공” 보고 후 종료.",
  },
  {
    icon: CalendarClock,
    title: "일일 CS 리포트",
    mech: "/schedule · cron",
    badge: "cyan" as const,
    command: "/schedule 평일 08:30 전날 문의·이상 주문 집계 리포트",
    desc: "LINE 문의 로그 + WooCommerce 이상 주문을 모아 요약. 내 PC가 꺼져 있어도 클라우드에서 실행.",
  },
  {
    icon: Server,
    title: "긴 마이그레이션",
    mech: "백그라운드 + 자율 페이스",
    badge: "amber" as const,
    command: "마이그레이션 스크립트 백그라운드 실행 후 완료까지 진행률 감시",
    desc: "스크립트는 백그라운드로, 진행률은 자율 페이스로 감시. 끝나면 검증 쿼리까지 자동 실행하고 보고.",
  },
]

const gettingStarted = [
  {
    step: "1",
    title: "프롬프트에 /loop 입력",
    detail: "입력창에 슬래시(/)를 치면 명령이 자동완성된다. 별도 설치·설정 없이 바로 쓸 수 있다.",
  },
  {
    step: "2",
    title: "간격 + 할 일 작성",
    detail: "`/loop 5m /check-ci`처럼 간격과 작업을 준다. 간격을 빼면 자율 페이스로 동작한다.",
  },
  {
    step: "3",
    title: "자동 반복 시작",
    detail: "첫 실행 후 매 주기마다 같은 작업을 다시 수행하고, 결과를 그때그때 보고한다.",
  },
  {
    step: "4",
    title: "멈추기",
    detail: "Esc로 즉시 중단하거나, 작업에 끝 조건을 넣어 자동 종료한다(예: “3회 연속 정상이면 종료”).",
  },
  {
    step: "5",
    title: "예약은 /schedule",
    detail: "시각 기반 루틴은 `/schedule`로 만들고, `/schedule 목록`으로 확인·삭제한다.",
  },
]

const firstRun = [
  "/loop 2m main 브랜치 빌드 상태 확인",
  "→ 2분마다 빌드 상태를 다시 확인",
  "→ 깨지면 에러 요약 보고 / 정상이면 다음 주기 대기",
  "→ Esc 또는 “정상이면 루프 종료” 지시로 멈춤",
]

const commandRef: { cmd: string; use: string; ex: string }[] = [
  { cmd: "/loop <간격> <할 일>", use: "고정 간격 반복", ex: "/loop 5m /babysit-prs" },
  { cmd: "/loop <할 일>", use: "자율 페이스 (모델이 주기 결정)", ex: "/loop 배포 안정될 때까지 감시" },
  { cmd: "Esc", use: "도는 루프 즉시 중단", ex: "—" },
  { cmd: "/schedule <자연어>", use: "cron 예약 루틴 생성", ex: "/schedule 매일 09:00 PR 요약" },
  { cmd: "/schedule 목록", use: "예약된 루틴 보기·관리", ex: "/schedule 목록 보여줘" },
  { cmd: "백그라운드로 실행", use: "긴 작업을 분리 실행", ex: "e2e 테스트 백그라운드로 돌려줘" },
]

const bigDataTasks: {
  id: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  mech: string
  badge: "blue" | "cyan" | "amber"
  desc: string
  commands: string[]
}[] = [
  {
    id: "migration",
    icon: Database,
    title: "대규모 마이그레이션",
    mech: "백그라운드 + 자율 페이스",
    badge: "amber",
    desc: "한 방에 옮기지 않는다. 배치·체크포인트·dry-run으로 안전하게. 실행은 백그라운드, 진행률은 자율 페이스로 감시.",
    commands: [
      "users 테이블을 새 스키마로 옮기는 마이그레이션 스크립트 작성해줘. 10,000행씩 배치, 실패한 배치부터 재시도 가능하게(체크포인트 기록). 먼저 dry-run 100행 결과를 보여주고 승인하면 전체 실행.",
      "마이그레이션 스크립트를 백그라운드로 실행하고, 자율 페이스로 진행률을 감시하다 끝나면 원본/대상 행 수 일치 검증 쿼리 돌려서 보고해줘.",
    ],
  },
  {
    id: "cleanup",
    icon: Trash2,
    title: "DB 정리 (cleanup)",
    mech: "배치 삭제",
    badge: "blue",
    desc: "삭제는 먼저 세고, 샘플을 보여주고, 배치로. 프로덕션은 승인 전 실행 금지가 기본.",
    commands: [
      "90일 이상 지난 비활성 세션 로그를 정리할 거야. 먼저 삭제 대상 건수와 샘플 10건만 보여줘. 승인하면 1만 건씩 트랜잭션으로 나눠 삭제하고 각 배치 후 남은 건수 출력. 프로덕션이니 내 승인 전 DELETE 실행 금지.",
    ],
  },
  {
    id: "report",
    icon: FileBarChart,
    title: "리포트 작성",
    mech: "/schedule · cron",
    badge: "cyan",
    desc: "쿼리는 DB가, 집계·서술은 Claude가. 정기 리포트는 예약으로 자동화한다.",
    commands: [
      "지난 30일 주문 데이터로 운영 리포트를 마크다운으로 만들어줘. 일별 매출 / 상위 상품 10개 / 환불율 / 이상 주문(금액 0·중복 결제). 쿼리는 직접 실행하고 결과만 표로, 마지막에 특이사항 3줄 요약.",
      "/schedule 매주 월요일 09시 지난주 운영 리포트 작성해서 슬랙으로 보내줘",
    ],
  },
]

export function DynamicWorkflowsPage() {
  const [activeMech, setActiveMech] = useState<MechId>("loop")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const mech = mechanisms.find((m) => m.id === activeMech)!

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Workflow size={20} className="text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Dynamic Workflows</h1>
          <Badge variant="purple">반복 · 예약 · 자율 진행</Badge>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          한 번 시키고 끝나는 작업이 아니라, <span className="text-purple-300">시간을 두고 스스로 반복·재개·예약</span>되는 워크플로우입니다.
          Claude Code의 <span className="text-white">/loop · 자율 페이스 · /schedule · 백그라운드 실행</span> 네 가지로 “사람이 계속 지켜보지 않아도 돌아가는 작업”을 만듭니다.
        </p>
      </div>

      {/* 정적 vs 동적 한 장 요약 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400" />
          정적 워크플로우 vs 동적 워크플로우
        </h2>
        <p className="text-xs text-slate-500 mb-6">차이는 “시간”입니다. 한 번의 응답으로 끝나는가, 시간 축 위에서 계속 돌아가는가.</p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 정적 */}
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-slate-300" />
              <span className="text-sm font-bold text-slate-200">정적 (One-shot)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <NodeBox label="프롬프트" color="text-slate-300" border="border-slate-600/40" bg="bg-slate-700/30" />
              <ArrowDown size={12} className="text-slate-600" />
              <NodeBox label="실행" color="text-blue-400" border="border-blue-500/30" bg="bg-blue-500/10" />
              <ArrowDown size={12} className="text-slate-600" />
              <NodeBox label="결과 → 끝" color="text-green-400" border="border-green-500/30" bg="bg-green-500/10" />
            </div>
            <p className="mt-4 text-[11px] text-slate-500 text-center">한 번 응답하고 종료. 대부분의 일반 요청.</p>
          </div>

          {/* 동적 */}
          <div className="rounded-xl border-2 border-dashed border-purple-500/40 bg-purple-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Repeat size={14} className="text-purple-400" />
              <span className="text-sm font-bold text-purple-300">동적 (Dynamic)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <NodeBox label="작업 + 조건" color="text-slate-300" border="border-slate-600/40" bg="bg-slate-700/30" />
              <ArrowDown size={12} className="text-slate-600" />
              <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 w-full text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-purple-300">
                  <Repeat size={12} />
                  실행 → 대기 → 재실행
                </div>
                <div className="text-[10px] text-slate-500 mt-1">간격·시각·완료 알림에 따라 반복</div>
              </div>
              <ArrowDown size={12} className="text-slate-600" />
              <NodeBox label="조건 충족 → 종료" color="text-green-400" border="border-green-500/30" bg="bg-green-500/10" />
            </div>
            <p className="mt-4 text-[11px] text-slate-500 text-center">시간 축 위에서 스스로 반복·재개. 멈출 조건을 만나면 종료.</p>
          </div>
        </div>
      </div>

      {/* 시작하기 — 초기 실행 방법 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Rocket size={16} className="text-pink-400" />
          시작하기 — 초기 실행 방법
        </h2>
        <p className="text-xs text-slate-500 mb-4">슬래시 명령 한 줄이면 끝. 별도 설치나 설정이 필요 없습니다.</p>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* 단계 */}
          <div className="space-y-2">
            {gettingStarted.map((g) => (
              <div key={g.step} className="flex gap-3 items-start rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
                <div className="w-7 h-7 rounded-lg border border-pink-500/30 bg-pink-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-pink-400">
                  {g.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{g.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{g.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 30초 첫 실행 */}
          <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4 h-fit">
            <div className="text-xs font-semibold text-pink-300 mb-3 flex items-center gap-1.5">
              <PlayCircle size={12} />
              30초 첫 실행
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/80 p-3 font-mono text-xs leading-relaxed space-y-1.5">
              {firstRun.map((line, idx) => (
                <div key={idx} className={idx === 0 ? "text-cyan-300" : "text-slate-400"}>
                  {idx === 0 ? <span className="text-slate-600 mr-1.5">›</span> : null}
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-400">
              <Clock size={11} className="text-pink-300 shrink-0 mt-0.5" />
              <span>
                간격 형식: <span className="text-slate-300 font-mono">30s</span>(초) ·{" "}
                <span className="text-slate-300 font-mono">5m</span>(분) ·{" "}
                <span className="text-slate-300 font-mono">1h</span>(시간) · 생략 시 자율 페이스
              </span>
            </div>
            <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-400">
              <Square size={11} className="text-pink-300 shrink-0 mt-0.5" />
              <span>멈출 땐 <span className="text-slate-300">Esc</span>(즉시 중단) 또는 작업에 끝 조건을 미리 명시</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4가지 메커니즘 탭 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Workflow size={16} className="text-amber-400" />
          4가지 메커니즘 — 사용법 + 명령어 + 예시
        </h2>
        <p className="text-xs text-slate-500 mb-4">탭을 눌러 각 방식의 “무엇 / 언제 / 어떻게”를 확인하세요.</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {mechanisms.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.id}
                onClick={() => setActiveMech(m.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  activeMech === m.id
                    ? `${m.bg} ${m.border} ${m.color}`
                    : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                }`}
              >
                <Icon size={12} />
                {m.title.replace(/^\d+\.\s*/, "")}
              </button>
            )
          })}
        </div>

        <div className={`rounded-xl border p-5 ${mech.border} ${mech.bg}`}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(() => {
              const Icon = mech.icon
              return <Icon size={18} className={mech.color} />
            })()}
            <div>
              <div className={`text-base font-bold ${mech.color}`}>{mech.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{mech.subtitle}</div>
            </div>
          </div>

          {/* 무엇 / 언제 */}
          <div className="grid md:grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-3">
              <div className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={12} className="text-slate-400" />
                무엇인가?
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{mech.whatIs}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-3">
              <div className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-amber-400" />
                언제 쓰나?
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{mech.whenUse}</p>
            </div>
          </div>

          {/* 명령어 */}
          <div className="mb-5">
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Terminal size={12} className={mech.color} />
              명령어 예시
            </div>
            <div className="space-y-2">
              {mech.commands.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-900/80 px-3 py-2"
                >
                  <code className="text-xs text-slate-300 font-mono break-all">{c}</code>
                  <button
                    onClick={() => copy(c, `${mech.id}-${idx}`)}
                    className="shrink-0 text-slate-500 hover:text-slate-200 transition-colors"
                    aria-label="복사"
                  >
                    {copiedId === `${mech.id}-${idx}` ? (
                      <Check size={13} className="text-green-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 예시 흐름 */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <PlayCircle size={12} className={mech.color} />
              예시 흐름 — {mech.example.label}
            </div>
            <div className="space-y-2">
              {mech.example.flow.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 text-[11px] font-bold ${mech.border} ${mech.color}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 rounded-lg border border-slate-700/40 bg-slate-800/40 px-3 py-2">
                    <span className="text-xs text-slate-300 leading-relaxed">{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 명령어 레퍼런스 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Terminal size={16} className="text-pink-400" />
          명령어 레퍼런스
        </h2>
        <p className="text-xs text-slate-500 mb-4">한곳에 모은 전체 명령어. 예시는 복사해서 바로 쓸 수 있습니다.</p>

        <div className="rounded-xl border border-slate-700/40 overflow-hidden">
          {/* 헤더 */}
          <div className="hidden sm:grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.3fr)] gap-2 px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/40 text-[11px] font-bold text-slate-400">
            <div>명령</div>
            <div>용도</div>
            <div>예시</div>
          </div>
          {commandRef.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.3fr)] gap-1.5 sm:gap-2 px-4 py-3 border-b border-slate-700/30 last:border-b-0 bg-slate-900/30 sm:items-center"
            >
              <code className="text-xs text-pink-300 font-mono break-all">{row.cmd}</code>
              <div className="text-xs text-slate-400">{row.use}</div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <code className="text-xs text-slate-300 font-mono break-all">{row.ex}</code>
                {row.ex !== "—" && (
                  <button
                    onClick={() => copy(row.ex, `ref-${idx}`)}
                    className="shrink-0 text-slate-500 hover:text-slate-200 transition-colors"
                    aria-label="복사"
                  >
                    {copiedId === `ref-${idx}` ? (
                      <Check size={13} className="text-green-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 어떤 프로젝트가 적합한가 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-400" />
          어떤 작업에 적합한가
        </h2>
        <p className="text-xs text-slate-500 mb-4">핵심 질문: “시간이 지나야 상태가 바뀌는가, 정기적으로 반복돼야 하는가?”</p>

        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {suitable.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={idx} className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg border border-green-500/30 bg-green-500/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-green-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{s.title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{s.detail}</p>
              </div>
            )
          })}
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={14} className="text-red-400" />
            <span className="text-sm font-bold text-red-300">이럴 땐 쓰지 말 것</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {notSuitable.map((n, idx) => (
              <div key={idx} className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-3">
                <div className="text-xs font-semibold text-slate-200 mb-1">{n.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{n.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 실전 예시 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Terminal size={16} className="text-cyan-400" />
          실전 예시 4가지
        </h2>
        <p className="text-xs text-slate-500 mb-4">명령어를 복사해 바로 응용해 보세요.</p>

        <div className="grid md:grid-cols-2 gap-3">
          {examples.map((ex, idx) => {
            const Icon = ex.icon
            return (
              <div key={idx} className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className="text-slate-300" />
                    <span className="text-sm font-bold text-white">{ex.title}</span>
                  </div>
                  <Badge variant={ex.badge}>{ex.mech}</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-900/80 px-3 py-2 mb-2">
                  <code className="text-xs text-slate-300 font-mono break-all">{ex.command}</code>
                  <button
                    onClick={() => copy(ex.command, `ex-${idx}`)}
                    className="shrink-0 text-slate-500 hover:text-slate-200 transition-colors"
                    aria-label="복사"
                  >
                    {copiedId === `ex-${idx}` ? (
                      <Check size={13} className="text-green-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ex.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 대규모 데이터 처리 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Database size={16} className="text-amber-400" />
          대규모 데이터 처리 — 마이그레이션 · 정리 · 리포트
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          핵심: Claude는 수백만 행을 컨텍스트에 올리지 않습니다. <span className="text-slate-300">스크립트·쿼리를 작성·실행하고 배치로 쪼개 감시·보고하는 오케스트레이터</span>입니다.
        </p>

        {/* 오케스트레이터 흐름 */}
        <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4 mb-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { label: "명령", sub: "사용자", color: "text-slate-300", border: "border-slate-600/40", bg: "bg-slate-700/30" },
              { label: "스크립트·쿼리 작성", sub: "Claude", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
              { label: "배치 실행", sub: "DB · 스크립트", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
              { label: "감시 · 검증 · 리포트", sub: "Claude", color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10" },
            ].map((n, idx, arr) => (
              <div key={n.label} className="flex items-center gap-2">
                <div className={`rounded-lg border ${n.border} ${n.bg} px-3 py-2 text-center`}>
                  <div className={`text-xs font-semibold ${n.color}`}>{n.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{n.sub}</div>
                </div>
                {idx < arr.length - 1 && <ArrowRight size={13} className="text-slate-600 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* 시나리오 카드 3종 */}
        <div className="space-y-3">
          {bigDataTasks.map((task) => {
            const Icon = task.icon
            return (
              <div key={task.id} className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className="text-slate-300" />
                    <span className="text-sm font-bold text-white">{task.title}</span>
                  </div>
                  <Badge variant={task.badge}>{task.mech}</Badge>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{task.desc}</p>
                <div className="space-y-2">
                  {task.commands.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-900/80 px-3 py-2"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-[10px] font-mono text-slate-600 mt-0.5 shrink-0">{idx + 1}</span>
                        <code className="text-xs text-slate-300 font-mono break-all leading-relaxed">{c}</code>
                      </div>
                      <button
                        onClick={() => copy(c, `big-${task.id}-${idx}`)}
                        className="shrink-0 text-slate-500 hover:text-slate-200 transition-colors mt-0.5"
                        aria-label="복사"
                      >
                        {copiedId === `big-${task.id}-${idx}` ? (
                          <Check size={13} className="text-green-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* 파괴적 작업 안전 수칙 */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={14} className="text-red-400" />
            <span className="text-sm font-bold text-red-300">파괴적 작업 안전 수칙</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {["count(먼저 세기)", "dry-run", "batch(배치)", "transaction", "verify(검증)"].map((s, idx, arr) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className="rounded-md border border-slate-700/50 bg-slate-900/60 px-2 py-1 text-[11px] font-mono text-slate-300">{s}</span>
                {idx < arr.length - 1 && <ArrowRight size={11} className="text-slate-600 shrink-0" />}
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
              <span className="font-bold text-red-300">deny</span>
              <span className="text-slate-400"> — DROP / TRUNCATE / WHERE 없는 DELETE·UPDATE</span>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
              <span className="font-bold text-amber-300">ask</span>
              <span className="text-slate-400"> — 마이그레이션 실행, 프로덕션 DB 접속·쓰기</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
            권한 정책은 <span className="text-slate-300">Claude Advanced</span> 페이지의 permissions 설정과 묶어두면, 위험한 쿼리는 환경 차원에서 자동 차단됩니다.
          </p>
        </div>
      </div>

      {/* 비용·간격 원칙 */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <div className="flex items-start gap-3">
          <Clock size={18} className="text-purple-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-purple-300 mb-2">간격을 정할 때의 원칙</div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div>• <span className="text-white">“얼마나 자주 잘까”가 아니라 “무엇을 기다리는가”로 정한다</span> — 8분 걸리는 CI를 30초마다 확인하면 같은 일을 16번 반복할 뿐.</div>
              <div>• <span className="text-white">컨텍스트 캐시는 5분</span> — 5분 넘게 쉬면 다음 실행이 느려지고 비싸진다. 자주 봐야 하면 4분 이내, 한참 기다려도 되면 20분 이상으로 크게.</div>
              <div>• <span className="text-white">자동 알림이 오는 작업은 폴링하지 않는다</span> — 백그라운드 작업은 끝나면 깨워준다. 굳이 짧게 다시 확인하면 비용만 든다.</div>
              <div>• <span className="text-white">멈출 조건을 반드시 명시</span> — “3회 연속 정상이면 종료”처럼 끝나는 기준이 없으면 영원히 돈다.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
function NodeBox({
  label,
  color,
  border,
  bg,
}: {
  label: string
  color: string
  border: string
  bg: string
}) {
  return (
    <div className={`rounded-lg border ${border} ${bg} px-4 py-2 text-center w-full`}>
      <span className={`text-xs font-semibold ${color}`}>{label}</span>
    </div>
  )
}
