import { useState } from "react"
import {
  ShieldAlert,
  Database,
  Camera,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ArrowDown,
  Clock,
  Lock,
  Eye,
  Zap,
  RefreshCw,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

type ScenarioId = "detect" | "isolate" | "restore" | "verify"

const snapshotTypes = [
  {
    type: "자동 백업",
    english: "Automated Backup",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "blue" as const,
    retention: "1 ~ 35일 설정 가능",
    trigger: "매일 새벽 (유지보수 윈도우)",
    feature: "Point-In-Time Recovery (PITR) 지원",
    limit: "보존 기간 지나면 자동 삭제",
    useCase: "일상적인 데이터 보호, 실수로 삭제된 데이터 복구",
    pitr: true,
  },
  {
    type: "수동 스냅샷",
    english: "Manual Snapshot",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "amber" as const,
    retention: "삭제 전까지 영구 보관",
    trigger: "사람이 직접 또는 CLI/API 호출",
    feature: "명시적으로 삭제하기 전까지 보존",
    limit: "스토리지 비용 발생 (GB당 과금)",
    useCase: "배포 직전, DB 마이그레이션 전, 해킹 의심 시",
    pitr: false,
  },
]

const manualSnapshotSteps = [
  {
    step: 1,
    title: "스냅샷 이름 규칙 결정",
    desc: "추후 식별 가능한 이름 패턴 사용",
    detail: "prod-db-2026-05-14-before-deploy\n배포일자·환경·목적을 이름에 포함시켜 나중에 찾기 쉽게 구성",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    code: 'aws rds create-db-snapshot \\\n  --db-instance-identifier prod-postgres \\\n  --db-snapshot-identifier prod-db-2026-05-14-before-deploy',
  },
  {
    step: 2,
    title: "RDS 콘솔 또는 CLI로 스냅샷 생성",
    desc: "AWS 콘솔 → RDS → 인스턴스 선택 → Actions → Take snapshot",
    detail: "생성 중에는 DB 성능이 일시적으로 저하될 수 있음\nMulti-AZ 구성 시에는 스탠바이에서 스냅샷을 찍어 영향 최소화",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    code: null,
  },
  {
    step: 3,
    title: "스냅샷 상태 확인 (available)",
    desc: "available 상태가 될 때까지 대기",
    detail: "creating → available 상태로 바뀌면 완료\n수십 GB 규모는 수 분, 수백 GB 이상은 10분 이상 소요 가능",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    code: 'aws rds describe-db-snapshots \\\n  --db-snapshot-identifier prod-db-2026-05-14-before-deploy \\\n  --query "DBSnapshots[0].Status"',
  },
  {
    step: 4,
    title: "스냅샷 다른 리전에 복사 (선택)",
    desc: "재해 복구(DR) 목적의 교차 리전 백업",
    detail: "해킹·리전 장애 동시 발생 시를 대비해 다른 리전에 복사본 유지\nap-northeast-2 (서울) → us-east-1 (버지니아) 복사 예시",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    code: 'aws rds copy-db-snapshot \\\n  --source-db-snapshot-identifier arn:aws:rds:ap-northeast-2:...\\\n  --target-db-snapshot-identifier prod-db-dr-copy \\\n  --region us-east-1',
  },
  {
    step: 5,
    title: "스냅샷 암호화 확인",
    desc: "KMS 키로 스냅샷이 암호화되어 있는지 확인",
    detail: "RDS 인스턴스 생성 시 암호화를 켜야 스냅샷도 자동 암호화\n암호화되지 않은 스냅샷은 복사 후 암호화 적용 가능",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    code: null,
  },
]

const scenarios: {
  id: ScenarioId
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  subtitle: string
  color: string
  border: string
  bg: string
  badge: "pink" | "amber" | "blue" | "green"
  steps: { action: string; detail: string; cmd?: string }[]
}[] = [
  {
    id: "detect",
    icon: Eye,
    title: "1단계 — 이상 징후 탐지",
    subtitle: "해킹 또는 랜섬웨어 의심 상황 감지",
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "pink",
    steps: [
      { action: "CloudWatch 알람 확인", detail: "DB 연결 수 급증, CPU 스파이크, 비정상적인 쿼리 실행량 확인" },
      { action: "RDS 로그 확인", detail: "error.log, general.log에서 대량 SELECT/DELETE/DROP 패턴 탐색" },
      { action: "VPC Flow Logs 확인", detail: "허가되지 않은 IP에서의 DB 접근 시도 여부 확인 (포트 5432/3306)" },
      { action: "슬랙/이메일 알람 수신 확인", detail: "CloudWatch 알람이 팀 채널에 전달되고 있는지 확인" },
    ],
  },
  {
    id: "isolate",
    icon: Lock,
    title: "2단계 — DB 격리",
    subtitle: "추가 피해 방지를 위해 즉시 접근 차단",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "amber",
    steps: [
      { action: "보안 그룹 인바운드 규칙 즉시 제거", detail: "RDS 보안 그룹에서 모든 인바운드 허용 규칙을 삭제해 외부 접근 차단", cmd: "AWS 콘솔 → EC2 → Security Groups → RDS SG → Inbound rules 삭제" },
      { action: "현재 시점 수동 스냅샷 즉시 생성", detail: "격리 직후 바로 스냅샷을 찍어 현재 상태를 보존 (복구 기준점 확보)" },
      { action: "DB 인스턴스 접속 비밀번호 교체", detail: "master user 비밀번호를 즉시 변경해 기존 탈취된 자격 증명 무효화" },
      { action: "애플리케이션 서버 DB 연결 설정 갱신", detail: "EC2/Railway 서버의 DATABASE_URL 환경변수를 새 비밀번호로 업데이트" },
    ],
  },
  {
    id: "restore",
    icon: RefreshCw,
    title: "3단계 — 스냅샷으로 복구",
    subtitle: "정상 상태의 스냅샷으로 새 RDS 인스턴스 생성",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "blue",
    steps: [
      { action: "복구 기준 스냅샷 선택", detail: "해킹 발생 시점 이전의 가장 최신 스냅샷 또는 자동 백업 PITR 시점 선택" },
      { action: "스냅샷으로 새 RDS 인스턴스 생성", detail: "기존 인스턴스를 덮어쓰지 않고 반드시 새 인스턴스로 복원 (원본 보존)", cmd: "RDS 콘솔 → Snapshots → 선택 → Restore snapshot → 새 identifier 입력" },
      { action: "새 엔드포인트로 앱 서버 연결 전환", detail: "복원된 RDS의 새 엔드포인트를 DATABASE_URL에 적용하고 서버 재시작" },
      { action: "PITR 활용 (분 단위 복구)", detail: "자동 백업이 켜져 있다면 해킹 발생 직전 특정 시각으로 복원 가능", cmd: 'aws rds restore-db-instance-to-point-in-time \\\n  --source-db-instance-identifier prod-postgres \\\n  --target-db-instance-identifier prod-postgres-restored \\\n  --restore-time 2026-05-14T09:30:00Z' },
    ],
  },
  {
    id: "verify",
    icon: CheckCircle,
    title: "4단계 — 복구 검증 및 사후 처리",
    subtitle: "정상화 확인 후 재발 방지 조치",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    badge: "green",
    steps: [
      { action: "데이터 무결성 확인", detail: "핵심 테이블 row count, 최신 레코드 타임스탬프를 확인해 복구 완료 검증" },
      { action: "애플리케이션 정상 동작 확인", detail: "로그인, 데이터 조회/저장 등 핵심 기능 E2E 테스트 수행" },
      { action: "보안 그룹 최소 권한으로 재설정", detail: "EC2 보안 그룹 IP만 허용. 퍼블릭 인터넷 접근은 절대 불허" },
      { action: "침투 경로 분석 및 패치", detail: "VPC Flow Logs, CloudTrail, 애플리케이션 로그로 침투 경로 파악 후 취약점 패치" },
      { action: "사고 보고서 작성", detail: "발생 시각, 탐지 경위, 피해 범위, 대응 과정, 재발 방지책을 문서로 정리" },
    ],
  },
]

const preventionChecklist = [
  { category: "접근 제어", items: ["RDS는 퍼블릭 접근 비활성화 (VPC 내부 전용)", "EC2 보안 그룹 IP만 5432 포트 허용", "DB master 계정 대신 앱 전용 제한 계정 사용", "IAM 데이터베이스 인증 활성화 검토"] },
  { category: "백업 전략", items: ["자동 백업 보존 기간 7일 이상 설정", "배포 전 수동 스냅샷 필수화 (팀 규칙)", "월 1회 스냅샷 복원 테스트 실시 (복구 훈련)", "교차 리전 스냅샷 복사본 유지 (DR)"] },
  { category: "모니터링", items: ["CloudWatch: DB 연결 수 100 초과 시 알람", "CloudWatch: CPU 80% 이상 2분 지속 시 알람", "CloudTrail: 비밀번호 변경·보안 그룹 수정 감사 로그", "RDS Enhanced Monitoring 활성화"] },
  { category: "암호화", items: ["RDS 인스턴스 생성 시 KMS 암호화 활성화", "전송 중 암호화: SSL/TLS 강제 (rds.force_ssl=1)", "Secrets Manager로 DB 비밀번호 관리 (하드코딩 금지)", "스냅샷 공유 시 암호화 여부 반드시 확인"] },
]

export function SecurityPage() {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("detect")
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const scenario = scenarios.find((s) => s.id === activeScenario)!

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={20} className="text-red-400" />
          <h1 className="text-2xl font-bold text-white">보안 / 장애 대응</h1>
          <Badge variant="pink">Security & Recovery</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          해킹·랜섬웨어 위협에 대비한 RDS 스냅샷 전략과, 실제 침해 발생 시 데이터를 복구하는 단계별 절차를 정리합니다.
        </p>
      </div>

      {/* 스냅샷 종류 비교 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Camera size={16} className="text-amber-400" />
          RDS 스냅샷 종류
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {snapshotTypes.map((s) => (
            <div key={s.type} className={`rounded-xl border p-4 ${s.border} ${s.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-sm font-bold ${s.color}`}>{s.type}</span>
                <Badge variant={s.badge}>{s.english}</Badge>
              </div>
              <div className="space-y-2">
                {[
                  { label: "보존 기간", value: s.retention },
                  { label: "생성 시점", value: s.trigger },
                  { label: "특징", value: s.feature },
                  { label: "제한", value: s.limit },
                  { label: "주 사용 시점", value: s.useCase },
                ].map((row) => (
                  <div key={row.label} className="flex gap-2 text-xs">
                    <span className="text-slate-500 w-24 shrink-0">{row.label}</span>
                    <span className="text-slate-300 leading-relaxed">{row.value}</span>
                  </div>
                ))}
                {s.pitr && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs text-blue-300">
                    <Clock size={10} />
                    PITR 지원 — 분 단위 특정 시각으로 복원 가능
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <p className="text-xs text-slate-400">
            <span className="text-amber-300 font-medium">원칙:</span>{" "}
            자동 백업(7일+)은 항상 켜두고, 배포·마이그레이션·보안 이슈 발생 시에는 수동 스냅샷을 추가로 찍는다.
            두 가지를 병행해야 복구 선택지가 넓어진다.
          </p>
        </div>
      </div>

      {/* 수동 스냅샷 찍는 순서 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Camera size={16} className="text-blue-400" />
          수동 스냅샷 찍는 순서
        </h2>
        <p className="text-xs text-slate-500 mb-4">배포 전·마이그레이션 전·해킹 의심 시 즉시 실행. 클릭 시 세부 내용 확인</p>
        <div className="space-y-2">
          {manualSnapshotSteps.map((s, idx) => {
            const isExpanded = expandedStep === s.step
            return (
              <div key={s.step}>
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : s.step)}
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
                      <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                    </div>
                    <ChevronRight size={14} className={`text-slate-500 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                  </div>

                  {isExpanded && (
                    <div className="mt-3 ml-10 space-y-2">
                      <div className={`p-3 rounded-lg border text-xs leading-relaxed whitespace-pre-line ${s.border} ${s.bg} ${s.color}`}>
                        {s.detail}
                      </div>
                      {s.code && (
                        <div className="rounded-lg border border-slate-700/50 bg-slate-900/80 p-3 font-mono text-xs text-green-300 whitespace-pre leading-relaxed overflow-x-auto">
                          {s.code}
                        </div>
                      )}
                    </div>
                  )}
                </button>
                {idx < manualSnapshotSteps.length - 1 && (
                  <div className="flex justify-start ml-5 my-0.5">
                    <ArrowDown size={12} className="text-slate-700" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 해킹 대응 시나리오 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Zap size={16} className="text-red-400" />
          해킹 침해 대응 절차
        </h2>
        <p className="text-xs text-slate-500 mb-5">탐지 → 격리 → 복구 → 검증 4단계. 각 단계를 선택해 세부 조치를 확인하세요.</p>

        {/* 타임라인 탭 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {scenarios.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => setActiveScenario(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  activeScenario === s.id
                    ? `${s.bg} ${s.border} ${s.color}`
                    : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                }`}
              >
                <Icon size={12} />
                {s.title.split("—")[1]?.trim()}
              </button>
            )
          })}
        </div>

        <div className={`rounded-xl border p-5 ${scenario.border} ${scenario.bg}`}>
          <div className="flex items-center gap-2 mb-4">
            {(() => { const Icon = scenario.icon; return <Icon size={16} className={scenario.color} /> })()}
            <div>
              <div className={`text-sm font-bold ${scenario.color}`}>{scenario.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{scenario.subtitle}</div>
            </div>
          </div>
          <div className="space-y-3">
            {scenario.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${scenario.border} ${scenario.color} opacity-80`} style={{ background: "transparent" }}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">{step.action}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.detail}</div>
                  {step.cmd && (
                    <div className="mt-1.5 rounded border border-slate-700/50 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs text-green-300 whitespace-pre overflow-x-auto">
                      {step.cmd}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 예방 체크리스트 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-400" />
          사전 예방 체크리스트
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {preventionChecklist.map((section) => (
            <div key={section.category} className="card">
              <div className="flex items-center gap-2 mb-3">
                <Database size={13} className="text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-200">{section.category}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded border border-green-500/40 bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-sm bg-green-500/60" />
                    </div>
                    <span className="text-xs text-slate-400 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 핵심 원칙 요약 */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-300 mb-2">핵심 원칙</div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div>• 스냅샷은 <span className="text-white">복원 테스트를 해봐야</span> 진짜 백업이다. 찍기만 하고 복원 안 해보면 의미 없음</div>
              <div>• 해킹 의심 시 <span className="text-white">먼저 격리, 그 다음 분석</span>. 원인 파악보다 피해 차단이 우선</div>
              <div>• 복원은 <span className="text-white">기존 인스턴스를 덮어쓰지 않고</span> 새 인스턴스로 생성해 원본 보존</div>
              <div>• <span className="text-white">DB 비밀번호는 Secrets Manager</span>로 관리, 코드/환경변수 하드코딩 절대 금지</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
