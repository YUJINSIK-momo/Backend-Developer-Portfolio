import { useEffect, useMemo, useState, type ElementType, type ReactNode } from "react"
import {
  ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, CircleAlert, CircleCheck, CircleDashed, CircleMinus,
  CircleX, Database, HeartPulse, Loader, Minus, Pause, Play, RotateCcw, Timer, X,
} from "lucide-react"
import { Badge, Button, Callout, FilterChips, cx, toneBorder, toneDot, toneText, type Tone } from "../yuyu"
import { demoInitialState, demoScenarios, demoStages } from "../../data/opsDemo"
import { countPods, demoStateAt } from "../../utils/opsDemo"
import type {
  DemoPod, DemoService, DemoState, JobState, PodPhase, PodRole, StageState, TargetState,
} from "../../types/opsDemo"

const FRAME_MS = 1700

const phaseView: Record<PodPhase, { text: string; tone: Tone; icon: ElementType; live?: boolean }> = {
  starting: { text: "시작 중", tone: "brand", icon: Loader, live: true },
  checking: { text: "헬스 체크 중", tone: "brand", icon: HeartPulse, live: true },
  running: { text: "실행 중", tone: "success", icon: CircleCheck },
  failing: { text: "헬스 체크 실패", tone: "danger", icon: CircleAlert, live: true },
  stopping: { text: "종료 중", tone: "warning", icon: ArrowDown, live: true },
  stopped: { text: "종료됨", tone: "neutral", icon: CircleMinus },
  failed: { text: "실패", tone: "danger", icon: CircleX },
}

const targetText: Record<TargetState, string> = {
  none: "대상 그룹에 없음",
  initial: "대상 등록 · 확인 중",
  healthy: "대상 정상 · 요청 받는 중",
  unhealthy: "대상 비정상 · 요청 안 받음",
  draining: "대상 해제 · 연결 정리 중",
}

const roleText: Record<PodRole, string> = { new: "새", old: "옛", keep: "유지" }

const stageView: Record<StageState, { tone: Tone; icon: ElementType; text: string }> = {
  pending: { tone: "neutral", icon: CircleDashed, text: "대기" },
  working: { tone: "brand", icon: Loader, text: "진행 중" },
  done: { tone: "success", icon: Check, text: "끝" },
  failed: { tone: "danger", icon: X, text: "실패" },
  skipped: { tone: "neutral", icon: Minus, text: "건너뜀" },
}

const jobView: Record<JobState, { tone: Tone; text: string }> = {
  idle: { tone: "neutral", text: "적용할 것 없음" },
  running: { tone: "brand", text: "실행 중" },
  done: { tone: "success", text: "끝남 · 2개 적용" },
  failed: { tone: "danger", text: "실패" },
}

const syncView: Record<DemoState["sync"], { tone: Tone; text: string; sub: string }> = {
  waiting: { tone: "brand", text: "배포 대기", sub: "main 에 합쳐진 PR 2개가 태그를 기다림" },
  deploying: { tone: "brand", text: "배포 중", sub: "태그 v1.0.21 → 운영" },
  synced: { tone: "success", text: "동기화됨", sub: "운영 = main HEAD" },
  rolledback: { tone: "danger", text: "롤백됨", sub: "시도 :29 · 지금 :28" },
}

