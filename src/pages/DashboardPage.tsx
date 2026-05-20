import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Server, Zap, GitBranch, Database, Shield, Radio,
  Layers, ArrowRight, Activity, Cpu, HardDrive, Network,
  Monitor, Send, Reply, Cloud, Lock, Code2, Box,
  Utensils, ChefHat, Archive, User,
} from "lucide-react"
import { StatusIndicator } from "../components/ui/StatusIndicator"
import { Badge } from "../components/ui/Badge"

const featureCards = [
  {
    icon: Radio,
    title: "Socket Communication",
    description: "WebSocket 기반 실시간 양방향 통신 흐름 시각화. client:connect → broadcast → notification",
    to: "/socket",
    color: "cyan",
    tag: "Realtime",
  },
  {
    icon: Layers,
    title: "Architecture Patterns",
    description: "Monolith → Microservices → Event-driven 아키텍처 패턴별 구조, 장단점, 사용 사례",
    to: "/architecture",
    color: "purple",
    tag: "Design",
  },
  {
    icon: GitBranch,
    title: "API Flow",
    description: "Frontend → Auth → Controller → Service → Repository → DB 전체 요청/응답 흐름",
    to: "/api-flow",
    color: "green",
    tag: "REST",
  },
  {
    icon: Cpu,
    title: "LLM Flow",
    description: "사용자 입력부터 토크나이제이션, 모델 추론, 스트리밍 응답까지 LLM 처리 파이프라인",
    to: "/llm-flow",
    color: "amber",
    tag: "AI",
  },
  {
    icon: Zap,
    title: "Tech Stack",
    description: "Node.js, NestJS, PostgreSQL, Redis, Docker, AWS 등 주요 백엔드 기술 스택 정리",
    to: "/tech-stack",
    color: "blue",
    tag: "Overview",
  },
  {
    icon: Shield,
    title: "PM 용어사전",
    description: "서버, API, 인증, LLM 등 개발 용어를 PM/기획자도 이해할 수 있는 비유로 설명",
    to: "/glossary",
    color: "pink",
    tag: "Glossary",
  },
]

const colorMap: Record<string, string> = {
  cyan: "border-cyan-500/20 hover:border-cyan-500/40 group-hover:text-cyan-400",
  purple: "border-purple-500/20 hover:border-purple-500/40 group-hover:text-purple-400",
  green: "border-green-500/20 hover:border-green-500/40 group-hover:text-green-400",
  amber: "border-amber-500/20 hover:border-amber-500/40 group-hover:text-amber-400",
  blue: "border-blue-500/20 hover:border-blue-500/40 group-hover:text-blue-400",
  pink: "border-pink-500/20 hover:border-pink-500/40 group-hover:text-pink-400",
}

const iconBgMap: Record<string, string> = {
  cyan: "bg-cyan-500/10 text-cyan-400",
  purple: "bg-purple-500/10 text-purple-400",
  green: "bg-green-500/10 text-green-400",
  amber: "bg-amber-500/10 text-amber-400",
  blue: "bg-blue-500/10 text-blue-400",
  pink: "bg-pink-500/10 text-pink-400",
}

const badgeVariantMap: Record<string, "cyan" | "purple" | "green" | "amber" | "blue" | "pink"> = {
  cyan: "cyan",
  purple: "purple",
  green: "green",
  amber: "amber",
  blue: "blue",
  pink: "pink",
}

