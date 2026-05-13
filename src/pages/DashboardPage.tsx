import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Server, Zap, GitBranch, Database, Shield, Radio,
  Layers, ArrowRight, Activity, Cpu, HardDrive, Network,
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
    </div>
  )
}