export function OpsDashboardDemo() {
  const [scenarioId, setScenarioId] = useState(demoScenarios[0].id)
  const [count, setCount] = useState(0)
  const [playing, setPlaying] = useState(false)

  const scenario = demoScenarios.find((s) => s.id === scenarioId) ?? demoScenarios[0]
  const total = scenario.frames.length
  const finished = count >= total
  const running = playing && !finished
  const state = useMemo(() => demoStateAt(demoInitialState, scenario.frames, count), [scenario, count])
  const logs = scenario.frames.slice(0, count).map((frame) => frame.log).reverse()

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setCount((c) => c + 1), count === 0 ? 300 : FRAME_MS)
    return () => clearTimeout(timer)
  }, [running, count])

  function chooseScenario(id: string) {
    setScenarioId(id)
    setCount(0)
    setPlaying(false)
  }

  function togglePlay() {
    if (finished) {
      setCount(0)
      setPlaying(true)
    } else {
      setPlaying(!running)
    }
  }

  function step(delta: number) {
    setPlaying(false)
    setCount((c) => Math.min(total, Math.max(0, c + delta)))
  }

  return (
    <div className="overflow-hidden rounded-yuyu-lg border border-yuyu-line/60 bg-yuyu-surface shadow-yuyu-raised">
      {/* 머리 — 실제 화면의 앱 탭 머리와 같은 자리 */}
      <div className="flex flex-col gap-3 border-b border-yuyu-line/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-yuyu-sm bg-yuyu-brand-strong font-mono text-[10px] font-bold text-white">
            app
          </span>
          <div>
            <p className="text-sm font-semibold text-yuyu-fg">상권 프로젝트 · 앱</p>
            <p className="text-[11px] text-yuyu-fg-subtle">ECS 리소스 · 읽기 전용 · 예시 데이터</p>
          </div>
        </div>
        <FilterChips
          label="시나리오"
          value={scenario.id}
          onChange={chooseScenario}
          options={demoScenarios.map((s) => ({ value: s.id, label: s.label }))}
        />
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-yuyu-fg-muted">{scenario.summary}</p>

        {/* 재생 */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" icon={finished ? RotateCcw : running ? Pause : Play} onClick={togglePlay}>
            {finished ? "다시 재생" : running ? "멈춤" : count === 0 ? "배포 재생" : "이어서 재생"}
          </Button>
          <Button size="sm" variant="outline" icon={ChevronLeft} onClick={() => step(-1)} disabled={count === 0} label="이전 장면">
            이전
          </Button>
          <Button size="sm" variant="outline" trailingIcon={ChevronRight} onClick={() => step(1)} disabled={finished} label="다음 장면">
            다음
          </Button>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-yuyu-fg-subtle">
            <Timer size={12} aria-hidden />
            {count === 0 ? "배포 전" : scenario.frames[count - 1].at} · {count}/{total}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-yuyu-raised" aria-hidden>
          <div
            className={cx("h-full rounded-full transition-all duration-500", finished && scenario.outcome.tone === "danger" ? "bg-yuyu-danger" : "bg-yuyu-brand")}
            style={{ width: `${(count / total) * 100}%` }}
          />
        </div>

        <SummaryTiles state={state} />
        <StageRail stages={state.stages} />

        <div className="space-y-3">
          {(["api", "web"] as const).map((service) => (
            <PodRow key={service} service={service} pods={state.pods.filter((p) => p.service === service)} />
          ))}
          <JobRow state={state} />
        </div>

        <EventLog logs={logs} />

        {finished && (
          <Callout tone={scenario.outcome.tone} icon={scenario.outcome.tone === "success" ? CircleCheck : CircleAlert}>
            {scenario.outcome.text}
          </Callout>
        )}
      </div>
    </div>
  )
}

function healthOf(state: DemoState): { tone: Tone; text: string } {
  if (state.pods.some((p) => p.phase === "failing" || p.phase === "failed")) return { tone: "warning", text: "주의" }
  if (state.pods.some((p) => p.phase === "starting" || p.phase === "checking" || p.phase === "stopping")) {
    return { tone: "brand", text: "진행 중" }
  }
  return { tone: "success", text: "정상" }
}

function SummaryTiles({ state }: { state: DemoState }) {
  const health = healthOf(state)
  const sync = syncView[state.sync]
  const pods = countPods(state.pods)
  const working = demoStages.find((s) => state.stages[s.id] === "working")
  const done = demoStages.filter((s) => state.stages[s.id] === "done").length

  return (
    <dl className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      <Tile label="앱 건강">
        <Dot tone={health.tone} /> <span className={toneText[health.tone]}>{health.text}</span>
      </Tile>
      <Tile label="동기화" sub={sync.sub}>
        <Dot tone={sync.tone} /> <span className={toneText[sync.tone]}>{sync.text}</span>
      </Tile>
      <Tile label="지금 배포" sub={`${done}/${demoStages.length} 단계 끝`}>
        {working ? working.label : state.sync === "waiting" ? "없음" : state.sync === "rolledback" ? "롤백으로 끝남" : "끝남"}
      </Tile>
      <Tile label="파드">
        <span className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs font-normal">
          <span><span className="text-yuyu-success">정상</span> {pods.healthy}</span>
          <span><span className="text-yuyu-brand">진행 중</span> {pods.progressing}</span>
          <span><span className="text-yuyu-danger">비정상</span> {pods.unhealthy}</span>
          <span><span className="text-yuyu-fg-subtle">종료됨</span> {pods.stopped}</span>
        </span>
      </Tile>
    </dl>
  )
}

