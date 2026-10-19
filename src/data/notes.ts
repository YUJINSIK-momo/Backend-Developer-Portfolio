import type { NoteGroup } from "../types/portfolio"

// 학습 노트 목록의 정본. 헤더·노트 허브·노트 상단 경로 표시가 모두 이 배열을 읽는다.
export const noteGroups: readonly NoteGroup[] = [
  {
    id: "ai",
    label: "AI · 에이전트",
    description: "LLM 이 응답을 만드는 과정과 Claude Code 로 일하는 방법",
    tone: "ai",
    notes: [
      { path: "/llm-flow", title: "LLM Flow", summary: "토큰화 → 추론 → 스트리밍 응답까지 단계별 시뮬레이션" },
      { path: "/claude-guide", title: "Claude Code 사용 가이드", summary: "다섯 개 파일과 여섯 단계로 시작하는 Claude Code 프로젝트 세팅" },
      { path: "/claude-advanced", title: "Claude Code Advanced", summary: "하네스 엔지니어링 — 서브에이전트 · hooks · 권한 · phase · 평가 루프" },
      { path: "/dynamic-workflows", title: "Dynamic Workflows", summary: "멀티 에이전트 오케스트레이션과 /loop · /schedule 시간 축 자동화" },
      { path: "/project-flow", title: "프로젝트 적용 플로우", summary: "신규/기존 프로젝트에 AI 개발 환경을 붙이는 순서" },
    ],
  },
  {
    id: "backend",
    label: "백엔드",
    description: "요청이 서버를 지나 DB 까지 가는 길과 실시간 통신",
    tone: "brand",
    notes: [
      { path: "/web-basics", title: "웹 기초", summary: "식당 비유로 보는 서버 · DNS · CDN · 정규식 · Cloudflare" },
      { path: "/backend-basics", title: "Backend Basics", summary: "Webhook · Express · DB 설계 · SQL" },
      { path: "/api-flow", title: "API Flow", summary: "Auth → Controller → Service → Repository 요청 흐름" },
      { path: "/socket", title: "Socket Communication", summary: "WebSocket 연결 · broadcast · room 시뮬레이션" },
      { path: "/architecture", title: "Architecture Patterns", summary: "Monolith · Microservices · Event-driven 비교" },
      { path: "/tech-stack", title: "Tech Stack", summary: "런타임 · 프레임워크 · DB · 캐시 · 테스트 도구" },
    ],
  },
  {
    id: "infra",
    label: "인프라 · 데이터",
    description: "배포 · 보안 · 장애 대응과 대용량 데이터 처리",
    tone: "infra",
    notes: [
      { path: "/aws-infra", title: "AWS 인프라 구성", summary: "EC2 · ALB · RDS · Redis 단계별 구축 기준" },
      { path: "/docker", title: "Docker & Kubernetes", summary: "이미지와 컨테이너, 클러스터 운영 개념" },
      { path: "/security", title: "보안 / 장애 대응", summary: "RDS 스냅샷 전략과 침해 발생 시 단계별 복구 절차" },
      { path: "/test-env", title: "테스트 환경 구성", summary: "Railway · Vercel · Supabase 로 꾸리는 저비용 테스트 환경" },
      { path: "/big-data", title: "빅데이터 & 추천 시스템", summary: "수집 → 처리 → 분석 파이프라인과 추천 구조" },
    ],
  },
  {
    id: "reference",
    label: "참고",
    description: "비개발자와 일할 때 쓰는 용어와 학습 순서",
    tone: "neutral",
    notes: [
      { path: "/glossary", title: "PM 용어사전", summary: "서버 · 프론트 · LLM 용어를 비유로 설명" },
      { path: "/roadmap", title: "Dev Roadmap", summary: "MVP 분리 · 기술 선택 기준 · 실습 순서" },
    ],
  },
]

export const allNotes = noteGroups.flatMap((group) =>
  group.notes.map((note) => ({ ...note, group })),
)

export function findNote(pathname: string) {
  return allNotes.find((note) => note.path === pathname)
}
