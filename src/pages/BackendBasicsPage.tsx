import { useState } from "react"
import {
  Webhook, Route, Database, Code2, ArrowRight, ArrowDown,
  RefreshCw, Zap, Layers, Key, Link2, CheckCircle2,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { CodeBlock } from "../components/ui/CodeBlock"

type SectionId = "webhook" | "express" | "db" | "sql"

const sections: { id: SectionId; label: string; icon: React.ElementType; color: string }[] = [
  { id: "webhook", label: "Webhook", icon: Webhook, color: "cyan" },
  { id: "express", label: "Express 라우팅", icon: Route, color: "green" },
  { id: "db", label: "DB 테이블 설계", icon: Database, color: "purple" },
  { id: "sql", label: "SQL 기본", icon: Code2, color: "amber" },
]

const tabColor: Record<string, { active: string; inactive: string }> = {
  cyan: {
    active: "bg-cyan-500/15 text-cyan-400 border-cyan-500/40",
    inactive: "text-slate-400 hover:text-slate-200 border-transparent",
  },
  green: {
    active: "bg-green-500/15 text-green-400 border-green-500/40",
    inactive: "text-slate-400 hover:text-slate-200 border-transparent",
  },
  purple: {
    active: "bg-purple-500/15 text-purple-400 border-purple-500/40",
    inactive: "text-slate-400 hover:text-slate-200 border-transparent",
  },
  amber: {
    active: "bg-amber-500/15 text-amber-400 border-amber-500/40",
    inactive: "text-slate-400 hover:text-slate-200 border-transparent",
  },
}

export function BackendBasicsPage() {
  const [active, setActive] = useState<SectionId>("webhook")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Hero */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers size={20} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Backend Basics</h1>
          <Badge variant="blue">Foundation</Badge>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
          백엔드 시스템을 만들 때 반드시 알아야 하는 4가지 기본기 — Webhook, Express 라우팅,
          DB 테이블 설계, SQL CRUD. 화려한 기술보다 이 기초가 흔들리지 않아야 LINE·Slack·AI 툴
          연동도 명확해집니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700/50 pb-3">
        {sections.map((s) => {
          const Icon = s.icon
          const isActive = active === s.id
          const c = tabColor[s.color]
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                isActive ? c.active : c.inactive
              }`}
            >
              <Icon size={14} />
              <span>{s.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {active === "webhook" && <WebhookSection />}
      {active === "express" && <ExpressSection />}
      {active === "db" && <DbDesignSection />}
      {active === "sql" && <SqlBasicsSection />}
    </div>
  )
}

/* ───────────────────────── Webhook ───────────────────────── */

function WebhookSection() {
  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={16} className="text-slate-400" />
            <h3 className="text-white font-semibold text-sm">Polling (전통 방식)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            클라이언트가 일정 주기로 "새 데이터 있어?" 를 계속 물어보는 방식.
            요청 99%는 빈 응답이라 비효율적.
          </p>
          <div className="bg-navy-900/50 rounded-lg p-3 text-[11px] font-mono text-slate-400 space-y-0.5 border border-slate-700/50">
            <div>10:00:00 → GET /messages → 없음</div>
            <div>10:00:05 → GET /messages → 없음</div>
            <div>10:00:10 → GET /messages → 1건 ✓</div>
            <div>10:00:15 → GET /messages → 없음</div>
          </div>
        </div>

        <div className="card border-cyan-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Webhook size={16} className="text-cyan-400" />
            <h3 className="text-white font-semibold text-sm">Webhook (이벤트 방식)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            "이벤트 생기면 네 URL로 알려줄게" — 외부 서비스가 능동적으로
            <span className="text-cyan-400"> POST</span> 요청을 보내줌. 실시간 + 비용 ↓.
          </p>
          <div className="bg-navy-900/50 rounded-lg p-3 text-[11px] font-mono text-slate-400 space-y-0.5 border border-slate-700/50">
            <div className="text-slate-600">... (조용함)</div>
            <div className="text-cyan-400">10:00:10 ← POST /webhook (LINE이 알려줌)</div>
            <div className="text-slate-600">... (조용함)</div>
          </div>
        </div>
      </div>

      {/* 흐름 다이어그램 */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4 text-center">
          🔄 Webhook 한 사이클 — LINE 메시지 수신 예시
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { label: "사용자가 LINE 입력", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
            { label: "LINE 서버", color: "text-green-400 border-green-500/30 bg-green-500/10" },
            { label: "POST /webhook", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
            { label: "서명 검증", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
            { label: "로직 처리", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
            { label: "200 OK 응답", color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium font-mono ${node.color}`}>
                {node.label}
              </div>
              {i < arr.length - 1 && <ArrowRight size={14} className="text-slate-600" />}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-[11px] text-slate-500">
          반드시 3초 안에 <span className="text-white font-mono">200 OK</span>을 돌려줘야 LINE이 재시도하지 않습니다.
          무거운 작업은 큐에 넣고 먼저 200을 응답하세요.
        </div>
      </div>

      {/* 실전 예시 */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          실전에서 자주 만나는 Webhook
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <WebhookExample service="LINE" desc="사용자 메시지 / 친구 추가 / 이미지 업로드 이벤트" verify="X-Line-Signature (HMAC-SHA256)" color="green" />
          <WebhookExample service="Slack" desc="슬래시 명령어 / 버튼 클릭 / 멘션 이벤트" verify="X-Slack-Signature + timestamp" color="purple" />
          <WebhookExample service="Stripe" desc="결제 성공 / 환불 / 구독 갱신 알림" verify="Stripe-Signature (whsec_...)" color="cyan" />
          <WebhookExample service="GitHub" desc="push / PR / Issue 생성 이벤트" verify="X-Hub-Signature-256" color="amber" />
        </div>
      </div>

      {/* 보안 코드 */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          🔐 Webhook 보안 — 서명 검증 필수
        </h3>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Webhook URL이 공개되어 있으니 누구나 가짜 요청을 보낼 수 있습니다.
          헤더의 서명을 시크릿 키로 검증해서 "진짜 LINE이 보낸 게 맞는지" 확인하세요.
        </p>
        <CodeBlock
          language="typescript"
          code={`import crypto from "crypto"
import express from "express"

const app = express()

app.post("/webhook/line", express.raw({ type: "*/*" }), (req, res) => {
  const signature = req.header("x-line-signature") ?? ""
  const body = req.body as Buffer

  const expected = crypto
    .createHmac("sha256", process.env.LINE_CHANNEL_SECRET!)
    .update(body)
    .digest("base64")

  if (signature !== expected) {
    return res.status(401).send("Invalid signature")
  }

  // 1) 먼저 200을 응답 (LINE 재시도 방지)
  res.status(200).end()

  // 2) 무거운 작업은 비동기 큐에 위임
  const events = JSON.parse(body.toString()).events
  events.forEach((e: unknown) => queue.add("handle-line-event", e))
})`}
        />
      </div>
    </section>
  )
}

function WebhookExample({ service, desc, verify, color }: {
  service: string
  desc: string
  verify: string
  color: "green" | "purple" | "cyan" | "amber"
}) {
  const colorMap = {
    green: "border-green-500/20 bg-green-500/5",
    purple: "border-purple-500/20 bg-purple-500/5",
    cyan: "border-cyan-500/20 bg-cyan-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
  }
  const textMap = {
    green: "text-green-400",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
    amber: "text-amber-400",
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className={`font-bold text-sm mb-2 ${textMap[color]}`}>{service}</div>
      <p className="text-xs text-slate-300 leading-relaxed mb-2">{desc}</p>
      <div className="text-[10px] text-slate-500 font-mono border-t border-slate-700/50 pt-2 mt-2">
        🔐 {verify}
      </div>
    </div>
  )
}

/* ───────────────────────── Express 라우팅 ───────────────────────── */

function ExpressSection() {
  return (
    <section className="space-y-6">
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-3">
          🛣️ 라우팅이란 — "어떤 URL이 오면 어떤 함수를 실행할지" 매핑
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Express는 <span className="text-green-400 font-mono">app.METHOD(path, handler)</span> 형태로
          요청을 함수에 연결합니다. 한 요청이 미들웨어 → 컨트롤러 → 응답 순서로 흐르는 게 핵심.
        </p>
        <CodeBlock
          language="typescript"
          code={`import express from "express"

const app = express()
app.use(express.json())          // JSON body 파싱 (전역 미들웨어)

// GET   /users         → 목록 조회
app.get("/users", async (req, res) => {
  const users = await db.user.findMany()
  res.json(users)
})

// POST  /users         → 생성
app.post("/users", async (req, res) => {
  const created = await db.user.create({ data: req.body })
  res.status(201).json(created)
})

// GET   /users/:id     → 단건 조회 (URL 파라미터)
app.get("/users/:id", async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } })
  if (!user) return res.status(404).json({ error: "Not found" })
  res.json(user)
})

// PATCH /users/:id     → 부분 수정
app.patch("/users/:id", async (req, res) => {
  const updated = await db.user.update({ where: { id: req.params.id }, data: req.body })
  res.json(updated)
})

// DELETE /users/:id    → 삭제
app.delete("/users/:id", async (req, res) => {
  await db.user.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

app.listen(3000)`}
        />
      </div>

      {/* 미들웨어 체인 */}
      <div className="card border-green-500/20">
        <h3 className="text-sm font-semibold text-white mb-4 text-center">
          🔗 미들웨어 체인 — 한 요청이 거치는 순서
        </h3>
        <div className="flex flex-col items-center gap-2">
          {[
            { label: "Request 도착", color: "bg-blue-500/5 border-blue-500/20", note: "POST /orders" },
            { label: "express.json()", color: "bg-slate-500/5 border-slate-500/20", note: "JSON body 파싱" },
            { label: "cors()", color: "bg-cyan-500/5 border-cyan-500/20", note: "CORS 헤더 추가" },
            { label: "authMiddleware", color: "bg-amber-500/5 border-amber-500/20", note: "JWT 검증 → req.user 주입" },
            { label: "rateLimitMiddleware", color: "bg-orange-500/5 border-orange-500/20", note: "분당 요청 수 제한" },
            { label: "Controller", color: "bg-green-500/5 border-green-500/20", note: "실제 비즈니스 로직" },
            { label: "errorHandler", color: "bg-red-500/5 border-red-500/20", note: "에러는 마지막 미들웨어로" },
            { label: "Response 전송", color: "bg-pink-500/5 border-pink-500/20", note: "201 Created + JSON" },
          ].map((step, i, arr) => (
            <div key={step.label} className="w-full max-w-md">
              <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${step.color}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-xs text-white">{step.label}</span>
                </div>
                <span className="text-[10px] text-slate-400">{step.note}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown size={12} className="text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 라우터 분리 + 에러 핸들러 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            📁 라우터 분리 — 규모가 커지면 필수
          </h3>
          <CodeBlock
            language="typescript"
            code={`// routes/users.ts
import { Router } from "express"
const router = Router()

router.get("/", listUsers)
router.post("/", createUser)
router.get("/:id", getUser)
export default router

// app.ts
import usersRouter from "./routes/users"
app.use("/api/users", usersRouter)
// → /api/users, /api/users/:id 로 자동 연결`}
          />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            ⚠️ 에러 처리 미들웨어 — 4개 인자가 시그니처
          </h3>
          <CodeBlock
            language="typescript"
            code={`// 모든 라우트 등록 후 맨 마지막에
app.use((err, req, res, next) => {
  console.error(err)

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({
    error: "Internal Server Error",
    requestId: req.id,
  })
})

// 라우트 안에서는 next(err)로 위임
app.get("/risky", async (req, res, next) => {
  try {
    res.json(await doStuff())
  } catch (err) {
    next(err)
  }
})`}
          />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── DB 테이블 설계 ───────────────────────── */

function DbDesignSection() {
  return (
    <section className="space-y-6">
      <div className="card border-purple-500/20">
        <h3 className="text-sm font-semibold text-white mb-3">
          🧱 좋은 테이블 설계의 3원칙
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <PrincipleCard
            n="1NF"
            title="원자값 유지"
            desc="한 셀에 값 하나만. 콤마로 여러 값 넣지 않기."
            bad='tags: "node,express,jwt"'
            good="별도 user_tags 테이블"
          />
          <PrincipleCard
            n="2NF"
            title="부분 종속 제거"
            desc="복합키의 일부에만 의존하는 컬럼을 분리."
            bad="order_items에 product_name 중복"
            good="products 테이블에서 JOIN"
          />
          <PrincipleCard
            n="3NF"
            title="이행 종속 제거"
            desc="A→B→C 같은 간접 의존을 분리."
            bad="users에 country_name 저장"
            good="countries 테이블 + country_id"
          />
        </div>
      </div>

      {/* 관계 유형 */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4">
          🔗 테이블 관계 — 3가지 패턴만 알면 90% 끝
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <RelationCard
            type="1 : 1"
            color="blue"
            example="users ↔ user_profiles"
            desc="회원 1명당 프로필 1개. 컬럼이 너무 많거나 일부만 자주 조회될 때 분리."
            sql="FOREIGN KEY (user_id) REFERENCES users(id) UNIQUE"
          />
          <RelationCard
            type="1 : N"
            color="green"
            example="users → orders"
            desc="한 명이 여러 주문. 가장 흔한 관계. 자식 테이블이 부모의 ID를 가짐."
            sql="orders.user_id → users.id"
          />
          <RelationCard
            type="N : M"
            color="purple"
            example="users ↔ roles"
            desc="한 명이 여러 역할, 한 역할이 여러 명. 중간 테이블이 반드시 필요."
            sql="user_roles(user_id, role_id) — 복합키"
          />
        </div>
      </div>

      {/* 미니 ERD */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4 text-center">
          📊 미니 ERD — 커머스 핵심 4테이블
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ErdTable
            name="users"
            color="blue"
            cols={[
              { name: "id", type: "UUID", pk: true },
              { name: "email", type: "VARCHAR" },
              { name: "name", type: "VARCHAR" },
              { name: "created_at", type: "TIMESTAMP" },
            ]}
          />
          <ErdTable
            name="orders"
            color="green"
            cols={[
              { name: "id", type: "UUID", pk: true },
              { name: "user_id", type: "UUID", fk: "users.id" },
              { name: "status", type: "VARCHAR" },
              { name: "total", type: "DECIMAL" },
              { name: "created_at", type: "TIMESTAMP" },
            ]}
          />
          <ErdTable
            name="order_items"
            color="amber"
            cols={[
              { name: "id", type: "UUID", pk: true },
              { name: "order_id", type: "UUID", fk: "orders.id" },
              { name: "product_id", type: "UUID", fk: "products.id" },
              { name: "qty", type: "INT" },
              { name: "price", type: "DECIMAL" },
            ]}
          />
          <ErdTable
            name="products"
            color="purple"
            cols={[
              { name: "id", type: "UUID", pk: true },
              { name: "name", type: "VARCHAR" },
              { name: "price", type: "DECIMAL" },
              { name: "stock", type: "INT" },
            ]}
          />
        </div>
        <div className="mt-4 text-center text-[11px] text-slate-500">
          users 1 — N orders / orders 1 — N order_items / products 1 — N order_items
          (orders ↔ products 는 order_items가 중간에서 N:M 해소)
        </div>
      </div>
    </section>
  )
}

function PrincipleCard({ n, title, desc, bad, good }: {
  n: string
  title: string
  desc: string
  bad: string
  good: string
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-navy-900/40 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono font-bold text-purple-400 text-xs">{n}</span>
        <span className="text-white font-semibold text-sm">{title}</span>
      </div>
      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{desc}</p>
      <div className="space-y-1.5 text-[11px] font-mono">
        <div className="text-red-400">✗ {bad}</div>
        <div className="text-green-400">✓ {good}</div>
      </div>
    </div>
  )
}

function RelationCard({ type, color, example, desc, sql }: {
  type: string
  color: "blue" | "green" | "purple"
  example: string
  desc: string
  sql: string
}) {
  const colorMap = {
    blue: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    green: "border-green-500/30 bg-green-500/5 text-green-400",
    purple: "border-purple-500/30 bg-purple-500/5 text-purple-400",
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="font-mono font-bold text-lg mb-1">{type}</div>
      <div className="text-white font-mono text-xs mb-2">{example}</div>
      <p className="text-xs text-slate-300 leading-relaxed mb-3">{desc}</p>
      <div className="text-[10px] font-mono text-slate-500 border-t border-slate-700/50 pt-2">
        {sql}
      </div>
    </div>
  )
}

function ErdTable({ name, color, cols }: {
  name: string
  color: "blue" | "green" | "amber" | "purple"
  cols: { name: string; type: string; pk?: boolean; fk?: string }[]
}) {
  const colorMap = {
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    green: "border-green-500/30 bg-green-500/10 text-green-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  }
  return (
    <div className="rounded-xl border border-slate-700/50 bg-navy-900/40 overflow-hidden">
      <div className={`px-3 py-2 border-b font-mono font-bold text-sm text-center ${colorMap[color]}`}>
        {name}
      </div>
      <div className="text-[11px] font-mono">
        {cols.map((col) => (
          <div key={col.name} className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/50 last:border-0">
            <div className="flex items-center gap-1.5">
              {col.pk && <Key size={10} className="text-amber-400" />}
              {col.fk && <Link2 size={10} className="text-cyan-400" />}
              <span className={col.pk ? "text-amber-300 font-bold" : "text-slate-300"}>
                {col.name}
              </span>
            </div>
            <span className="text-slate-500 text-[10px]">{col.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── SQL 기본 ───────────────────────── */

function SqlBasicsSection() {
  return (
    <section className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <CrudCard verb="SELECT" color="green" desc="조회 (Read)" example="SELECT * FROM users" />
        <CrudCard verb="INSERT" color="blue" desc="삽입 (Create)" example="INSERT INTO users (...) VALUES (...)" />
        <CrudCard verb="UPDATE" color="amber" desc="수정 (Update)" example="UPDATE users SET name = '...' WHERE id = 1" />
        <CrudCard verb="DELETE" color="red" desc="삭제 (Delete)" example="DELETE FROM users WHERE id = 1" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            🔍 가장 자주 쓰는 SELECT 패턴
          </h3>
          <CodeBlock
            language="sql"
            code={`-- 1) 조건 필터링 + 정렬 + 페이지네이션
SELECT id, email, name
FROM users
WHERE status = 'active'
  AND created_at >= '2026-01-01'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

-- 2) GROUP BY + 집계 함수
SELECT
  user_id,
  COUNT(*) AS order_count,
  SUM(total) AS total_spent
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING SUM(total) > 100000
ORDER BY total_spent DESC;`}
          />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            🔗 JOIN — 여러 테이블 합치기
          </h3>
          <CodeBlock
            language="sql"
            code={`-- 주문 + 주문자 + 상품명을 한 번에
SELECT
  o.id           AS order_id,
  u.name         AS customer,
  p.name         AS product,
  oi.qty,
  oi.price
FROM orders o
INNER JOIN users u
       ON u.id = o.user_id
INNER JOIN order_items oi
       ON oi.order_id = o.id
INNER JOIN products p
       ON p.id = oi.product_id
WHERE o.created_at >= NOW() - INTERVAL '7 days'
ORDER BY o.created_at DESC;`}
          />
        </div>
      </div>

      {/* JOIN 종류 비교 */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4">
          🎯 JOIN 4가지 — 결과가 달라지는 핵심
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <JoinCard type="INNER JOIN" color="green" desc="양쪽에 모두 있는 행만" example="주문이 있는 회원만" />
          <JoinCard type="LEFT JOIN" color="blue" desc="왼쪽은 다, 오른쪽 없으면 NULL" example="모든 회원 + 주문 (없으면 NULL)" />
          <JoinCard type="RIGHT JOIN" color="amber" desc="오른쪽은 다, 왼쪽 없으면 NULL" example="모든 주문 + 회원 (탈퇴자 포함)" />
          <JoinCard type="FULL OUTER" color="purple" desc="양쪽 다, 매칭 없으면 NULL" example="회원 ∪ 주문 전체" />
        </div>
      </div>

      {/* 인덱스 팁 */}
      <div className="card border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">💡 인덱스 — 느린 SELECT의 해결책</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              <span className="font-mono text-amber-400">WHERE</span>·<span className="font-mono text-amber-400">JOIN ON</span>·<span className="font-mono text-amber-400">ORDER BY</span>에
              자주 쓰는 컬럼은 인덱스를 만들면 조회 속도가 10~100배 빨라집니다. 단, INSERT/UPDATE는 약간 느려지니 남발 금지.
            </p>
            <CodeBlock
              language="sql"
              code={`-- 단일 인덱스
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 복합 인덱스 (자주 함께 검색되는 컬럼)
CREATE INDEX idx_orders_status_created
  ON orders(status, created_at DESC);

-- UNIQUE 인덱스 = 중복 방지 + 인덱스 효과
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- 실행 계획 확인
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 'xxx';`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function CrudCard({ verb, color, desc, example }: {
  verb: string
  color: "green" | "blue" | "amber" | "red"
  desc: string
  example: string
}) {
  const colorMap = {
    green: "border-green-500/30 bg-green-500/5 text-green-400",
    blue: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    amber: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    red: "border-red-500/30 bg-red-500/5 text-red-400",
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="font-mono font-bold text-sm mb-1">{verb}</div>
      <div className="text-xs text-white mb-2">{desc}</div>
      <div className="text-[10px] font-mono text-slate-400 bg-navy-900/40 rounded px-2 py-1.5 border border-slate-700/50">
        {example}
      </div>
    </div>
  )
}

function JoinCard({ type, color, desc, example }: {
  type: string
  color: "green" | "blue" | "amber" | "purple"
  desc: string
  example: string
}) {
  const colorMap = {
    green: "text-green-400 border-green-500/20",
    blue: "text-blue-400 border-blue-500/20",
    amber: "text-amber-400 border-amber-500/20",
    purple: "text-purple-400 border-purple-500/20",
  }
  return (
    <div className={`rounded-xl border p-4 bg-navy-900/40 ${colorMap[color]}`}>
      <div className="font-mono font-bold text-sm mb-2">{type}</div>
      <p className="text-xs text-slate-300 mb-2 leading-relaxed">{desc}</p>
      <div className="text-[11px] text-slate-500 italic border-t border-slate-700/50 pt-2 flex items-start gap-1">
        <CheckCircle2 size={10} className="mt-0.5 flex-shrink-0" />
        <span>{example}</span>
      </div>
    </div>
  )
}

