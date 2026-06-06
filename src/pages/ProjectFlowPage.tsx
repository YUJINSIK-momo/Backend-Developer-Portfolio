import { useState } from "react"
import {
  Workflow,
  Rocket,
  Wrench,
  Terminal,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Bot,
  AlertTriangle,
  ListChecks,
  Sparkles,
  GitBranch,
  Gauge,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

type Mode = "new" | "existing"

type Step = {
  n: string
  title: string
  detail: string
  cmd?: string
}

const modeMeta: {
  id: Mode
  label: string
  tagline: string
  start: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  border: string
  bg: string
  badge: "blue" | "amber"
}[] = [
  {
    id: "new",
    label: "신규 프로젝트",
    tagline: "빈 프로젝트를 키트 구조로 처음부터 세운다",
    start: "/new-project",
    icon: Rocket,
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "blue",
  },
  {
    id: "existing",
    label: "기존 프로젝트",
    tagline: "이미 코드가 있는 프로젝트에 키트를 입힌다",
    start: "/apply-kit",
    icon: Wrench,
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "amber",
  },
]

const newSteps: Step[] = [
  {
    n: "1",
    title: "claude 실행 → /new-project",
    detail: "컨셉·스택·핵심기능을 한 줄로 넘기면 Claude가 키트 구조를 처음부터 세운다.",
    cmd: "/new-project LINE 챗봇 / Node·NestJS·PostgreSQL / 웹훅 수신·GPT 응답·로그 저장",
  },
  {
    n: "2",
    title: "키트 구조 자동 생성",
    detail:
      "CLAUDE.md · docs/(PRD·ARCHITECTURE·ADR·UI_GUIDE) · .claude/(commands ×7 · agents ×3 · settings) · scripts/verify · CI · phases/ 가 한 번에 깔린다.",
  },
  {
    n: "3",
    title: "핵심 4파일 채우기 — 앞으로 만들 것",
    detail:
      "CLAUDE.md(스택·CRITICAL 규칙 3개) · PRD(무엇을) · ARCHITECTURE(어떻게) · UI_GUIDE(색·간격). 신규는 ‘계획’을 적는다.",
  },
  {
    n: "4",
    title: "verify 연결 (핵심)",
    detail: "package.json에 한 줄. Stop hook + CI가 살아난다. Windows는 ps1.",
    cmd: "\"verify\": \"sh scripts/verify.sh\"",
  },
  {
    n: "5",
    title: "phase-01부터 시작",
    detail: "첫 작업 명세를 따라 진행한다.",
    cmd: "phases/phase-01-setup.md 확인하고 미완료 항목 처리해줘",
  },
  {
    n: "6",
    title: "작업 루프",
    detail: "큰 작업은 /phase로 쪼개고, 변경은 /review, 배포는 /deploy.",
    cmd: "/phase 소켓 통신 시각화 페이지 추가",
  },
]

const existingSteps: Step[] = [
  {
    n: "0",
    title: "안전망 — git 백업 먼저",
    detail: "키트 적용은 파일을 건드린다. clean 상태에서 커밋하거나 새 브랜치를 판다.",
    cmd: "git switch -c chore/apply-kit",
  },
  {
    n: "1",
    title: "키트 풀어서 머지 — 덮어쓰기 금지",
    detail:
      "기존 CLAUDE.md·docs·.claude/settings가 있으면 통째로 덮지 않는다. 없는 파일만 들어오고, 충돌은 확인 후 병합.",
    cmd: "unzip claude-starter-kit.zip && cp -r claude-starter-kit/. ./",
  },
  {
    n: "2",
    title: "verify 연결 (핵심)",
    detail: "기존 package.json에 verify 한 줄. 이게 있어야 자동 검증이 동작한다.",
    cmd: "\"verify\": \"sh scripts/verify.sh\"",
  },
  {
    n: "3",
    title: "CLAUDE.md·docs 역공학으로 채우기",
    detail:
      "신규와 반대로 ‘이미 있는 것’을 적는다. 현재 스택·폴더 구조·데이터 흐름·UI 토큰을 문서화.",
  },
  {
    n: "4",
    title: "/apply-kit 으로 정리·개선",
    detail:
      "안 쓰는 코드·중복·죽은 의존성을 식별 → 삭제 계획을 보여주고 승인받은 뒤 정리. 자산·콘텐츠는 지우지 않는다.",
    cmd: "/apply-kit 백엔드 포트폴리오 / React·TS·Vite",
  },
  {
    n: "5",
    title: "검증",
    detail: "lint + build + test 를 한 번에 돌려 통과 확인.",
    cmd: "npm run verify",
  },
  {
    n: "6",
    title: "작업 루프",
    detail: "/phase로 작업 단위 관리, 변경은 /review, 배포는 /deploy.",
    cmd: "/review",
  },
  {
    n: "7",
    title: "(누적 프로젝트) 하네스 감사",
    detail:
      "오래된 프로젝트는 규칙·설정이 쌓여 있다. 머지된 하네스를 감사해 중복·모순·낡은 규칙을 정리.",
    cmd: "/harness-legacy-scan",
  },
]

const compare: { aspect: string; neo: string; old: string }[] = [
  { aspect: "출발 명령", neo: "/new-project", old: "/apply-kit" },
  { aspect: "파일 처리", neo: "새로 생성", old: "머지 (덮어쓰기 X)" },
  { aspect: "CLAUDE.md·docs", neo: "앞으로 만들 것", old: "이미 있는 것 역공학" },
  { aspect: "정리 단계", neo: "거의 없음", old: "안 쓰는 코드 정리 (승인 후)" },
  { aspect: "백업 필요성", neo: "낮음 (빈 프로젝트)", old: "높음 (git 백업 먼저)" },
  { aspect: "하네스 감사", neo: "나중에", old: "적용 후 권장" },
]

const shared: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  detail: string
}[] = [
  {
    icon: ShieldCheck,
    title: "verify 연결",
    detail: "package.json verify → Stop hook이 작업 끝마다 lint+build+test, CI도 push/PR마다. “다 됐어요”를 강제.",
  },
  {
    icon: Bot,
    title: "서브에이전트 3종",
    detail: "reviewer(/review) · tester(테스트) · migrator(마이그레이션)가 역할별로 분업.",
  },
  {
    icon: ListChecks,
    title: "phase 루프",
    detail: "/phase로 작업을 체크리스트 단위로 쪼개고, /review·/deploy로 마감.",
  },
  {
    icon: Workflow,
    title: "하네스 감사",
    detail: "누적되면 /harness-legacy-scan → /harness-diet로 규칙을 다이어트.",
  },
]