function Tile({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-yuyu-md border border-yuyu-line/50 bg-yuyu-bg/60 px-3 py-2.5">
      <dt className="text-[11px] text-yuyu-fg-subtle">{label}</dt>
      <dd className="mt-1 flex items-center gap-1 text-sm font-semibold text-yuyu-fg">{children}</dd>
      {sub && <dd className="mt-0.5 truncate text-[11px] text-yuyu-fg-subtle">{sub}</dd>}
    </div>
  )
}

function Dot({ tone, live }: { tone: Tone; live?: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0" aria-hidden>
      {live && <span className={cx("absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping", toneDot[tone])} />}
      <span className={cx("relative h-2 w-2 rounded-full", toneDot[tone])} />
    </span>
  )
}

function StageRail({ stages }: { stages: DemoState["stages"] }) {
  return (
    <ol aria-label="배포 단계" className="grid grid-cols-2 gap-1.5 sm:grid-cols-5 xl:grid-cols-10">
      {demoStages.map((stage, i) => {
        const v = stageView[stages[stage.id]]
        const Icon = v.icon
        return (
          <li
            key={stage.id}
            className={cx(
              "flex min-w-0 items-center gap-1.5 rounded-yuyu-sm border px-2 py-1.5 sm:flex-col sm:gap-1 sm:px-1 sm:py-2 sm:text-center",
              toneBorder[v.tone],
              stages[stage.id] === "working" && "bg-yuyu-brand/10",
              stages[stage.id] === "failed" && "bg-yuyu-danger/10",
            )}
          >
            <Icon
              size={14}
              className={cx("shrink-0", toneText[v.tone], stages[stage.id] === "working" && "motion-safe:animate-spin")}
              aria-hidden
            />
            <span
              className={cx(
                "min-w-0 truncate text-[11px] sm:w-full",
                stages[stage.id] === "pending" || stages[stage.id] === "skipped" ? "text-yuyu-fg-subtle" : "text-yuyu-fg",
                stages[stage.id] === "skipped" && "line-through",
              )}
            >
              <span className="text-yuyu-fg-subtle">{i + 1}.</span> {stage.label}
            </span>
            <span className="sr-only">, {v.text}</span>
          </li>
        )
      })}
    </ol>
  )
}

function PodRow({ service, pods }: { service: DemoService; pods: readonly DemoPod[] }) {
  const before = pods.filter((p) => p.role !== "new")
  const after = pods.filter((p) => p.role === "new")
  const healthy = pods.filter((p) => p.target === "healthy").length
  const draining = pods.filter((p) => p.target === "draining").length

  return (
    <div className="rounded-yuyu-md border border-yuyu-line/50 bg-yuyu-bg/40 p-3">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-yuyu-fg">
          <span className="font-mono font-semibold">{service}</span> <span className="text-yuyu-fg-muted">파드</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={healthy > 0 ? "success" : "danger"}>정상 대상 {healthy}</Badge>
          {draining > 0 && <Badge tone="warning">연결 정리 {draining} · 겹치는 중</Badge>}
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-2">{before.map((pod) => <PodCard key={pod.id} pod={pod} />)}</div>
        {after.length > 0 && (
          <>
            <ArrowRight size={16} className="hidden shrink-0 text-yuyu-fg-subtle sm:block" aria-label="교체" />
            <ArrowDown size={16} className="mx-auto shrink-0 text-yuyu-fg-subtle sm:hidden" aria-label="교체" />
            <div className="grid flex-1 gap-2">{after.map((pod) => <PodCard key={pod.id} pod={pod} />)}</div>
          </>
        )}
      </div>
    </div>
  )
}

