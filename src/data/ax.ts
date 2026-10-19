import type { Tone } from "../components/yuyu"

// AI · AX 페이지 본문 — 하네스를 이루는 부품과 두 하네스의 비교
export interface HarnessPart {
  name: string
  role: string
  example: string
  tone: Tone
}

export const harnessParts: readonly HarnessPart[] = [
  {
    name: "지시문",
    role: "에이전트가 매번 처음 읽는 규칙. 무엇을 해도 되고 무엇은 묻고 무엇은 하지 않는지.",
    example: "AGENTS.md · CLAUDE.md · docs/system (정본 문서)",
    tone: "brand",
  },
  {
    name: "명령 · 스킬",
    role: "자주 하는 일을 이름 붙은 절차로 만든다. 사람은 명령 하나로 요청한다.",
    example: "/make-screens · generate-code · review-design · /port-screen · /infra-change",
    tone: "ai",
  },
  {
    name: "스크립트",
    role: "결과가 늘 같아야 하는 변환 · 검증 · 업로드. 모델이 손으로 옮겨 쓰지 않게 한다.",
    example: "plan.json 검증 · 배포 확인 · 결과 카드 · 문서 ↔ 코드 drift 측정",
    tone: "infra",
  },
  {
    name: "권한",
    role: "되돌리기 어려운 명령은 아예 막거나 사람에게 묻게 한다. 저장소에 함께 둔다.",
    example: ".claude/settings.json allow · ask · deny",
    tone: "warning",
  },
  {
    name: "검증",
    role: "에이전트의 결과를 사람이 아니라 기계가 먼저 본다. 통과해야 리뷰로 간다.",
    example: "화면 규칙 AST 검사 · 마이그레이션 up/down/up · 공개 금지 식별자 검사",
    tone: "success",
  },
  {
    name: "러너 · 사람 결정",
    role: "정해진 신호(이슈 · PR · 태그)에 맞춰 돌고, 결정이 필요한 순간에만 사람을 부른다.",
    example: "launchd 감시 · Slack 승인 카드 · GitHub Release 태그 배포",
    tone: "neutral",
  },
]

export interface HarnessComparison {
  aspect: string
  design: string
  release: string
}

export const harnessComparison: readonly HarnessComparison[] = [
  {
    aspect: "누가 시작하나",
    design: "기획자가 Slack 폼에 화면 요청을 쓴다 (GitHub issue 가 원본)",
    release: "개발자가 develop → main pull request 를 연다",
  },
  {
    aspect: "모델이 하는 일",
    design: "디자인 시스템 문서만 보고 화면 · 테스트를 쓰고 plan.json 을 남긴 뒤 멈춘다",
    release: "Codex 가 바뀐 코드를 리뷰하고, 승인되면 고친다",
  },
  {
    aspect: "스크립트가 하는 일",
    design: "가지 · 커밋 · PR · CI 대기 · 머지 · 배포 확인 · 결과 카드 · 결정 처리",
    release: "PR 감시 · Slack 카드 · 릴리스 노트 · 배포 디스패치",
  },
  {
    aspect: "사람이 결정하는 곳",
    design: "배포된 화면을 보고 Slack 버튼으로 승인 · 반려 · 개선",
    release: "Slack 에서 「수정 후 머지 / 그대로 머지」, 그리고 배포 태그 발행",
  },
  {
    aspect: "막아 둔 것",
    design: "gh api 전체 · main push · 자기 판정 파일 편집 · 화면 자리 밖 변경",
    release: "마이그레이션 · 인프라 · 워크플로 · 새 의존성은 항상 사람 판단",
  },
]

export interface ToolUse {
  tool: string
  use: string
}

export const toolUses: readonly ToolUse[] = [
  { tool: "Claude Code", use: "하네스 본체. 플러그인 · 스킬 · 서브에이전트 · 권한 규칙으로 작업 환경을 묶는다." },
  { tool: "Codex CLI", use: "릴리스 전 두 번째 시선. 다른 모델로 리뷰해 한 모델의 맹점을 줄인다." },
  { tool: "Figma MCP", use: "화면을 Figma 에 그리고 고친 것을 되읽는 연동까지 만들었다가, A/B 측정 뒤 처리 흐름에서 뺐다 — 쓰지 않기로 한 근거까지 남기는 것도 일이다." },
  { tool: "Gemini API", use: "서비스 안의 AI. 상권 요약 어시스턴트와 사내 시스템의 번역 · 이미지 생성." },
  { tool: "Slack (Socket Mode)", use: "사람 결정 창구. 승인 버튼 · 알림 · 릴리스 노트가 한 채널 흐름으로 모인다." },
  { tool: "GitHub Actions · OIDC", use: "검사와 배포. 오래 사는 키 없이 짧은 자격 증명으로 AWS 에 배포한다." },
]
