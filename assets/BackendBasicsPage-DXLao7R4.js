import{f as b,r as h,j as e,A as g}from"./index-Yj6Cpdem.js";import{B as N}from"./Badge-Bnv_LS2w.js";import{C as d}from"./CodeBlock-RNp4h82f.js";import{L as j}from"./layers-DsSd4Izw.js";import{W as u}from"./webhook-CdDR_BLT.js";import{D as f}from"./database-Y9ZqH_fm.js";import{C as v}from"./code-xml-D2_O2lHO.js";import{R as y}from"./refresh-cw-_Ro7xIUr.js";import{A as E}from"./arrow-down-DTCY93Cs.js";import{Z as R}from"./zap-St699Jed.js";import{L as I}from"./link-2-BzsO5qZA.js";import{C as S}from"./circle-check-BpgyfCux.js";import"./check-tUyDdLrP.js";import"./copy-D3JDJFPe.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=b("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=b("Route",[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",key:"1d8sl"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]]),L=[{id:"webhook",label:"Webhook",icon:u,color:"cyan"},{id:"express",label:"Express 라우팅",icon:w,color:"green"},{id:"db",label:"DB 테이블 설계",icon:f,color:"purple"},{id:"sql",label:"SQL 기본",icon:v,color:"amber"}],T={cyan:{active:"bg-cyan-500/15 text-cyan-400 border-cyan-500/40",inactive:"text-slate-400 hover:text-slate-200 border-transparent"},green:{active:"bg-green-500/15 text-green-400 border-green-500/40",inactive:"text-slate-400 hover:text-slate-200 border-transparent"},purple:{active:"bg-purple-500/15 text-purple-400 border-purple-500/40",inactive:"text-slate-400 hover:text-slate-200 border-transparent"},amber:{active:"bg-amber-500/15 text-amber-400 border-amber-500/40",inactive:"text-slate-400 hover:text-slate-200 border-transparent"}};function X(){const[s,t]=h.useState("webhook");return e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(j,{size:20,className:"text-blue-400"}),e.jsx("h1",{className:"text-2xl font-bold text-white",children:"Backend Basics"}),e.jsx(N,{variant:"blue",children:"Foundation"})]}),e.jsx("p",{className:"text-slate-400 text-sm leading-relaxed max-w-3xl",children:"백엔드 시스템을 만들 때 반드시 알아야 하는 4가지 기본기 — Webhook, Express 라우팅, DB 테이블 설계, SQL CRUD. 화려한 기술보다 이 기초가 흔들리지 않아야 LINE·Slack·AI 툴 연동도 명확해집니다."})]}),e.jsx("div",{className:"flex flex-wrap gap-2 border-b border-slate-700/50 pb-3",children:L.map(r=>{const l=r.icon,a=s===r.id,o=T[r.color];return e.jsxs("button",{onClick:()=>t(r.id),className:`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${a?o.active:o.inactive}`,children:[e.jsx(l,{size:14}),e.jsx("span",{children:r.label})]},r.id)})}),s==="webhook"&&e.jsx(C,{}),s==="express"&&e.jsx(O,{}),s==="db"&&e.jsx(_,{}),s==="sql"&&e.jsx(U,{})]})}function C(){return e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"card border-slate-700/50",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(y,{size:16,className:"text-slate-400"}),e.jsx("h3",{className:"text-white font-semibold text-sm",children:"Polling (전통 방식)"})]}),e.jsx("p",{className:"text-xs text-slate-400 leading-relaxed mb-3",children:'클라이언트가 일정 주기로 "새 데이터 있어?" 를 계속 물어보는 방식. 요청 99%는 빈 응답이라 비효율적.'}),e.jsxs("div",{className:"bg-navy-900/50 rounded-lg p-3 text-[11px] font-mono text-slate-400 space-y-0.5 border border-slate-700/50",children:[e.jsx("div",{children:"10:00:00 → GET /messages → 없음"}),e.jsx("div",{children:"10:00:05 → GET /messages → 없음"}),e.jsx("div",{children:"10:00:10 → GET /messages → 1건 ✓"}),e.jsx("div",{children:"10:00:15 → GET /messages → 없음"})]})]}),e.jsxs("div",{className:"card border-cyan-500/30",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(u,{size:16,className:"text-cyan-400"}),e.jsx("h3",{className:"text-white font-semibold text-sm",children:"Webhook (이벤트 방식)"})]}),e.jsxs("p",{className:"text-xs text-slate-400 leading-relaxed mb-3",children:['"이벤트 생기면 네 URL로 알려줄게" — 외부 서비스가 능동적으로',e.jsx("span",{className:"text-cyan-400",children:" POST"})," 요청을 보내줌. 실시간 + 비용 ↓."]}),e.jsxs("div",{className:"bg-navy-900/50 rounded-lg p-3 text-[11px] font-mono text-slate-400 space-y-0.5 border border-slate-700/50",children:[e.jsx("div",{className:"text-slate-600",children:"... (조용함)"}),e.jsx("div",{className:"text-cyan-400",children:"10:00:10 ← POST /webhook (LINE이 알려줌)"}),e.jsx("div",{className:"text-slate-600",children:"... (조용함)"})]})]})]}),e.jsxs("div",{className:"card",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-4 text-center",children:"🔄 Webhook 한 사이클 — LINE 메시지 수신 예시"}),e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-2 sm:gap-3",children:[{label:"사용자가 LINE 입력",color:"text-blue-400 border-blue-500/30 bg-blue-500/10"},{label:"LINE 서버",color:"text-green-400 border-green-500/30 bg-green-500/10"},{label:"POST /webhook",color:"text-cyan-400 border-cyan-500/30 bg-cyan-500/10"},{label:"서명 검증",color:"text-amber-400 border-amber-500/30 bg-amber-500/10"},{label:"로직 처리",color:"text-purple-400 border-purple-500/30 bg-purple-500/10"},{label:"200 OK 응답",color:"text-pink-400 border-pink-500/30 bg-pink-500/10"}].map((s,t,r)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:`px-3 py-1.5 rounded-lg border text-xs font-medium font-mono ${s.color}`,children:s.label}),t<r.length-1&&e.jsx(g,{size:14,className:"text-slate-600"})]},s.label))}),e.jsxs("div",{className:"mt-4 text-center text-[11px] text-slate-500",children:["반드시 3초 안에 ",e.jsx("span",{className:"text-white font-mono",children:"200 OK"}),"을 돌려줘야 LINE이 재시도하지 않습니다. 무거운 작업은 큐에 넣고 먼저 200을 응답하세요."]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3",children:"실전에서 자주 만나는 Webhook"}),e.jsxs("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-3",children:[e.jsx(n,{service:"LINE",desc:"사용자 메시지 / 친구 추가 / 이미지 업로드 이벤트",verify:"X-Line-Signature (HMAC-SHA256)",color:"green"}),e.jsx(n,{service:"Slack",desc:"슬래시 명령어 / 버튼 클릭 / 멘션 이벤트",verify:"X-Slack-Signature + timestamp",color:"purple"}),e.jsx(n,{service:"Stripe",desc:"결제 성공 / 환불 / 구독 갱신 알림",verify:"Stripe-Signature (whsec_...)",color:"cyan"}),e.jsx(n,{service:"GitHub",desc:"push / PR / Issue 생성 이벤트",verify:"X-Hub-Signature-256",color:"amber"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3",children:"🔐 Webhook 보안 — 서명 검증 필수"}),e.jsx("p",{className:"text-xs text-slate-400 mb-3 leading-relaxed",children:'Webhook URL이 공개되어 있으니 누구나 가짜 요청을 보낼 수 있습니다. 헤더의 서명을 시크릿 키로 검증해서 "진짜 LINE이 보낸 게 맞는지" 확인하세요.'}),e.jsx(d,{language:"typescript",code:`import crypto from "crypto"
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
})`})]})]})}function n({service:s,desc:t,verify:r,color:l}){const a={green:"border-green-500/20 bg-green-500/5",purple:"border-purple-500/20 bg-purple-500/5",cyan:"border-cyan-500/20 bg-cyan-500/5",amber:"border-amber-500/20 bg-amber-500/5"},o={green:"text-green-400",purple:"text-purple-400",cyan:"text-cyan-400",amber:"text-amber-400"};return e.jsxs("div",{className:`rounded-xl border p-4 ${a[l]}`,children:[e.jsx("div",{className:`font-bold text-sm mb-2 ${o[l]}`,children:s}),e.jsx("p",{className:"text-xs text-slate-300 leading-relaxed mb-2",children:t}),e.jsxs("div",{className:"text-[10px] text-slate-500 font-mono border-t border-slate-700/50 pt-2 mt-2",children:["🔐 ",r]})]})}function O(){return e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"card",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-3",children:'🛣️ 라우팅이란 — "어떤 URL이 오면 어떤 함수를 실행할지" 매핑'}),e.jsxs("p",{className:"text-xs text-slate-400 leading-relaxed mb-4",children:["Express는 ",e.jsx("span",{className:"text-green-400 font-mono",children:"app.METHOD(path, handler)"})," 형태로 요청을 함수에 연결합니다. 한 요청이 미들웨어 → 컨트롤러 → 응답 순서로 흐르는 게 핵심."]}),e.jsx(d,{language:"typescript",code:`import express from "express"

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

app.listen(3000)`})]}),e.jsxs("div",{className:"card border-green-500/20",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-4 text-center",children:"🔗 미들웨어 체인 — 한 요청이 거치는 순서"}),e.jsx("div",{className:"flex flex-col items-center gap-2",children:[{label:"Request 도착",color:"bg-blue-500/5 border-blue-500/20",note:"POST /orders"},{label:"express.json()",color:"bg-slate-500/5 border-slate-500/20",note:"JSON body 파싱"},{label:"cors()",color:"bg-cyan-500/5 border-cyan-500/20",note:"CORS 헤더 추가"},{label:"authMiddleware",color:"bg-amber-500/5 border-amber-500/20",note:"JWT 검증 → req.user 주입"},{label:"rateLimitMiddleware",color:"bg-orange-500/5 border-orange-500/20",note:"분당 요청 수 제한"},{label:"Controller",color:"bg-green-500/5 border-green-500/20",note:"실제 비즈니스 로직"},{label:"errorHandler",color:"bg-red-500/5 border-red-500/20",note:"에러는 마지막 미들웨어로"},{label:"Response 전송",color:"bg-pink-500/5 border-pink-500/20",note:"201 Created + JSON"}].map((s,t,r)=>e.jsxs("div",{className:"w-full max-w-md",children:[e.jsxs("div",{className:`flex items-center justify-between rounded-lg border px-3 py-2 ${s.color}`,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-[10px] font-mono text-slate-500 w-5",children:String(t+1).padStart(2,"0")}),e.jsx("span",{className:"font-mono text-xs text-white",children:s.label})]}),e.jsx("span",{className:"text-[10px] text-slate-400",children:s.note})]}),t<r.length-1&&e.jsx("div",{className:"flex justify-center py-0.5",children:e.jsx(E,{size:12,className:"text-slate-600"})})]},s.label))})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",children:"📁 라우터 분리 — 규모가 커지면 필수"}),e.jsx(d,{language:"typescript",code:`// routes/users.ts
import { Router } from "express"
const router = Router()

router.get("/", listUsers)
router.post("/", createUser)
router.get("/:id", getUser)
export default router

// app.ts
import usersRouter from "./routes/users"
app.use("/api/users", usersRouter)
// → /api/users, /api/users/:id 로 자동 연결`})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",children:"⚠️ 에러 처리 미들웨어 — 4개 인자가 시그니처"}),e.jsx(d,{language:"typescript",code:`// 모든 라우트 등록 후 맨 마지막에
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
})`})]})]})]})}function _(){return e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"card border-purple-500/20",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-3",children:"🧱 좋은 테이블 설계의 3원칙"}),e.jsxs("div",{className:"grid sm:grid-cols-3 gap-3",children:[e.jsx(m,{n:"1NF",title:"원자값 유지",desc:"한 셀에 값 하나만. 콤마로 여러 값 넣지 않기.",bad:'tags: "node,express,jwt"',good:"별도 user_tags 테이블"}),e.jsx(m,{n:"2NF",title:"부분 종속 제거",desc:"복합키의 일부에만 의존하는 컬럼을 분리.",bad:"order_items에 product_name 중복",good:"products 테이블에서 JOIN"}),e.jsx(m,{n:"3NF",title:"이행 종속 제거",desc:"A→B→C 같은 간접 의존을 분리.",bad:"users에 country_name 저장",good:"countries 테이블 + country_id"})]})]}),e.jsxs("div",{className:"card",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-4",children:"🔗 테이블 관계 — 3가지 패턴만 알면 90% 끝"}),e.jsxs("div",{className:"grid md:grid-cols-3 gap-4",children:[e.jsx(p,{type:"1 : 1",color:"blue",example:"users ↔ user_profiles",desc:"회원 1명당 프로필 1개. 컬럼이 너무 많거나 일부만 자주 조회될 때 분리.",sql:"FOREIGN KEY (user_id) REFERENCES users(id) UNIQUE"}),e.jsx(p,{type:"1 : N",color:"green",example:"users → orders",desc:"한 명이 여러 주문. 가장 흔한 관계. 자식 테이블이 부모의 ID를 가짐.",sql:"orders.user_id → users.id"}),e.jsx(p,{type:"N : M",color:"purple",example:"users ↔ roles",desc:"한 명이 여러 역할, 한 역할이 여러 명. 중간 테이블이 반드시 필요.",sql:"user_roles(user_id, role_id) — 복합키"})]})]}),e.jsxs("div",{className:"card",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-4 text-center",children:"📊 미니 ERD — 커머스 핵심 4테이블"}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",children:[e.jsx(c,{name:"users",color:"blue",cols:[{name:"id",type:"UUID",pk:!0},{name:"email",type:"VARCHAR"},{name:"name",type:"VARCHAR"},{name:"created_at",type:"TIMESTAMP"}]}),e.jsx(c,{name:"orders",color:"green",cols:[{name:"id",type:"UUID",pk:!0},{name:"user_id",type:"UUID",fk:"users.id"},{name:"status",type:"VARCHAR"},{name:"total",type:"DECIMAL"},{name:"created_at",type:"TIMESTAMP"}]}),e.jsx(c,{name:"order_items",color:"amber",cols:[{name:"id",type:"UUID",pk:!0},{name:"order_id",type:"UUID",fk:"orders.id"},{name:"product_id",type:"UUID",fk:"products.id"},{name:"qty",type:"INT"},{name:"price",type:"DECIMAL"}]}),e.jsx(c,{name:"products",color:"purple",cols:[{name:"id",type:"UUID",pk:!0},{name:"name",type:"VARCHAR"},{name:"price",type:"DECIMAL"},{name:"stock",type:"INT"}]})]}),e.jsx("div",{className:"mt-4 text-center text-[11px] text-slate-500",children:"users 1 — N orders / orders 1 — N order_items / products 1 — N order_items (orders ↔ products 는 order_items가 중간에서 N:M 해소)"})]})]})}function m({n:s,title:t,desc:r,bad:l,good:a}){return e.jsxs("div",{className:"rounded-xl border border-slate-700/50 bg-navy-900/40 p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx("span",{className:"font-mono font-bold text-purple-400 text-xs",children:s}),e.jsx("span",{className:"text-white font-semibold text-sm",children:t})]}),e.jsx("p",{className:"text-xs text-slate-400 mb-3 leading-relaxed",children:r}),e.jsxs("div",{className:"space-y-1.5 text-[11px] font-mono",children:[e.jsxs("div",{className:"text-red-400",children:["✗ ",l]}),e.jsxs("div",{className:"text-green-400",children:["✓ ",a]})]})]})}function p({type:s,color:t,example:r,desc:l,sql:a}){const o={blue:"border-blue-500/30 bg-blue-500/5 text-blue-400",green:"border-green-500/30 bg-green-500/5 text-green-400",purple:"border-purple-500/30 bg-purple-500/5 text-purple-400"};return e.jsxs("div",{className:`rounded-xl border p-4 ${o[t]}`,children:[e.jsx("div",{className:"font-mono font-bold text-lg mb-1",children:s}),e.jsx("div",{className:"text-white font-mono text-xs mb-2",children:r}),e.jsx("p",{className:"text-xs text-slate-300 leading-relaxed mb-3",children:l}),e.jsx("div",{className:"text-[10px] font-mono text-slate-500 border-t border-slate-700/50 pt-2",children:a})]})}function c({name:s,color:t,cols:r}){const l={blue:"border-blue-500/30 bg-blue-500/10 text-blue-400",green:"border-green-500/30 bg-green-500/10 text-green-400",amber:"border-amber-500/30 bg-amber-500/10 text-amber-400",purple:"border-purple-500/30 bg-purple-500/10 text-purple-400"};return e.jsxs("div",{className:"rounded-xl border border-slate-700/50 bg-navy-900/40 overflow-hidden",children:[e.jsx("div",{className:`px-3 py-2 border-b font-mono font-bold text-sm text-center ${l[t]}`,children:s}),e.jsx("div",{className:"text-[11px] font-mono",children:r.map(a=>e.jsxs("div",{className:"flex items-center justify-between px-3 py-1.5 border-b border-slate-800/50 last:border-0",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[a.pk&&e.jsx(k,{size:10,className:"text-amber-400"}),a.fk&&e.jsx(I,{size:10,className:"text-cyan-400"}),e.jsx("span",{className:a.pk?"text-amber-300 font-bold":"text-slate-300",children:a.name})]}),e.jsx("span",{className:"text-slate-500 text-[10px]",children:a.type})]},a.name))})]})}function U(){return e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-3",children:[e.jsx(i,{verb:"SELECT",color:"green",desc:"조회 (Read)",example:"SELECT * FROM users"}),e.jsx(i,{verb:"INSERT",color:"blue",desc:"삽입 (Create)",example:"INSERT INTO users (...) VALUES (...)"}),e.jsx(i,{verb:"UPDATE",color:"amber",desc:"수정 (Update)",example:"UPDATE users SET name = '...' WHERE id = 1"}),e.jsx(i,{verb:"DELETE",color:"red",desc:"삭제 (Delete)",example:"DELETE FROM users WHERE id = 1"})]}),e.jsxs("div",{className:"grid lg:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",children:"🔍 가장 자주 쓰는 SELECT 패턴"}),e.jsx(d,{language:"sql",code:`-- 1) 조건 필터링 + 정렬 + 페이지네이션
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
ORDER BY total_spent DESC;`})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",children:"🔗 JOIN — 여러 테이블 합치기"}),e.jsx(d,{language:"sql",code:`-- 주문 + 주문자 + 상품명을 한 번에
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
ORDER BY o.created_at DESC;`})]})]}),e.jsxs("div",{className:"card",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-4",children:"🎯 JOIN 4가지 — 결과가 달라지는 핵심"}),e.jsxs("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-3",children:[e.jsx(x,{type:"INNER JOIN",color:"green",desc:"양쪽에 모두 있는 행만",example:"주문이 있는 회원만"}),e.jsx(x,{type:"LEFT JOIN",color:"blue",desc:"왼쪽은 다, 오른쪽 없으면 NULL",example:"모든 회원 + 주문 (없으면 NULL)"}),e.jsx(x,{type:"RIGHT JOIN",color:"amber",desc:"오른쪽은 다, 왼쪽 없으면 NULL",example:"모든 주문 + 회원 (탈퇴자 포함)"}),e.jsx(x,{type:"FULL OUTER",color:"purple",desc:"양쪽 다, 매칭 없으면 NULL",example:"회원 ∪ 주문 전체"})]})]}),e.jsx("div",{className:"card border-amber-500/20",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0",children:e.jsx(R,{size:18,className:"text-amber-400"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold text-sm mb-2",children:"💡 인덱스 — 느린 SELECT의 해결책"}),e.jsxs("p",{className:"text-xs text-slate-300 leading-relaxed mb-3",children:[e.jsx("span",{className:"font-mono text-amber-400",children:"WHERE"}),"·",e.jsx("span",{className:"font-mono text-amber-400",children:"JOIN ON"}),"·",e.jsx("span",{className:"font-mono text-amber-400",children:"ORDER BY"}),"에 자주 쓰는 컬럼은 인덱스를 만들면 조회 속도가 10~100배 빨라집니다. 단, INSERT/UPDATE는 약간 느려지니 남발 금지."]}),e.jsx(d,{language:"sql",code:`-- 단일 인덱스
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 복합 인덱스 (자주 함께 검색되는 컬럼)
CREATE INDEX idx_orders_status_created
  ON orders(status, created_at DESC);

