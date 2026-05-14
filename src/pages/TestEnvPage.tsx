import { useState } from "react"
import {
  Globe,
  Server,
  Database,
  ArrowDown,
  ChevronRight,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

type ServiceId = "vercel" | "railway" | "supabase"
type FlowStep = { step: number; actor: string; desc: string; detail: string; color: string }

const services: {
  id: ServiceId
  name: string
  role: string
  analogy: string
  free: string
  color: string
  border: string
  bg: string
  badgeVariant: "green" | "purple" | "blue"
  icon: React.ComponentType<{ size?: number; className?: string }>
  what: string[]
  deployFlow: string[]
  envExample: { key: string; value: string }[]
  warnings: string[]
}[] = [
  {
    id: "vercel",
    name: "Vercel",
    role: "프론트엔드 배포 및 호스팅",
    analogy: "식당 홀 (손님이 보는 공간)",
    free: "무제한 정적 배포, 100GB 대역폭/월",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    badgeVariant: "green",
    icon: Globe,
    what: [
      "React, Next.js 앱을 GitHub push 시 자동 빌드 + 배포",
      "브랜치별 프리뷰 URL 자동 생성 (PR마다 고유 URL)",
      "환경변수 설정 가능 (.env 대신 대시보드에서 관리)",
    ],
    deployFlow: [
      "로컬 코드 작성",
      "GitHub push (main 브랜치)",
      "Vercel 자동 감지",
      "npm run build 실행",
      "전 세계 CDN 배포",
      "https://your-app.vercel.app 접근 가능",
    ],
    envExample: [
      { key: "VITE_API_BASE_URL", value: "https://your-backend.railway.app" },
      { key: "VITE_SUPABASE_URL", value: "https://xxxx.supabase.co" },
      { key: "VITE_SUPABASE_ANON_KEY", value: "your-anon-key" },
    ],
    warnings: [
      "API 서버(Railway)와 도메인이 다르므로 백엔드에서 CORS 설정 필수",
      "서버 코드(Node.js)는 Vercel에 올리지 않는다 → Railway 사용",
      "Next.js API Routes는 Vercel에서 실행 가능 (단, 실행 시간 제한 있음)",
    ],
  },
  {
    id: "railway",
    name: "Railway",
    role: "백엔드 서버 실행 환경",
    analogy: "식당 주방 (로직 처리)",
    free: "$5 무료 크레딧/월",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    badgeVariant: "purple",
    icon: Server,
    what: [
      "Node.js / NestJS / Express 서버를 컨테이너로 실행",
      "GitHub 연동 시 push마다 자동 재배포",
      "환경변수, 포트, 도메인 대시보드에서 설정",
      "로그 실시간 확인 가능",
    ],
    deployFlow: [
      "로컬 서버 코드 작성",
      "GitHub push",
      "Railway 자동 감지",
      "Dockerfile 또는 nixpacks로 빌드",
      "서버 실행",
      "https://your-backend.railway.app 접근 가능",
    ],
    envExample: [
      { key: "DATABASE_URL", value: "postgresql://user:pw@db.supabase.co:5432/postgres" },
      { key: "REDIS_URL", value: "redis://..." },
      { key: "JWT_SECRET", value: "your-secret-key" },
      { key: "PORT", value: "3000" },
      { key: "CORS_ORIGIN", value: "https://your-app.vercel.app" },
    ],
    warnings: [
      "무료 크레딧($5/월) 소진 시 서버 중단 → 테스트 환경 전용으로 사용",
      "장기 운영 시 Hobby 플랜 ($20/월) 또는 AWS EC2로 이전",
      "package.json의 start 스크립트 정의 필수: \"start\": \"node dist/main.js\"",
    ],
  },
  {
    id: "supabase",
    name: "Supabase",
    role: "데이터베이스 + 인증 + 스토리지",
    analogy: "창고 + 신분증 확인소",
    free: "500MB DB, 1GB 스토리지, 50MB 파일",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    badgeVariant: "blue",
    icon: Database,
    what: [
      "PostgreSQL 데이터베이스를 UI 대시보드로 관리",
      "회원가입/로그인 인증(Auth) 기능 내장 (이메일, OAuth 소셜 로그인)",
      "파일 업로드 스토리지 제공",
      "실시간 구독(Realtime) 기능 내장",
    ],
    deployFlow: [
      "Supabase 프로젝트 생성",
      "DATABASE_URL 복사",
      "Railway 환경변수에 설정",
      "Prisma / TypeORM / pg로 연결",
      "마이그레이션 실행",
      "쿼리 정상 작동 확인",
    ],
    envExample: [
      { key: "SUPABASE_URL", value: "https://xxxx.supabase.co" },
      { key: "SUPABASE_ANON_KEY", value: "eyJ... (공개 가능)" },
      { key: "SUPABASE_SERVICE_ROLE_KEY", value: "eyJ... (서버만 사용)" },
    ],
    warnings: [
      "무료 플랜은 프로젝트 2개 제한, 1주일 비활성 시 일시 정지",
      "이메일 인증은 무료 50건/일 제한",
      "SUPABASE_SERVICE_ROLE_KEY는 서버(Railway)에서만 사용, 프론트에 노출 금지",
    ],
  },
]

const dataFlowSteps: FlowStep[] = [
  { step: 1, actor: "Vercel (프론트)", desc: "사용자가 로그인 버튼 클릭", detail: "Vercel에 배포된 React 앱에서 이메일/비밀번호 입력 후 로그인 요청", color: "text-green-400" },
  { step: 2, actor: "Supabase Auth", desc: "Supabase Auth SDK로 인증 요청", detail: "supabase.auth.signInWithPassword() 호출 → Supabase가 사용자 검증", color: "text-blue-400" },
  { step: 3, actor: "Supabase Auth", desc: "JWT 토큰 발급 → 프론트에 저장", detail: "발급된 access_token을 localStorage 또는 cookie에 저장", color: "text-blue-400" },
  { step: 4, actor: "Vercel → Railway", desc: "백엔드 API 호출", detail: "Authorization: Bearer {JWT} 헤더를 포함해 Railway 서버로 REST API 요청", color: "text-purple-400" },
  { step: 5, actor: "Railway (백엔드)", desc: "JWT 검증", detail: "미들웨어에서 JWT 서명 검증. SUPABASE_JWT_SECRET 또는 JWKS로 검증", color: "text-purple-400" },
  { step: 6, actor: "Railway → Supabase", desc: "PostgreSQL에서 데이터 조회", detail: "Prisma / TypeORM을 통해 Supabase PostgreSQL에 쿼리 실행", color: "text-cyan-400" },
  { step: 7, actor: "Vercel (프론트)", desc: "JSON 응답 → 화면 렌더링", detail: "Railway 서버의 응답 데이터를 받아 React 컴포넌트에서 렌더링", color: "text-green-400" },
]

const comparisonRows = [
  { item: "초기 설정 시간", test: "30분 ~ 1시간", aws: "2~4시간" },
  { item: "비용 (소규모)", test: "무료 ~ $5/월", aws: "$20 ~ $50/월" },
  { item: "자동 배포", test: "GitHub 연동 기본 제공", aws: "GitHub Actions 직접 설정" },
  { item: "확장성", test: "제한적", aws: "무제한" },
  { item: "커스터마이징", test: "제한적", aws: "자유로움" },
  { item: "운영 난이도", test: "낮음", aws: "높음" },
  { item: "추천 용도", test: "테스트 / 데모 / 포트폴리오", aws: "실서비스 / 프로덕션" },
]

function ArchDiagram() {
  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {/* User */}
      <div className="rounded-lg border border-slate-500/40 bg-slate-500/10 px-6 py-2 text-center">
        <div className="text-xs text-slate-400">사용자 브라우저</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-px h-4 bg-slate-600" />
        <div className="text-xs text-slate-600 mb-1">HTTPS</div>
      </div>

      {/* Vercel */}
      <div className="rounded-xl border border-green-500/40 bg-green-500/5 p-4 w-64">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={14} className="text-green-400" />
          <span className="text-sm font-semibold text-green-300">Vercel</span>
          <Badge variant="green">Frontend</Badge>
        </div>
        <div className="text-xs text-slate-500">React / Next.js</div>
        <div className="text-xs text-slate-600">GitHub push 시 자동 배포</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-px h-4 bg-slate-600" />
        <div className="text-xs text-slate-600 mb-1">REST API / WebSocket</div>
      </div>

      {/* Railway */}
      <div className="rounded-xl border border-purple-500/40 bg-purple-500/5 p-4 w-64">
        <div className="flex items-center gap-2 mb-2">
          <Server size={14} className="text-purple-400" />
          <span className="text-sm font-semibold text-purple-300">Railway</span>
          <Badge variant="purple">Backend</Badge>
        </div>
        <div className="text-xs text-slate-500">Node.js / NestJS</div>
        <div className="flex gap-1 mt-1.5">
          <div className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">서버</div>
          <div className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs text-red-400">Redis Plugin</div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-px h-4 bg-slate-600" />
        <div className="text-xs text-slate-600 mb-1">SQL (PostgreSQL 연결)</div>
      </div>

      {/* Supabase */}
      <div className="rounded-xl border border-blue-500/40 bg-blue-500/5 p-4 w-64">
        <div className="flex items-center gap-2 mb-2">
          <Database size={14} className="text-blue-400" />
          <span className="text-sm font-semibold text-blue-300">Supabase</span>
          <Badge variant="blue">BaaS</Badge>
        </div>
        <div className="text-xs text-slate-500">PostgreSQL 기반, 대시보드 제공</div>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          <div className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">DB</div>
          <div className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400">Auth</div>
          <div className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">Storage</div>
          <div className="rounded border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Realtime</div>
        </div>
      </div>
    </div>
  )
}

