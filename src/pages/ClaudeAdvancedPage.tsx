import { useState } from "react"
import {
  Wrench,
  Bot,
  Webhook,
  ShieldCheck,
  ListChecks,
  Gauge,
  ArrowRight,
  ArrowDown,
  ChevronRight,
  User,
  Cpu,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  PlayCircle,
  RotateCcw,
  Bell,
  Code2,
  TestTube,
  FileSearch,
  Package,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

type TopicId = "subagent" | "hooks" | "permission" | "phase" | "eval"

const topics: {
  id: TopicId
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  subtitle: string
  color: string
  border: string
  bg: string
  badge: "blue" | "purple" | "amber" | "cyan" | "pink"
  whatIs: string
  whyNeed: string
  todoSteps: { action: string; detail: string }[]
}[] = [
  {
    id: "subagent",
    icon: Bot,
    title: "1. 서브에이전트 설계",
    subtitle: "역할별 전문 에이전트로 분업시키기",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "blue",
    whatIs: "메인 Claude 외에 reviewer·tester·migrator처럼 역할이 한정된 보조 에이전트를 만들어두는 것. 메인은 라우팅·통합을 맡고, 서브는 좁은 작업을 깊게 처리한다.",
    whyNeed: "한 에이전트가 모든 걸 하면 컨텍스트가 오염된다. 코드 리뷰·테스트 실행·DB 마이그레이션을 같은 대화에 섞으면 “지금까지 뭐 했지?”가 발생. 역할을 쪼개면 각자 깨끗한 컨텍스트로 동작.",
    todoSteps: [
      { action: ".claude/agents/ 폴더 생성", detail: "프로젝트 루트의 .claude 아래에 agents 폴더를 만든다" },
      { action: "역할별 .md 파일 작성", detail: "reviewer.md, tester.md 등. 각 파일 상단에 name·description·tools를 frontmatter로 명시" },
      { action: "에이전트 본문에 책임 범위 명시", detail: "“이 에이전트는 X만 한다. Y는 메인 Claude로 돌려보낸다” 같은 경계를 분명히" },
      { action: "메인에서 호출 패턴 정의", detail: "“리뷰는 reviewer에게 위임, 테스트 실행은 tester에게 위임” 패턴을 CLAUDE.md에 한 줄 기록" },
    ],
  },
  {
    id: "hooks",
    icon: Webhook,
    title: "2. hooks 자동화",
    subtitle: "이벤트가 발생할 때 자동으로 명령 실행",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    badge: "purple",
    whatIs: "Claude가 도구를 쓰기 전/후, 작업 종료 시점에 셸 명령을 자동 실행하는 기능. PreToolUse / PostToolUse / Stop 같은 이벤트에 묶는다.",
    whyNeed: "“lint 돌렸어?”, “테스트 통과했어?”를 사람이 매번 묻지 않게 한다. 또 “수정한 파일 자동 포맷”, “작업 끝나면 슬랙 알림”처럼 마찰을 줄이는 일에 강력하다.",
    todoSteps: [
      { action: ".claude/settings.json 열기", detail: "프로젝트 단위 hook은 여기, 개인 hook은 settings.local.json에" },
      { action: "hooks 객체 추가", detail: "PreToolUse / PostToolUse / Stop / UserPromptSubmit 등 이벤트 종류 선택" },
      { action: "matcher와 command 작성", detail: "어떤 도구에 어떤 셸 명령을 붙일지. 예: Edit 도구 후 prettier 실행" },
      { action: "팀과 개인 hook 분리", detail: "팀 공유는 settings.json(커밋), 개인 알림은 settings.local.json(gitignore)" },
    ],
  },
  {
    id: "permission",
    icon: ShieldCheck,
    title: "3. 권한 정책",
    subtitle: "안전한 명령은 자동, 위험한 건 항상 묻기",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "amber",
    whatIs: "settings.json의 permissions에 allow / ask / deny 규칙을 적어 Claude의 도구 호출을 제어. “npm test는 자동 허용, rm -rf는 항상 거부” 같은 정책을 코드로 관리.",
    whyNeed: "매번 “Y/N”을 누르는 피로 vs 위험한 명령이 통과되는 사고. 권한 정책으로 안전한 명령은 자동 통과시키고, 위험한 건 무조건 멈추게 해서 둘 다 잡는다.",
    todoSteps: [
      { action: ".claude/settings.json의 permissions 정의", detail: "allow / ask / deny 세 카테고리에 명령 패턴 나열" },
      { action: "안전한 명령부터 allow에", detail: "npm run lint, npm test, git status 같은 읽기·검증 명령부터" },
      { action: "위험 명령은 deny에 명시", detail: "rm -rf, force push, drop database 같은 복구 불가 명령" },
      { action: "애매한 건 ask로", detail: "DB 마이그레이션, 배포 명령처럼 영향이 큰 건 항상 사용자 확인" },
    ],
  },
  {
    id: "phase",
    icon: ListChecks,
    title: "4. Phase / 작업 명세 관리",
    subtitle: "큰 작업을 단계별 체크리스트로 쪼개기",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "cyan",
    whatIs: "phases/phase-01-setup.md 같은 파일에 “이 단계에서 무엇을 끝내야 하는지”를 체크리스트로 정의. Claude가 매번 “어디까지 했지?”를 묻지 않게 한다.",
    whyNeed: "컨텍스트 윈도우엔 한계가 있다. 한 번에 “전체 프로젝트”를 다루면 길게 갈수록 앞 내용을 잊는다. phase 단위로 잘라 그 phase만 컨텍스트에 올리는 방식이 안정적.",
    todoSteps: [
      { action: "phases/ 폴더 생성", detail: "프로젝트 루트에 단순한 phases 디렉터리를 만든다" },
      { action: "phase-NN-XXX.md 형식으로 파일 작성", detail: "phase-01-setup.md, phase-02-pages.md 처럼 번호와 주제를 파일명에" },
      { action: "각 파일에 체크리스트 작성", detail: "- [ ] 항목으로 끝내야 할 작업을 나열, 완료되면 - [x]로 변경" },
      { action: "작업 시작 시 해당 phase 파일을 명시 참조", detail: "“phases/phase-02-pages.md 읽고 다음 미완료 항목 처리해줘”로 시작" },
    ],
  },
  {
    id: "eval",
    icon: Gauge,
    title: "5. 평가 루프",
    subtitle: "결과물의 품질을 자동으로 검증",
    color: "text-pink-400",
    border: "border-pink-500/30",
    bg: "bg-pink-500/5",
    badge: "pink",
    whatIs: "Claude가 만든 결과물을 별도 에이전트나 스크립트로 자동 검증. 빌드 통과·테스트 통과·타입 에러 0건·접근성 점수 같은 기준을 통과해야 “완료”로 친다.",
    whyNeed: "“다 됐어요” 했지만 실제로 빌드가 깨져 있는 경우가 흔하다. 사람이 매번 확인하면 병목, 평가 루프를 자동화하면 Claude가 스스로 검증·재시도하게 만들 수 있다.",
    todoSteps: [
      { action: "통과 기준을 명문화", detail: "CLAUDE.md에 “완료의 정의”를 적는다: build 통과 + lint 0건 + 테스트 통과" },
      { action: "검증 스크립트 만들기", detail: "scripts/verify.sh 같은 파일에 lint·build·test를 묶어 한 명령으로 실행" },
      { action: "Stop hook으로 자동 실행", detail: "작업 종료 시 hook이 verify.sh를 돌려 실패하면 다시 작업 지시" },
      { action: "evaluator 서브에이전트 도입(선택)", detail: "결과물을 별도 에이전트가 리뷰·점수 매기는 패턴. 큰 프로젝트에서 효과" },
    ],
  },
]

const decisionTree = [
  {
    q: "같은 종류의 작업을 자주 반복하는가?",
    yes: "→ 슬래시 명령(.claude/commands/) 부터",
    no: null,
  },
  {
    q: "에이전트가 위험한 명령을 실수로 실행할까 걱정되는가?",
    yes: "→ 권한 정책(permissions) 부터",
    no: null,
  },
  {
    q: "“다 됐어요” 했는데 실제로는 빌드 깨진 경험이 있는가?",
    yes: "→ 평가 루프 + Stop hook 부터",
    no: null,
  },
  {
    q: "작업이 너무 커서 매번 “어디까지 했지?”를 묻게 되는가?",
    yes: "→ Phase 관리 부터",
    no: null,
  },
  {
    q: "한 대화에 여러 종류 작업이 섞여 컨텍스트가 오염되는가?",
    yes: "→ 서브에이전트 분리 부터",
    no: null,
  },
]

export function ClaudeAdvancedPage() {
  const [activeTopic, setActiveTopic] = useState<TopicId>("subagent")
  const topic = topics.find((t) => t.id === activeTopic)!

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Wrench size={20} className="text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Claude Code 가이드 — Advanced</h1>
          <Badge variant="purple">Harness Engineering</Badge>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          기초(CLAUDE.md + docs/)가 갖춰진 다음 단계. AI 에이전트가 일할 “작업 환경”을 설계하는 영역이며, 업계에서는 <span className="text-purple-300">하네스 엔지니어링(Harness Engineering)</span>이라 부릅니다.
          서브에이전트·hooks·권한 정책·phase 관리·평가 루프 다섯 축으로 구성됩니다.
        </p>
      </div>

      {/* 전체 그림: 하네스란? */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400" />
          하네스 엔지니어링 한 장 요약
        </h2>
        <p className="text-xs text-slate-500 mb-6">사용자와 Claude 사이에 “하네스(작업 환경)”를 둬서 자동화·안전성·재현성을 확보합니다.</p>

        <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-6">
          <div className="flex flex-col items-center gap-3">
            {/* Top: User */}
            <div className="rounded-lg border border-slate-600/40 bg-slate-700/30 px-4 py-2 flex items-center gap-2">
              <User size={14} className="text-slate-300" />
              <span className="text-sm text-white font-medium">사용자</span>
            </div>
            <ArrowDown size={14} className="text-slate-600" />

            {/* Harness Box */}
            <div className="w-full rounded-xl border-2 border-dashed border-purple-500/40 bg-purple-500/5 p-5">
              <div className="text-center mb-4">
                <Badge variant="purple">Harness · 작업 환경</Badge>
              </div>
              <div className="grid sm:grid-cols-5 gap-2">
                {[
                  { icon: Bot, label: "서브에이전트", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
                  { icon: Webhook, label: "hooks", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
                  { icon: ShieldCheck, label: "권한 정책", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
                  { icon: ListChecks, label: "Phase 관리", color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
                  { icon: Gauge, label: "평가 루프", color: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/10" },
                ].map((c) => {
                  const Icon = c.icon
                  return (
                    <div key={c.label} className={`rounded-lg border p-3 flex flex-col items-center gap-1.5 ${c.border} ${c.bg}`}>
                      <Icon size={16} className={c.color} />
                      <span className={`text-xs font-medium ${c.color}`}>{c.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <ArrowDown size={14} className="text-slate-600" />

            {/* Bottom: Claude + Results */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 flex items-center gap-2">
                <Cpu size={14} className="text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">Claude Code</span>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />
                <span className="text-sm text-green-300 font-medium">검증된 결과</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-purple-300 font-medium">핵심:</span> 사용자가 매번 “lint 돌렸어?”, “테스트 했어?”, “이거 실행해도 돼?”를 물을 필요가 없도록
              <span className="text-white"> 환경 자체에 검증·권한·자동화</span>를 박아둔다.
            </p>
          </div>
        </div>
      </div>

      {/* 5가지 고급 주제 탭 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Wrench size={16} className="text-amber-400" />
          5가지 축 — 각 항목에서 “내가 무엇을 해야 하는지”
        </h2>
        <p className="text-xs text-slate-500 mb-4">탭을 누르고 단계별 to-do를 따라가세요.</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {topics.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  activeTopic === t.id
                    ? `${t.bg} ${t.border} ${t.color}`
                    : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                }`}
              >
                <Icon size={12} />
                {t.title.replace(/^\d+\.\s*/, "")}
              </button>
            )
          })}
        </div>

        <div className={`rounded-xl border p-5 ${topic.border} ${topic.bg}`}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(() => { const Icon = topic.icon; return <Icon size={18} className={topic.color} /> })()}
            <div>
              <div className={`text-base font-bold ${topic.color}`}>{topic.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{topic.subtitle}</div>
            </div>
          </div>

          {/* 무엇 / 왜 */}
          <div className="grid md:grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-3">
              <div className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <HelpCircle size={12} className="text-slate-400" />
                무엇인가?
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{topic.whatIs}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-3">
              <div className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-amber-400" />
                왜 필요한가?
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{topic.whyNeed}</p>
            </div>
          </div>

          {/* 시각 다이어그램 */}
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-5 mb-5">
            <div className="text-xs font-bold text-slate-300 mb-4 text-center">시각적 흐름</div>
            <TopicDiagram topicId={topic.id} />
          </div>

          {/* 단계별 to-do */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <PlayCircle size={12} className={topic.color} />
              내가 해야 할 일 · 단계별
            </div>
            <div className="space-y-2">
              {topic.todoSteps.map((s, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-xs font-bold ${topic.border} ${topic.color}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
                    <div className="text-sm font-semibold text-white">{s.action}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 의사결정 트리 — 어디서부터 시작? */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <ChevronRight size={16} className="text-cyan-400" />
          어디서부터 시작할까? — 의사결정 가이드
        </h2>
        <p className="text-xs text-slate-500 mb-5">5가지를 한꺼번에 다 하지 않습니다. 현재 가장 아픈 곳부터.</p>

        <div className="space-y-3">
          {decisionTree.map((q, idx) => (
            <div key={idx} className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-cyan-400">
                  Q{idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium mb-2">{q.q}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="green">YES</Badge>
                    <span className="text-slate-300">{q.yes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-cyan-300 font-medium">규칙:</span> 한 번에 하나씩만. 두세 가지를 동시에 도입하면 어디서 문제가 생겼는지 추적이 어렵습니다.
            <span className="text-white"> 도입 → 1주 운영 → 평가 → 다음 단계</span> 리듬을 권장합니다.
          </p>
        </div>
      </div>

      {/* 도입 로드맵 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Package size={16} className="text-green-400" />
          전형적인 도입 로드맵
        </h2>
        <p className="text-xs text-slate-500 mb-5">대부분의 팀이 이 순서를 따라가면 마찰이 가장 적습니다.</p>

        <div className="grid md:grid-cols-5 gap-3">
          {[
            { week: "Week 1", topic: "권한 정책", icon: ShieldCheck, color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/5", note: "안전망부터 깐다" },
            { week: "Week 2", topic: "hooks 자동화", icon: Webhook, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/5", note: "lint·테스트 자동화" },
            { week: "Week 3", topic: "Phase 관리", icon: ListChecks, color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/5", note: "큰 작업 쪼개기" },
            { week: "Week 4", topic: "서브에이전트", icon: Bot, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5", note: "역할 분리" },
            { week: "Week 5+", topic: "평가 루프", icon: Gauge, color: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/5", note: "품질 자동 검증" },
          ].map((w, idx) => {
            const Icon = w.icon
            return (
              <div key={idx} className={`rounded-xl border p-4 ${w.border} ${w.bg}`}>
                <div className="text-xs text-slate-500 mb-1">{w.week}</div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className={w.color} />
                  <span className={`text-sm font-bold ${w.color}`}>{w.topic}</span>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">{w.note}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 마무리 원칙 */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-purple-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-purple-300 mb-2">하네스 엔지니어링 핵심 원칙</div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div>• <span className="text-white">AI를 신뢰하지 말고 환경을 신뢰하라</span> — 모델 능력에 기대지 말고 검증을 환경에 박는다</div>
              <div>• <span className="text-white">한 에이전트 = 한 책임</span> — 분업이 곧 품질</div>
              <div>• <span className="text-white">완료의 정의를 코드로</span> — “다 됐어요”의 기준을 verify.sh 같은 파일로 명문화</div>
              <div>• <span className="text-white">점진적 도입</span> — 한 번에 하나씩, 운영 후 다음 단계로</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 주제별 시각 다이어그램
// ─────────────────────────────────────────────────────────────
function TopicDiagram({ topicId }: { topicId: TopicId }) {
  if (topicId === "subagent") return <SubagentDiagram />
  if (topicId === "hooks") return <HooksDiagram />
  if (topicId === "permission") return <PermissionDiagram />
  if (topicId === "phase") return <PhaseDiagram />
  return <EvalDiagram />
}

function NodeBox({
  icon: Icon,
  label,
  sublabel,
  color,
  border,
  bg,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  sublabel?: string
  color: string
  border: string
  bg: string
}) {
  return (
    <div className={`rounded-lg border ${border} ${bg} px-3 py-2 inline-flex flex-col items-center gap-1 min-w-[110px]`}>
      <div className="flex items-center gap-1.5">
        <Icon size={12} className={color} />
        <span className={`text-xs font-semibold ${color}`}>{label}</span>
      </div>
      {sublabel && <span className="text-[10px] text-slate-500">{sublabel}</span>}
    </div>
  )
}

function SubagentDiagram() {
  return (
    <div className="flex flex-col items-center gap-2">
      <NodeBox icon={User} label="사용자 요청" color="text-slate-300" border="border-slate-600/40" bg="bg-slate-700/30" />
      <ArrowDown size={12} className="text-slate-600" />
      <NodeBox icon={Cpu} label="Main Claude" sublabel="라우터 역할" color="text-blue-400" border="border-blue-500/30" bg="bg-blue-500/10" />
      <ArrowDown size={12} className="text-slate-600" />
      <div className="flex gap-2 flex-wrap justify-center">
        <NodeBox icon={FileSearch} label="Reviewer" sublabel="코드 리뷰" color="text-purple-400" border="border-purple-500/30" bg="bg-purple-500/10" />
        <NodeBox icon={TestTube} label="Tester" sublabel="테스트 실행" color="text-cyan-400" border="border-cyan-500/30" bg="bg-cyan-500/10" />
        <NodeBox icon={Code2} label="Migrator" sublabel="DB 마이그레이션" color="text-amber-400" border="border-amber-500/30" bg="bg-amber-500/10" />
      </div>
      <div className="mt-3 text-[11px] text-slate-500 text-center max-w-md">
        메인은 라우팅만, 서브가 좁은 책임을 깊게 처리. 각자 깨끗한 컨텍스트.
      </div>
    </div>
  )
}

function HooksDiagram() {
  return (
    <div className="flex flex-col items-center gap-2">
      <NodeBox icon={User} label='"코드 수정"' color="text-slate-300" border="border-slate-600/40" bg="bg-slate-700/30" />
      <ArrowDown size={12} className="text-slate-600" />
      <NodeBox icon={Webhook} label="PreToolUse" sublabel="lint 검사" color="text-purple-400" border="border-purple-500/30" bg="bg-purple-500/10" />
      <ArrowDown size={12} className="text-slate-600" />
      <NodeBox icon={Code2} label="Edit 실행" color="text-blue-400" border="border-blue-500/30" bg="bg-blue-500/10" />
      <ArrowDown size={12} className="text-slate-600" />
      <NodeBox icon={Webhook} label="PostToolUse" sublabel="format + 테스트" color="text-purple-400" border="border-purple-500/30" bg="bg-purple-500/10" />
      <ArrowDown size={12} className="text-slate-600" />
      <NodeBox icon={Bell} label="Stop hook" sublabel="슬랙 알림" color="text-pink-400" border="border-pink-500/30" bg="bg-pink-500/10" />
      <div className="mt-3 text-[11px] text-slate-500 text-center max-w-md">
        이벤트마다 자동 명령 실행 → 사람이 “돌렸어?”라고 물을 일이 사라진다.
      </div>
    </div>
  )
}

function PermissionDiagram() {
  return (
    <div className="flex flex-col items-center gap-3">
      <NodeBox icon={Cpu} label="Claude의 도구 호출" color="text-blue-400" border="border-blue-500/30" bg="bg-blue-500/10" />
      <ArrowDown size={12} className="text-slate-600" />
      <div className="rounded-lg border-2 border-dashed border-amber-500/40 bg-amber-500/5 px-4 py-3 text-center">
        <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 justify-center">
          <ShieldCheck size={12} />
          settings.json · permissions
        </div>
        <div className="text-[10px] text-slate-500 mt-1">패턴 매칭으로 분기</div>
      </div>
      <ArrowDown size={12} className="text-slate-600" />
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center">
          <CheckCircle2 size={14} className="text-green-400 mx-auto mb-1" />
          <div className="text-xs font-bold text-green-400">allow</div>
          <div className="text-[10px] text-slate-400 mt-1">자동 실행<br/>npm test 등</div>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center">
          <HelpCircle size={14} className="text-amber-400 mx-auto mb-1" />
          <div className="text-xs font-bold text-amber-400">ask</div>
          <div className="text-[10px] text-slate-400 mt-1">사용자 확인<br/>배포 등</div>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
          <XCircle size={14} className="text-red-400 mx-auto mb-1" />
          <div className="text-xs font-bold text-red-400">deny</div>
          <div className="text-[10px] text-slate-400 mt-1">절대 차단<br/>rm -rf 등</div>
        </div>
      </div>
      <div className="mt-1 text-[11px] text-slate-500 text-center max-w-md">
        안전한 명령은 자동, 애매한 건 확인, 위험한 건 차단 — 세 단계로 분리.
      </div>
    </div>
  )
}

function PhaseDiagram() {
  return (
    <div className="flex flex-col items-center gap-3">
      <NodeBox icon={Package} label="큰 프로젝트" sublabel="컨텍스트 과부하" color="text-slate-300" border="border-slate-600/40" bg="bg-slate-700/30" />
      <ArrowDown size={12} className="text-slate-600" />
      <div className="text-xs text-cyan-400 font-bold">↓ phases/ 폴더로 쪼개기 ↓</div>
      <div className="grid sm:grid-cols-3 gap-3 w-full">
        {[
          { num: "01", title: "Setup", items: ["프로젝트 init", "의존성 설치", "CLAUDE.md 작성"] },
          { num: "02", title: "Pages", items: ["라우팅 설정", "Dashboard 페이지", "Glossary 페이지"] },
          { num: "03", title: "Deploy", items: ["GitHub Pages 설정", "도메인 연결", "최종 점검"] },
        ].map((p) => (
          <div key={p.num} className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
            <div className="text-xs font-bold text-cyan-400 mb-2">phase-{p.num}-{p.title.toLowerCase()}.md</div>
            <div className="space-y-1">
              {p.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <div className="w-3 h-3 rounded border border-slate-600/40 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1 text-[11px] text-slate-500 text-center max-w-md">
        한 phase의 체크리스트만 컨텍스트에 올린다 → Claude가 “어디까지 했지?”를 묻지 않음.
      </div>
    </div>
  )
}

function EvalDiagram() {
  return (
    <div className="flex flex-col items-center gap-2">
      <NodeBox icon={Cpu} label="Claude 결과물" sublabel="“다 됐어요”" color="text-blue-400" border="border-blue-500/30" bg="bg-blue-500/10" />
      <ArrowDown size={12} className="text-slate-600" />
      <NodeBox icon={Gauge} label="Evaluator" sublabel="verify.sh 실행" color="text-pink-400" border="border-pink-500/30" bg="bg-pink-500/10" />
      <ArrowDown size={12} className="text-slate-600" />
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center">
          <CheckCircle2 size={14} className="text-green-400 mx-auto mb-1" />
          <div className="text-xs font-bold text-green-400">기준 통과</div>
          <div className="text-[10px] text-slate-400 mt-1">build OK<br/>test OK<br/>lint 0건</div>
          <div className="mt-2 text-[10px] text-green-300">→ 완료</div>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
          <RotateCcw size={14} className="text-red-400 mx-auto mb-1" />
          <div className="text-xs font-bold text-red-400">기준 미달</div>
          <div className="text-[10px] text-slate-400 mt-1">에러 메시지<br/>다시 작업 지시</div>
          <div className="mt-2 text-[10px] text-red-300">→ 재시도</div>
        </div>
      </div>
      <div className="mt-3 text-[11px] text-slate-500 text-center max-w-md">
        “완료의 정의”를 코드(verify.sh)로 만들어 자동 검증 → 거짓 “다 됐어요”를 막는다.
      </div>
    </div>
  )
}
