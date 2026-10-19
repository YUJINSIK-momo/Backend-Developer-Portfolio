import type { Tone } from "../components/yuyu"

// 사람에 관한 사실의 정본 — 홈·About·머리글·바닥글이 모두 여기서 읽는다
export const profile = {
  name: "유진식",
  nameEn: "Jinsik Yu",
  handle: "yuyu",
  role: "AI · AX 백엔드 / 인프라 개발자",
  headline: "AI 가 일하는 길을 깔고, 사람이 결정하는 자리를 지키는 개발자",
  intro:
    "기획자가 Slack 에 적은 화면 요청이 코드 · 테스트 · 배포를 거쳐 승인 버튼 하나로 끝나는 디자인 시스템 하네스를 만들었고, " +
    "상권 분석 서비스의 AWS 인프라를 Terraform 으로 세워 GPT 리뷰 · Slack 결정 · 태그 배포로 이어지는 릴리스 하네스로 운영합니다. " +
    "모델에게는 판단만 맡기고 반복 작업은 스크립트와 테스트가, 되돌리기 어려운 일은 사람이 결정하도록 설계합니다.",
  email: "jinsik2036@gmail.com",
  github: "https://github.com/YUJINSIK-momo",
  line: { id: "@118htpvo", href: "https://line.me/R/ti/p/@118htpvo" },
  languages: ["한국어", "일본어 (JLPT N1)"],
  location: "한국 · 일본 원격 가능",
} as const

export interface Principle {
  title: string
  body: string
  tone: Tone
}

// 일하는 원칙 — 홈과 AI · AX 페이지에서 같은 문장을 쓴다
export const principles: readonly Principle[] = [
  {
    title: "모델은 판단만, 반복은 스크립트가",
    body: "AI 가 매번 새로 써야 하는 부분을 줄인다. 변환 · 검증 · 배포처럼 정해진 일은 스크립트와 테스트로 옮기고, 모델은 무엇을 만들지만 고른다.",
    tone: "ai",
  },
  {
    title: "되돌리기 어려운 일은 사람이 누른다",
    body: "인프라 반영, 운영 배포, 마이그레이션, 권한 변경은 에이전트가 실행할 수 없게 막아 두고 사람의 승인 버튼이나 태그로만 진행한다.",
    tone: "warning",
  },
  {
    title: "권한은 좁게, 예외는 기록으로",
    body: "배포는 GitHub OIDC 임시 자격 증명으로 하고 비밀값은 Secrets Manager 에서 컨테이너로 바로 넣는다. 읽기만 필요한 도구엔 읽기 전용 권한만, 피할 수 없는 장기 키는 예외로 적고 주기적으로 바꾼다.",
    tone: "infra",
  },
  {
    title: "기록이 정본이 되게",
    body: "결정 · 규칙 · 절차를 저장소 문서에 남겨 다음 사람(과 다음 에이전트)이 같은 판단을 다시 하지 않게 한다. 문서와 코드가 어긋나면 검사로 잡는다.",
    tone: "brand",
  },
]

export interface SkillGroup {
  label: string
  tone: Tone
  items: readonly string[]
}

export const skillGroups: readonly SkillGroup[] = [
  {
    label: "AI · 에이전트",
    tone: "ai",
    items: ["Claude Code (Plugins · Skills · Subagents · 권한 규칙)", "Codex CLI", "Figma MCP", "Claude API", "Gemini API", "OpenAI API", "LangChain", "Dialogflow"],
  },
  {
    label: "AWS · 인프라",
    tone: "infra",
    items: ["Terraform (+ terraform test)", "ECS Fargate", "ECR", "ALB · ACM · Route 53", "IAM · GitHub OIDC", "Secrets Manager", "S3", "CloudWatch", "EventBridge · Scheduler · SQS", "SNS · Amazon Q Developer in chat", "SES", "RDS (MariaDB)"],
  },
  {
    label: "백엔드",
    tone: "brand",
    items: ["TypeScript", "Node.js", "NestJS", "Express", "Socket.IO", "Prisma", "PostgreSQL", "MariaDB", "Redis", "Python · FastAPI"],
  },
  {
    label: "프론트 · 디자인 시스템",
    tone: "web",
    items: ["React 19", "Next.js", "Vite", "Tailwind CSS", "Base UI", "shadcn/ui", "디자인 토큰", "Expo"],
  },
  {
    label: "자동화 · 운영",
    tone: "neutral",
    items: ["GitHub Actions", "self-hosted 러너 (EKS ARC)", "launchd 러너", "Slack Socket Mode", "LINE Messaging API", "Docker", "Tailscale", "Cloudflare Pages"],
  },
]

export interface CareerStep {
  phase: string
  title: string
  body: string
  tone: Tone
}

export const career: readonly CareerStep[] = [
  {
    phase: "시작",
    title: "QA · 5G 시스템 테스트",
    body: "테스트 케이스 설계와 결함 추적, 검증 사이클 운영. 지금도 「검증할 수 있게 만든다」를 먼저 생각하는 습관이 여기서 왔습니다.",
    tone: "neutral",
  },
  {
    phase: "확장",
    title: "커머스 운영 · 결제 자동화",
    body: "WordPress · WooCommerce · Shopify 운영과 플러그인 개발. 일본 결제(KOMOJU) 취소 · 선결제 자동 취소 · 주문 시트 같은 매출이 걸린 기능을 다뤘습니다.",
    tone: "web",
  },
  {
    phase: "자동화",
    title: "LINE · Slack 상담과 업무 자동화",
    body: "일본 고객 LINE 상담 백엔드(Dialogflow → LLM 폴백 → Slack 담당자 연결), 사내 Slack 한↔일 번역 봇, HR 시스템의 Gemini 번역 · 이미지 생성.",
    tone: "brand",
  },
  {
    phase: "현재",
    title: "AX 하네스 · AWS 인프라",
    body: "디자인 시스템 하네스(Slack 화면 요청 → 화면 코드 → 배포 → 승인 버튼), 상권 분석 서비스의 AWS 구축과 운영, GPT 리뷰 · Slack 결정 릴리스 하네스, 운영 대시보드.",
    tone: "ai",
  },
]