function PodCard({ pod }: { pod: DemoPod }) {
  const v = phaseView[pod.phase]
  const Icon = v.icon
  const gone = pod.phase === "stopped" || pod.phase === "failed"

  return (
    <div
      className={cx(
        "min-w-0 rounded-yuyu-md border bg-yuyu-surface px-3 py-2.5 transition-colors duration-500",
        toneBorder[v.tone],
        gone && "border-dashed opacity-70",
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px]">
        <span className="rounded-yuyu-sm bg-yuyu-raised px-1.5 py-0.5 font-mono text-yuyu-fg">:{pod.revision}</span>
        <span className="text-yuyu-fg-muted">{roleText[pod.role]}</span>
        <span className="ml-auto font-mono text-yuyu-fg-subtle">{pod.id}</span>
      </div>
      <p className={cx("mt-1.5 flex items-center gap-1.5 text-sm font-semibold", toneText[v.tone])}>
        <Icon size={14} className={cx(pod.phase === "starting" && "motion-safe:animate-spin")} aria-hidden />
        {v.text}
        {v.live && <Dot tone={v.tone} live />}
      </p>
      <p className="mt-0.5 text-[11px] text-yuyu-fg-subtle">{targetText[pod.target]}</p>
      {pod.steps.length > 0 && (
        <ol aria-label="지나온 단계" className="mt-2 space-y-0.5 border-t border-yuyu-line/40 pt-2">
          {pod.steps.map((s) => (
            <li key={s.at + s.text} className="flex gap-2 text-[11px] text-yuyu-fg-muted">
              <time className="shrink-0 font-mono text-yuyu-fg-subtle">{s.at}</time>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function JobRow({ state }: { state: DemoState }) {
  const job = jobView[state.migration]
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="flex items-center gap-2.5 rounded-yuyu-md border border-dashed border-yuyu-line/60 px-3 py-2.5">
        <Database size={14} className="shrink-0 text-yuyu-fg-subtle" aria-hidden />
        <div className="min-w-0">
          <p className="text-xs text-yuyu-fg">마이그레이션 <span className="text-yuyu-fg-subtle">· 단발 태스크</span></p>
          <p className={cx("flex items-center gap-1.5 text-[11px]", toneText[job.tone])}>
            <Dot tone={job.tone} live={state.migration === "running"} /> {job.text}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 rounded-yuyu-md border border-dashed border-yuyu-line/60 px-3 py-2.5">
        <Timer size={14} className="shrink-0 text-yuyu-fg-subtle" aria-hidden />
        <div className="min-w-0">
          <p className="text-xs text-yuyu-fg">ETL 스케줄 <span className="text-yuyu-fg-subtle">· 매일 새벽 단발 태스크</span></p>
          <p className="text-[11px] text-yuyu-fg-muted">
            부르는 리비전 <span className="font-mono text-yuyu-fg">etl :{state.etlRevision}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

const logView = {
  info: { tone: "neutral", text: "정보" },
  warn: { tone: "warning", text: "경고" },
  error: { tone: "danger", text: "에러" },
} as const

function EventLog({ logs }: { logs: readonly { at: string; level: keyof typeof logView; text: string; human?: boolean }[] }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold text-yuyu-fg-subtle">이벤트 · 최근 것이 위</p>
      <ol
        aria-live="polite"
        className="scrollbar-thin h-40 space-y-1 overflow-y-auto rounded-yuyu-md border border-yuyu-line/50 bg-yuyu-bg/70 p-2.5 font-mono text-[11px]"
      >
        {logs.length === 0 && <li className="text-yuyu-fg-subtle">「배포 재생」을 누르면 사람이 태그를 발행한 순간부터 시작합니다.</li>}
        {logs.map((log) => (
          <li key={log.at} className="flex gap-2 leading-relaxed">
            <time className="shrink-0 text-yuyu-fg-subtle">{log.at}</time>
            <span className={cx("shrink-0", toneText[logView[log.level].tone])}>{logView[log.level].text}</span>
            <span className={log.human ? "text-yuyu-warning" : "text-yuyu-fg-muted"}>
              {log.text}
              {log.human && <span className="ml-1.5 rounded border border-yuyu-warning/40 px-1 text-[10px]">사람 결정</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
