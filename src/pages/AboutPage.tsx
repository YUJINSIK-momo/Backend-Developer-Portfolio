import { Link } from "react-router-dom"
import {
  User, Mail, Github, Linkedin, MapPin, Languages, Sparkles,
  MessageSquare, ShoppingBag, Bot, Workflow, FileCheck2, Radio,
  ArrowRight, Briefcase, GraduationCap, Wrench, Star,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

const strengths = [
  {
    icon: Languages,
    title: "일본어 비즈니스 (JLPT N1)",
    desc: "일본 고객사·문서·회의 직접 대응. 일본어 CS 자동화 시스템 설계에 강점.",
    color: "red",
  },
  {
    icon: Bot,
    title: "LINE · Slack · 다양한 AI 툴 자동화",
    desc: "메신저 채널과 ChatGPT · Claude · Gemini 등 LLM을 상황에 맞게 조합한 업무 자동화 경험.",
    color: "green",
  },
  {
    icon: ShoppingBag,
    title: "WordPress · WooCommerce · Shopify",
    desc: "커머스 플랫폼 운영·커스터마이즈 경험. 실무에서 바로 쓰이는 통합 가능.",
    color: "purple",
  },
  {
    icon: FileCheck2,
    title: "QA / 5G 시스템 테스트",
    desc: "테스트 케이스 설계와 검증 사이클 경험. 품질을 코드 작성 단계부터 고민.",
    color: "amber",
  },
] as const

const techGroups = [
  { label: "Backend", items: ["Node.js", "Express", "NestJS", "TypeScript"], color: "green" },
  { label: "Database", items: ["PostgreSQL", "Prisma", "Redis"], color: "cyan" },
  { label: "Realtime / API", items: ["WebSocket", "Socket.IO", "REST", "Webhook"], color: "blue" },
  { label: "AI / Automation", items: ["ChatGPT", "Claude", "Gemini", "LangChain", "LINE Messaging", "Slack API"], color: "amber" },
  { label: "Frontend", items: ["React", "Vite", "Tailwind CSS"], color: "purple" },
  { label: "Infra / Ops", items: ["AWS EC2", "Cloudflare", "Docker", "GitHub Actions"], color: "pink" },
] as const

const projects = [
  { to: "/backend-basics", label: "Backend Basics", desc: "Webhook · Express · DB 설계 · SQL", icon: Workflow },
  { to: "/socket", label: "Socket Communication", desc: "실시간 양방향 통신 시각화", icon: Radio },
  { to: "/llm-flow", label: "LLM Flow", desc: "토큰 → 추론 → 스트리밍 파이프라인", icon: Sparkles },
  { to: "/aws-infra", label: "AWS Infra", desc: "EC2 + ALB + RDS + Redis 구성도", icon: Wrench },
  { to: "/roadmap", label: "Dev Roadmap", desc: "MVP 분리 · 기술 선택 기준 · 실습 로드맵", icon: Star },
] as const

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-5">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
          <User size={36} className="text-blue-400" />
        </div>
        <div className="space-y-2">
          <Badge variant="blue">About Me</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            유진식 <span className="text-slate-400 text-2xl font-normal">(Jinsik Yoo)</span>
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            <span className="text-blue-400 font-semibold">일본어 커머스·CS 환경</span>을 이해하고,
            <span className="text-cyan-400 font-semibold"> LINE·Slack·WooCommerce + 다양한 AI 툴</span>(ChatGPT·Claude·Gemini)을 활용해
            <span className="text-purple-400 font-semibold"> 업무 자동화 시스템</span>을
            설계·개발하는 실무형 백엔드 개발자.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5"><MapPin size={12} /> 한국 · 일본 원격 가능</span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5"><Languages size={12} /> 한국어 / 일본어(N1) / 영어</span>
          </div>
        </div>

        {/* CTA links */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <ContactLink href="mailto:jinsik2036@gmail.com" icon={Mail} label="Email" />
          <ContactLink href="https://github.com/YUJINSIK-momo" icon={Github} label="GitHub" />
          <ContactLink href="https://www.linkedin.com/in/" icon={Linkedin} label="LinkedIn" />
        </div>
      </section>

      {/* 강점 4종 */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">강점 조합</h2>
          <p className="text-xs text-slate-500 mt-1">"순수 개발자" 보다 더 잘 들어맞는 4가지 축</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {strengths.map((s) => (
            <StrengthCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      {/* 한 줄 포지셔닝 */}
      <section className="card border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={22} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">Positioning</div>
            <p className="text-base text-white leading-relaxed">
              순수 프론트엔드/백엔드 개발자가 아닌,
              <span className="text-cyan-400 font-bold"> "일본 시장 × 커머스 × 자동화 × LLM"</span>의
              교차점을 직접 설계하고 코드로 구현할 수 있는 개발자.
            </p>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              비개발자 PM·CS 담당자와도 깊은 대화가 가능하고, Webhook부터 AI 응답(ChatGPT/Claude/Gemini 중 상황별 선택)·DB 저장·Slack 알림까지
              한 사이클을 혼자 완성합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 기술 스택 */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">기술 스택</h2>
          <p className="text-xs text-slate-500 mt-1">실무에서 쓰거나 학습 중인 것들</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {techGroups.map((g) => (
            <TechGroup key={g.label} {...g} />
          ))}
        </div>
      </section>

      {/* 경력 흐름 */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">경력 흐름</h2>
          <p className="text-xs text-slate-500 mt-1">QA에서 시작해 풀스택 자동화 개발자로</p>
        </div>
        <div className="space-y-3">
          <TimelineItem
            icon={GraduationCap}
            color="slate"
            phase="이전"
            title="QA · 5G 시스템 테스트"
            desc="테스트 케이스 설계, 결함 추적, 검증 사이클 운영. 품질을 코드 단계부터 고민하는 습관."
          />
          <TimelineItem
            icon={ShoppingBag}
            color="purple"
            phase="확장"
            title="WordPress · WooCommerce · Shopify"
            desc="커머스 사이트 운영·커스터마이즈. 실제 매출이 도는 시스템을 다뤄본 경험."
          />
          <TimelineItem
            icon={Briefcase}
            color="blue"
            phase="현재"
            title="백엔드 · 자동화 시스템 개발"
            desc="Node.js · TypeScript · Express · PostgreSQL 기반으로 LINE/Slack + 다양한 AI 툴(ChatGPT/Claude/Gemini) 연동 자동화 구축."
          />
          <TimelineItem
            icon={Sparkles}
            color="cyan"
            phase="앞으로"
            title="일본 시장 자동화 솔루션 개발"
            desc="일본어 CS 자동화 · 커머스 통합 · LLM 응용. 일본 기업 협업에 열려 있음."
          />
        </div>
      </section>

      {/* 이 포트폴리오 안의 프로젝트 */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">이 포트폴리오에서 볼 수 있는 것</h2>
          <p className="text-xs text-slate-500 mt-1">각 페이지가 하나의 작은 데모입니다</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((p) => (
            <ProjectLink key={p.to} {...p} />
          ))}
        </div>
      </section>

      {/* 연락 */}
      <section className="card border-blue-500/30">
        <div className="text-center space-y-3">
          <h2 className="text-lg font-bold text-white">함께 일해보고 싶으시다면</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            일본 시장 진출 / 커머스 자동화 / 챗봇·CS 시스템 / LLM 통합 프로젝트에 관심 있습니다.
            짧은 메시지도 환영합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <ContactLink href="mailto:jinsik2036@gmail.com" icon={Mail} label="jinsik2036@gmail.com" />
            <ContactLink href="https://github.com/YUJINSIK-momo" icon={Github} label="@YUJINSIK-momo" />
          </div>
        </div>
      </section>
    </div>
  )
}

/* ─────────── sub components ─────────── */

function ContactLink({ href, icon: Icon, label }: {
  href: string
  icon: React.ElementType
  label: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/50 bg-navy-800/50 hover:bg-navy-700/50 hover:border-blue-500/30 text-slate-300 hover:text-white text-xs font-medium transition-all"
    >
      <Icon size={13} />
      <span>{label}</span>
    </a>
  )
}

const strengthColorMap = {
  red: { border: "border-red-500/30", bg: "bg-red-500/15 text-red-400" },
  green: { border: "border-green-500/30", bg: "bg-green-500/15 text-green-400" },
  purple: { border: "border-purple-500/30", bg: "bg-purple-500/15 text-purple-400" },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/15 text-amber-400" },
}

function StrengthCard({ icon: Icon, title, desc, color }: {
  icon: React.ElementType
  title: string
  desc: string
  color: keyof typeof strengthColorMap
}) {
  const c = strengthColorMap[color]
  return (
    <div className={`rounded-xl border bg-navy-900/40 p-4 ${c.border}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  )
}

const techColorMap = {
  green: { border: "border-green-500/20", text: "text-green-400" },
  cyan: { border: "border-cyan-500/20", text: "text-cyan-400" },
  blue: { border: "border-blue-500/20", text: "text-blue-400" },
  amber: { border: "border-amber-500/20", text: "text-amber-400" },
  purple: { border: "border-purple-500/20", text: "text-purple-400" },
  pink: { border: "border-pink-500/20", text: "text-pink-400" },
}

function TechGroup({ label, items, color }: {
  label: string
  items: readonly string[]
  color: keyof typeof techColorMap
}) {
  const c = techColorMap[color]
  return (
    <div className={`rounded-xl border bg-navy-900/40 p-4 ${c.border}`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${c.text}`}>{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="text-xs font-mono px-2 py-1 rounded-md bg-slate-800/70 text-slate-300 border border-slate-700/50">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

const timelineColorMap = {
  slate: { dot: "bg-slate-500", bg: "bg-slate-500/15 text-slate-400" },
  purple: { dot: "bg-purple-500", bg: "bg-purple-500/15 text-purple-400" },
  blue: { dot: "bg-blue-500", bg: "bg-blue-500/15 text-blue-400" },
  cyan: { dot: "bg-cyan-500", bg: "bg-cyan-500/15 text-cyan-400" },
}

function TimelineItem({ icon: Icon, color, phase, title, desc }: {
  icon: React.ElementType
  color: keyof typeof timelineColorMap
  phase: string
  title: string
  desc: string
}) {
  const c = timelineColorMap[color]
  return (
    <div className="card flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{phase}</span>
        </div>
        <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function ProjectLink({ to, label, desc, icon: Icon }: {
  to: string
  label: string
  desc: string
  icon: React.ElementType
}) {
  return (
    <Link
      to={to}
      className="group card-hover border border-slate-700/50 hover:border-blue-500/30 flex flex-col gap-2 transition-all"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-blue-400" />
        <h3 className="text-white font-semibold text-sm">{label}</h3>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed flex-1">{desc}</p>
      <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-blue-400 transition-colors">
        <span>보기</span>
        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  )
}
