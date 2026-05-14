import { useState } from "react"
import {
  Cloud,
  Server,
  Database,
  Layers,
  Shield,
  Activity,
  CheckSquare,
  ArrowDown,
  ChevronRight,
  GitBranch,
  DollarSign,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

type TabId = "basic" | "scaled"
type StepId = number | null

const lbCriteria = [
  { condition: "DAU 1,000 미만", decision: "ALB 불필요", reason: "단일 EC2로 충분, 비용 절감", color: "text-green-400", badge: "green" as const },
  { condition: "DAU 1,000 ~ 10,000", decision: "ALB 검토", reason: "피크 타임 트래픽 분산 필요", color: "text-amber-400", badge: "amber" as const },
  { condition: "DAU 10,000 이상", decision: "ALB + ASG 필수", reason: "가용성 및 장애 대응 필수", color: "text-red-400", badge: "pink" as const },
  { condition: "소켓 연결 1,000+ 동시", decision: "ALB + Sticky Session", reason: "WebSocket은 연결 유지 필요", color: "text-purple-400", badge: "purple" as const },
  { condition: "무중단 배포 필요", decision: "ALB + Rolling Deploy", reason: "Blue/Green 또는 Rolling 배포", color: "text-blue-400", badge: "blue" as const },
]

const setupSteps = [
  { step: 1, title: "도메인 구입", desc: "Route 53 또는 가비아/카페24", detail: "도메인을 가비아에서 사도 Route 53에 NS 레코드를 연결하면 AWS에서 관리 가능", icon: Cloud, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  { step: 2, title: "SSL 인증서 발급", desc: "ACM (AWS Certificate Manager)", detail: "ACM + ALB 조합 권장 → 자동 갱신. 단일 EC2만 쓸 때는 Let's Encrypt (Certbot)", icon: Shield, color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10" },
  { step: 3, title: "EC2 + Nginx", desc: "인스턴스 생성 + 리버스 프록시", detail: "Nginx로 /api → localhost:3000, /socket.io → WebSocket 업그레이드 헤더 설정 필수", icon: Server, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  { step: 4, title: "RDS (PostgreSQL)", desc: "영구 데이터 저장소", detail: "EC2와 동일 VPC 내 프라이빗 서브넷. 퍼블릭 인터넷 접근 차단. 프로덕션은 Multi-AZ 활성화", icon: Database, color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
  { step: 5, title: "ElastiCache Redis", desc: "캐시 / 세션 / 소켓 상태", detail: "API 응답 캐싱, JWT 블랙리스트, 소켓 룸 상태, 세션 저장. EC2와 동일 VPC 내 배치", icon: Activity, color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10" },
  { step: 6, title: "S3 + CloudFront", desc: "정적 파일 분리 (CDN)", detail: "이미지·CSS·JS를 S3에 저장, CloudFront로 글로벌 CDN 배포. EC2 트래픽 및 부하 감소", icon: Cloud, color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  { step: 7, title: "ALB 연결", desc: "트래픽 증가 시 로드밸런싱", detail: "DAU 1,000 초과 또는 무중단 배포 필요 시 도입. WebSocket은 Sticky Session 활성화 필수", icon: Layers, color: "text-indigo-400", border: "border-indigo-500/30", bg: "bg-indigo-500/10" },
  { step: 8, title: "CI/CD 파이프라인", desc: "GitHub Actions → EC2 자동 배포", detail: "main push → test → build → SSH 접속 → pm2 재시작 → 슬랙 알림", icon: GitBranch, color: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/10" },
  { step: 9, title: "모니터링", desc: "CloudWatch 알람 + 대시보드", detail: "CPU 80% / RDS 스토리지 90% / ALB 5xx 에러율 5% / EC2 상태체크 실패 즉시 알람", icon: Activity, color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
]

const checklist = [
  "보안 그룹: 80(HTTP), 443(HTTPS), 22(SSH, 특정 IP만) 포트만 오픈",
  "SSH 키페어 .pem 파일 분실 금지 (로컬 + 안전한 저장소 백업)",
  "IAM Role 설정: EC2에 직접 Access Key 넣지 않고 Role로 권한 부여",
  "CloudWatch 알람: CPU 80% 이상 / 디스크 90% 이상 시 알림",
  "탄력적 IP(Elastic IP) 할당: 인스턴스 재시작 시 IP 변경 방지",
  "스냅샷 자동화: AMI 또는 EBS 스냅샷 주 1회 이상",
]

const costTips = [
  { tip: "사용하지 않는 개발 EC2는 퇴근 후 중지(Stop)", note: "삭제가 아닌 중지" },
  { tip: "RDS는 개발 환경에서 Multi-AZ 비활성화", note: "프로덕션만 Multi-AZ" },
  { tip: "CloudFront + S3로 정적 파일 분리", note: "EC2 부하 감소" },
  { tip: "AWS Budgets 알람 설정", note: "월 $50 초과 시 이메일 알림" },
]

function FlowArrow() {
  return (
    <div className="flex justify-center my-1">
      <ArrowDown size={14} className="text-slate-500" />
    </div>
  )
}

function FlowNode({ label, sub, color }: { label: string; sub?: string; color: string }) {
  return (
    <div className={`rounded-lg border px-4 py-2.5 text-center mx-auto w-fit min-w-[160px] ${color}`}>
      <div className="text-sm font-semibold">{label}</div>
      {sub && <div className="text-xs opacity-70 mt-0.5">{sub}</div>}
    </div>
  )
}

function BasicDiagram() {
  return (
    <div className="py-4">
      <FlowNode label="사용자" color="border-slate-500/40 bg-slate-500/10 text-slate-300" />
      <FlowArrow />
      <FlowNode label="Route 53" sub="DNS" color="border-blue-500/40 bg-blue-500/10 text-blue-300" />
      <FlowArrow />
      <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3 mx-auto w-fit min-w-[200px]">
        <div className="text-center text-sm font-semibold text-purple-300 mb-2">EC2 온디맨드</div>
        <div className="flex gap-2 justify-center">
          <div className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-xs text-purple-300">Node.js / NestJS</div>
          <div className="rounded border border-slate-500/30 bg-slate-500/10 px-2 py-1 text-xs text-slate-300">Nginx</div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-1.5">t3.small ~ t3.medium</div>
      </div>
      <FlowArrow />
      <FlowNode label="RDS PostgreSQL" sub="영구 데이터 저장" color="border-cyan-500/40 bg-cyan-500/10 text-cyan-300" />
      <FlowArrow />
      <FlowNode label="ElastiCache Redis" sub="캐시 / 세션" color="border-red-500/40 bg-red-500/10 text-red-300" />
    </div>
  )
}

function ScaledDiagram() {
  return (
    <div className="py-4">
      <FlowNode label="사용자" color="border-slate-500/40 bg-slate-500/10 text-slate-300" />
      <FlowArrow />
      <FlowNode label="Route 53" sub="DNS" color="border-blue-500/40 bg-blue-500/10 text-blue-300" />
      <FlowArrow />
      <FlowNode label="ALB" sub="Application Load Balancer" color="border-indigo-500/40 bg-indigo-500/10 text-indigo-300" />
      <FlowArrow />
      <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 mx-auto w-fit">
        <div className="text-center text-xs text-green-400 mb-2 font-semibold">Auto Scaling Group</div>
        <div className="flex gap-2">
          {["AZ-a", "AZ-b", "AZ-c"].map((az) => (
            <div key={az} className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-center">
              <div className="text-xs text-purple-300 font-medium">EC2</div>
              <div className="text-xs text-slate-500">{az}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">t3.large 이상</div>
      </div>
      <FlowArrow />
      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3 mx-auto w-fit min-w-[200px]">
        <div className="text-center text-sm font-semibold text-cyan-300 mb-1">RDS Multi-AZ</div>
        <div className="flex gap-2 justify-center">
          <div className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">Primary</div>
          <div className="rounded border border-slate-500/30 bg-slate-500/10 px-2 py-1 text-xs text-slate-400">Read Replica</div>
        </div>
      </div>
      <FlowArrow />
      <FlowNode label="ElastiCache Redis Cluster" sub="클러스터 모드" color="border-red-500/40 bg-red-500/10 text-red-300" />
    </div>
  )
}

export function AwsInfraPage() {
  const [activeTab, setActiveTab] = useState<TabId>("basic")
  const [expandedStep, setExpandedStep] = useState<StepId>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Cloud size={20} className="text-amber-400" />
          <h1 className="text-2xl font-bold text-white">AWS 인프라 구성</h1>
          <Badge variant="amber">Infrastructure</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          EC2 기반 백엔드 서버 인프라 구성. 트래픽 규모에 따라 단일 인스턴스에서 ALB + ASG 확장 구성으로 진화하는 전략을 시각화합니다.
        </p>
      </div>

      {/* 인프라 구성도 탭 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">인프라 구성도</h2>
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              activeTab === "basic"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            기본 구성 (단일 EC2)
          </button>
          <button
            onClick={() => setActiveTab("scaled")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              activeTab === "scaled"
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            확장 구성 (ALB + ASG)
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            {activeTab === "basic" ? <BasicDiagram /> : <ScaledDiagram />}
          </div>
          <div className="space-y-3">
            {activeTab === "basic" ? (
              <>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="text-sm font-semibold text-amber-300 mb-2">사용 시점</div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>• DAU 1,000 미만 초기/소규모 서비스</div>
                    <div>• 비용 최적화가 최우선인 경우</div>
                    <div>• 트래픽 예측이 어려운 초기 단계</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "인스턴스", value: "t3.small ~ t3.medium" },
                    { label: "헬스체크", value: "pm2 또는 systemd 자동 재시작" },
                    { label: "비용 최적화", value: "Reserved Instance / Savings Plans" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className="text-xs text-slate-300">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <div className="text-sm font-semibold text-indigo-300 mb-2">사용 시점</div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>• DAU 10,000 이상 또는 급격한 트래픽 변동</div>
                    <div>• 무중단 배포(Rolling/Blue-Green) 필요</div>
                    <div>• 소켓 연결 1,000+ 동시 처리</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "인스턴스", value: "t3.large 이상 + ASG" },
                    { label: "WebSocket", value: "Sticky Session 활성화 필수" },
                    { label: "DB", value: "RDS Multi-AZ + Read Replica" },
                    { label: "캐시", value: "Redis Cluster 모드" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className="text-xs text-slate-300">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 로드밸런서 도입 판단 기준 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">로드밸런서 도입 판단 기준</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">트래픽 상황</th>
                <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">판단</th>
                <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium hidden sm:table-cell">이유</th>
              </tr>
            </thead>
            <tbody>
              {lbCriteria.map((row) => (
                <tr key={row.condition} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="py-2.5 px-3 text-xs text-slate-400">{row.condition}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant={row.badge}>{row.decision}</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-slate-500 hidden sm:table-cell">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 환경별 분리 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">환경별 인프라 분리</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { env: "dev", color: "border-green-500/30 bg-green-500/5", badge: "green" as const, instance: "EC2 t3.small 1대", note: "공용 개발 서버", db: "개발 DB (분리)" },
            { env: "stage", color: "border-amber-500/30 bg-amber-500/5", badge: "amber" as const, instance: "EC2 t3.medium 1대", note: "프로덕션 동일 환경 검증", db: "스테이징 DB (분리)" },
            { env: "prod", color: "border-red-500/30 bg-red-500/5", badge: "pink" as const, instance: "EC2 t3.large + ALB", note: "트래픽 기준으로 ASG 추가", db: "프로덕션 DB (분리)" },
          ].map((item) => (
            <div key={item.env} className={`rounded-lg border p-4 ${item.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={item.badge}>{item.env}</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-start gap-1.5">
                  <Server size={11} className="mt-0.5 shrink-0 text-slate-500" />
                  <span>{item.instance}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Database size={11} className="mt-0.5 shrink-0 text-slate-500" />
                  <span>{item.db}</span>
                </div>
                <div className="text-slate-500 text-xs mt-2">{item.note}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-lg bg-slate-700/20 border border-slate-600/30">
          <p className="text-xs text-slate-500">
            <span className="text-slate-400 font-medium">env 파일 분리:</span>{" "}
            .env.development / .env.staging / .env.production — 프로덕션 DB와 개발 DB는 반드시 분리
          </p>
        </div>
      </div>

      {/* 인프라 구축 순서 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">인프라 구축 전체 순서</h2>
        <p className="text-xs text-slate-500 mb-4">각 단계를 클릭하면 세부 내용을 확인할 수 있습니다.</p>
        <div className="space-y-2">
          {setupSteps.map((s, idx) => {
            const Icon = s.icon
            const isExpanded = expandedStep === s.step
            return (
              <div key={s.step}>
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : s.step)}
                  className={`w-full rounded-lg border p-4 text-left transition-all duration-200 hover:bg-slate-700/20 ${
                    isExpanded ? `${s.border} bg-slate-700/20` : "border-slate-700/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${s.border} ${s.bg}`}>
                      <Icon size={13} className={s.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 font-mono">0{s.step}</span>
                        <span className="text-sm font-semibold text-white">{s.title}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`text-slate-500 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                  {isExpanded && (
                    <div className={`mt-3 ml-10 p-3 rounded-lg border ${s.border} ${s.bg} text-xs ${s.color} leading-relaxed`}>
                      {s.detail}
                    </div>
                  )}
                </button>
                {idx < setupSteps.length - 1 && (
                  <div className="flex justify-start ml-5">
                    <ArrowDown size={12} className="text-slate-700" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* EC2 운영 체크리스트 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <CheckSquare size={16} className="text-green-400" />
          EC2 운영 체크리스트
        </h2>
        <div className="space-y-2">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 py-1.5 border-b border-slate-700/30 last:border-0">
              <div className="w-4 h-4 rounded border border-green-500/40 bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-sm bg-green-500/60" />
              </div>
              <span className="text-xs text-slate-400 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 비용 절감 팁 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-emerald-400" />
          AWS 비용 절감 팁
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {costTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs text-emerald-400 font-bold">{idx + 1}</span>
              </div>
              <div>
                <div className="text-xs text-slate-300">{tip.tip}</div>
                <div className="text-xs text-emerald-600 mt-0.5">{tip.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
