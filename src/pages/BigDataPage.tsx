import { useState } from "react"
import {
  Database, Server, Search, BarChart3, Boxes, Cpu, Layers,
  ArrowDown, ArrowRight, ChevronRight, Filter, HardDrive, Zap,
  Waves, Brain, Shuffle, TrendingUp, Users, Film, Workflow,
  Eye, ThumbsUp, Clock, Gauge, ListOrdered, Repeat, BookOpen,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"

/* ─────────────────────────────  데이터  ───────────────────────────── */

type Stage = {
  n: number
  icon: React.ElementType
  title: string
  en: string
  desc: string
  tools: string
  color: string
  border: string
  bg: string
}

// 빅데이터 처리 5단계 — 첫 번째 캡처(빅데이터분석)의 파이프라인을 정리
const pipeline: Stage[] = [
  {
    n: 1,
    icon: Filter,
    title: "수집 (Ingestion)",
    en: "Data Collection",
    desc: "앱 로그·DB 변경·클릭스트림·IoT 센서 등 흩어진 소스에서 데이터를 끌어모은다. 실시간은 메시지 큐로 흘려보내고, 대량 적재는 배치로 가져온다.",
    tools: "Kafka · Logstash · Flume · CDC(Debezium)",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    n: 2,
    icon: HardDrive,
    title: "저장 (Storage)",
    en: "Data Lake / Warehouse",
    desc: "가공 전 원본(raw)은 값싼 Data Lake에 그대로 쌓고, 분석용으로 정제·구조화된 데이터는 Data Warehouse에 적재한다. '일단 다 저장, 나중에 가공' 전략.",
    tools: "S3 · HDFS · Snowflake · BigQuery",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
  },
  {
    n: 3,
    icon: Cpu,
    title: "처리 (Processing)",
    en: "Batch + Stream",
    desc: "쌓인 데이터를 분산 엔진으로 변환·집계한다. 정해진 주기로 대량 처리하는 배치와, 들어오는 즉시 처리하는 스트림을 함께 운영한다.",
    tools: "Spark(배치) · Flink(스트림) · MapReduce",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
  },
  {
    n: 4,
    icon: Brain,
    title: "분석 (Analytics)",
    en: "Query / ML",
    desc: "처리된 데이터로 통계 집계, 검색 색인, 머신러닝 모델 학습·추론을 수행한다. 추천·이상탐지·예측이 여기서 만들어진다.",
    tools: "Elasticsearch · Hive · Spark MLlib · TensorFlow",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    n: 5,
    icon: BarChart3,
    title: "활용 (Serving)",
    en: "Visualization / API",
    desc: "분석 결과를 API로 서비스에 돌려주거나 대시보드로 시각화한다. 추천 영상 노출, 실시간 지표, 리포트가 여기서 사용자에게 닿는다.",
    tools: "API 서버 · Superset · Grafana · Looker",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
]

// 유튜브 추천 알고리즘 — 두 번째 캡처(YouTube Recommendation) 정리
type RecStep = {
  n: number
  icon: React.ElementType
  title: string
  desc: string
  badge: string
  color: string
  border: string
  bg: string
}

const recFlow: RecStep[] = [
  {
    n: 1,
    icon: Eye,
    title: "데이터 소스",
    desc: "시청 기록·검색어·좋아요·구독·시청 시간 등 사용자 행동 로그를 수집한다.",
    badge: "수집",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    n: 2,
    icon: Filter,
    title: "데이터 전처리",
    desc: "로그를 정제하고 사용자·영상을 숫자 벡터(임베딩)로 변환해 모델이 먹을 수 있는 피처로 만든다.",
    badge: "전처리",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
  },
  {
    n: 3,
    icon: Shuffle,
    title: "후보 생성 (Candidate Generation)",
    desc: "수백만 개 영상 중 이 사용자가 볼 법한 수백 개를 빠르게 추린다. 협업 필터링 + 딥러닝(DNN)으로 1차 필터링.",
    badge: "1단계",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    n: 4,
    icon: ListOrdered,
    title: "랭킹 (Ranking)",
    desc: "추려진 후보를 정밀 모델(DNN)로 점수화해 순서를 매긴다. 클릭·시청시간 예측치를 종합해 최종 노출 순서를 결정.",
    badge: "2단계",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
  {
    n: 5,
    icon: Film,
    title: "추천 노출 (Serving)",
    desc: "상위 영상을 홈·다음 추천에 노출한다. 사용자의 반응(클릭/이탈)이 다시 1번 로그로 쌓여 모델이 계속 학습한다.",
    badge: "활용",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
]

// 핵심 이론 — 클릭 시 펼쳐지는 아코디언
type Concept = {
  id: string
  icon: React.ElementType
  title: string
  short: string
  detail: React.ReactNode
  color: string
  border: string
  bg: string
}

const concepts: Concept[] = [
  {
    id: "v",
    icon: Gauge,
    title: "빅데이터의 5V",
    short: "데이터가 '크다'를 정의하는 5가지 축",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    detail: (
      <ul className="space-y-1.5">
        <li><b className="text-blue-300">Volume(양)</b> — TB~PB 규모. 한 대 서버로 못 담아 분산 저장이 필요.</li>
        <li><b className="text-blue-300">Velocity(속도)</b> — 초당 수만 건씩 쏟아짐. 실시간 처리 요구.</li>
        <li><b className="text-blue-300">Variety(다양성)</b> — 정형(테이블)·반정형(JSON/로그)·비정형(이미지/영상)이 섞임.</li>
        <li><b className="text-blue-300">Veracity(정확성)</b> — 노이즈·결측·중복이 많아 신뢰도 관리가 필요.</li>
        <li><b className="text-blue-300">Value(가치)</b> — 결국 비즈니스 가치를 뽑아내야 의미가 있음.</li>
      </ul>
    ),
  },
  {
    id: "batch-stream",
    icon: Waves,
    title: "배치 처리 vs 스트림 처리",
    short: "모아서 한 번에 vs 들어오는 즉시",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    detail: (
      <CompareTable
        a="배치 (Batch)"
        b="스트림 (Stream)"
        rows={[
          ["처리 단위", "일정 기간 모은 대량", "건건이 도착 즉시"],
          ["지연", "분~시간 (느림, 정확)", "ms~초 (빠름)"],
          ["대표 도구", "Spark · Hadoop", "Flink · Kafka Streams"],
          ["예시", "일 매출 집계, 모델 학습", "실시간 이상탐지, 알림"],
        ]}
      />
    ),
  },
  {
    id: "lambda-kappa",
    icon: Workflow,
    title: "Lambda vs Kappa 아키텍처",
    short: "배치+스트림 두 갈래 vs 스트림 한 갈래",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    detail: (
      <div className="space-y-2">
        <p><b className="text-purple-300">Lambda</b> — 정확한 배치 레이어 + 빠른 스피드(스트림) 레이어를 동시에 두고 결과를 합친다. 정확성과 실시간성을 둘 다 잡지만 코드가 두 벌이라 무겁다.</p>
        <p><b className="text-purple-300">Kappa</b> — 모든 걸 스트림 하나로 처리하고, 재계산이 필요하면 로그를 처음부터 다시 흘린다. 단순하지만 스트림 엔진 의존도가 크다.</p>
      </div>
    ),
  },
  {
    id: "lake-warehouse",
    icon: HardDrive,
    title: "Data Lake vs Warehouse vs Lakehouse",
    short: "원본 호수 · 정제 창고 · 둘의 결합",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    detail: (
      <CompareTable
        a="Data Lake"
        b="Data Warehouse"
        rows={[
          ["저장 형태", "원본 그대로(raw)", "정제·구조화"],
          ["스키마", "읽을 때 정의 (ELT)", "쓸 때 정의 (ETL)"],
          ["비용/유연성", "싸고 유연", "비싸고 빠른 분석"],
          ["대표", "S3 · HDFS", "Snowflake · BigQuery"],
        ]}
        note="Lakehouse = 호수의 저렴함 + 창고의 분석 성능을 합친 최신 절충안 (Delta Lake · Iceberg)."
      />
    ),
  },
  {
    id: "etl-elt",
    icon: Repeat,
    title: "ETL vs ELT",
    short: "변환 후 적재 vs 적재 후 변환",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    detail: (
      <div className="space-y-2">
        <p><b className="text-amber-300">ETL</b> (Extract→Transform→Load) — 먼저 가공한 뒤 창고에 넣는다. 전통적 방식, 저장 비용이 비쌀 때 유리.</p>
        <p><b className="text-amber-300">ELT</b> (Extract→Load→Transform) — 일단 Lake에 다 넣고, 필요할 때 SQL로 변환한다. 클라우드·Lake 시대의 기본.</p>
      </div>
    ),
  },
  {
    id: "oltp-olap",
    icon: Database,
    title: "OLTP vs OLAP",
    short: "거래 처리용 DB vs 분석용 DB",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    detail: (
      <CompareTable
        a="OLTP"
        b="OLAP"
        rows={[
          ["목적", "실시간 거래(주문/결제)", "대량 집계·분석"],
          ["쿼리", "작고 잦은 읽기/쓰기", "크고 무거운 집계"],
          ["저장", "행(row) 기반", "열(column) 기반"],
          ["예시", "PostgreSQL · MySQL", "BigQuery · ClickHouse"],
        ]}
      />
    ),
  },
  {
    id: "distributed",
    icon: Boxes,
    title: "분산 처리 (MapReduce · Spark)",
    short: "한 대로 못 하면 여러 대로 쪼갠다",
    color: "text-pink-400",
    border: "border-pink-500/30",
    bg: "bg-pink-500/10",
    detail: (
      <div className="space-y-2">
        <p><b className="text-pink-300">MapReduce</b> — 데이터를 잘게 나눠(Map) 여러 노드가 동시에 처리하고, 결과를 모아(Reduce) 합치는 분산 처리의 원조 개념.</p>
        <p><b className="text-pink-300">Spark</b> — 중간 결과를 디스크 대신 메모리에 올려 MapReduce보다 수십 배 빠르다. 배치·스트림·ML·SQL을 한 엔진에서 처리해 사실상 표준.</p>
        <p className="text-slate-500">HDFS/S3에 저장 → Spark/Flink로 처리 → 결과를 DW/ES로 → 서비스가 활용, 이 흐름이 빅데이터의 뼈대다.</p>
      </div>
    ),
  },
  {
    id: "recsys",
    icon: TrendingUp,
    title: "추천 시스템의 종류",
    short: "협업 필터링 · 콘텐츠 기반 · 하이브리드",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    detail: (
      <div className="space-y-2">
        <p><b className="text-purple-300">협업 필터링(Collaborative Filtering)</b> — "나와 취향이 비슷한 사람이 본 것"을 추천. 행동 데이터만 있으면 됨.</p>
        <p><b className="text-purple-300">콘텐츠 기반(Content-based)</b> — "내가 본 것과 비슷한 콘텐츠"를 추천. 아이템의 특성(태그/임베딩)을 사용.</p>
        <p><b className="text-purple-300">하이브리드</b> — 둘을 결합. 유튜브는 여기에 딥러닝을 더해 <b>후보 생성 → 랭킹</b> 2단계로 운영한다(위 다이어그램 참고).</p>
      </div>
    ),
  },
]

// 빅데이터 기술 스택
type Tool = {
  name: string
  role: string
  cat: string
  color: string
}

const tools: Tool[] = [
  { name: "Apache Kafka", role: "실시간 데이터 수집·스트리밍 백본", cat: "수집", color: "blue" },
  { name: "Apache Spark", role: "대규모 배치·ML 분산 처리 엔진", cat: "처리", color: "amber" },
  { name: "Apache Flink", role: "저지연 실시간 스트림 처리", cat: "처리", color: "orange" },
  { name: "Hadoop / HDFS", role: "분산 파일 저장 + MapReduce 원조", cat: "저장", color: "slate" },
  { name: "S3 / Data Lake", role: "원본(raw) 데이터 저렴한 보관", cat: "저장", color: "cyan" },
  { name: "Snowflake / BigQuery", role: "분석용 데이터 웨어하우스(OLAP)", cat: "저장", color: "purple" },
  { name: "Apache Airflow", role: "파이프라인 스케줄링·오케스트레이션", cat: "운영", color: "green" },
  { name: "Elasticsearch", role: "검색·로그 분석 색인", cat: "분석", color: "pink" },
  { name: "Superset / Grafana", role: "대시보드 시각화·모니터링", cat: "활용", color: "red" },
]

const toolColor: Record<string, string> = {
  blue: "border-blue-500/30 bg-blue-500/5 text-blue-400",
  amber: "border-amber-500/30 bg-amber-500/5 text-amber-400",
  orange: "border-orange-500/30 bg-orange-500/5 text-orange-400",
  slate: "border-slate-500/30 bg-slate-500/5 text-slate-400",
  cyan: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400",
  purple: "border-purple-500/30 bg-purple-500/5 text-purple-400",
  green: "border-green-500/30 bg-green-500/5 text-green-400",
  pink: "border-pink-500/30 bg-pink-500/5 text-pink-400",
  red: "border-red-500/30 bg-red-500/5 text-red-400",
}

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

function TierArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-1">
      <ArrowDown size={16} className="text-slate-600" />
      {label && <span className="text-[10px] text-slate-500 mt-0.5">{label}</span>}
    </div>
  )
}

function PipelineDiagram() {
  return (
    <div className="space-y-0">
      <Tier label="데이터 소스">
        <NodeBox icon={Server} label="앱 / 서버 로그" sub="이벤트 · 클릭스트림" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
        <NodeBox icon={Database} label="운영 DB" sub="CDC 변경 캡처" color="text-cyan-400 border-cyan-500/30 bg-cyan-500/10" />
        <NodeBox icon={Users} label="사용자 행동" sub="시청 · 검색 · 좋아요" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
      </Tier>
      <TierArrow label="수집" />
      <Tier label="수집 — 스트리밍 백본">
        <NodeBox icon={Boxes} label="Kafka" sub="실시간 이벤트 버스" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
      </Tier>
      <TierArrow label="저장" />
      <Tier label="저장">
        <NodeBox icon={HardDrive} label="Data Lake" sub="S3 · 원본(raw)" color="text-cyan-400 border-cyan-500/30 bg-cyan-500/10" />
        <NodeBox icon={Database} label="Data Warehouse" sub="정제 · 분석용" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
      </Tier>
      <TierArrow label="처리" />
      <Tier label="처리 — 배치 + 스트림 (Lambda)">
        <NodeBox icon={Cpu} label="Spark" sub="배치 · 대량 집계 · ML" color="text-amber-400 border-amber-500/30 bg-amber-500/10" />
        <NodeBox icon={Waves} label="Flink" sub="실시간 스트림" color="text-orange-400 border-orange-500/30 bg-orange-500/10" />
      </Tier>
      <TierArrow label="분석" />
      <Tier label="분석 · 색인">
        <NodeBox icon={Search} label="Elasticsearch" sub="검색 · 로그 분석" color="text-pink-400 border-pink-500/30 bg-pink-500/10" />
        <NodeBox icon={Brain} label="ML 모델" sub="추천 · 예측 학습" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
      </Tier>
      <TierArrow label="활용" />
      <Tier label="활용 — 서비스 / 시각화">
        <NodeBox icon={Server} label="API 서버" sub="추천 결과 서빙" color="text-green-400 border-green-500/30 bg-green-500/10" />
        <NodeBox icon={BarChart3} label="대시보드" sub="Superset · Grafana" color="text-red-400 border-red-500/30 bg-red-500/10" />
      </Tier>
    </div>
  )
}

function RecDiagram() {
  return (
    <div className="space-y-0">
      <Tier label="① 데이터 소스 (행동 로그)">
        <NodeBox icon={Eye} label="시청 기록" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
        <NodeBox icon={Search} label="검색어" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
        <NodeBox icon={ThumbsUp} label="좋아요 · 구독" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
        <NodeBox icon={Clock} label="시청 시간" color="text-blue-400 border-blue-500/30 bg-blue-500/10" />
      </Tier>
      <TierArrow label="전처리 · 임베딩" />
      <Tier label="② 데이터 전처리">
        <NodeBox icon={Filter} label="정제 · 피처 추출" sub="사용자/영상 → 벡터" color="text-cyan-400 border-cyan-500/30 bg-cyan-500/10" />
      </Tier>
      <TierArrow label="1단계" />
      <Tier label="③ 후보 생성 (Candidate Generation)">
        <NodeBox icon={Shuffle} label="협업 필터링" sub="비슷한 사용자 기반" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
        <NodeBox icon={Brain} label="딥러닝(DNN)" sub="수백만 → 수백 개" color="text-purple-400 border-purple-500/30 bg-purple-500/10" />
      </Tier>
      <TierArrow label="2단계" />
      <Tier label="④ 랭킹 (Ranking)">
        <NodeBox icon={ListOrdered} label="정밀 점수화" sub="클릭·시청시간 예측 → 정렬" color="text-amber-400 border-amber-500/30 bg-amber-500/10" />
      </Tier>
      <TierArrow label="노출" />
      <Tier label="⑤ 추천 노출 (Serving)">
        <NodeBox icon={Film} label="홈 · 다음 추천" sub="상위 영상 표시" color="text-green-400 border-green-500/30 bg-green-500/10" />
      </Tier>
      <div className="flex justify-center pt-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Repeat size={13} className="text-green-400" />
          <span>사용자 반응(클릭/이탈)이 다시 ①로 쌓여 모델이 계속 학습하는 피드백 루프</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────  비교 표 헬퍼  ───────────────────────────── */

function CompareTable({ a, b, rows, note }: {
  a: string
  b: string
  rows: [string, string, string][]
  note?: string
}) {
  return (
    <div>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-1.5 pr-3 text-[10px] text-slate-500 font-medium" />
              <th className="text-left py-1.5 px-3 text-slate-300 font-semibold">{a}</th>
              <th className="text-left py-1.5 px-3 text-slate-300 font-semibold">{b}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-slate-800/50 align-top">
                <td className="py-1.5 pr-3 text-slate-500 whitespace-nowrap">{r[0]}</td>
                <td className="py-1.5 px-3 text-slate-300">{r[1]}</td>
                <td className="py-1.5 px-3 text-slate-300">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{note}</p>}
    </div>
  )
}

/* ─────────────────────────────  페이지  ───────────────────────────── */

export function BigDataPage() {
  const [tab, setTab] = useState<"pipeline" | "rec">("pipeline")
  const [openConcept, setOpenConcept] = useState<string | null>("v")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* 헤더 */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Database size={20} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">빅데이터 아키텍처 & 추천 시스템</h1>
          <Badge variant="cyan">Learning</Badge>
        </div>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          데이터가 <span className="text-cyan-300">수집 → 저장 → 처리 → 분석 → 활용</span>으로 흐르는 빅데이터 파이프라인 전체 구조와,
          그 대표 사례인 <span className="text-cyan-300">유튜브 추천 알고리즘(후보 생성 → 랭킹 2단계)</span>을 시각화했습니다.
          아래에 나중에 빅데이터를 다룰 때 필요한 핵심 이론을 알기 쉽게 정리해 두었습니다.
        </p>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 border border-slate-700/50 rounded-md px-2 py-1">
            <BookOpen size={12} className="text-cyan-400" />
            이 페이지는 학습·정리용 개념 자료입니다 (실제 구현이 아닌 이론·아키텍처 설명).
          </span>
        </div>
      </div>

      {/* 1. 빅데이터 5단계 파이프라인 */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Workflow size={16} className="text-cyan-400" />
          <h2 className="text-base font-semibold text-white">빅데이터 처리 5단계</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          흩어진 데이터가 가치 있는 결과로 바뀌기까지 거치는 다섯 단계. 각 단계마다 쓰는 도구가 다릅니다.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pipeline.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.n} className="relative">
                <div className={`rounded-xl border p-4 h-full ${s.border} ${s.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${s.border} bg-navy-900/50`}>
                      <Icon size={14} className={s.color} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">STEP {s.n}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{s.title}</div>
                  <div className={`text-[10px] font-mono mb-2 ${s.color}`}>{s.en}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{s.desc}</p>
                  <div className="text-[10px] text-slate-500 border-t border-slate-700/40 pt-2 leading-relaxed">
                    {s.tools}
                  </div>
                </div>
                {i < pipeline.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                    <ArrowRight size={14} className="text-slate-600" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. 아키텍처 구성도 (탭) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Boxes size={16} className="text-orange-400" />
          <h2 className="text-base font-semibold text-white">아키텍처 구성도</h2>
        </div>
        <div className="flex gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setTab("pipeline")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              tab === "pipeline"
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            빅데이터 파이프라인
          </button>
          <button
            onClick={() => setTab("rec")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              tab === "rec"
                ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                : "border-slate-600/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            유튜브 추천 알고리즘
          </button>
        </div>
        <div className="card">
          {tab === "pipeline" ? <PipelineDiagram /> : <RecDiagram />}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-500 border-t border-slate-700/50 pt-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" /> 수집 / 소스</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> 저장 / 전처리</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" /> 처리</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> 분석 / 모델</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" /> 활용 / 서빙</span>
          </div>
        </div>
      </section>

      {/* 3. 유튜브 추천 알고리즘 단계 설명 */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-purple-400" />
          <h2 className="text-base font-semibold text-white">유튜브 추천 알고리즘 — 단계별</h2>
          <Badge variant="purple">2-Stage</Badge>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          수백만 개 영상을 한 번에 정밀 평가하는 건 불가능합니다. 그래서{" "}
          <span className="text-purple-300">①후보 생성(빠르게 추리기) → ②랭킹(정밀 정렬)</span> 2단계로 나눠 처리합니다.
        </p>
        <div className="space-y-2">
          {recFlow.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.n} className={`rounded-lg border p-4 ${s.border} ${s.bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${s.border} bg-navy-900/50`}>
                    <Icon size={15} className={s.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-600 font-mono">0{s.n}</span>
                      <span className="text-sm font-semibold text-white">{s.title}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${s.border} ${s.color}`}>
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. 핵심 이론 정리 (아코디언) */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} className="text-blue-400" />
          <h2 className="text-base font-semibold text-white">빅데이터 핵심 이론 정리</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          나중에 빅데이터를 다룰 때 꼭 알아야 할 개념들. 각 항목을 클릭하면 자세한 설명이 펼쳐집니다.
        </p>
        <div className="space-y-2">
          {concepts.map((c) => {
            const Icon = c.icon
            const open = openConcept === c.id
            return (
              <div key={c.id} className={`rounded-lg border transition-all ${open ? `${c.border}` : "border-slate-700/40"}`}>
                <button
                  onClick={() => setOpenConcept(open ? null : c.id)}
                  className="w-full p-4 text-left flex items-center gap-3 hover:bg-slate-700/20 transition-colors rounded-lg"
                >
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${c.border} ${c.bg}`}>
                    <Icon size={13} className={c.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{c.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{c.short}</div>
                  </div>
                  <ChevronRight size={14} className={`text-slate-500 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-0 ml-10 text-xs text-slate-400 leading-relaxed">
                    {c.detail}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. 기술 스택 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers size={16} className="text-green-400" />
          <h2 className="text-base font-semibold text-white">빅데이터 기술 스택</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((t) => (
            <div key={t.name} className={`rounded-xl border p-4 ${toolColor[t.color].split(" ").slice(0, 2).join(" ")}`}>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Zap size={14} className={toolColor[t.color].split(" ").slice(2).join(" ")} />
                <span className="text-sm font-semibold text-white">{t.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-navy-900/60 border border-slate-700/50 text-slate-400">
                  {t.cat}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
