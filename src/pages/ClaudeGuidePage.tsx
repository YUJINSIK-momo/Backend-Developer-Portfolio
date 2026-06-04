import { useState } from "react"
import {
  Sparkles,
  FileText,
  FolderTree,
  Workflow,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Layers,
  Terminal,
  BookOpen,
  GitBranch,
  Download,
  Package,
  Settings,
  ShieldCheck,
  GitMerge,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

type DocFileId = "prd" | "architecture" | "adr" | "ui_guide" | "claude_md"

const docFiles: {
  id: DocFileId
  path: string
  oneLiner: string
  question: string
  color: string
  border: string
  bg: string
  badge: "blue" | "purple" | "amber" | "cyan" | "green"
  description: string
  example: string
}[] = [
  {
    id: "prd",
    path: "docs/PRD.md",
    oneLiner: "뭘 만드는지",
    question: "What",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "blue",
    description: "제품 요구사항. 사용자가 누구이고, 어떤 문제를 푸는지, 성공 기준은 무엇인지를 정의한다. Claude가 작업 범위를 벗어나지 않도록 잡아주는 닻 역할.",
    example: "- 타겟: PM·기획자\n- 핵심 기능: 용어 검색, 카테고리 필터\n- 비기능 요구: 모바일 대응, GitHub Pages 정적 배포\n- 성공 기준: 비개발자가 5분 내 원하는 용어를 찾을 수 있다",
  },
  {
    id: "architecture",
    path: "docs/ARCHITECTURE.md",
    oneLiner: "어떻게 만드는지",
    question: "How",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    badge: "purple",
    description: "시스템 구조. 폴더 구조, 데이터 흐름, 외부 의존성, 모듈 경계를 그림과 글로 정리. 코드 위치를 매번 묻지 않게 하는 지도.",
    example: "src/\n  pages/      ← 라우트 단위 화면\n  components/ ← 재사용 UI 조각\n  data/       ← mock data\n  types/      ← 공통 타입\n\n데이터 흐름:\nuser → Route → Page → data/*.ts → Card UI",
  },
  {
    id: "adr",
    path: "docs/ADR.md",
    oneLiner: "왜 이렇게 만드는지",
    question: "Why",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "amber",
    description: "Architecture Decision Record. 큰 선택의 이유와 대안, 트레이드오프를 적는다. 6개월 뒤 “왜 이렇게 했지?”라는 질문에 답하는 기록.",
    example: "ADR-001: 상태관리 라이브러리 미사용\n  - 결정: useState + Context만 사용\n  - 이유: 정적 사이트, 전역 상태 거의 없음\n  - 대안: Zustand, Redux\n  - 트레이드오프: 규모 커지면 재검토",
  },
  {
    id: "ui_guide",
    path: "docs/UI_GUIDE.md",
    oneLiner: "어떻게 보여야 하는지",
    question: "Look",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "cyan",
    description: "디자인 토큰·컴포넌트 규칙·레이아웃 원칙. 색상 팔레트, 간격, 폰트, 카드 스타일을 한 곳에. Claude가 만든 UI가 톤이 어긋나지 않게 한다.",
    example: "색상:\n  Primary: blue-500\n  Accent:  cyan-400\n  BG:      navy-900\n\n레이아웃:\n  max-w-7xl, px-4 sm:px-6, py-10\n  카드: rounded-xl border border-slate-700/40",
  },
  {
    id: "claude_md",
    path: "CLAUDE.md",
    oneLiner: "프로젝트 헌법",
    question: "Rules",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    badge: "green",
    description: "항상 자동 로드되는 최상위 컨텍스트. 기술 스택, 절대 어기면 안 되는 CRITICAL 규칙 3개, 개발 프로세스. 길게 쓰지 말고 핵심만.",
    example: "기술 스택: React + TS + Vite + Tailwind\n\nCRITICAL 규칙:\n1. any 타입 금지\n2. 빌드 통과 후 커밋\n3. 한글 커밋 메시지 사용\n\n프로세스: lint → build → commit",
  },
]

type PromptId = "newPage" | "fixBug" | "refactor" | "review"

const promptTemplates: {
  id: PromptId
  title: string
  when: string
  badge: "blue" | "amber" | "purple" | "cyan"
  template: string
}[] = [
  {
    id: "newPage",
    title: "새 페이지 추가",
    when: "기능 단위로 화면을 새로 만들 때",
    badge: "blue",
    template: `[페이지명]Page.tsx를 추가해줘.

목적: [한 문장]
참고할 페이지: src/pages/[기존페이지].tsx
mock data 위치: src/data/[파일명].ts (분리)
사이드바 nav 항목 추가: 라벨 "[표시명]"

완료 기준:
- npm run build 통과
- 모바일 레이아웃 깨짐 없음
- 기존 카드 스타일과 동일`,
  },
  {
    id: "fixBug",
    title: "버그 수정",
    when: "에러가 발생했을 때",
    badge: "amber",
    template: `[에러 메시지 전체 붙여넣기]

발생 파일: src/pages/[파일].tsx
재현 조건: [어떤 동작을 했을 때]
시도해본 것: [이미 해본 것]

원인을 먼저 분석한 후 수정 방향을 알려줘.
수정 전에 영향 범위(다른 페이지)도 함께 확인해줘.`,
  },
  {
    id: "refactor",
    title: "리팩토링",
    when: "코드 구조를 정리할 때",
    badge: "purple",
    template: `[대상 파일/폴더]를 리팩토링해줘.

목표: [중복 제거 / 가독성 / 성능 / 타입 강화]
유지해야 할 것: 외부 API, props 타입, 기존 동작
변경 가능한 것: 내부 구현, 헬퍼 분리, 네이밍

작업 전에 변경 계획을 먼저 보여줘.
확정되면 한 파일씩 단계별로 수정.`,
  },
  {
    id: "review",
    title: "코드 리뷰 요청",
    when: "내가 쓴 코드를 점검받을 때",
    badge: "cyan",
    template: `[코드 붙여넣기 또는 파일 경로]

아래 3가지를 중점으로 리뷰해줘:
1. TypeScript 타입 누락·any 사용 여부
2. 불필요한 재렌더링 가능성
3. 모바일 레이아웃 / 접근성 문제

각 항목에 대해 발견 시 파일:line 형식으로 위치 표기.
사소한 스타일 지적은 생략.`,
  },
]

const startupSteps = [
  {
    step: 0,
    title: "프로젝트 헌법 작성",
    file: "CLAUDE.md",
    detail: "기술 스택, 절대 어기면 안 되는 규칙 3개, 개발 프로세스만. 100~200줄을 넘기지 않는다. 자세한 내용은 docs/로 분리.",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
  {
    step: 1,
    title: "무엇을 만들지 정의",
    file: "docs/PRD.md",
    detail: "사용자·문제·핵심 기능·성공 기준. Claude가 작업 범위를 벗어나지 않도록 잡아주는 닻. 한 페이지 분량으로 충분.",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    step: 2,
    title: "어떻게 만들지 그리기",
    file: "docs/ARCHITECTURE.md",
    detail: "폴더 구조·데이터 흐름·외부 의존성. 한 번 잘 적어두면 “이 코드 어디 있어?” 질문이 사라진다.",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    step: 3,
    title: "큰 결정의 이유 기록",
    file: "docs/ADR.md",
    detail: "라이브러리 선택·아키텍처 선택의 이유를 짧게. 처음엔 2~3개로 시작하고 결정할 때마다 추가.",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
  {
    step: 4,
    title: "디자인 규칙 정리",
    file: "docs/UI_GUIDE.md",
    detail: "색상 토큰·간격·카드 스타일. Claude가 만든 UI가 톤이 어긋나지 않게. 토큰만 적고 컴포넌트 코드는 src/에.",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
  },
  {
    step: 5,
    title: "슬래시 명령·hooks 설정",
    file: ".claude/",
    detail: "자주 쓰는 명령은 .claude/commands/로, 자동 실행은 settings.json hooks로. 작업 마찰을 줄이는 단계. 처음부터 다 만들 필요 없음, 반복되면 추가.",
    color: "text-pink-400",
    border: "border-pink-500/30",
    bg: "bg-pink-500/10",
  },
]

const folderTree = `루트/
├── CLAUDE.md                  ← 항상 자동 로드 (프로젝트 헌법)
├── .claude.local.md           ← 개인 메모 (gitignore)
├── .claude/
│   ├── settings.json          ← 팀 공유 (permissions, hooks)
│   ├── settings.local.json    ← 개인 설정 (gitignore)
│   ├── agents/                ← 커스텀 서브에이전트
│   │   └── reviewer.md
│   └── commands/              ← 슬래시 명령
│       ├── deploy.md          ← /deploy
│       ├── review.md          ← /review
│       ├── new-project.md     ← /new-project
│       ├── apply-kit.md       ← /apply-kit
│       └── phase.md           ← /phase
├── docs/
│   ├── PRD.md                 ← 뭘 만드는지
│   ├── ARCHITECTURE.md        ← 어떻게 만드는지
│   ├── ADR.md                 ← 왜 그렇게 결정했는지
│   ├── UI_GUIDE.md            ← 어떻게 보여야 하는지
│   └── archive/               ← 완료된 작업 보관
├── phases/                    ← phase 단위 실행 상태
│   ├── phase-01-setup.md
│   └── phase-02-pages.md
└── src/
    ├── pages/
    ├── components/
    └── CLAUDE.md              ← 영역별 컨텍스트 (선택)`

const principles = [
  { rule: "CLAUDE.md는 짧게, docs/는 깊게", detail: "자동 로드되는 CLAUDE.md에 길게 쓰면 매 대화마다 토큰을 잡아먹는다. 핵심 규칙만 적고 세부는 docs/로 분리해 필요할 때만 참조." },
  { rule: "하위 디렉터리 CLAUDE.md 활용", detail: "src/pages/에서 작업하면 루트 + src/pages/CLAUDE.md가 자동 로드. 영역별 컨텍스트를 분리해 관련 정보만 노출." },
  { rule: "docs/는 명시적 참조용", detail: "Claude가 자동으로 읽지 않으므로 “docs/PRD.md 읽고 시작해줘”처럼 시작 메시지에 명시. 또는 슬래시 명령으로 자동화." },
  { rule: "phases/로 진행 상태 추적", detail: "큰 작업은 phase 단위로 쪼개 마크다운 체크리스트로 관리. Claude가 “어디까지 했지?”를 매번 묻지 않게 한다." },
  { rule: "한 지시에 한 작업", detail: "“페이지 추가 + 버그 수정 + 리팩토링” 같은 복합 지시는 누락이 생긴다. 페이지 → 섹션 → 컴포넌트 순으로 쪼개라." },
  { rule: "완료 기준을 함께 적기", detail: "“npm run build 통과, 모바일 깨짐 없음”처럼 구체적 검증 기준을 같이 주면 Claude가 스스로 확인 후 종료한다." },
]

const slashCommands: { cmd: string; does: string; example: string }[] = [
  {
    cmd: "/new-project",
    does: "빈 프로젝트를 키트 구조로 처음부터 구축",
    example: "/new-project LINE 챗봇 / Node·NestJS·PostgreSQL / 웹훅 수신·GPT 응답·로그 저장",
  },
  {
    cmd: "/apply-kit",
    does: "기존 코드를 분석해 키트 적용 + 정리·개선",
    example: "/apply-kit 백엔드 포트폴리오 / React·TS·Vite",
  },
  {
    cmd: "/phase",
    does: "목표를 phase 문서로 만들고 체크리스트대로 진행",
    example: "/phase 소켓 통신 시각화 페이지 추가",
  },
  {
    cmd: "/review",
    does: "현재 변경사항 코드 리뷰 (타입·성능·모바일·보안)",
    example: "/review",
  },
  {
    cmd: "/deploy",
    does: "lint·build 검증 후 커밋·푸시",
    example: "/deploy",
  },
]

export function ClaudeGuidePage() {
  const [activeDoc, setActiveDoc] = useState<DocFileId>("claude_md")
  const [activePrompt, setActivePrompt] = useState<PromptId>("newPage")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedStep, setExpandedStep] = useState<number | null>(0)

  const doc = docFiles.find((d) => d.id === activeDoc)!
  const prompt = promptTemplates.find((p) => p.id === activePrompt)!

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Claude Code 사용 가이드</h1>
          <Badge variant="purple">Project Setup</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          프로젝트 시작 전에 어떤 폴더 구조로, 어떤 문서를 먼저 만들고, 어떤 프롬프트로 Claude에게 일을 시킬지 정리합니다.
          복잡한 규칙을 외우는 대신 다섯 개 파일과 여섯 단계 시작 순서로 단순화합니다.
        </p>
      </div>

      {/* 다운로드 CTA */}
      <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-cyan-500/10 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Package size={20} className="text-purple-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-base font-bold text-white">Claude Starter Kit</span>
                <Badge variant="purple">즉시 사용 가능</Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                아래 5가지 파일·폴더 구조를 한 번에 받아 본인 프로젝트 루트에 풀면 끝입니다.
                CLAUDE.md 템플릿, docs/ 4종, .claude/ 설정(권한·슬래시 명령·에이전트), phase 템플릿 모두 포함.
              </p>
            </div>
          </div>
          <a
            href={`${import.meta.env.BASE_URL}templates/claude-starter-kit.zip`}
            download="claude-starter-kit.zip"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500/25 border border-purple-400/50 hover:bg-purple-500/40 hover:border-purple-300/60 text-purple-100 text-sm font-semibold transition-all shrink-0 shadow-lg shadow-purple-500/10"
          >
            <Download size={15} />
            ZIP 다운로드 (스타터 키트)
          </a>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2">
          {[
            { icon: FileText, label: "CLAUDE.md", color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10" },
            { icon: BookOpen, label: "docs/ × 4", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
            { icon: Settings, label: ".claude/settings.json", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
            { icon: Terminal, label: "slash commands × 5", color: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/10" },
            { icon: Sparkles, label: "reviewer agent", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
            { icon: Workflow, label: "phase-01 템플릿", color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
            { icon: Layers, label: ".agents/skills × 6", color: "text-fuchsia-400", border: "border-fuchsia-500/30", bg: "bg-fuchsia-500/10" },
            { icon: ShieldCheck, label: "scripts/verify (sh + ps1)", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
            { icon: GitMerge, label: "GitHub Actions verify.yml", color: "text-sky-400", border: "border-sky-500/30", bg: "bg-sky-500/10" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className={`rounded-lg border ${item.border} ${item.bg} px-2.5 py-2 flex items-center gap-1.5`}>
                <Icon size={11} className={`${item.color} shrink-0`} />
                <span className={`text-[10px] font-medium ${item.color} truncate`}>{item.label}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-3 p-3 rounded-lg bg-pink-500/5 border border-pink-500/20">
          <div className="text-xs font-semibold text-pink-300 mb-2 flex items-center gap-1.5">
            <Terminal size={11} />
            포함된 슬래시 명령 (.claude/commands/)
          </div>
          <div className="space-y-1 text-[10px] text-slate-400 leading-relaxed">
            <div><span className="text-pink-300 font-mono">/new-project</span> — 빈 프로젝트를 키트 구조로 처음부터 구축</div>
            <div><span className="text-pink-300 font-mono">/apply-kit</span> — 기존 코드를 분석해 키트 적용 + 정리·개선</div>
            <div><span className="text-pink-300 font-mono">/phase</span> — 목표를 phase 문서로 만들고 체크리스트대로 진행</div>
            <div><span className="text-pink-300 font-mono">/review</span> — 현재 변경사항 코드 리뷰</div>
            <div><span className="text-pink-300 font-mono">/deploy</span> — lint·build 검증 후 커밋·푸쉬</div>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/20">
          <div className="text-xs font-semibold text-fuchsia-300 mb-1.5 flex items-center gap-1.5">
            <Layers size={11} />
            포함된 스킬 (.agents/skills/)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] text-slate-400">
            <div>• andrej-karpathy-skills</div>
            <div>• find-skills</div>
            <div>• frontend-design</div>
            <div>• karpathy-guidelines</div>
            <div>• vercel-react-best-practices</div>
            <div>• web-design-guidelines</div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-900/40 border border-slate-700/40">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Terminal size={11} className="text-cyan-400" />
            사용 순서 (5분)
          </div>
          <div className="space-y-1 text-xs text-slate-400 font-mono leading-relaxed">
            <div><span className="text-slate-600">1.</span> unzip claude-starter-kit.zip</div>
            <div><span className="text-slate-600">2.</span> cp -r claude-starter-kit/. /your-project/</div>
            <div><span className="text-slate-600">3.</span> package.json에 "verify": "sh scripts/verify.sh" 추가</div>
            <div><span className="text-slate-600">4.</span> CLAUDE.md 본인 프로젝트에 맞게 수정</div>
            <div><span className="text-slate-600">5.</span> claude (실행) → "phases/phase-01-setup.md 확인하고 시작해줘"</div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-700/40 text-[10px] text-emerald-300/80 flex items-center gap-1.5">
            <ShieldCheck size={10} />
            verify가 활성화되면 Stop hook이 매 작업 종료마다 lint+build+test 자동 검증
          </div>
        </div>
      </div>

      {/* 핵심 5가지 파일 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <FileText size={16} className="text-blue-400" />
          핵심 5가지 파일 — “이것만 있으면 시작 가능”
        </h2>
        <p className="text-xs text-slate-500 mb-4">탭을 눌러 각 파일의 역할과 작성 예시를 확인하세요.</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {docFiles.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDoc(d.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                activeDoc === d.id
                  ? `${d.bg} ${d.border} ${d.color}`
                  : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
              }`}
            >
              <FileText size={12} />
              {d.path}
            </button>
          ))}
        </div>

        <div className={`rounded-xl border p-5 ${doc.border} ${doc.bg}`}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-sm font-mono font-bold ${doc.color}`}>{doc.path}</span>
            <Badge variant={doc.badge}>{doc.question}</Badge>
            <span className="text-xs text-slate-500">— {doc.oneLiner}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">{doc.description}</p>
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/80 p-3 font-mono text-xs text-slate-300 whitespace-pre leading-relaxed overflow-x-auto">
            {doc.example}
          </div>
        </div>
      </div>

      {/* 시작 순서 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Workflow size={16} className="text-amber-400" />
          프로젝트 시작 순서 — Phase 0 → 5
        </h2>
        <p className="text-xs text-slate-500 mb-4">위에서 아래로 순서대로. 클릭하면 세부 설명이 펼쳐집니다.</p>
        <div className="space-y-2">
          {startupSteps.map((s, idx) => {
            const isExpanded = expandedStep === idx
            return (
              <div key={s.step}>
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : idx)}
                  className={`w-full rounded-lg border p-4 text-left transition-all hover:bg-slate-700/20 ${
                    isExpanded ? `${s.border} bg-slate-700/20` : "border-slate-700/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-xs font-bold ${s.border} ${s.bg} ${s.color}`}>
                      {s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{s.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono">{s.file}</div>
                    </div>
                    <ChevronRight size={14} className={`text-slate-500 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                  {isExpanded && (
                    <div className={`mt-3 ml-10 p-3 rounded-lg border text-xs leading-relaxed ${s.border} ${s.bg} text-slate-300`}>
                      {s.detail}
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* 폴더 구조 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <FolderTree size={16} className="text-cyan-400" />
          권장 폴더 구조
        </h2>
        <p className="text-xs text-slate-500 mb-4">자동 로드되는 영역과 명시적으로 참조하는 영역을 구분합니다.</p>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/80 p-4 font-mono text-xs text-slate-300 whitespace-pre leading-relaxed overflow-x-auto">
              {folderTree}
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Layers size={12} className="text-green-400" />
                <span className="text-xs font-bold text-green-400">자동 로드</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1 leading-relaxed">
                <li>• 루트 CLAUDE.md</li>
                <li>• 작업 중인 디렉터리의 CLAUDE.md</li>
                <li>• .claude/agents/*</li>
                <li>• .claude/commands/*</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={12} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400">명시 참조</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1 leading-relaxed">
                <li>• docs/PRD.md</li>
                <li>• docs/ARCHITECTURE.md</li>
                <li>• docs/ADR.md</li>
                <li>• docs/UI_GUIDE.md</li>
                <li>• phases/*.md</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-600/40 bg-slate-700/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={12} className="text-slate-300" />
                <span className="text-xs font-bold text-slate-300">gitignore</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1 leading-relaxed">
                <li>• .claude.local.md</li>
                <li>• .claude/settings.local.json</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 프롬프트 템플릿 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <MessageSquare size={16} className="text-pink-400" />
          상황별 프롬프트 템플릿
        </h2>
        <p className="text-xs text-slate-500 mb-4">탭을 누르고 복사해서 그대로 활용하세요.</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {promptTemplates.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePrompt(p.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                activePrompt === p.id
                  ? "bg-pink-500/10 border-pink-500/30 text-pink-400"
                  : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
              }`}
            >
              <Terminal size={12} />
              {p.title}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{prompt.title}</span>
              <Badge variant={prompt.badge}>{prompt.when}</Badge>
            </div>
            <button
              onClick={() => copy(prompt.template, `prompt-${prompt.id}`)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-600/40 bg-slate-700/30 hover:bg-slate-700/50 text-xs text-slate-300 transition-colors"
            >
              {copiedId === `prompt-${prompt.id}` ? (
                <>
                  <Check size={12} className="text-green-400" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy size={12} />
                  복사
                </>
              )}
            </button>
          </div>
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/80 p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {prompt.template}
          </div>
        </div>
      </div>

      {/* 슬래시 명령 사용 예시 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Terminal size={16} className="text-pink-400" />
          슬래시 명령 — 사용 예시
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          키트의 <span className="font-mono text-slate-400">.claude/commands/</span>에 들어 있는 5개 명령. 예시는 복사해서 바로 쓸 수 있습니다.
        </p>

        <div className="rounded-xl border border-slate-700/40 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)_minmax(0,1.5fr)] gap-2 px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/40 text-[11px] font-bold text-slate-400">
            <div>명령</div>
            <div>하는 일</div>
            <div>예시</div>
          </div>
          {slashCommands.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)_minmax(0,1.5fr)] gap-1.5 sm:gap-2 px-4 py-3 border-b border-slate-700/30 last:border-b-0 bg-slate-900/30 sm:items-center"
            >
              <code className="text-xs text-pink-300 font-mono">{row.cmd}</code>
              <div className="text-xs text-slate-400">{row.does}</div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <code className="text-xs text-slate-300 font-mono break-all">{row.example}</code>
                <button
                  onClick={() => copy(row.example, `slash-${idx}`)}
                  className="shrink-0 text-slate-500 hover:text-slate-200 transition-colors"
                  aria-label="복사"
                >
                  {copiedId === `slash-${idx}` ? (
                    <Check size={13} className="text-green-400" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
          <span className="text-slate-400 font-mono">/new-project · /apply-kit · /phase</span>는 뒤에 인자(만들 것·스택·목표)를 받고,{" "}
          <span className="text-slate-400 font-mono">/review · /deploy</span>는 인자 없이 바로 실행됩니다.
        </p>
      </div>

      {/* 원칙 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-400" />
          작동 원리 · 6가지 원칙
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {principles.map((p, idx) => (
            <div key={idx} className="card">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-5 h-5 rounded border border-amber-500/40 bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-amber-400">
                  {idx + 1}
                </div>
                <h3 className="text-sm font-semibold text-slate-200 leading-snug">{p.rule}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed ml-7">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 시작 전 체크리스트 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-400" />
          프로젝트 시작 전 체크리스트
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            "CLAUDE.md에 기술 스택 명시했는가",
            "CRITICAL 규칙 3개 이내로 정리했는가",
            "docs/PRD.md에 핵심 기능 5개 이하로 정의했는가",
            "docs/ARCHITECTURE.md에 폴더 구조 그렸는가",
            "docs/UI_GUIDE.md에 색상 토큰 정의했는가",
            ".gitignore에 .claude.local.md 추가했는가",
            "첫 phase 파일 만들었는가 (phases/phase-01-*.md)",
            "자주 쓸 슬래시 명령 1~2개 정해두었는가",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded border border-green-500/40 bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-sm bg-green-500/60" />
              </div>
              <span className="text-xs text-slate-400 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 핵심 원칙 요약 */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-purple-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-purple-300 mb-2">핵심 원칙</div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div>• <span className="text-white">CLAUDE.md는 짧게</span>, 디테일은 docs/로 분리해 명시 참조한다 (토큰 절약)</div>
              <div>• <span className="text-white">한 지시 = 한 작업</span>. 페이지 → 섹션 → 컴포넌트 순으로 쪼개라</div>
              <div>• <span className="text-white">완료 기준을 함께 적어라</span> — “build 통과”, “모바일 깨짐 없음” 같은 검증 가능한 문장으로</div>
              <div>• <span className="text-white">반복되는 작업은 슬래시 명령</span>으로, 자동 실행은 hooks로 옮긴다</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