function MetricCard({ label, value, unit, icon: Icon, color }: {
  label: string
  value: number
  unit: string
  icon: React.ElementType
  color: string
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const step = Math.ceil(value / 40)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, value)
      setDisplay(current)
      if (current >= value) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xl font-bold text-white font-mono">
          {display.toLocaleString()}
          <span className="text-sm text-slate-400 ml-1">{unit}</span>
        </div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [apiCount, setApiCount] = useState(2847)

  useEffect(() => {
    const interval = setInterval(() => {
      setApiCount((v) => v + Math.floor(Math.random() * 3))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <StatusIndicator status="online" label="All systems operational" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Backend Architecture
          <span className="block gradient-text">Portfolio</span>
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          실시간 소켓 통신부터 마이크로서비스 아키텍처, LLM 추론 파이프라인까지 —
          백엔드 시스템이 어떻게 동작하는지 시각적으로 이해할 수 있는 포트폴리오입니다.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Node.js", "NestJS", "PostgreSQL", "Redis", "WebSocket", "Docker", "AWS"].map((tech) => (
            <Badge key={tech} variant="blue">{tech}</Badge>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Live Metrics (Simulated)
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="API Requests Today"
            value={apiCount}
            unit="req"
            icon={Activity}
            color="bg-blue-500/10 text-blue-400"
          />
          <MetricCard
            label="Active WebSocket Connections"
            value={142}
            unit="conn"
            icon={Network}
            color="bg-cyan-500/10 text-cyan-400"
          />
          <MetricCard
            label="DB Query Avg Latency"
            value={12}
            unit="ms"
            icon={HardDrive}
            color="bg-green-500/10 text-green-400"
          />
          <MetricCard
            label="Cache Hit Rate"
            value={94}
            unit="%"
            icon={Database}
            color="bg-purple-500/10 text-purple-400"
          />
        </div>
      </section>

      {/* Architecture Quick View */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          System Architecture Overview
        </h2>
        <div className="card">
          <div className="flex flex-wrap items-center justify-center gap-3 py-4">
            {[
              { label: "Client", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
              { label: "API Gateway", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
              { label: "Auth Service", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
              { label: "Business Service", color: "text-green-400 border-green-500/30 bg-green-500/10" },
              { label: "Message Queue", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
              { label: "PostgreSQL", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
              { label: "Redis Cache", color: "text-red-400 border-red-500/30 bg-red-500/10" },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium font-mono ${node.color}`}>
                  {node.label}
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight size={14} className="text-slate-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-700/50 pt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> HTTP / REST
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> WebSocket
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400" /> Async Queue
            </span>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Explore
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.to}
                to={card.to}
                className={`card-hover group border ${colorMap[card.color]} transition-all duration-200`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgMap[card.color]}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-white text-sm">{card.title}</h3>
                      <Badge variant={badgeVariantMap[card.color]}>{card.tag}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                  <span>자세히 보기</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Tech highlight */}
      <section className="card border-blue-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Server size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">About This Portfolio</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              이 사이트는 GitHub Pages에 배포된 정적 사이트입니다. 실제 백엔드 서버 없이도
              백엔드 시스템의 동작 방식을 시각화합니다. 소켓 통신, API 요청 흐름, 아키텍처 패턴,
              LLM 추론 파이프라인을 애니메이션과 인터랙션으로 표현합니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="blue">React 19</Badge>
              <Badge variant="blue">TypeScript</Badge>
              <Badge variant="blue">Vite</Badge>
              <Badge variant="blue">Tailwind CSS</Badge>
              <Badge variant="green">GitHub Pages</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 백엔드 기초 — 한눈에 이해하기 */}
      <BackendBasicsSection />
    </div>
  )
}

function BackendBasicsSection() {
  return (
    <section className="space-y-8 pt-4">
      <div className="text-center space-y-2">
        <Badge variant="blue">Backend 101</Badge>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          백엔드란 <span className="gradient-text">무엇인가요?</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          개발을 처음 접한 사람도 이 한 장이면 백엔드가 무엇인지 이해할 수 있습니다.
          식당 비유부터 실제 요청/응답 흐름, 백엔드가 하는 일까지 차근차근 살펴봅니다.
        </p>
      </div>

      {/* 식당 비유 */}
      <div className="card border-blue-500/20">
        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4 text-center">
          🍱 한 줄 비유 — 백엔드는 "식당의 주방"입니다
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <AnalogyCard
            icon={User}
            title="손님"
            subtitle="= 사용자 / 브라우저"
            color="blue"
            desc="앱에서 버튼을 누르고 데이터를 요청"
          />
          <AnalogyCard
            icon={Utensils}
            title="홀"
            subtitle="= 프론트엔드 (화면)"
            color="cyan"
            desc="손님이 보는 메뉴판과 직원이 일하는 공간"
          />
          <AnalogyCard
            icon={ChefHat}
            title="주방"
            subtitle="= 백엔드 (서버)"
            color="purple"
            desc="주문을 받아 실제 요리를 만드는 곳"
          />
        </div>
        <div className="mt-5 pt-5 border-t border-slate-700/50 text-center text-xs text-slate-400 leading-relaxed">
          손님(사용자)이 메뉴판(화면)에서 주문하면, 홀 직원(프론트엔드)이 주방(백엔드)에 전달하고,
          주방은 창고(<span className="text-cyan-400 font-mono">DB</span>)에서 재료를 꺼내 요리를 완성해 돌려줍니다.
        </div>
      </div>

      {/* 요청 → 응답 사이클 */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          🔄 요청 한 번이 처리되는 6단계
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <FlowStep
            n={1}
            icon={Monitor}
            title="사용자 행동"
            desc='"로그인" 버튼 클릭'
            color="blue"
          />
          <FlowStep
            n={2}
            icon={Send}
            title="HTTP 요청"
            desc="프론트가 서버로 데이터 전송"
            color="cyan"
          />
          <FlowStep
            n={3}
            icon={Lock}
            title="인증 확인"
            desc="이 사람이 맞나? 권한 검사"
            color="amber"
          />
          <FlowStep
            n={4}
            icon={Server}
            title="로직 처리"
            desc="비즈니스 규칙대로 계산"
            color="purple"
          />
          <FlowStep
            n={5}
            icon={Database}
            title="DB 조회/저장"
            desc="데이터베이스와 통신"
            color="green"
          />
          <FlowStep
            n={6}
            icon={Reply}
            title="응답 반환"
            desc="결과를 JSON으로 돌려줌"
            color="pink"
          />
        </div>
        <div className="mt-4 text-center text-xs text-slate-500">
          이 한 사이클이 보통 <span className="text-white font-mono">50~300ms</span> 안에 끝나야 사용자가 "빠르다"고 느낍니다.
        </div>
      </div>

      {/* 백엔드가 하는 4가지 일 */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          💼 백엔드가 책임지는 4가지 핵심 역할
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RoleCard
            icon={Database}
            title="데이터 관리"
            color="green"
            points={["회원 정보 저장", "주문 내역 보관", "검색 / 통계"]}
            example="회원가입 정보를 DB에 영구 저장"
          />
          <RoleCard
            icon={Code2}
            title="비즈니스 로직"
            color="purple"
            points={["가격 계산", "재고 차감", "할인 규칙 적용"]}
            example="장바구니 합계 + 쿠폰 할인 계산"
          />
          <RoleCard
            icon={Shield}
            title="인증 / 보안"
            color="amber"
            points={["로그인 검증", "권한 확인", "데이터 암호화"]}
            example="JWT 토큰으로 본인 확인"
          />
          <RoleCard
            icon={Network}
            title="외부 통신"
            color="cyan"
            points={["결제 API 호출", "이메일 발송", "푸시 알림"]}
            example="토스/카카오페이로 결제 요청"
          />
        </div>
      </div>

      {/* 구성 요소 한눈에 */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5 text-center">
          🏗️ 백엔드를 구성하는 주요 부품
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <PartChip icon={Server} label="서버" sub="요청 처리" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
          <PartChip icon={Database} label="DB" sub="영구 저장" color="text-green-400 border-green-500/30 bg-green-500/10" />
          <PartChip icon={Zap} label="캐시" sub="빠른 조회" color="text-amber-400 border-amber-500/30 bg-amber-500/10" />
          <PartChip icon={Lock} label="인증" sub="신원 확인" color="text-pink-400 border-pink-500/30 bg-pink-500/10" />
          <PartChip icon={Cloud} label="클라우드" sub="실행 환경" color="text-cyan-400 border-cyan-500/30 bg-cyan-500/10" />
          <PartChip icon={Box} label="컨테이너" sub="배포 단위" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
        </div>
        <div className="mt-5 pt-5 border-t border-slate-700/50 flex flex-wrap items-center justify-center gap-2 text-xs">
          <Archive size={12} className="text-slate-500" />
          <span className="text-slate-400">더 자세한 흐름이 궁금하면 →</span>
          <Link to="/api-flow" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">API Flow</Link>
          <span className="text-slate-600">·</span>
          <Link to="/architecture" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Architecture</Link>
          <span className="text-slate-600">·</span>
          <Link to="/glossary" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">용어 사전</Link>
        </div>
      </div>
    </section>
  )
}

function AnalogyCard({ icon: Icon, title, subtitle, desc, color }: {
  icon: React.ElementType
  title: string
  subtitle: string
  desc: string
  color: "blue" | "cyan" | "purple"
}) {
  const colorMap = {
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400",
  }
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-4 text-center ${colorMap[color]}`}>
      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-navy-900/60 flex items-center justify-center">
        <Icon size={24} />
      </div>
      <div className="text-white font-bold text-base">{title}</div>
      <div className="text-xs font-mono opacity-80 mb-2">{subtitle}</div>
      <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
    </div>
  )
}

function FlowStep({ n, icon: Icon, title, desc, color }: {
  n: number
  icon: React.ElementType
  title: string
  desc: string
  color: "blue" | "cyan" | "amber" | "purple" | "green" | "pink"
}) {
  const colorMap = {
    blue: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    cyan: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400",
    amber: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    purple: "border-purple-500/30 bg-purple-500/5 text-purple-400",
    green: "border-green-500/30 bg-green-500/5 text-green-400",
    pink: "border-pink-500/30 bg-pink-500/5 text-pink-400",
  }
  return (
    <div className={`relative rounded-lg border p-3 ${colorMap[color]}`}>
      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-navy-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-white">
        {n}
      </div>
      <Icon size={18} className="mb-2" />
      <div className="text-white text-xs font-semibold mb-1">{title}</div>
      <div className="text-[11px] text-slate-400 leading-snug">{desc}</div>
    </div>
  )
}

function RoleCard({ icon: Icon, title, points, example, color }: {
  icon: React.ElementType
  title: string
  points: string[]
  example: string
  color: "green" | "purple" | "amber" | "cyan"
}) {
  const colorMap = {
    green: "border-green-500/20 bg-green-500/5",
    purple: "border-purple-500/20 bg-purple-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
    cyan: "border-cyan-500/20 bg-cyan-500/5",
  }
  const iconColorMap = {
    green: "bg-green-500/15 text-green-400",
    purple: "bg-purple-500/15 text-purple-400",
    amber: "bg-amber-500/15 text-amber-400",
    cyan: "bg-cyan-500/15 text-cyan-400",
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${iconColorMap[color]}`}>
        <Icon size={18} />
      </div>
      <div className="text-white font-semibold text-sm mb-2">{title}</div>
      <ul className="space-y-1 mb-3">
        {points.map((p) => (
          <li key={p} className="text-xs text-slate-400 flex items-start gap-1.5">
            <span className="text-slate-600 mt-0.5">·</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <div className="text-[11px] text-slate-500 italic border-t border-slate-700/40 pt-2">
        예) {example}
      </div>
    </div>
  )
}

function PartChip({ icon: Icon, label, sub, color }: {
  icon: React.ElementType
  label: string
  sub: string
  color: string
}) {
  return (
    <div className={`rounded-lg border p-3 flex flex-col items-center text-center ${color}`}>
      <Icon size={20} className="mb-1.5" />
      <div className="text-white text-xs font-semibold">{label}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
    </div>
  )
}