const guards = [
  "자산·콘텐츠(src/assets 등)는 “코드에서 안 쓰인다”고 지우지 않는다",
  "기존 설정·CLAUDE.md는 덮어쓰지 말고 머지, 충돌은 확인",
  "되돌리기 어려운 작업은 계획을 보여주고 승인받은 뒤 실행",
  "커밋·푸시·배포는 명시 허락 전 금지, 빌드·lint 통과 유지",
]

const summaryFlow: { id: Mode; label: string; steps: string[]; color: string }[] = [
  {
    id: "new",
    label: "신규",
    color: "text-blue-300",
    steps: ["claude", "/new-project", "4파일 채우기", "verify 연결", "phase-01", "/review·/deploy"],
  },
  {
    id: "existing",
    label: "기존",
    color: "text-amber-300",
    steps: ["git 백업", "머지(덮어쓰기X)", "verify 연결", "docs 역공학", "/apply-kit 정리", "verify", "/harness-scan·diet"],
  },
]

const effortRecipe: {
  scope: string
  badge: "blue" | "amber" | "purple"
  effort: string
  flow: string
  note: string
}[] = [
  {
    scope: "신규",
    badge: "blue",
    effort: "xhigh",
    flow: "/effort xhigh → /new-project",
    note: "스캐폴딩·인터랙티브라 fan-out 이득이 거의 없음. ultracode는 과함.",
  },
  {
    scope: "기존 · 작은~중간",
    badge: "amber",
    effort: "xhigh",
    flow: "/effort xhigh → /apply-kit",
    note: "한 컨텍스트에 분석이 다 들어옴. xhigh 하나로 충분.",
  },
  {
    scope: "기존 · 크고 누적",
    badge: "purple",
    effort: "ultracode → xhigh",
    flow: "분석만 ultracode → 정리·적용은 xhigh",
    note: "넓은 코드베이스 분석만 fan-out, 승인 필요한 정리는 인터랙티브로. 이후 /harness-legacy-scan → /harness-diet.",
  },
]