export function TestEnvPage() {
  const [activeService, setActiveService] = useState<ServiceId>("vercel")
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const service = services.find((s) => s.id === activeService)!
  const ServiceIcon = service.icon

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={20} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">테스트 환경 구성</h1>
          <Badge variant="cyan">Railway + Vercel + Supabase</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          AWS 없이 무료/저비용으로 풀스택 테스트 환경을 빠르게 구성하는 방법.
          프로덕션 전 기능 검증, 데모, 포트폴리오 배포에 적합합니다.
        </p>
      </div>

      {/* 전체 구성도 + 서비스 역할 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">전체 구성도</h2>
          <ArchDiagram />
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">서비스 역할 정리</h2>
          <div className="space-y-3">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.id} className={`rounded-lg border p-3 ${s.border} ${s.bg}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${s.border} bg-black/20`}>
                      <Icon size={13} className={s.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-semibold ${s.color}`}>{s.name}</span>
                        <Badge variant={s.badgeVariant}>{s.role.split(" ")[0]}</Badge>
                      </div>
                      <div className="text-xs text-slate-400">{s.role}</div>
                      <div className="text-xs text-slate-600 mt-1">비유: {s.analogy}</div>
                      <div className="text-xs text-slate-500 mt-0.5">무료: {s.free}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 서비스별 상세 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">서비스별 상세 설명</h2>
        <div className="flex gap-2 mb-6 flex-wrap">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => setActiveService(s.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  activeService === s.id
                    ? `${s.bg} ${s.border} ${s.color}`
                    : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                }`}
              >
                <Icon size={13} />
                {s.name}
              </button>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 왼쪽: 하는 일 + 배포 흐름 */}
          <div className="space-y-4">
            <div>
              <div className={`flex items-center gap-2 mb-3`}>
                <ServiceIcon size={15} className={service.color} />
                <h3 className={`text-sm font-semibold ${service.color}`}>{service.name}가 하는 일</h3>
              </div>
              <div className="space-y-1.5">
                {service.what.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <CheckCircle size={12} className={`${service.color} shrink-0 mt-0.5`} />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">배포 흐름</h3>
              <div className="space-y-1">
                {service.deployFlow.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`flex flex-col items-center`}>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${service.border} ${service.bg} ${service.color}`}>
                        {i + 1}
                      </div>
                      {i < service.deployFlow.length - 1 && (
                        <div className="w-px h-3 bg-slate-700" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400 pb-2">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 환경변수 + 주의사항 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">환경변수 예시</h3>
              <div className="rounded-lg border border-slate-700/40 bg-slate-900/60 p-3 font-mono text-xs space-y-1">
                {service.envExample.map((env, i) => (
                  <div key={i} className="flex flex-wrap gap-1">
                    <span className="text-cyan-400">{env.key}</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-amber-300 break-all">{env.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <AlertTriangle size={13} className="text-amber-400" />
                주의사항
              </h3>
              <div className="space-y-2">
                {service.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <AlertTriangle size={11} className="text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-400">{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {activeService === "railway" && (
              <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                <div className="text-xs text-purple-400 font-semibold mb-2">Redis Plugin 구성</div>
                <div className="font-mono text-xs text-slate-400 space-y-1">
                  <div>Railway 프로젝트</div>
                  <div className="ml-2 text-slate-500">├─ Service: Node.js 백엔드 서버</div>
                  <div className="ml-2 text-slate-500">└─ Plugin: <span className="text-red-400">Redis</span> (클릭 한 번으로 추가)</div>
                  <div className="ml-10 text-slate-600">→ REDIS_URL 환경변수 자동 주입</div>
                </div>
              </div>
            )}

            {activeService === "supabase" && (
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                <div className="text-xs text-blue-400 font-semibold mb-2">Storage 파일 업로드 흐름</div>
                <div className="space-y-1 text-xs text-slate-500">
                  <div>사용자 이미지 업로드 →</div>
                  <div className="ml-2">Supabase Storage SDK로 직접 업로드 →</div>
                  <div className="ml-2">공개 URL 반환 →</div>
                  <div className="ml-2">URL을 Railway DB에 저장</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 전체 데이터 흐름 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-2">전체 데이터 흐름 예시</h2>
        <p className="text-xs text-slate-500 mb-5">로그인 → 데이터 조회까지의 흐름. 클릭 시 세부 내용 확인</p>
        <div className="space-y-2">
          {dataFlowSteps.map((s, idx) => {
            const isExpanded = expandedStep === s.step
            return (
              <div key={s.step}>
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : s.step)}
                  className={`w-full rounded-lg border p-3.5 text-left transition-all hover:bg-slate-700/20 ${
                    isExpanded ? "border-slate-500/50 bg-slate-700/20" : "border-slate-700/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-bold ${s.color} opacity-80`}>
                      {s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium ${s.color} mr-2`}>{s.actor}</span>
                      <span className="text-sm text-slate-300">{s.desc}</span>
                    </div>
                    <ChevronRight size={13} className={`text-slate-500 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                  {isExpanded && (
                    <div className="mt-2.5 ml-9 text-xs text-slate-400 leading-relaxed p-2.5 rounded-lg bg-slate-800/60 border border-slate-600/30">
                      {s.detail}
                    </div>
                  )}
                </button>
                {idx < dataFlowSteps.length - 1 && (
                  <div className="flex justify-start ml-5 my-0.5">
                    <ArrowDown size={12} className="text-slate-700" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* AWS vs 테스트 환경 비교 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">AWS vs 테스트 환경 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2.5 px-3 text-xs text-slate-500 font-medium">항목</th>
                <th className="text-left py-2.5 px-3 text-xs text-cyan-500 font-medium">Railway + Vercel + Supabase</th>
                <th className="text-left py-2.5 px-3 text-xs text-amber-500 font-medium">AWS (EC2 + RDS + S3)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="py-2.5 px-3 text-xs text-slate-500">{row.item}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-300">{row.test}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-300">{row.aws}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 원칙 */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-cyan-300 mb-1.5">운영 원칙</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              기능 검증과 데모는{" "}
              <span className="text-cyan-300 font-medium">Railway + Vercel + Supabase</span>로 빠르게 진행하고,
              실서비스 전환 시{" "}
              <span className="text-amber-300 font-medium">AWS EC2 + RDS + S3</span>{" "}
              구성으로 이전한다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
