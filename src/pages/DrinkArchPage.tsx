import { useState } from "react"
import {
  Boxes, Server, Database, Cloud, ShoppingCart, CreditCard, Search,
  Bell, Layers, ArrowDown, ArrowRight, ChevronRight, GitBranch,
  RefreshCw, ShieldCheck, Inbox, Repeat, Webhook, Lock, Users, Store,
  Cpu, AlertTriangle, CheckCircle2, Send, Image as ImageIcon, Package,
  BarChart3, ExternalLink, Code2,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { CodeBlock } from "../components/ui/CodeBlock"

/* ─────────────────────────────  데이터  ───────────────────────────── */

type StackRow = {
  name: string
  used: string
  latest: string
  reason: string
  badge: "blue" | "green" | "amber" | "cyan" | "purple" | "pink" | "red" | "slate"
}

const stackVersions: StackRow[] = [
  {
    name: "Node.js",
    used: "22 LTS (Jod)",
    latest: "24 LTS · 25 Current",
    badge: "green",
    reason:
      "프로덕션은 짝수 = LTS만 투입한다. 홀수(25 Current)는 단기 지원이라 운영 제외. 24 LTS보다 한 세대 더 검증된 22를 골라 네이티브 모듈·Prisma·드라이버 호환성을 안정적으로 확보.",
  },
  {
    name: "TypeScript",
    used: "5.7",
    latest: "5.x 최신",
    badge: "blue",
    reason:
      "Vite·ESLint·ts-node 플러그인이 검증된 라인. 최신 버전의 타입 추론 변경으로 인한 빌드 깨짐 리스크를 회피.",
  },
  {
    name: "NestJS",
    used: "10.x",
    latest: "11.x",
    badge: "red",
    reason:
      "11은 기반이 Express 4 → 5로 올라가 미들웨어 생태계 호환 이슈가 있음. 운영 안정성을 위해 Express 4 기반 10을 유지.",
  },
  {
    name: "PostgreSQL",
    used: "16",
    latest: "17",
    badge: "cyan",
    reason:
      "RDS·관리형 서비스가 기본 지원 + 확장(extension)·ORM 호환성이 검증된 버전. 17 신기능보다 안정성과 장애 복구 경험을 우선.",
  },
  {
    name: "Redis",
    used: "7.4",
    latest: "7.x · Valkey",
    badge: "pink",
    reason:
      "캐시·세션·분산 락 용도엔 7.4로 충분. 라이선스(RSALv2)가 부담되면 오픈소스 포크 Valkey로 교체할 수 있도록 클라이언트를 추상화.",
  },
  {
    name: "Prisma (ORM)",
    used: "6.x",
    latest: "6.x",
    badge: "purple",
    reason:
      "타입 안전한 스키마·마이그레이션이 강점. 무거운 통계 쿼리는 $queryRaw로 분리해 ORM 한계를 우회.",
  },
  {
    name: "RabbitMQ",
    used: "3.13",
    latest: "4.0",
    badge: "amber",
    reason:
      "4.0은 classic mirrored queue를 제거해 quorum queue를 강제함. 운영 검증된 3.13을 쓰되, 큐는 처음부터 quorum queue로 구성해 4.x 이전을 대비.",
  },
  {
    name: "Docker Engine",
    used: "27.x",
    latest: "27.x",
    badge: "blue",
    reason:
      "멀티스테이지 빌드로 이미지 경량화. compose v2 기준, 어드민·스토어프론트·워커를 각각 컨테이너로 분리.",
  },
  {
    name: "Nginx",
    used: "1.27 stable",
    latest: "1.27 mainline",
    badge: "green",
    reason:
      "리버스 프록시 · TLS 종료 · 정적 캐싱 담당. 운영은 신규 기능보다 안정성이 중요해 stable 라인으로 고정.",
  },
  {
    name: "pnpm",
    used: "9.x",
    latest: "9.x",
    badge: "slate",
    reason:
      "모노레포(어드민/스토어프론트/워커) 워크스페이스 구성 + 빠른 설치·디스크 절약(content-addressable store).",
  },
]

type ServerCard = {
  icon: React.ElementType
  title: string
  status: "live" | "roadmap"
  role: string
  stack: string
  note: string
  color: string
}

const servers: ServerCard[] = [
  {
    icon: Store,
    title: "Storefront API",
    status: "live",
    role: "고객용 — 상품 조회 · 주문 생성 (결제는 로드맵)",
    stack: "NestJS · Prisma",
    note: "읽기 트래픽이 많음 → Redis 캐시·CDN을 적극 활용",
    color: "border-blue-500/30 bg-blue-500/5 text-blue-400",
  },
  {
    icon: Users,
    title: "Admin API (어드민 서버군)",
    status: "roadmap",
    role: "판매자 · MD용 — 상품 등록/수정/관리, 정산 조회",
    stack: "NestJS · Prisma",
    note: "쓰기 위주 → 후처리 이벤트를 발행하는 주체",
    color: "border-purple-500/30 bg-purple-500/5 text-purple-400",
  },
  {
    icon: Lock,
    title: "Auth",
    status: "roadmap",
    role: "JWT 발급·검증, 권한(고객/판매자/MD/관리자) 분리",
    stack: "JWT · Redis(블랙리스트)",
    note: "access/refresh 토큰, 어드민은 IP 제한·MFA로 강화",
    color: "border-amber-500/30 bg-amber-500/5 text-amber-400",
  },
  {
    icon: Cpu,
    title: "Worker (비동기 후처리)",
    status: "roadmap",
    role: "큐 소비 → 색인 · 전송 · 집계 · 이미지 · 알림",
    stack: "Node 워커 · amqplib",
    note: "수평 확장 가능, 실패 시 재시도/DLQ로 격리",
    color: "border-green-500/30 bg-green-500/5 text-green-400",
  },
]

const syncWork = [
  "상품 row INSERT / UPDATE",
  "옵션 · 재고 INSERT",
  "가격 · 필수값 검증",
  "판매자 권한 체크",
  "이미지 메타데이터 저장",
]

type PostTask = {
  icon: React.ElementType
  title: string
  desc: string
  color: string
}

const postTasks: PostTask[] = [
  {
    icon: Search,
    title: "Elasticsearch 색인",
    desc: "상품을 검색 엔진에 upsert → 검색 · 자동완성 · 필터에 노출",
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    icon: Send,
    title: "타팀 데이터 전송",
    desc: "정산 · 물류 · 추천 팀에 상품 변경 이벤트 전달 (API/Webhook)",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "대시보드 집계",
    desc: "관리자 통계 · 등록 수 · 카테고리별 집계 테이블 갱신",
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  {
    icon: ImageIcon,
    title: "이미지 후처리",
    desc: "원본 → 썸네일 · webp 변환 후 S3 재업로드, CDN 캐시 워밍",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    icon: RefreshCw,
    title: "캐시 무효화",
    desc: "상품 상세 · 목록의 Redis/CDN 캐시 purge로 최신 반영",
    color: "text-pink-400 border-pink-500/30 bg-pink-500/10",
  },
  {
    icon: Bell,
    title: "알림 발송",
    desc: "판매자에게 등록/승인 완료 메일 · 슬랙 알림",
    color: "text-green-400 border-green-500/30 bg-green-500/10",
  },
]

type RetryStep = {
  n: number
  icon: React.ElementType
  title: string
  short: string
  detail: string
  color: string
  border: string
  bg: string
}

const retrySteps: RetryStep[] = [
  {
    n: 1,
    icon: CheckCircle2,
    title: "수동 ACK (Manual Acknowledgement)",
    short: "작업이 성공해야만 ack — 처리 중 워커가 죽으면 자동 재배달",
    detail:
      "autoAck를 끄고, 후처리가 끝난 뒤에만 channel.ack를 호출한다. 워커가 처리 도중 크래시되면 unacked 메시지를 브로커가 다른 워커에 다시 배달한다. prefetch(예: 10)로 한 번에 가져오는 양을 제한해 특정 워커에 메시지가 몰리거나 OOM 나는 것을 막는다.",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
  {
    n: 2,
    icon: Repeat,
    title: "재시도 + 지수 백오프 (Exponential Backoff)",
    short: "일시적 오류는 즉시 버리지 않고 간격을 늘려가며 재시도",
    detail:
      "네트워크 순단·외부 API 5xx 같은 일시적 실패는 바로 폐기하지 않고 재시도한다. 간격을 1s → 5s → 30s … 로 늘리는 지수 백오프를 적용. RabbitMQ에서는 retry 전용 큐에 message-ttl을 걸고 dead-letter-exchange로 원본 큐에 되돌려보내는 'delay queue' 패턴으로 구현한다.",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
  {
    n: 3,
    icon: Inbox,
    title: "DLQ (Dead Letter Queue) 격리",
    short: "N회 초과 · 영구 실패 메시지는 별도 큐로 보내 격리",
    detail:
      "x-death 헤더로 재시도 횟수를 세고, 임계치(예: 5회)를 넘으면 DLQ로 라우팅한다. DLQ 메시지는 자동 폐기하지 않고 보관 → 원인(스키마 오류·버그) 조사 → 수정 배포 → 수동/배치로 재처리(replay). DLQ에 메시지가 쌓이는 것 자체를 알람으로 잡는다.",
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
  },
  {
    n: 4,
    icon: ShieldCheck,
    title: "멱등성 (Idempotency)",
    short: "같은 메시지가 두 번 와도 결과가 한 번과 동일하게",
    detail:
      "재배달·재시도 때문에 메시지는 '최소 1회(at-least-once)' 전달된다 — 즉 중복은 정상이다. eventId(또는 productId+version)를 키로 처리 이력을 Redis SETNX / DB unique 제약에 기록해, 이미 처리한 이벤트는 건너뛴다. ES 색인처럼 덮어쓰기(upsert) 연산은 본질적으로 멱등이라 더 안전하다.",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
  },
  {
    n: 5,
    icon: GitBranch,
    title: "Outbox 패턴 (발행 유실 차단)",
    short: "DB 커밋과 메시지 발행을 한 트랜잭션으로 묶어 유실 0",
    detail:
      "'DB 저장 성공 → 그 다음 큐 발행'은 두 단계라, 저장 후 발행 직전에 죽으면 메시지가 영영 안 나간다. 해결: 상품 저장과 같은 트랜잭션 안에서 outbox 테이블에 이벤트 row를 INSERT(원자적). 별도 Relay(폴링 또는 CDC/Debezium)가 outbox를 읽어 RabbitMQ에 발행하고 성공 시 sent 처리. 발행이 실패해도 row가 남아 다시 보낸다.",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    n: 6,
    icon: Server,
    title: "Publisher Confirms + 영속화",
    short: "발행이 브로커에 도착했는지 확인, 큐/메시지는 디스크 복제",
    detail:
      "발행 측은 publisher confirm으로 브로커 ACK를 받은 메시지만 outbox에서 sent 처리한다. 큐는 quorum queue(다중 노드 디스크 복제) + persistent 메시지로 두어, 브로커 한 대가 죽어도 메시지가 살아남게 한다.",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    n: 7,
    icon: AlertTriangle,
    title: "모니터링 & 알람",
    short: "DLQ 적재 · 컨슈머 지연 · unacked 급증을 즉시 감지",
    detail:
      "DLQ 메시지 수 > 0, consumer lag(ready 메시지 적체), unacked 급증, 워커 처리 실패율을 CloudWatch/Prometheus로 수집해 Slack 알람. '조용히 쌓이다 한 번에 터지는' 상황을 막는다.",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
  },
]

const stores = [
  {
    icon: Database,
    title: "PostgreSQL",
    status: "live",
    sub: "관계형 · 트랜잭션 원본",
    desc: "주문 · 상품 · 회원 · 정산 등 정합성이 중요한 데이터의 원본(Source of Truth)",
    color: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400",
  },
  {
    icon: RefreshCw,
    title: "Redis",
    status: "roadmap",
    sub: "캐시 · 세션 · 락",
    desc: "응답 캐시, 세션, 분산 락(중복 등록 방지), 멱등 키, 큐 상태 저장",
    color: "border-pink-500/30 bg-pink-500/5 text-pink-400",
  },
  {
    icon: Cloud,
    title: "S3 + CloudFront",
    status: "roadmap",
    sub: "이미지 · CDN",
    desc: "상품 이미지 원본/썸네일 저장, presigned URL 업로드, 전 세계 CDN 전송",
    color: "border-amber-500/30 bg-amber-500/5 text-amber-400",
  },
  {
    icon: Search,
    title: "Elasticsearch",
    status: "roadmap",
    sub: "검색 색인",
    desc: "상품 검색 색인 — 자동완성 · 필터 · 정렬. 원본은 PG, 검색은 ES로 분리",
    color: "border-purple-500/30 bg-purple-500/5 text-purple-400",
  },
]

/* ─────────────────────────────  코드 샘플  ───────────────────────────── */

const outboxCode = `// Admin API — 상품 저장과 이벤트 발행을 한 트랜잭션으로 묶기 (Outbox)
await prisma.$transaction(async (tx) => {
  const product = await tx.product.update({
    where: { id },
    data: dto,
  })

  // 같은 트랜잭션에서 outbox에 이벤트 기록 → 원자적으로 보장
  await tx.outbox.create({
    data: {
      eventId: randomUUID(),
      type: "product.updated",
      payload: { productId: product.id, version: product.version },
      status: "PENDING",
    },
  })
})
// 별도 Relay 프로세스가 outbox(PENDING)를 폴링 → RabbitMQ 발행 → SENT 처리`

const consumerCode = `// Worker — 수동 ack + 멱등 처리 + 실패 시 재시도/DLQ
await channel.prefetch(10)
await channel.consume("product.events", async (msg) => {
  if (!msg) return
  const event = JSON.parse(msg.content.toString())

  try {
    // 멱등성: 이미 처리한 이벤트면 skip (중복 배달 대비)
    const fresh = await redis.set(\`evt:\${event.eventId}\`, "1", "NX", "EX", 86400)
    if (fresh === null) return channel.ack(msg)

    await esClient.index({ index: "products", id: event.productId, document: event.payload })
    await notifyOtherTeams(event)

    channel.ack(msg) // 성공해야만 ack
  } catch (err) {
    const deaths = msg.properties.headers?.["x-death"]?.[0]?.count ?? 0
    if (deaths >= 5) {
      channel.publish("dlx", "product.events.dead", msg.content) // DLQ로 격리 + 알람
      channel.ack(msg)
    } else {
      channel.nack(msg, false, false) // retry 큐(TTL+DLX)로 재투입 = 지수 백오프
    }
  }
})`

const webhookCode = `// Storefront API — Toss 결제 webhook (서명 검증 + 멱등)
@Post("/webhooks/toss")
async handleTossWebhook(@Req() req, @Headers("tosspayments-signature") sig: string) {
  // 1) 서명 검증 — 위조 요청 차단
  if (!verifyTossSignature(req.rawBody, sig)) throw new ForbiddenException()

  const { paymentKey, orderId, status } = req.body
  // 2) 멱등 — webhook은 재전송된다. 이미 처리된 결제면 무시
  const ok = await redis.set(\`pay:\${paymentKey}\`, "1", "NX", "EX", 86400)
  if (ok === null) return { received: true }

  // 3) 주문 상태 갱신 + 후처리 이벤트 발행(Outbox)
  if (status === "DONE") await this.orders.markPaid(orderId, paymentKey)
  return { received: true }
}`

/* ─────────────────────────────  다이어그램 헬퍼  ───────────────────────────── */

function NodeBox({ icon: Icon, label, sub, color }: {
  icon: React.ElementType
  label: string
  sub?: string
  color: string
}) {
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${color}`}>
      <Icon size={15} className="shrink-0" />
      <div className="text-left leading-tight">
        <div className="text-xs font-semibold">{label}</div>
        {sub && <div className="text-[10px] opacity-70">{sub}</div>}
      </div>
    </div>
  )
}

function Tier({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700/40 bg-navy-900/40 p-3 w-full">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 text-center">{label}</div>
      <div className="flex flex-wrap items-stretch justify-center gap-2">{children}</div>
    </div>
  )
}

function TierArrow() {
  return (
    <div className="flex justify-center py-1">
      <ArrowDown size={16} className="text-slate-600" />
    </div>
  )
}

function FullDiagram() {
  return (
    <div className="space-y-0">
      <Tier label="클라이언트">
        <NodeBox icon={ShoppingCart} label="고객" sub="웹 / 모바일 — Storefront" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
        <NodeBox icon={Users} label="판매자 · MD" sub="어드민 웹" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
      </Tier>
      <TierArrow />
      <Tier label="엣지 / 프록시">
        <NodeBox icon={Cloud} label="CloudFront + S3" sub="정적 · 이미지 CDN" color="text-amber-400 border-amber-500/30 bg-amber-500/10" />
        <NodeBox icon={Server} label="Nginx" sub="리버스 프록시 · TLS 종료" color="text-slate-300 border-slate-500/30 bg-slate-500/10" />
      </Tier>
      <TierArrow />
      <Tier label="API 서버군 (NestJS)">
        <NodeBox icon={Store} label="Storefront API" sub="조회 · 주문 · 결제" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
        <NodeBox icon={Users} label="Admin API" sub="상품 등록/수정" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
        <NodeBox icon={Lock} label="Auth" sub="JWT · 권한" color="text-amber-400 border-amber-500/30 bg-amber-500/10" />
        <NodeBox icon={CreditCard} label="Toss Payments" sub="결제 · webhook" color="text-emerald-400 border-emerald-500/30 bg-emerald-500/10" />
      </Tier>
      <TierArrow />
      <Tier label="데이터 계층 (동기)">
        <NodeBox icon={Database} label="PostgreSQL" sub="원본 · 트랜잭션" color="text-cyan-400 border-cyan-500/30 bg-cyan-500/10" />
        <NodeBox icon={RefreshCw} label="Redis" sub="캐시 · 세션 · 락" color="text-pink-400 border-pink-500/30 bg-pink-500/10" />
      </Tier>
      <div className="flex justify-center py-1">
        <div className="flex items-center gap-1.5 text-[10px] text-orange-400">
          <ArrowDown size={14} className="text-orange-500/70" />
          <span>이벤트 발행 (Outbox → Relay)</span>
        </div>
      </div>
      <Tier label="메시지 브로커">
        <NodeBox icon={Boxes} label="RabbitMQ" sub="Exchange · Quorum Queue · DLX/DLQ" color="text-orange-400 border-orange-500/30 bg-orange-500/10" />
      </Tier>
      <TierArrow />
      <Tier label="비동기 워커">
        <NodeBox icon={Cpu} label="Worker" sub="후처리 컨슈머 (수평 확장)" color="text-green-400 border-green-500/30 bg-green-500/10" />
      </Tier>
      <TierArrow />
      <Tier label="후처리 대상 (fan-out)">
        <NodeBox icon={Search} label="Elasticsearch" sub="검색 색인" color="text-cyan-400 border-cyan-500/30 bg-cyan-500/10" />
        <NodeBox icon={Send} label="타팀 전송" sub="정산 · 물류 · 추천" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
        <NodeBox icon={BarChart3} label="대시보드 집계" sub="통계 갱신" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
        <NodeBox icon={ImageIcon} label="이미지 변환" sub="썸네일 → S3" color="text-amber-400 border-amber-500/30 bg-amber-500/10" />
        <NodeBox icon={Bell} label="알림" sub="메일 · 슬랙" color="text-green-400 border-green-500/30 bg-green-500/10" />
      </Tier>
    </div>
  )
}

function AsyncDiagram() {
  return (
    <div className="space-y-0">
      <Tier label="Admin API — 동기 처리 (한 트랜잭션)">
        <NodeBox icon={Package} label="상품 저장 (COMMIT)" sub="row + 옵션 + 재고" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
        <NodeBox icon={GitBranch} label="Outbox 기록" sub="같은 트랜잭션 내" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
      </Tier>
      <TierArrow />
      <Tier label="Relay (별도 프로세스)">
        <NodeBox icon={Send} label="Outbox 폴링 → 발행" sub="publisher confirm" color="text-cyan-400 border-cyan-500/30 bg-cyan-500/10" />
      </Tier>
      <TierArrow />
      <Tier label="RabbitMQ">
        <NodeBox icon={Boxes} label="Exchange" sub="product.events" color="text-orange-400 border-orange-500/30 bg-orange-500/10" />
        <NodeBox icon={Inbox} label="Quorum Queue" sub="디스크 복제 · persistent" color="text-orange-400 border-orange-500/30 bg-orange-500/10" />
      </Tier>
      <TierArrow />
      <Tier label="Worker — 수동 ACK + 멱등">
        <NodeBox icon={Cpu} label="consume" sub="prefetch 10" color="text-green-400 border-green-500/30 bg-green-500/10" />
      </Tier>
      <div className="grid grid-cols-2 gap-3 pt-3">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={15} className="text-green-400" />
            <span className="text-xs font-semibold text-green-300">성공</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            후처리 완료 → <span className="text-green-400 font-mono">channel.ack</span> → 메시지 제거
          </p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={15} className="text-red-400" />
            <span className="text-xs font-semibold text-red-300">실패</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-mono">nack</span> → Retry 큐(백오프) → 5회 초과 →{" "}
            <span className="text-red-400 font-mono">DLQ</span> → 알람 → 수동 재처리
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────  페이지  ───────────────────────────── */

export function DrinkArchPage() {
  const [tab, setTab] = useState<"full" | "async">("full")
  const [openRetry, setOpenRetry] = useState<number | null>(1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* 헤더 */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <ShoppingCart size={20} className="text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Drink E-commerce 백엔드 아키텍처</h1>
          <Badge variant="green">Project</Badge>
        </div>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          직접 만든 드링크 커머스 사이트를, 실제 운영을 가정한 백엔드 아키텍처로 재설계했습니다.
          고객 스토어프론트와 판매자·MD용 어드민 서버군, 결제(Toss), 이미지(S3), 검색(Elasticsearch),
          그리고 상품 등록/수정 후의 <span className="text-emerald-400">비동기 후처리 파이프라인</span>까지의 흐름과
          메시지 유실·실패 시 재처리 전략을 정리했습니다.
          <span className="block mt-2 text-slate-300">
            이 중 <span className="text-emerald-300 font-medium">1차 MVP(상품 조회 · 주문 생성 — Storefront API + PostgreSQL)</span>는
            실제로 구현되어 동작하며, 나머지는 트래픽·규모 확장을 가정한 설계입니다.
          </span>
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <a
            href="https://yujinsik-momo.github.io/Drink-E-commerce/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <ExternalLink size={13} /> 라이브 데모
          </a>
          <a
            href="https://github.com/YUJINSIK-momo/Drink-E-commerce"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-600/40 bg-slate-700/30 text-slate-300 text-xs font-medium hover:bg-slate-700/50 transition-colors"
          >
            <Code2 size={13} /> GitHub 저장소
          </a>
        </div>
      </div>

      {/* 구현 현황 배너 */}
      <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <h2 className="text-base font-semibold text-white">구현 현황</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          아래 각 항목에 <StatusTag live={true} /> (실제 구현·동작) 와 <StatusTag live={false} /> (확장 설계) 를 구분해 표시했습니다.
          1차 MVP는 <span className="text-emerald-300 font-medium">NestJS + PostgreSQL</span> 로 실제 배포 가능한 상태입니다.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-emerald-500/20 bg-navy-900/40 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <StatusTag live={true} />
              <span className="text-xs font-semibold text-white">구현됨</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Storefront API — 상품 조회 · 주문 생성</li>
              <li>PostgreSQL + Prisma — 원본 DB · 주문 가격 스냅샷</li>
              <li>서버 권위적 가격 계산 · 헬스체크 · CORS</li>
              <li>Docker(멀티스테이지) · Render 배포 구성</li>
            </ul>
          </div>
          <div className="rounded-lg border border-slate-600/30 bg-navy-900/40 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <StatusTag live={false} />
              <span className="text-xs font-semibold text-white">확장 로드맵</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>JWT 인증 · 멀티셀러 어드민(Admin API)</li>
              <li>RabbitMQ 비동기 후처리 (Outbox · DLQ · 멱등)</li>
              <li>Elasticsearch 검색 색인 · Redis 캐시</li>
              <li>Toss 결제 · Webhook · S3/CloudFront 이미지</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 1. 기술 스택 & 버전 선택 */}
      <section className="card">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={16} className="text-blue-400" />
          <h2 className="text-base font-semibold text-white">기술 스택 & 버전 선택</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          원칙: <span className="text-slate-300">"최신(latest)이 아니라 안정(stable)을 고른다."</span> 운영 환경은
          짝수 LTS · 검증된 라인을 기본으로 하고, 최신 버전은 신기능 대비 호환·운영 리스크를 따져 한 세대 뒤를 선택합니다.
          <span className="block mt-2 text-slate-400">
            <span className="text-green-400 font-medium">● MVP 사용 중</span>: Node · TypeScript · NestJS · PostgreSQL · Prisma · Docker
            &nbsp;/&nbsp; 나머지(Redis · RabbitMQ · Nginx · pnpm)는 확장 단계 도입 예정.
          </span>
        </p>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">기술</th>
                <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">사용 버전</th>
                <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium hidden sm:table-cell">최신 (참고)</th>
                <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">선택 이유</th>
              </tr>
            </thead>
            <tbody>
              {stackVersions.map((row) => (
                <tr key={row.name} className="border-b border-slate-800/50 hover:bg-navy-700/30 transition-colors align-top">
                  <td className="py-2.5 px-3 text-xs text-white font-semibold whitespace-nowrap">{row.name}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <Badge variant={row.badge}>{row.used}</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-slate-500 font-mono hidden sm:table-cell whitespace-nowrap">{row.latest}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-400 leading-relaxed min-w-[260px]">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. 아키텍처 구성도 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Boxes size={16} className="text-orange-400" />
          <h2 className="text-base font-semibold text-white">아키텍처 구성도</h2>
        </div>
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab("full")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              tab === "full"
                ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            전체 시스템 구성
          </button>
          <button
            onClick={() => setTab("async")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              tab === "async"
                ? "bg-green-500/20 border-green-500/50 text-green-300"
                : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            비동기 후처리 파이프라인
          </button>
        </div>
        <div className="card">
          {tab === "full" ? <FullDiagram /> : <AsyncDiagram />}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-500 border-t border-slate-700/50 pt-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" /> HTTP / REST</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> 결제 / Webhook</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" /> 비동기 큐</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> 데이터 / 색인</span>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
            <StatusTag live={true} />
            <span>Storefront API · PostgreSQL 노드는 실제 구현됨(배포 가능) · 그 외는 확장 설계</span>
          </p>
        </div>
      </section>

      {/* 3. 서버 구성 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Server size={16} className="text-purple-400" />
          <h2 className="text-base font-semibold text-white">서버 구성</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {servers.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title} className={`rounded-xl border p-4 ${s.color.split(" ").slice(0, 2).join(" ")}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{s.title}</span>
                      <StatusTag live={s.status === "live"} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{s.role}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {s.stack.split(" · ").map((t) => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-navy-900/60 border border-slate-700/50 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-500 italic mt-2 border-t border-slate-700/40 pt-2">{s.note}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. 동기 vs 비동기 경계 + 후처리란? */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={16} className="text-green-400" />
          <h2 className="text-base font-semibold text-white">상품 등록/수정 — 동기 vs 비동기 경계</h2>
          <StatusTag live={false} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 동기 */}
          <div className="card border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Database size={15} className="text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300">한 트랜잭션 안 (동기)</span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              모두 성공해야 커밋 · 하나라도 실패하면 롤백. 정합성이 핵심인 작업만 묶는다.
            </p>
            <ul className="space-y-1.5">
              {syncWork.map((w) => (
                <li key={w} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 비동기 */}
          <div className="card border-orange-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Boxes size={15} className="text-orange-400" />
              <span className="text-sm font-semibold text-orange-300">큐로 분리 (비동기 후처리)</span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              커밋 후 이벤트로 발행 → 워커가 처리. 실패해도 핵심 트랜잭션엔 영향 없음.
            </p>
            <ul className="space-y-1.5">
              {postTasks.map((t) => (
                <li key={t.title} className="flex items-start gap-2 text-xs text-slate-300">
                  <ArrowRight size={13} className="text-orange-400 shrink-0 mt-0.5" />
                  <span>{t.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 후처리란? */}
        <div className="card mt-4 border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Webhook size={15} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">"상품 등록/수정 후처리"란 무엇인가요?</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            굳이 <span className="text-emerald-400">한 트랜잭션에 물릴 필요가 없는 작업</span>을 본 처리와 분리하는 것입니다.
            상품 저장(원본 DB 커밋)은 빠르게 끝내 판매자에게 즉시 응답을 주고, 시간이 걸리거나 외부 시스템에 의존하는 작업은
            이벤트로 던져 워커가 따로 처리합니다.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <ReasonCard n="1" title="응답 지연 방지" desc="ES 색인·이미지 변환을 기다리지 않고 판매자에게 즉시 '등록 완료' 응답" />
            <ReasonCard n="2" title="장애 격리" desc="ES·추천팀 API가 죽어도 상품 저장은 성공 — 핵심 흐름이 외부에 안 묶임" />
            <ReasonCard n="3" title="독립 확장 · 재시도" desc="후처리만 워커 늘려 확장, 실패한 것만 따로 재시도/replay" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {postTasks.map((t) => {
              const Icon = t.icon
              return (
                <div key={t.title} className="rounded-lg border border-slate-700/40 bg-navy-900/40 p-3">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center mb-2 ${t.color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="text-xs font-semibold text-white">{t.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{t.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. 메시지 큐 & 재처리 전략 */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <Repeat size={16} className="text-amber-400" />
          <h2 className="text-base font-semibold text-white">메시지 유실 · 처리 실패 시 재처리 전략</h2>
          <StatusTag live={false} />
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          어드민 → 워커로 후처리 메시지를 전달할 때 핵심 질문은 <span className="text-slate-300">"메시지가 유실되거나 처리에 실패하면?"</span> 입니다.
          RabbitMQ 기준 7가지 안전장치를 단계로 정리했습니다. (각 항목 클릭 시 상세 설명)
        </p>

        <div className="space-y-2 mb-6">
          {retrySteps.map((s) => {
            const Icon = s.icon
            const open = openRetry === s.n
            return (
              <button
                key={s.n}
                onClick={() => setOpenRetry(open ? null : s.n)}
                className={`w-full rounded-lg border p-4 text-left transition-all duration-200 hover:bg-slate-700/20 ${
                  open ? `${s.border} bg-slate-700/20` : "border-slate-700/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${s.border} ${s.bg}`}>
                    <Icon size={13} className={s.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-mono">0{s.n}</span>
                      <span className="text-sm font-semibold text-white">{s.title}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.short}</div>
                  </div>
                  <ChevronRight size={14} className={`text-slate-500 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
                </div>
                {open && (
                  <div className={`mt-3 ml-10 p-3 rounded-lg border ${s.border} ${s.bg} text-xs ${s.color} leading-relaxed`}>
                    {s.detail}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <GitBranch size={13} className="text-purple-400" /> Outbox — 발행 유실 차단
            </div>
            <CodeBlock code={outboxCode} language="typescript" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Cpu size={13} className="text-green-400" /> Worker — 수동 ack + 멱등 + DLQ
            </div>
            <CodeBlock code={consumerCode} language="typescript" />
          </div>
        </div>
      </section>

      {/* 6. 결제 흐름 (Toss + Webhook) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} className="text-emerald-400" />
          <h2 className="text-base font-semibold text-white">결제 흐름 (Toss Payments + Webhook)</h2>
          <StatusTag live={false} />
        </div>
        <div className="card mb-4">
          <ol className="space-y-3">
            <PayStep n={1} title="주문 생성 (PENDING)" desc="고객이 결제 요청 → Storefront API가 주문을 PENDING으로 생성하고 Toss 결제창(clientKey) 호출" />
            <PayStep n={2} title="고객 결제" desc="Toss 결제 위젯에서 카드/간편결제 진행" />
            <PayStep n={3} title="결제 승인 (confirm)" desc="successUrl 복귀 후 서버가 Toss confirm API 호출 (secretKey + Idempotency-Key 헤더로 중복 승인 방지)" />
            <PayStep n={4} title="Webhook 수신" desc="Toss가 결제 상태 변경을 webhook으로 통지 → 서버는 서명 검증 후 주문을 PAID로 갱신 (멱등 처리)" />
            <PayStep n={5} title="결제 후처리" desc="결제 완료 이벤트를 큐로 발행 → 정산 · 알림 · 대시보드 집계 비동기 처리" last />
          </ol>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 mb-4 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-amber-300 font-medium">webhook은 중복·재전송이 기본</span>입니다. 반드시 ① 서명 검증으로 위조를 막고,
            ② paymentKey 기준 멱등 처리로 같은 결제를 두 번 반영하지 않게 해야 합니다.
          </p>
        </div>
        <CodeBlock code={webhookCode} language="typescript" />
      </section>

      {/* 7. 데이터 저장소 요약 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-cyan-400" />
          <h2 className="text-base font-semibold text-white">데이터 저장소 · 역할 분리</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stores.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title} className={`rounded-xl border p-4 ${s.color.split(" ").slice(0, 2).join(" ")}`}>
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">{s.title}</span>
                  <StatusTag live={s.status === "live"} />
                </div>
                <div className="text-[11px] font-mono text-slate-500 mb-2 mt-0.5">{s.sub}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function StatusTag({ live }: { live: boolean }) {
  return live ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-green-500/40 bg-green-500/15 text-green-300 align-middle">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> 구현됨
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-slate-600/50 bg-slate-600/20 text-slate-400 align-middle">
      설계
    </span>
  )
}

function ReasonCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400">
          {n}
        </span>
        <span className="text-xs font-semibold text-white">{title}</span>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}

function PayStep({ n, title, desc, last }: { n: number; title: string; desc: string; last?: boolean }) {
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-[11px] font-mono font-bold text-emerald-400 shrink-0">
          {n}
        </span>
        {!last && <span className="w-px flex-1 bg-slate-700/50 my-1" />}
      </div>
      <div className="pb-1">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</div>
      </div>
    </li>
  )
}