export function ProjectFlowPage() {
  const [mode, setMode] = useState<Mode>("new")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const active = modeMeta.find((m) => m.id === mode)!
  const steps = mode === "new" ? newSteps : existingSteps

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
          <Workflow size={20} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">프로젝트 적용 플로우</h1>
          <Badge variant="cyan">신규 / 기존</Badge>
          <Badge variant="slate">치트시트</Badge>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Claude Starter Kit을 <span className="text-blue-300">새 프로젝트</span>에 처음부터 세우는 흐름과,{" "}
          <span className="text-amber-300">이미 코드가 있는 프로젝트</span>에 입히는 흐름을 단계로 정리한 메모입니다.
          핵심 차이는 “새로 만드느냐 vs 머지하고 정리하느냐”입니다.
        </p>
      </div>

      {/* 실전 레시피 — effort 선택 (최상단 하이라이트) */}
      <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-blue-500/10 p-5">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Gauge size={16} className="text-purple-300" />
          <h2 className="text-base font-bold text-white">실전 레시피 — 어떤 effort로?</h2>
          <Badge variant="purple">xhigh 기본</Badge>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          평소엔 <span className="text-cyan-300 font-mono">xhigh</span>로 충분합니다.{" "}
          <span className="text-purple-300 font-mono">ultracode</span>는 “넓게 훑어야 하는 큰 기존 코드베이스의 <span className="text-white">분석</span>”에서만
          잠깐 켜고, 승인이 필요한 정리·적용은 다시 xhigh로 내리세요.
        </p>

        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {effortRecipe.map((r, idx) => (
            <div key={idx} className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-bold text-white">{r.scope}</span>
                <Badge variant={r.badge}>{r.effort}</Badge>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-md border border-slate-700/50 bg-slate-900/80 px-2.5 py-1.5 mb-2">
                <code className="text-[11px] text-slate-300 font-mono break-all">{r.flow}</code>
                <button
                  onClick={() => copy(r.flow, `recipe-${idx}`)}
                  className="shrink-0 text-slate-500 hover:text-slate-200 transition-colors"
                  aria-label="복사"
                >
                  {copiedId === `recipe-${idx}` ? (
                    <Check size={12} className="text-green-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{r.note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-3">
          <div className="text-[11px] font-semibold text-slate-300 mb-1.5">왜 xhigh가 기본인가</div>
          <ul className="space-y-1 text-[11px] text-slate-400 leading-relaxed">
            <li>• <span className="text-white">ultracode = xhigh 추론 + 자동 워크플로우 오케스트레이션</span> — 추론 깊이는 같고, 차이는 멀티 에이전트 fan-out뿐.</li>
            <li>• ultracode는 토큰을 훨씬 쓰고 느립니다. 한 요청이 워크플로우 여러 개로 갈라지기도.</li>
            <li>• <span className="text-amber-300">워크플로우는 중간 승인을 못 받습니다</span> — 키트의 “계획 보여주고 승인” 게이트와 충돌하니, 파괴적 정리·삭제는 xhigh로 인터랙티브하게.</li>
          </ul>
        </div>
      </div>

      {/* 모드 탭 */}
      <div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {modeMeta.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  mode === m.id
                    ? `${m.bg} ${m.border} ${m.color}`
                    : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                }`}
              >
                <Icon size={13} />
                {m.label}
              </button>
            )
          })}
        </div>

        {/* 활성 모드 헤더 + 출발 명령 */}
        <div className={`rounded-xl border p-5 ${active.border} ${active.bg}`}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(() => {
              const Icon = active.icon
              return <Icon size={18} className={active.color} />
            })()}
            <div>
              <div className={`text-base font-bold ${active.color}`}>{active.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{active.tagline}</div>
            </div>
            <div className="ml-auto flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/80 px-3 py-1.5">
              <span className="text-[10px] text-slate-500">출발</span>
              <code className={`text-xs font-mono ${active.color}`}>{active.start}</code>
            </div>
          </div>

          {/* 스텝 */}
          <div className="space-y-2">
            {steps.map((s, idx) => (
              <div key={s.n} className="flex gap-3 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold ${active.border} ${active.color}`}>
                    {s.n}
                  </div>
                  {idx < steps.length - 1 && <div className="w-px flex-1 min-h-[10px] bg-slate-700/50 mt-1" />}
                </div>
                <div className="flex-1 rounded-lg border border-slate-700/40 bg-slate-800/40 px-3 py-2.5 mb-1">
                  <div className="text-sm font-semibold text-white">{s.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{s.detail}</div>
                  {s.cmd && (
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-900/80 px-3 py-1.5">
                      <code className="text-[11px] text-slate-300 font-mono break-all">{s.cmd}</code>
                      <button
                        onClick={() => copy(s.cmd as string, `step-${mode}-${s.n}`)}
                        className="shrink-0 text-slate-500 hover:text-slate-200 transition-colors"
                        aria-label="복사"
                      >
                        {copiedId === `step-${mode}-${s.n}` ? (
                          <Check size={13} className="text-green-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 신규 vs 기존 비교 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400" />
          신규 vs 기존 — 무엇이 다른가
        </h2>
        <p className="text-xs text-slate-500 mb-4">출발 명령과 “파일을 새로 만드느냐 / 머지하고 정리하느냐”가 갈림길입니다.</p>

        <div className="rounded-xl border border-slate-700/40 overflow-hidden">
          <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/40 text-[11px] font-bold">
            <div className="text-slate-400">항목</div>
            <div className="text-blue-300">신규 (/new-project)</div>
            <div className="text-amber-300">기존 (/apply-kit)</div>
          </div>
          {compare.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-4 py-2.5 border-b border-slate-700/30 last:border-b-0 bg-slate-900/30"
            >
              <div className="text-xs font-medium text-slate-300">{row.aspect}</div>
              <div className="text-xs text-slate-400">{row.neo}</div>
              <div className="text-xs text-slate-400">{row.old}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 공통 뼈대 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <GitBranch size={16} className="text-emerald-400" />
          공통 뼈대 — 둘 다 똑같이 적용
        </h2>
        <p className="text-xs text-slate-500 mb-4">출발만 다를 뿐, 그 뒤로 돌아가는 엔진은 같습니다.</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {shared.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={idx} className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{s.title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{s.detail}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 안전 가드 */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={15} className="text-red-400" />
          <span className="text-sm font-bold text-red-300">안전 가드 — 기존 프로젝트는 특히</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {guards.map((g, idx) => (
            <div key={idx} className="flex items-start gap-2 rounded-lg border border-slate-700/40 bg-slate-900/40 px-3 py-2">
              <span className="text-red-400 text-xs mt-0.5 shrink-0">✕</span>
              <span className="text-[11px] text-slate-400 leading-relaxed">{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 한눈 요약 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Terminal size={16} className="text-pink-400" />
          한눈 요약
        </h2>
        <p className="text-xs text-slate-500 mb-4">전체 흐름을 한 줄로.</p>

        <div className="space-y-3">
          {summaryFlow.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
              <div className={`text-xs font-bold mb-2 ${f.color}`}>{f.label}</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {f.steps.map((step, idx, arr) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <span className="rounded-md border border-slate-700/50 bg-slate-800/60 px-2 py-1 text-[11px] font-mono text-slate-300">
                      {step}
                    </span>
                    {idx < arr.length - 1 && <ArrowRight size={11} className="text-slate-600 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