-- UNIQUE 인덱스 = 중복 방지 + 인덱스 효과
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- 실행 계획 확인
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 'xxx';`})]})]})})]})}function i({verb:s,color:t,desc:r,example:l}){const a={green:"border-green-500/30 bg-green-500/5 text-green-400",blue:"border-blue-500/30 bg-blue-500/5 text-blue-400",amber:"border-amber-500/30 bg-amber-500/5 text-amber-400",red:"border-red-500/30 bg-red-500/5 text-red-400"};return e.jsxs("div",{className:`rounded-xl border p-4 ${a[t]}`,children:[e.jsx("div",{className:"font-mono font-bold text-sm mb-1",children:s}),e.jsx("div",{className:"text-xs text-white mb-2",children:r}),e.jsx("div",{className:"text-[10px] font-mono text-slate-400 bg-navy-900/40 rounded px-2 py-1.5 border border-slate-700/50",children:l})]})}function x({type:s,color:t,desc:r,example:l}){const a={green:"text-green-400 border-green-500/20",blue:"text-blue-400 border-blue-500/20",amber:"text-amber-400 border-amber-500/20",purple:"text-purple-400 border-purple-500/20"};return e.jsxs("div",{className:`rounded-xl border p-4 bg-navy-900/40 ${a[t]}`,children:[e.jsx("div",{className:"font-mono font-bold text-sm mb-2",children:s}),e.jsx("p",{className:"text-xs text-slate-300 mb-2 leading-relaxed",children:r}),e.jsxs("div",{className:"text-[11px] text-slate-500 italic border-t border-slate-700/50 pt-2 flex items-start gap-1",children:[e.jsx(S,{size:10,className:"mt-0.5 flex-shrink-0"}),e.jsx("span",{children:l})]})]})}export{X as BackendBasicsPage};
