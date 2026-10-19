import type { CaseStudy } from "../types/portfolio"

// 사례 본문의 정본. 숫자는 각 저장소의 CI · 문서 · 실행 기록에서 옮겼다(2026-10-19 기준).
// 회사 저장소 이야기라 계정 · 네트워크 · 채널 식별자와 회사 내부 이름은 쓰지 않는다 — tests/public-safety.test.ts 가 막는다.
export const caseStudies: Record<string, CaseStudy> = {
  "design-harness": {
    slug: "design-harness",
    eyebrow: "Case study · AI · AX",
    title: "디자인 시스템 하네스",
    lead:
      "기획자가 Slack 폼에 화면 요청 한 문단을 적으면, 사무실 Mac 의 감시자가 그것을 집어 에이전트에게 넘깁니다. " +
      "에이전트는 디자인 시스템 문서만 보고 화면 코드와 테스트를 만들고 멈춥니다. 가지 · 커밋 · PR · CI · 머지 · 배포 확인 · 결과 보고는 스크립트가 하고, " +
      "기획자는 배포된 실제 화면을 보고 Slack 버튼으로 승인 · 반려 · 개선을 고릅니다.",
    facts: [
      { label: "기간", value: "2026.09 – 운영 중" },
      { label: "역할", value: "개발자 — 하네스 · 러너 · 권한 · 검증 전담, 신규 컴포넌트(Table · Chart 등)" },
      { label: "협업", value: "기획자 1명 — 요청 작성 · 승인, 기존 컴포넌트 담당" },
    ],
    stats: [
      { value: "27 / 27", label: "화면 요청 처리 · 종료", hint: "요청 1건 처리 11~15분", tone: "ai" },
      { value: "1,256", label: "자동 테스트", hint: "lint · typecheck · build 포함 pnpm check", tone: "success" },
      { value: "30쌍", label: "문서 ↔ 코드 자동 대조", hint: "규칙 문서가 코드와 어긋나면 표시", tone: "infra" },
      { value: "160", label: "3주간 병합한 PR", hint: "dev 124 · main 36", tone: "brand" },
    ],
    sections: [
      {
        id: "flow",
        kind: "pipeline",
        title: "지금 도는 흐름",
        description: "점선은 사람이 결정하는 자리입니다. 모델이 하는 일은 「화면 만들기」 하나뿐이고, 모델과 스크립트 사이의 약속은 plan.json 파일 하나입니다.",
        nodes: [
          { label: "Slack 폼 요청", sub: "기획자 → GitHub issue", tone: "brand", human: true },
          { label: "60초 감시", sub: "launchd · 신뢰 사본", tone: "infra" },
          { label: "/make-screens", sub: "화면 · 테스트 · 캡처 검수", tone: "ai" },
          { label: "plan.json", sub: "모델은 여기서 멈춤", tone: "ai" },
          { label: "PR · CI · 머지 · 배포", sub: "스크립트", tone: "infra" },
          { label: "Slack 카드", sub: "👍 승인 · 👎 반려 · 😕 개선", tone: "warning", human: true },
        ],
        caption: "승인하면 dev → main 으로 올리고 issue 를 닫습니다. 반려하면 그 화면만 지우는 PR 을 올립니다. 둘 다 모델을 부르지 않습니다. 개선은 사유와 함께 최대 3번까지 다시 만듭니다.",
      },
      {
        id: "model-job",
        kind: "steps",
        title: "모델이 하는 일 — /make-screens",
        steps: [
          { title: "요청을 화면 단위로 나눈다", body: "issue 본문(요청서의 원본)을 읽어 몇 장의 화면이 필요한지 정한다. 뜻이 갈리면 묻지 않고 가장 그럴듯한 해석으로 만든 뒤, 버린 갈래를 「결정 필요」 첫 줄에 남긴다." },
          { title: "화면마다 코드 · 테스트 · 등록", body: "디자인 시스템 문서 → 부품 매핑표 → 화면 · 테스트 · 등록 파일 세 개. 공용 부품 수정, 다른 화면 코드 읽기, 캐시 삭제는 금지.", tone: "ai" },
          { title: "규칙 검사와 자가 검수", body: "화면 규칙 검사기(AST)로 primitive 색 · 부품 재사용 · import 경계 · 아이콘 · 글자 크기 등을 보고, 15개 항목 검수표로 스스로 확인한다.", tone: "success" },
          { title: "세 가지 폭으로 캡처해 눈으로 대조", body: "정적 빌드 후 1440 · 1024 · 390 폭에서 캡처하고, 제목 유무와 가로 넘침을 측정한다.", tone: "infra" },
          { title: "plan.json 을 쓰고 멈춘다", body: "git · gh 쓰기 권한은 처음부터 열려 있지 않다. 이후는 러너 스크립트의 몫이다." },
        ],
      },
      {
        id: "history",
        kind: "steps",
        title: "Figma 를 넣었다가 뺀 이유",
        description: "처음 계획은 코드 → Figma → 사람 검토 → 되읽기였습니다. 측정해 보고 구조를 두 번 바꿨습니다.",
        steps: [
          { title: "Figma 연동을 만들었다", body: "Figma MCP 로 화면을 그리는 스크립트와 Figma 컴포넌트 카탈로그(Variants), 디자이너 수정을 다시 읽어 diff 로 만드는 되읽기까지 구현했다.", tone: "ai" },
          { title: "느린 원인을 쟀다", body: "23분 걸리던 원인은 Figma 호출(0.2초)이 아니라 모델이 빌더 코드를 옮겨 적는 글자 수였다. 빌더를 문서에 한 번만 저장하고 해시로 검사해 42단계 → 23단계, 보내는 글자 1/3.", tone: "infra" },
          { title: "A/B 로 Figma 의 쓸모를 쟀다", body: "Figma 경유안과 「요청 + 문서」안을 같은 화면으로 비교했다. 규칙 위반 · 부품 재사용은 같았지만 요청과 어긋난 곳은 4~5건 대 0~1건. Figma 는 동작 · 미정 사항 · 선택지 같은 요청의 뜻을 실어 나르지 못했다.", tone: "warning" },
          { title: "처리 흐름에서 Figma 를 뺐다", body: "5장짜리 요청이 코드 완성 뒤 Figma 에서만 1시간 넘게 걸렸다. Storybook 도 빼고 AI 용 색인(llms.txt) 한 장으로 대신했다.", note: "판단", tone: "warning" },
          { title: "모델과 스크립트의 역할을 뒤집었다", body: "이틀 동안 처리가 9번 무너졌는데 화면 생성은 한 번도 실패하지 않았다. 무너진 곳은 늘 모델이 운전하던 주변(배포 기다리다 턴 종료, 머지 타임아웃)이었다. 그래서 「모델은 화면만, 나머지는 스크립트」로 바꿨다.", tone: "ai" },
          { title: "러너를 GitHub job 밖으로 옮겼다", body: "Mac 의 러너 연결이 15~25분마다 끊겨 job 이 버려지고 에이전트도 함께 죽었다. launchd 감시자가 신뢰 사본에서 돌게 바꿨다.", tone: "infra" },
        ],
      },
      {
        id: "safety",
        kind: "cards",
        title: "보안 · 안전장치",
        description: "무료 플랜 비공개 저장소라 브랜치 보호가 없습니다. 그 자리를 권한 규칙(허용 28 · 확인 50 · 거부 20)과 산출물 검사가 대신합니다.",
        cards: [
          { title: "결정 위조 차단", body: "처음엔 쓰기 꼴만 막았더니 반응 API 로 👍(승인)를 위조할 틈이 있었다. gh api 를 통째로 막고, 요청서 · 결정을 바꾸는 issue · PR 편집과 라벨도 거부했다.", evidence: ".claude/settings.json deny", tone: "danger" },
          { title: "자기 판정을 못 고치게", body: "화면 규칙 검사기 · 그 테스트 · 러너 스크립트 · launchd 설정 · 스킬 문서 편집은 확인 대상이다. 헤드리스에서는 곧 거부다.", evidence: "settings.json ask", tone: "warning" },
          { title: "우회로를 열지 않는다", body: "node -e 는 child_process 로 모든 거부를 우회할 수 있어 하루 만에 닫았다. 스크립트 와일드카드 허용도 두지 않는다.", tone: "warning" },
          { title: "산출물 경계", body: "화면 자리와 등록 파일 밖이 바뀌면 커밋 전에 한 번, PR 파일 목록으로 한 번 더 멈춘다. 모델이 하네스 스크립트를 몰래 함께 올리는 것을 막는다.", evidence: "outsideScreenFiles", tone: "success" },
          { title: "최소 권한 체인", body: "러너는 세 스킬 머리말의 allowed-tools 합집합만 넘기고, 그 목록에 쓰기 명령이 섞이지 않는지 테스트가 본다. MCP 서버는 하나도 열지 않는다.", tone: "infra" },
          { title: "검사를 건너뛰면 빨갛게", body: "예전 틀린 화면 2장은 해시로 면제하되, 규칙이 그 틀린 사례를 실제로 잡는지 확인한다. 훑은 화면 수가 기준보다 적으면 실패한다.", evidence: "screen-rules.test.tsx", tone: "success" },
          { title: "신뢰 사본에서만 실행", body: "러너는 사람이 일하는 clone 이 아니라 매 주기 origin/dev 로 맞추는 별도 사본에서 돈다. Slack 토큰은 저장소 밖에 둔다.", tone: "brand" },
          { title: "결정은 좁게 읽는다", body: "「승인합니다」 같은 닮은꼴이 늦게 오면 따르지 않고 멈춘다. 사유 없는 반려 · 개선은 시작하지 않고, 같은 결정은 처리 전에 열쇠를 기록해 한 번만 처리한다.", tone: "neutral" },
          { title: "공개 범위 허용 목록", body: "문서 사이트에는 정해 둔 디자인 시스템 문서만 싣고, 실린 문서가 바깥을 링크하면 빌드가 멈춘다.", tone: "neutral" },
        ],
      },
      {
        id: "verify",
        kind: "bullets",
        title: "어떻게 검증했나",
        items: [
          "깨끗한 clone 에서 Sonnet 에이전트가 플러그인 스킬만 보고 화면을 처음부터 만들게 하고 결과를 다시 쟀다 — 「pull request 준비 완료」, 파일 3개, 규칙 위반 0, 보고와 실측 일치(통합 검증 5회).",
          "에이전트 규칙을 고친 뒤 10회 반복 실행에서 이전 실패 유형 재발 0/9.",
          "다섯 리뷰어 에이전트가 각자 worktree 에서 검토해 21건을 찾고, 반박 검증을 거쳐 13건을 고쳤다. 이 과정에서 CI 가 샌드박스 테스트를 돌리지 않던 구멍도 찾았다.",
          "플러그인을 디자인 시스템 문서 · 패키지 · 화면 앱만 담은 별도 저장소에 설치해 같은 명령이 도는 것을 확인했다.",
        ],
      },
    ],
    next: { label: "블루맵스 상권 분석 서비스 — AWS · 릴리스 하네스", to: "/work/blue-maps" },
  },

  "blue-maps": {
    slug: "blue-maps",
    eyebrow: "Case study · 인프라 · 운영",
    title: "블루맵스 상권 분석 서비스",
    lead:
      "누구나 쓰는 공개 상권 분석 서비스입니다. 빈 저장소에서 시작해 15일 만에 운영 릴리스 20개를 냈고, " +
      "AWS 인프라는 Terraform 으로, 리뷰와 배포는 GPT 리뷰 · Slack 결정 · 태그 배포로 이어지는 릴리스 하네스로 운영합니다.",
    facts: [
      { label: "기간", value: "2026.09.30 – 운영 중" },
      { label: "역할", value: "인프라 · 백엔드 · 릴리스 하네스 설계와 구현" },
      { label: "구성", value: "pnpm 모노레포 — web · api · etl · db · infra" },
    ],
    stats: [
      { value: "20", label: "운영 릴리스", hint: "첫 커밋부터 15일", tone: "brand" },
      { value: "3,059", label: "자동 테스트", hint: "+ Terraform test 50회 실행", tone: "success" },
      { value: "554,091", label: "서울 상가업소 적재", hint: "1회 수집 약 14분", tone: "infra" },
      { value: "$59", label: "월 인프라 추정", hint: "NAT 없이 설계해 월 $44 절감", tone: "warning" },
    ],
    sections: [
      {
        id: "architecture",
        kind: "pipeline",
        title: "요청이 지나는 길",
        nodes: [
          { label: "Route 53", sub: "도메인 · ACM", tone: "infra" },
          { label: "ALB", sub: "80 → 443, TLS 1.3", tone: "infra" },
          { label: "web", sub: "Next.js · Fargate", tone: "web" },
          { label: "api", sub: "NestJS · Fargate", tone: "brand" },
          { label: "MariaDB", sub: "공유 RDS", tone: "neutral" },
        ],
        caption: "AI 어시스턴트는 api 의 Socket.IO(WebSocket 전용) 경로로 붙고, 수집은 EventBridge Scheduler 가 깨우는 단발 Fargate 작업이 S3 원본 보관 → 검증 → DB upsert 순으로 처리합니다.",
      },
      {
        id: "features",
        kind: "cards",
        title: "무엇을 만들었나",
        cards: [
          { title: "지도 · 상권 리포트", body: "카카오 지도 위에 행정동 경계 · 업소 수 단계 구분도 · 리포트 패널. 지도 키는 런타임에 비밀 저장소에서 받아 넘긴다.", tone: "web" },
          { title: "AI 어시스턴트", body: "메뉴 엔진이 먼저 답하고, 풀지 못한 질문만 Gemini 로 보낸다. 개인정보 꼴은 저장 · 전송 전에 가리고, 필수 동의가 있어야만 호출한다.", tone: "ai" },
          { title: "ETL", body: "매일 새벽 공공데이터를 1,000건 단위로 받아 원본을 S3 에 남기고 검증 후 적재. 중복 실행 잠금, 99% 성공 기준, 재시도 3회 뒤 DLQ.", tone: "infra" },
          { title: "서버 다운로드", body: "api 컨테이너의 헤드리스 Chromium 이 리포트를 PDF · 이미지로 만들어 응답으로만 보낸다(저장하지 않음).", tone: "brand" },
          { title: "로그인", body: "이메일 · Google · Kakao. argon2id, __Host- 쿠키, PKCE · state · nonce, 최소 수집. 구현과 인프라 준비까지 끝났고 운영 스위치는 아직 꺼 둠.", tone: "neutral" },
          { title: "요청 상한", body: "생성형 AI · 소켓 · 브랜드 검색 · 로그인마다 IP 별 · 전체 상한을 둔다. IP 는 ALB 가 붙인 값만 믿는다.", tone: "warning" },
        ],
      },
      {
        id: "aws",
        kind: "table",
        title: "쓴 AWS 서비스",
        description: "모두 Terraform 으로 관리합니다. 기반(foundation)과 서비스(service) 두 묶음으로 나눠 상태 파일을 따로 둡니다.",
        head: ["서비스", "여기서 하는 일"],
        rows: [
          ["ECS Fargate", "web · api 상시 서비스(최소 100% · 최대 200% 무중단 교체, 서킷 브레이커 자동 롤백), etl · 마이그레이션은 단발 작업"],
          ["ECR", "이미지 저장소 3개 — 불변 태그 · push 시 취약점 스캔 · 30개 보존"],
          ["ALB · ACM · Route 53", "경로 규칙(/ → web, /api → api), TLS 1.3 정책, 잘못된 헤더 버림, 인증서 만료 알람"],
          ["RDS (MariaDB)", "새로 만들지 않고 사내 공유 DB 를 참조 — 보안그룹 규칙 2개만 추가"],
          ["S3", "ETL 원본 · 배포 기록, 사용자 보관함 — 퍼블릭 차단 · 암호화 · TLS 아닌 요청 거부"],
          ["Secrets Manager", "앱 비밀 하나에서 키별로 컨테이너에 주입, 값은 사람이 넣음"],
          ["CloudWatch", "로그 30일, 오류 로그 지표 필터, 알람 12개, ETL 성공 지표"],
          ["EventBridge · SNS · Amazon Q Developer in chat", "알람을 한국어 요약 카드로 바꿔 Slack 으로"],
          ["EventBridge Scheduler · SQS", "수집 스케줄 4개와 실패 DLQ"],
          ["IAM · GitHub OIDC", "OIDC provider 와 역할 6종 — 배포 · 작업 · 실행 · 스케줄러 · 알림"],
          ["SES · Budgets", "인증 메일(DKIM · SPF · DMARC), 태그 기준 월 예산"],
        ],
      },
      {
        id: "security",
        kind: "cards",
        title: "보안 — 무엇을 어떻게 막았나",
        description: "각 항목은 Terraform · 워크플로 · 코드에 근거가 있습니다.",
        cards: [
          { title: "배포 경로에 장기 키 없음", body: "GitHub Actions 는 OIDC 로 임시 자격 증명을 받는다. 신뢰 정책은 aud 와 불변 subject 형식의 main 하나만 받고, id-token 권한은 deploy job 하나에만 있는지 CI 가 검사한다.", evidence: "github_oidc.tf · ci.yml", tone: "infra" },
          { title: "배포 역할 최소 권한", body: "이미지 저장소 3개, 이 서비스의 task 정의 · 서비스 2개, PassRole 은 대상 서비스 조건, S3 는 배포 기록 경로만.", evidence: "deploy_policy.tf", tone: "infra" },
          { title: "혼동된 대리인 방지", body: "작업 · 스케줄러 · 알림 역할의 신뢰 정책에 SourceAccount · SourceArn 조건. 실행 역할은 비밀 하나만 읽는다.", evidence: "iam.tf", tone: "infra" },
          { title: "네트워크", body: "기본 egress 를 지우고 ALB 만 공개. 나가는 길은 443 과 DB 보안그룹 참조 3306 뿐, SSH 없음. 인라인 규칙 금지 규칙을 따른다.", evidence: "network.tf", tone: "brand" },
          { title: "컨테이너 · 저장소", body: "컨테이너는 root 가 아닌 사용자로, 이미지는 불변 태그와 스캔으로. 서드파티 Action 8종은 모두 커밋 SHA 로 고정.", evidence: "Dockerfile · ecr.tf · workflows", tone: "brand" },
          { title: "로그 위생 · 알람 보호", body: "인증 없는 4xx 는 warn 으로만 남겨 알람 폭주를 막고, 알림 카드에는 오류 내용을 싣지 않는다. 생성형 AI 로그에 질문 · 답 · IP 없음.", evidence: "app-exception-filter.ts · monitoring.tf", tone: "success" },
          { title: "AI 개인정보", body: "저장 · 전송 전 개인정보 꼴을 가리고, 외부 전송 고지가 든 동의가 있을 때만 Gemini 를 부른다. 유료 등급 키로 학습 미사용, 18세 이상 조건.", evidence: "chat/masking.ts · decisions.md", tone: "ai" },
          { title: "오류 수집의 가림", body: "로그를 분석에 넘기기 전에 토큰 · JWT · 메일 · 전화 · 카드 · IP · SQL 값을 가린다. 원문은 어디에도 쓰지 않는다.", evidence: "error-watch/redact.mjs", tone: "success" },
          { title: "스캐너 차단", body: "web 오류 97건 중 91건이 스캐너의 가짜 Server Action 요청이었다. 해당 헤더 요청을 404 로 끊고, 오류 분석에서도 잡음으로 거른다.", evidence: "apps/web/src/proxy.ts", tone: "warning" },
        ],
      },
      {
        id: "agent-guard",
        kind: "cards",
        title: "에이전트가 할 수 없는 일",
        description: "저장소 규칙 227개(허용 67 · 확인 22 · 거부 138). 무료 플랜 비공개 저장소라 브랜치 보호를 걸 수 없어, 규칙과 권한으로 막았습니다.",
        cards: [
          { title: "인프라 쓰기 금지", body: "terraform apply · destroy · import · state 와 AWS 쓰기 동사 약 40종, S3 복사 · 삭제. 에이전트는 plan 요약과 변경 기록 초안까지, apply 는 사람이 터미널에서.", tone: "danger" },
          { title: "비밀 읽기 금지", body: "비밀값 조회 · 레지스트리 비밀번호 · 복호화 읽기 · 자격 증명 내보내기, .env 와 자격 증명 파일 읽기.", tone: "danger" },
          { title: "배포 발행 금지", body: "GitHub 릴리스 발행이 곧 운영 배포라 에이전트는 릴리스를 만들거나 고칠 수 없다. main · develop 직접 push 와 force push 도 금지.", tone: "warning" },
          { title: "확인을 받는 일", body: "terraform plan, pull request 생성 · 병합, push, 마이그레이션 실행, 워크플로 · 권한 파일 편집.", tone: "neutral" },
        ],
      },
      {
        id: "release",
        kind: "steps",
        title: "릴리스 하네스 — GPT 리뷰 · Slack 결정 · 태그 배포",
        description: "개발 Mac 의 launchd 감시자(60초 주기)와 Slack Socket Mode 다리로 돕니다. 결정의 원본은 pull request 댓글이고, Slack 버튼은 그 댓글을 대신 달 뿐입니다.",
        steps: [
          { title: "develop → main pull request 를 연다", body: "같은 저장소 · 믿는 계정 · 초안이 아닌 것만 받는다." },
          { title: "Codex 가 읽기 전용으로 리뷰한다", body: "read-only 샌드박스, 승인 없음, 30분 상한. 결과는 스키마로 검사하고 비밀 꼴은 가린 뒤 PR 댓글로 남긴다. 출력은 데이터로만 다룬다.", tone: "ai" },
          { title: "사람이 Slack 에서 고른다", body: "「수정 반영 후 머지」 또는 「그대로 머지」. 리뷰가 필요 없다고 나오고 안전 규칙도 통과하면 바로 머지한다.", note: "사람 결정", tone: "warning" },
          { title: "Codex 가 고치고, 러너가 검사한다", body: "네트워크 없는 쓰기 샌드박스에서 수정 → 러너가 샌드박스 밖에서 전체 검사 → 수정 PR 을 develop 에 합치고 CI 통과 후 head 커밋을 확인하며 main 에 머지.", tone: "ai" },
          { title: "사람이 태그를 발행하면 배포", body: "릴리스 발행 시 태그 꼴 · main 조상 · 그 커밋의 CI 성공 · 발행자 권한 · 가장 높은 태그인지 확인한 뒤 배포를 부른다. 마이그레이션 → api → web → 스모크 → 스케줄 순.", note: "사람 결정", tone: "warning" },
        ],
      },
      {
        id: "release-guard",
        kind: "bullets",
        title: "GPT 가 손댈 수 없는 곳",
        description: "다음 경로가 바뀌면 리뷰 결과와 상관없이 늘 사람 결정을 받습니다.",
        items: [
          "DB 마이그레이션, infra/, .github/workflows/, Dockerfile, .claude/, 새 의존성",
          "GPT 수정 금지 경로: 위 경로와 .github/, vendor/, 릴리스 러너 자신, package.json, .env*. 토큰 꼴이 보이면 멈춘다.",
          "멈춤 스위치(PAUSE), 손 머지 감지 · 경고, 위험한 샌드박스 모드는 코드로 만들 수 없게 막음.",
          "기록: 릴리스 PR 위 GPT 리뷰 24회 — 사람 결정 요청 20 · 자동 머지 4. 예: 「외부 전송 고지 없이 Gemini 를 켠다(높음)」를 잡아 배포 전에 고쳤다.",
        ],
      },
      {
        id: "ci",
        kind: "table",
        title: "CI · 배포 파이프라인",
        head: ["단계", "하는 일"],
        rows: [
          ["check", "린트 · 타입 · 테스트 · 빌드 전체"],
          ["infra", "Terraform test(mock) — 실패해야 통과하는 시험 포함"],
          ["migrations", "운영과 같은 MariaDB 버전 · 같은 앱 계정 권한으로 실행 → 하나씩 끝까지 되돌림 → 다시 실행"],
          ["workflows", "actionlint · shellcheck, id-token 권한 위치 검사"],
          ["deploy", "동시성 잠금, 코드 변경 없는 태그 건너뛰기, 같은 SHA 이미지 재사용, 이전 리비전과 롤백 명령 기록"],
          ["러너", "Actions 무료 분량이 바닥나 사내 EKS 의 ARC 러너로 옮길 수 있게 변수 하나로 전환. 주 1,515분 → 600분으로 줄임"],
        ],
      },
      {
        id: "ops",
        kind: "cards",
        title: "운영과 관측",
        columns: 2,
        cards: [
          { title: "한국어 알람 카드", body: "CloudWatch 알람 12개를 EventBridge 입력 변환으로 한국어 요약 카드로 만들어 Slack 으로 보낸다. 전달 시험까지 마쳤다.", tone: "infra" },
          { title: "서버 오류 분석", body: "15분마다 읽기 전용으로 로그를 읽어 가린 뒤, 지문별로 이슈를 열고 GPT 분석을 Slack 카드로 올린다. 승인돼도 수정은 develop 에만.", tone: "ai" },
          { title: "무중단 배포 확인", body: "새 대상 등록 → 옛 대상 해제 사이 약 1분 겹침, 정상 대상 0개 구간 없음. 옛 web + 새 api 가 3분 함께 돈 기록이 API 「확장 → 축소」 규칙의 근거가 됐다.", tone: "success" },
          { title: "변경 기록", body: "AWS 에 무언가 만들기 전에 화면 캡처와 함께 변경 기록을 먼저 남기고, 결과와 승인까지 채운다.", tone: "neutral" },
        ],
      },
      {
        id: "limits",
        kind: "bullets",
        title: "아직 남은 것 (솔직하게)",
        items: [
          "WAF · CSP 는 아직 없다. 요청 상한은 api 메모리에서 세므로 재시작하면 비워진다.",
          "공유 DB 의 백업 · 암호화 설정은 이 서비스 소관이 아니라 위험으로 기록해 두었다.",
          "브랜치 보호를 못 걸어 사람의 손 머지는 막지 못하고 경고만 남긴다.",
          "운영 대시보드 · 오류 수집용 읽기 전용 키는 장기 키 예외로 승인받아 90일마다 바꾼다.",
        ],
      },
    ],
    next: { label: "운영 대시보드 — 읽기 전용으로 보는 관제 화면", to: "/work/ops-dashboard" },
  },

  "ops-dashboard": {
    slug: "ops-dashboard",
    eyebrow: "Case study · 인프라 · 운영",
    title: "블루맵스 운영 대시보드",
    lead:
      "AWS 콘솔 · GitHub · Slack · 러너 로그에 흩어진 운영 정보를 한 화면에 모았습니다. " +
      "외부 의존성 없이 Node 내장 모듈만으로 만들었고, 읽기 전용 권한으로만 AWS 를 보며, 사설망 밖으로는 열리지 않습니다.",
    facts: [
      { label: "기간", value: "2026.10 – 운영 중" },
      { label: "역할", value: "설계 · 구현 · 운영" },
      { label: "실행", value: "러너 Mac 의 launchd 상주, 사설망 공유" },
    ],
    stats: [
      { value: "0", label: "외부 의존성", hint: "Node 내장 모듈만", tone: "infra" },
      { value: "510", label: "자동 테스트", tone: "success" },
      { value: "15", label: "읽기 전용 정책 문장", hint: "쓰기 액션 없음", tone: "warning" },
      { value: "30s", label: "같은 조회 최소 간격", tone: "brand" },
    ],
    sections: [
      {
        id: "tabs",
        kind: "cards",
        title: "화면 구성",
        cards: [
          { title: "러너", body: "릴리스 하네스 상태와 릴리스 단계 카드 — 지금 어떤 PR 이 어느 단계에서 누구의 결정을 기다리는지.", tone: "ai" },
          { title: "인프라", body: "헬스 체크, Actions · CI 러너, ECS · 대상 그룹 · 알람 · ETL, 그리고 디자인 → 기획 → 개발 → GPT 리뷰 → Claude 검증 → 결정 → 태그 배포 흐름 카드.", tone: "infra" },
          { title: "흐름", body: "아키텍처 구조도 위에 실시간 상태를 입혀 어디가 아픈지 그림으로 본다.", tone: "brand" },
          { title: "앱", body: "리소스 트리, 24시간 지표, 비용, 배포 이력 — 10단계 진행, 태스크 교체, 대상 겹침, 롤백.", tone: "web" },
          { title: "로그", body: "CloudWatch 와 러너 로그를 한곳에서, 여러 줄 오류는 하나로 묶어 보여 준다.", tone: "neutral" },
        ],
      },
      {
        id: "security",
        kind: "cards",
        title: "보안 설계",
        columns: 2,
        cards: [
          { title: "읽기 전용 IAM", body: "describe · list · get · filter 와 Logs Insights 만. ECS 는 이 클러스터, 로그는 이 서비스 로그 그룹, S3 는 배포 기록 경로, RDS 는 인스턴스 하나로 범위를 좁혔다.", tone: "infra" },
          { title: "셸 없이 부르기", body: "AWS CLI 는 셸을 거치지 않는 execFile 로만 부른다. 사용자 입력이 명령줄로 해석될 길이 없다.", tone: "success" },
          { title: "루프백 + 사설망", body: "127.0.0.1 에만 열고, 공유는 Tailscale serve 로만(공개 Funnel 미사용). 신원 헤더 · 허용 목록 밖이면 403.", tone: "brand" },
          { title: "요청 검사", body: "Host 검사로 DNS 리바인딩 차단, 실행마다 바뀌는 토큰을 상수 시간 비교, Origin 검사. 쓰기 요청은 「지금 조회」 하나만 허용.", tone: "warning" },
        ],
      },
      {
        id: "deploy-view",
        kind: "steps",
        title: "배포를 눈으로 확인하기",
        description: "「배포 중에 끊기지 않았나?」를 감이 아니라 ECS 이벤트로 답하게 만들었습니다.",
        steps: [
          { title: "배포 대기", body: "develop → main PR 과 태그 발행 사이에 쌓인 변경을 「배포 대기」로 보여 준다." },
          { title: "내리기 시작 → 대상 해제 → 연결 정리", body: "새 태스크가 대상 그룹에 등록된 뒤 옛 태스크가 빠지는 구간을 시간 막대로 그린다.", tone: "infra" },
          { title: "겹침 확인", body: "실제 배포에서 새 · 옛 대상이 1분 남짓 겹치고 정상 대상 0개 구간이 없음을 확인했다.", tone: "success" },
        ],
      },
      {
        id: "lessons",
        kind: "bullets",
        title: "배운 것",
        items: [
          "운영 정보는 모으기만 해도 결정이 빨라진다 — 배포 대기 목록 하나로 「언제 태그를 찍을지」 대화가 줄었다.",
          "관제 도구는 권한부터 설계한다. 읽기 전용 정책을 먼저 쓰고, 그 안에서 할 수 있는 화면만 만들었다.",
          "장기 키를 피할 수 없는 곳은 예외로 기록하고 교체 주기를 정해 둔다.",
        ],
      },
    ],
    next: { label: "디자인 시스템 하네스", to: "/work/design-harness" },
  },
}
