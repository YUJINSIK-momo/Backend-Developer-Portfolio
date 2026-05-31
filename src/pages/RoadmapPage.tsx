import { useState } from "react"
import {
  Map, Target, Scale, Lightbulb, ListChecks, Rocket, Wrench, DollarSign,
  Users2, Zap, ArrowRight, Check, X, CircleDot, ChevronRight,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

export function RoadmapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Map size={20} className="text-orange-400" />
          <h1 className="text-2xl font-bold text-white">Dev Roadmap</h1>
          <Badge variant="amber">Methodology</Badge>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
          더 많은 기술을 아는 것보다, 하나의 작은 시스템을 끝까지 만들어보는 것.
          MVP 분리·기술 선택 기준·"왜 이 기술인가"·작은 기능 반복 로드맵으로
          개발자로서의 사고방식을 정리합니다.
        </p>
      </div>

      <MvpSplitSection />
      <TechCriteriaSection />
      <WhyTechSection />
      <PracticeRoadmapSection />
    </div>
  )
}

/* ───────────── 1) MVP 3단계 분리 ───────────── */

function MvpSplitSection() {
  return (
    <section className="space-y-5">
      <div className="text-center space-y-2">
        <Badge variant="blue">01 · Scope</Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          프로젝트를 무조건 <span className="gradient-text">3단계로 쪼개기</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          큰 그림은 쉽지만, 한 번에 넣으면 일정도 흐트러지고 "지금 뭘 해야 하지?" 가 됩니다.
          1차 / 2차 / 고도화로 분리하면 한 사이클이 항상 완성된 채로 끝납니다.
        </p>
      </div>

      {/* 챗봇 예시 */}
      <div className="card">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          🤖 예시 — 일본어 CS 자동화 챗봇
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MvpPhase
            phase="1차"
            title="최소 동작 (Walking Skeleton)"
            color="green"
            timeline="1~2주"
            goal="혼자 끝까지 만들 수 있는 가장 작은 버전. 데모 가능."
            items={[
              "LINE 메시지 수신 (Webhook)",
              "GPT API에 그대로 전달",
              "응답을 LINE으로 반환",
              "console.log + 파일 로그",
            ]}
            skip={["관리자 화면", "DB", "Slack 알림", "권한 관리"]}
          />
          <MvpPhase
            phase="2차"
            title="운영 가능 (Operational)"
            color="amber"
            timeline="2~3주"
            goal="담당자가 실제로 매일 쓸 수 있는 수준. 장애 대응 가능."
            items={[
              "PostgreSQL에 대화 로그 저장",
              "Slack으로 신규 문의 알림",
              "담당자 승인/거절 버튼",
              "기본 에러 알림 + 재시도",
            ]}
            skip={["WooCommerce 연동", "RAG", "대시보드"]}
          />
          <MvpPhase
            phase="3차"
            title="고도화 (Scale)"
            color="purple"
            timeline="필요해진 시점에"
            goal="고객·내부 모두 만족도 ↑. 비즈니스 지표 개선."
            items={[
              "WooCommerce 주문 조회 연동",
              "RAG로 사내 매뉴얼 응답",
              "이미지 자동 전송",
              "관리자 대시보드 + 통계",
            ]}
            skip={[]}
          />
        </div>
        <div className="mt-5 pt-5 border-t border-slate-700/50 text-center text-xs text-slate-400 leading-relaxed">
          🔑 <span className="text-white">핵심 규칙</span> — 1차가 끝나야 2차를 시작한다.
          1차에 2차 기능이 새어 들어가는 순간 일정도 무너지고 동기부여도 떨어집니다.
        </div>
      </div>
    </section>
  )
}

function MvpPhase({ phase, title, color, timeline, goal, items, skip }: {
  phase: string
  title: string
  color: "green" | "amber" | "purple"
  timeline: string
  goal: string
  items: string[]
  skip: string[]
}) {
  const colorMap = {
    green: { border: "border-green-500/30", text: "text-green-400", bg: "bg-green-500/10" },
    amber: { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10" },
    purple: { border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10" },
  }
  const c = colorMap[color]
  return (
    <div className={`rounded-xl border-2 ${c.border} bg-navy-900/40 p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-2xl font-bold ${c.text}`}>{phase}</span>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
          ⏱ {timeline}
        </span>
      </div>
      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">{goal}</p>

      <div className="space-y-1.5 mb-4">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2 text-xs text-slate-200">
            <Check size={12} className={`${c.text} mt-0.5 flex-shrink-0`} />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {skip.length > 0 && (
        <div className="pt-3 border-t border-slate-700/50">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            이 단계에서는 안 함
          </div>
          <div className="space-y-1">
            {skip.map((s) => (
              <div key={s} className="flex items-start gap-2 text-[11px] text-slate-500">
                <X size={10} className="text-slate-600 mt-1 flex-shrink-0" />
                <span className="line-through">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ───────────── 2) 기술 선택 4가지 기준 ───────────── */

function TechCriteriaSection() {
  return (
    <section className="space-y-5 pt-6 border-t border-slate-800">
      <div className="text-center space-y-2">
        <Badge variant="green">02 · Decision</Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          기술 선택 — <span className="gradient-text">4가지 기준</span>으로만 판단
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          "요즘 좋아 보이는 기술"에 흔들리지 않으려면 같은 자를 들고 비교해야 합니다.
          이 4가지를 매번 점수표로 채워보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <CriterionCard
          n="01"
          icon={Users2}
          title="팀 운영 가능성"
          color="blue"
          q="지금 팀이 이걸 운영할 수 있는가?"
          desc="문서·튜토리얼·한국어 자료가 충분한가? 새 멤버가 1주일 안에 따라올 수 있는가?"
        />
        <CriterionCard
          n="02"
          icon={Wrench}
          title="유지보수 가능성"
          color="purple"
          q="개발자가 6개월 후 다시 봐도 이해되는가?"
          desc="러닝커브가 너무 가팔거나, 메이저 버전이 자주 깨지는 라이브러리는 피하기."
        />
        <CriterionCard
          n="03"
          icon={DollarSign}
          title="비용 감당 가능성"
          color="green"
          q="고정비 + 트래픽 비용이 감당 가능한가?"
          desc="무료 티어로 시작 가능한가? 사용량 10배가 되면 청구서가 얼마인가?"
        />
        <CriterionCard
          n="04"
          icon={Target}
          title="고객 문제 해결 속도"
          color="amber"
          q="이걸로 가장 빨리 고객 문제를 풀 수 있는가?"
          desc="'멋진 기술'이 아니라 '지금 가장 빠른 길'을 고른다. MVP 단계에서 가장 중요."
        />
      </div>

      {/* 점수표 예시 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Scale size={16} className="text-cyan-400" />
          <h3 className="text-white font-semibold text-sm">
            적용 예시 — "DB는 PostgreSQL이냐 Firebase냐"
          </h3>
        </div>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
                <th className="text-left py-2 pr-3 font-medium">기준</th>
                <th className="text-center py-2 px-3 font-medium">PostgreSQL</th>
                <th className="text-center py-2 px-3 font-medium">Firebase</th>
                <th className="text-left py-2 pl-3 font-medium hidden sm:table-cell">메모</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <ScoreRow label="팀 운영" a={4} b={5} memo="Firebase 콘솔이 더 직관적, PostgreSQL은 DBA 지식 필요" />
              <ScoreRow label="유지보수" a={5} b={3} memo="SQL은 30년 검증됨, Firebase는 lock-in 위험" />
              <ScoreRow label="비용" a={4} b={2} memo="트래픽 증가 시 Firebase 비용 급증" />
              <ScoreRow label="문제 해결" a={4} b={5} memo="MVP 1주 안에 띄울 거면 Firebase가 빠름" />
              <tr className="font-bold border-t-2 border-slate-700/50">
                <td className="py-2 pr-3 text-white">합계 / 20</td>
                <td className="py-2 px-3 text-center text-green-400 font-mono">17</td>
                <td className="py-2 px-3 text-center text-amber-400 font-mono">15</td>
                <td className="py-2 pl-3 text-slate-300 hidden sm:table-cell">→ 운영 단계 진입 시 PostgreSQL 선택</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-[11px] text-slate-500 italic">
          💡 점수 자체보다 "왜 그 점수를 줬는지" 메모가 중요합니다. 6개월 후의 나에게 보내는 편지.
        </div>
      </div>
    </section>
  )
}

function CriterionCard({ n, icon: Icon, title, color, q, desc }: {
  n: string
  icon: React.ElementType
  title: string
  color: "blue" | "purple" | "green" | "amber"
  q: string
  desc: string
}) {
  const colorMap = {
    blue: { border: "border-blue-500/20", bg: "bg-blue-500/15 text-blue-400" },
    purple: { border: "border-purple-500/20", bg: "bg-purple-500/15 text-purple-400" },
    green: { border: "border-green-500/20", bg: "bg-green-500/15 text-green-400" },
    amber: { border: "border-amber-500/20", bg: "bg-amber-500/15 text-amber-400" },
  }
  const c = colorMap[color]
  return (
    <div className={`rounded-xl border bg-navy-900/40 p-4 ${c.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg}`}>
          <Icon size={18} />
        </div>
        <span className="text-xs font-mono text-slate-500">{n}</span>
      </div>
      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
      <p className="text-xs text-slate-300 font-medium mb-2 leading-relaxed">"{q}"</p>
      <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}

function ScoreRow({ label, a, b, memo }: { label: string; a: number; b: number; memo: string }) {
  return (
    <tr className="border-b border-slate-800/50">
      <td className="py-2 pr-3 text-slate-300">{label}</td>
      <td className="py-2 px-3 text-center font-mono text-white">{a} / 5</td>
      <td className="py-2 px-3 text-center font-mono text-white">{b} / 5</td>
      <td className="py-2 pl-3 text-slate-500 text-[11px] hidden sm:table-cell">{memo}</td>
    </tr>
  )
}

/* ───────────── 3) 왜 이 기술을 쓰는지 ───────────── */

const techDecisions = [
  {
    tech: "PostgreSQL",
    badge: "DB",
    color: "cyan" as const,
    why: "주문 · 고객 · 팀명 · 상태 이력처럼 관계형 데이터가 많고, 추후 통계/리포팅 쿼리가 필요해서.",
    alt: "MongoDB",
    altReason: "스키마가 자주 바뀌고 조인이 거의 없다면 MongoDB. 우리는 반대 케이스.",
  },
  {
    tech: "Redis",
    badge: "Cache",
    color: "red" as const,
    why: "JWT 블랙리스트 · 소켓 룸 상태 · 인기 상품 캐시처럼 사라져도 되는 빠른 키-값 저장이 필요해서.",
    alt: "Memcached",
    altReason: "단순 캐시만 필요하면 Memcached도 충분. 우리는 pub/sub과 자료구조도 써서 Redis.",
  },
  {
    tech: "Slack",
    badge: "Ops",
    color: "purple" as const,
    why: "내부 CS 담당자가 이미 매일 쓰고 있고, 승인/거절 버튼이 메시지 안에서 동작해서.",
    alt: "Discord / Teams",
    altReason: "Discord는 사외 협업에 더 가깝고, Teams는 회사 라이선스 없음. Slack이 가장 빠른 길.",
  },
  {
    tech: "GPT (OpenAI API)",
    badge: "AI",
    color: "green" as const,
    why: "정형 FAQ가 아니라 자연어 문의 분류 + 일본어 응답 생성이 필요해서. 자체 모델은 데이터가 부족.",
    alt: "Claude / Gemini",
    altReason: "장문 요약은 Claude가 강함. 일본어 CS는 GPT-4o가 현재 가장 안정적이라 선택.",
  },
  {
    tech: "Node.js + Express",
    badge: "Runtime",
    color: "blue" as const,
    why: "Webhook · 짧은 API · 비동기 I/O 비중이 높고, 프론트와 같은 JS/TS 생태계를 쓸 수 있어서.",
    alt: "Python (FastAPI)",
    altReason: "ML 파이프라인이 많으면 Python. 우리는 외부 API 호출 + DB CRUD가 90%라 Node.",
  },
  {
    tech: "Cloudflare",
    badge: "Edge",
    color: "amber" as const,
    why: "DNS · CDN · SSL · DDoS 방어를 무료로 한 번에. 작은 팀에서 직접 운영할 필요가 없어서.",
    alt: "AWS CloudFront",
    altReason: "AWS 통합이 강하면 CloudFront. 초기엔 Cloudflare가 압도적으로 빠르고 저렴.",
  },
]

function WhyTechSection() {
  return (
    <section className="space-y-5 pt-6 border-t border-slate-800">
      <div className="text-center space-y-2">
        <Badge variant="purple">03 · Rationale</Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          "왜 이 기술을 쓰는지" <span className="gradient-text">기록 남기기</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          이유를 남기면 PM·기획자·외주에게 설득할 때 강해지고, 6개월 뒤 내가 바뀌고 싶을 때도
          판단 근거가 남습니다. ADR (Architecture Decision Record) 의 가벼운 버전.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {techDecisions.map((d) => (
          <DecisionCard key={d.tech} {...d} />
        ))}
      </div>
    </section>
  )
}

function DecisionCard({ tech, badge, color, why, alt, altReason }: typeof techDecisions[number]) {
  const colorMap: Record<string, { border: string; text: string; bg: string }> = {
    cyan: { border: "border-cyan-500/20", text: "text-cyan-400", bg: "bg-cyan-500/10" },
    red: { border: "border-red-500/20", text: "text-red-400", bg: "bg-red-500/10" },
    purple: { border: "border-purple-500/20", text: "text-purple-400", bg: "bg-purple-500/10" },
    green: { border: "border-green-500/20", text: "text-green-400", bg: "bg-green-500/10" },
    blue: { border: "border-blue-500/20", text: "text-blue-400", bg: "bg-blue-500/10" },
    amber: { border: "border-amber-500/20", text: "text-amber-400", bg: "bg-amber-500/10" },
  }
  const c = colorMap[color]
  return (
    <div className={`rounded-xl border bg-navy-900/40 p-4 ${c.border}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-base ${c.text}`}>{tech}</h3>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
          {badge}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">왜 채택?</div>
          <p className="text-xs text-slate-200 leading-relaxed">{why}</p>
        </div>
        <div className="pt-2 border-t border-slate-700/50">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            대안 ↔ <span className="text-slate-400">{alt}</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">{altReason}</p>
        </div>
      </div>
    </div>
  )
}

/* ───────────── 4) 작은 기능 반복 실습 로드맵 ───────────── */

const practiceSteps = [
  {
    n: 1,
    title: "Express 서버 만들기",
    learn: "Node.js 실행, 포트 바인딩, 라우트 등록",
    cmd: "node app.js → http://localhost:3000",
    deps: ["express"],
  },
  {
    n: 2,
    title: "POST /webhook 받기",
    learn: "HTTP body 파싱, Webhook의 단방향성",
    cmd: "curl -X POST -d '{}' http://localhost:3000/webhook",
    deps: ["express.json()"],
  },
  {
    n: 3,
    title: "받은 메시지 console.log",
    learn: "로그의 중요성, 디버깅 사이클",
    cmd: "console.log(req.body)",
    deps: ["winston (선택)"],
  },
  {
    n: 4,
    title: "PostgreSQL에 저장",
    learn: "DB 연결, 스키마 설계, ORM 사용법",
    cmd: "INSERT INTO messages (...) VALUES (...)",
    deps: ["prisma", "pg"],
  },
  {
    n: 5,
    title: "Slack으로 알림 보내기",
    learn: "외부 API 호출, fetch/axios, 비동기 에러 처리",
    cmd: "POST https://hooks.slack.com/services/...",
    deps: ["@slack/webhook"],
  },
  {
    n: 6,
    title: "버튼 클릭 → 상태 변경",
    learn: "Slack Interactive · 상태 머신 · UPDATE 쿼리",
    cmd: "UPDATE messages SET status='approved' WHERE id=?",
    deps: ["@slack/bolt"],
  },
  {
    n: 7,
    title: "LINE으로 답장 보내기",
    learn: "LINE Messaging API, 채널 토큰, 메시지 포맷",
    cmd: "POST https://api.line.me/v2/bot/message/reply",
    deps: ["@line/bot-sdk"],
  },
  {
    n: 8,
    title: "WooCommerce 주문 조회",
    learn: "REST API 인증 (key/secret), 외부 시스템 통합",
    cmd: "GET /wp-json/wc/v3/orders/123",
    deps: ["axios"],
  },
]

function PracticeRoadmapSection() {
  const [open, setOpen] = useState<number | null>(1)
  return (
    <section className="space-y-5 pt-6 border-t border-slate-800">
      <div className="text-center space-y-2">
        <Badge variant="cyan">04 · Practice</Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          작은 기능 반복 — <span className="gradient-text">8단계 로드맵</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          하나의 작은 시스템을 처음부터 끝까지 만들어보면, 그동안 궁금했던 백엔드 개념 대부분이
          실제로 연결됩니다. 한 단계가 동작해야 다음으로 넘어가세요.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks size={16} className="text-cyan-400" />
          <h3 className="text-white font-semibold text-sm">
            목표 시스템: LINE 메시지 → Node.js → GPT → Slack → DB
          </h3>
          <Rocket size={14} className="text-orange-400 ml-auto" />
        </div>

        <div className="space-y-1.5">
          {practiceSteps.map((step) => {
            const isOpen = open === step.n
            return (
              <div key={step.n}>
                <button
                  onClick={() => setOpen(isOpen ? null : step.n)}
                  className={`w-full text-left rounded-lg border transition-all px-3 py-2.5 flex items-center gap-3 ${
                    isOpen
                      ? "border-cyan-500/40 bg-cyan-500/5"
                      : "border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-700/20"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold ${
                    isOpen ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-700/50 text-slate-400"
                  }`}>
                    {step.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium">{step.title}</div>
                    <div className="text-[11px] text-slate-500 truncate">{step.learn}</div>
                  </div>
                  <ChevronRight size={14} className={`text-slate-500 flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="ml-10 mr-2 mt-1 mb-2 p-3 rounded-lg bg-navy-900/50 border border-slate-700/50 space-y-2">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        실행 / 명령
                      </div>
                      <code className="text-[11px] text-cyan-300 font-mono break-all">{step.cmd}</code>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        의존성 / 패키지
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {step.deps.map((d) => (
                          <span key={d} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 마무리 카드 */}
      <div className="card border-orange-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb size={20} className="text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">한 마디로</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              더 많은 기술을 아는 것보다, <span className="text-orange-400 font-semibold">하나의 작은 시스템을 끝까지</span> 만들어보는 것.
              위 8단계를 혼자 처음부터 끝까지 만들 수 있으면, 백엔드 기초 고민 대부분이 한 단계 정리됩니다.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <CircleDot size={10} className="text-orange-400" />
              <span>1차 MVP는 1~2주, 8단계 전체는 4~6주 목표</span>
              <span className="text-slate-700">·</span>
              <ArrowRight size={10} />
              <span>완성 후 README + "왜 이 기술을 썼는지" 문서화</span>
              <Zap size={10} className="text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
