# CLAUDE.md

## 프로젝트 개요

이 프로젝트는 백엔드 기술과 실시간 소켓 통신 기반 서비스를 시각적으로 보여주는 포트폴리오용 웹 프로젝트이다.

사용자가 백엔드 아키텍처, 실시간 통신 흐름, API 구조, 데이터 흐름을 눈으로 이해할 수 있도록 UI/UX 페이지를 구성한다.

단순 설명 페이지가 아니라, 실제 백엔드 서비스가 어떤 방식으로 작동하는지 시각화하는 것을 목표로 한다.

---

## 프로젝트 목표

### 핵심 목표
- 백엔드 기술 스택 정리
- 소켓 통신 기반 서비스 예시 구현
- 아키텍처 구조를 시각적으로 표현
- API 흐름과 데이터 흐름을 UI로 설명
- 포트폴리오용으로 보기 좋은 기술 소개 페이지 제작
- GitHub Pages로 배포 가능한 정적 사이트 구성

---

## 배포

### 배포 방식
- GitHub Pages 사용

### 배포 목표
- GitHub 저장소 기반 정적 배포
- 배포 URL은 GitHub Pages URL 사용

예상 URL 형식:

```text
https://사용자명.github.io/저장소명/
```

---

## 기술 스택

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### UI
- shadcn/ui 스타일 참고
- Lucide Icons
- Card 기반 레이아웃
- 반응형 디자인

### 시각화
- 아키텍처 다이어그램
- 데이터 흐름 카드
- 실시간 이벤트 로그 UI
- 소켓 연결 상태 표시 UI

### Backend 설명 대상

실제 서버를 GitHub Pages에서 실행할 수는 없으므로, 백엔드 동작은 UI 시뮬레이션 또는 mock data 기반으로 표현한다.

정리 대상 기술:

- Node.js
- Express
- NestJS
- WebSocket
- Socket.IO
- REST API
- GraphQL
- PostgreSQL
- Redis
- Docker
- AWS
- CI/CD
- Message Queue
- JWT Authentication

---

## 주요 페이지 구성

### 1. Dashboard Page

**목적**

백엔드 시스템 전체 구조를 한눈에 보여주는 메인 페이지.

**구성 요소**
- 프로젝트 소개 카드
- 주요 백엔드 기술 카드
- 실시간 통신 상태 카드
- API 요청 수 시뮬레이션
- 서버 상태 표시
- 아키텍처 요약 다이어그램

**표시 예시**
```
Backend Architecture Portfolio
실시간 통신과 백엔드 아키텍처를 시각적으로 이해할 수 있는 포트폴리오
```

---

### 2. Socket Communication Page

**목적**

소켓 통신이 어떤 방식으로 작동하는지 시각적으로 보여준다.

**구성 요소**
- Client
- WebSocket Server
- Event Handler
- Database
- Notification Service

**UI 기능**
- 연결 상태 표시
- 메시지 전송 시뮬레이션
- 이벤트 로그 표시
- broadcast 흐름 시각화
- room/channel 개념 설명

**예시 이벤트**
- `client:connect`
- `message:send`
- `server:broadcast`
- `notification:push`
- `client:disconnect`

---

### 3. Architecture Page

**목적**

최근 백엔드 아키텍처 구성 방식을 시각적으로 정리한다.

**포함 내용**
- Monolith Architecture
- Layered Architecture
- Microservices Architecture
- Event-driven Architecture
- API Gateway Pattern
- BFF Pattern
- Queue-based Processing

**UI 구성**
- 아키텍처 카드
- 장점/단점
- 사용 사례
- 흐름 다이어그램

---

### 4. API Flow Page

**목적**

API 요청이 프론트에서 백엔드, DB까지 어떻게 이동하는지 설명한다.

**흐름 예시**
```
Frontend
↓
API Request
↓
Auth Middleware
↓
Controller
↓
Service
↓
Repository
↓
Database
↓
Response
```

**구성 요소**
- 요청/응답 흐름 카드
- REST API 예시
- 인증 흐름
- 에러 처리 흐름
- 상태 코드 설명

---

### 5. LLM / 자연어 처리 Flow Page

**목적**

사용자가 채팅창에 텍스트를 입력했을 때, LLM(대형 언어 모델)이 어떻게 처리하고 응답을 돌려주는지 전체 흐름을 단계별로 시각화한다.

PM 및 비개발자도 이해할 수 있는 수준으로 표현한다.

**흐름 예시**

```
사용자 입력 (Prompt)
↓
입력 전처리 (Tokenization)
  └─ 텍스트 → 숫자(Token) 변환
↓
LLM 추론 요청 (API Call)
  └─ OpenAI / Claude / Gemini 등 외부 API 또는 자체 모델 호출
↓
컨텍스트 구성 (Context Building)
  └─ System Prompt + 이전 대화 + 사용자 입력 조합
↓
모델 추론 (Inference)
  └─ 토큰 단위로 다음 단어 예측 반복 (Auto-regressive)
↓
응답 스트리밍 (Streaming Response)
  └─ Server-Sent Events(SSE) 또는 WebSocket으로 실시간 전달
↓
후처리 (Post-processing)
  └─ 마크다운 파싱 / 필터링 / 로깅
↓
화면 출력 (Render)
  └─ 사용자 UI에 타이핑 효과로 표시
```

**구성 요소**

- Tokenization 시각화: 입력 텍스트가 토큰으로 분리되는 모습 표현
- Context Window 표시: System Prompt / History / User Input 구성 비율 바
- 스트리밍 시뮬레이션: 응답이 한 글자씩 나타나는 타이핑 효과 UI
- 단계별 Step Flow 카드: 각 단계 클릭 시 설명 표시
- 소요 시간 표시: 각 단계별 예상 latency (예: Tokenize 2ms / Inference 800ms)

**표시할 주요 개념**

| 개념 | 설명 |
|------|------|
| Prompt | 사용자가 모델에게 보내는 입력 텍스트 |
| Token | 텍스트를 쪼갠 최소 단위. 대략 단어의 ¾ 수준 |
| Context Window | 모델이 한 번에 기억할 수 있는 토큰 한계량 |
| Inference | 모델이 다음 토큰을 예측하는 연산 과정 |
| Streaming | 응답 전체를 기다리지 않고 생성되는 즉시 전달 |
| System Prompt | 모델의 역할과 규칙을 정의하는 숨겨진 초기 지시문 |
| Temperature | 응답의 창의성/무작위성을 조절하는 파라미터 (0~1) |
| RAG | 외부 문서를 검색해서 모델 응답에 추가 정보 주입 |

**UI 기능**

- 직접 텍스트 입력 → 토큰 분리 시뮬레이션
- 스트리밍 응답 애니메이션 (타이핑 효과)
- Context Window 용량 게이지 바
- 각 단계 hover 시 PM 친화적 설명 툴팁

---

### 6. Tech Stack Page

**목적**

최근 자주 사용되는 백엔드 기술을 정리한다.

**카테고리**
- Runtime
- Framework
- Database
- Cache
- Auth
- Realtime
- DevOps
- Cloud
- Testing

**예시**
- Node.js
- Express
- NestJS
- PostgreSQL
- Redis
- Socket.IO
- Docker
- AWS
- GitHub Actions
- Jest

---

### 7. PM 용어 사전 Page (Glossary)

**목적**

PM, 기획자, 디자이너 등 비개발자가 개발팀과 협업할 때 자주 마주치는 기술 용어를 쉽게 이해할 수 있도록 정리한다.

"서버가 어떻게 움직이는지", "프론트엔드가 어떻게 동작하는지"를 비유와 그림으로 설명하는 것을 목표로 한다.

**구성 방식**

- 카테고리별 탭으로 분류
- 각 용어 카드: 용어명 / 한 줄 정의 / PM 관점 비유 설명 / 실제 예시
- 검색 기능 (용어 필터링)
- 난이도 표시 (초급 / 중급 / 심화)

**카테고리 및 용어 목록**

#### 🖥️ 서버 / 백엔드

| 용어 | 한 줄 정의 | PM 비유 |
|------|-----------|---------|
| 서버 (Server) | 요청을 받아 처리하고 응답을 돌려주는 컴퓨터 | 식당의 주방. 손님(클라이언트)이 주문하면 요리해서 내보냄 |
| API | 프론트와 백엔드가 데이터를 주고받는 약속된 창구 | 식당 메뉴판 + 주문서. 무엇을 어떻게 요청할지 정해놓은 규칙 |
| REST API | HTTP 방식으로 자원을 CRUD 하는 표준적인 API 형태 | "냉면 1개 주세요(GET/POST)" 처럼 URL + 동사로 요청하는 방식 |
| 데이터베이스 (DB) | 데이터를 영구적으로 저장하는 창고 | 창고 or 서랍장. 앱을 껐다 켜도 데이터가 남아있는 이유 |
| 캐시 (Cache) | 자주 쓰는 데이터를 빠르게 꺼낼 수 있도록 임시 저장 | 책상 위 메모지. 서랍(DB)까지 가지 않고 바로 꺼내 씀 |
| 인증 (Authentication) | 사용자가 누구인지 확인하는 과정 | 신분증 확인. "당신이 맞습니까?" |
| 인가 (Authorization) | 인증된 사용자가 무엇을 할 수 있는지 권한 확인 | 입장 후 VIP 구역 출입 가능 여부 확인 |
| JWT | 로그인 상태를 증명하는 암호화된 토큰 | 놀이공원 자유이용권. 들고 다니면 매번 재확인 불필요 |
| 미들웨어 (Middleware) | 요청이 컨트롤러에 도달하기 전 중간에서 처리하는 로직 | 공항 보안검색대. 탑승 전 모든 승객이 통과해야 하는 관문 |
| 로드밸런서 (Load Balancer) | 여러 서버에 요청을 골고루 분산시키는 장치 | 은행 번호표 기계. 창구가 여럿일 때 줄을 균등하게 나눔 |
| Docker | 앱 실행 환경을 컨테이너로 묶어 어디서든 동일하게 실행 | 이케아 가구 박스. 조립 설명서(환경)가 박스 안에 포함되어 있음 |
| CI/CD | 코드 변경 시 자동으로 테스트하고 배포하는 파이프라인 | 공장 자동화 라인. 사람이 일일이 확인하지 않아도 자동 검수 후 출하 |
| Message Queue | 처리할 작업을 순서대로 쌓아두고 순차 처리하는 구조 | 콜센터 대기열. 상담원이 여러 전화를 동시에 받지 않고 줄 세워 처리 |
| WebSocket | 연결을 끊지 않고 서버↔클라이언트가 실시간으로 통신 | 전화통화. 한 번 연결되면 양쪽이 언제든 자유롭게 말할 수 있음 |

#### 🌐 프론트엔드 / 클라이언트

| 용어 | 한 줄 정의 | PM 비유 |
|------|-----------|---------|
| 프론트엔드 | 사용자가 직접 보고 상호작용하는 화면 영역 | 식당의 홀. 손님이 앉아 메뉴 보고 주문하는 공간 |
| HTML | 웹 페이지의 구조와 콘텐츠를 정의하는 마크업 언어 | 건물의 뼈대 / 설계도 |
| CSS | HTML 요소의 색상, 크기, 배치 등 스타일을 담당 | 인테리어. 같은 뼈대라도 꾸미기에 따라 전혀 다른 모습 |
| JavaScript | 웹 페이지에 동작과 상호작용을 부여하는 프로그래밍 언어 | 전기 배선. 버튼을 누르면 불이 켜지는 것처럼 동작을 만듦 |
| React | UI를 컴포넌트 단위로 만드는 JavaScript 라이브러리 | 레고 블록. 작은 블록(컴포넌트)을 조립해서 화면을 구성 |
| 컴포넌트 (Component) | 재사용 가능한 UI 조각 | 레고 부품 하나. 버튼, 카드, 모달 등 |
| 상태 (State) | 컴포넌트가 기억하고 있는 현재 데이터 | 점원의 현재 메모장. 바뀌면 화면도 즉시 바뀜 |
| 렌더링 (Rendering) | 데이터를 받아 화면에 시각적으로 그려내는 과정 | 주문서를 받아 실제 요리를 접시에 담아 내오는 과정 |
| SPA (Single Page App) | 페이지 전환 없이 한 페이지 내에서 화면이 교체되는 방식 | 파워포인트 슬라이드. URL은 그대로지만 내용이 바뀜 |
| SSR (Server Side Rendering) | 서버에서 HTML을 완성해서 브라우저에 전달 | 완성된 도시락을 받는 것. 받자마자 바로 먹을 수 있음 |
| CSR (Client Side Rendering) | 브라우저에서 JavaScript로 직접 화면을 그림 | 밀키트. 재료를 받아서 직접 조리해야 먹을 수 있음 |
| API 호출 | 프론트가 백엔드에 데이터를 요청하는 행위 | 홀 직원이 주방에 주문을 넣는 것 |
| CORS | 다른 도메인 간 요청을 허용할지 브라우저가 제어하는 보안 정책 | 국경 통관. A국에서 B국으로 물건을 보낼 때 허가 필요 |

#### 🤖 LLM / AI

| 용어 | 한 줄 정의 | PM 비유 |
|------|-----------|---------|
| LLM | 대량의 텍스트로 학습한 대형 언어 예측 모델 | 엄청나게 많은 책을 읽은 사람. 다음에 올 말을 잘 예측함 |
| Prompt | 모델에게 보내는 입력 지시문 | 직원에게 내리는 업무 지시서 |
| Token | 텍스트를 처리하는 최소 단위 (단어보다 작을 수 있음) | 언어를 처리하는 최소 벽돌 조각. "안녕하세요"는 약 3~4 토큰 |
| Context Window | 모델이 한 번에 읽을 수 있는 토큰 최대량 | 단기 기억력. 이 범위를 넘으면 앞 대화를 잊음 |
| Hallucination | 모델이 사실이 아닌 내용을 자신 있게 말하는 현상 | 자신 있게 틀리는 직원. 모르면서 아는 척 |
| RAG | 외부 문서를 검색해 모델 응답에 주입하는 기법 | 오픈북 시험. 모르면 책에서 찾아서 답변 |
| Fine-tuning | 특정 도메인 데이터로 모델을 추가 학습시키는 과정 | 신입 직원을 회사 스타일로 재교육 |
| Temperature | 응답의 창의성/무작위성 수치 (0=정확, 1=창의적) | 요리사의 자유도. 0이면 레시피 그대로, 1이면 즉흥 요리 |
| Streaming | 응답을 한 번에 보내지 않고 생성되는 즉시 전송 | 라이브 방송. 편집 없이 실시간 송출 |
| Embedding | 텍스트를 숫자 벡터로 변환해 의미를 수치화 | 단어를 지도 위 좌표로 표시. 비슷한 말은 좌표가 가까움 |
| System Prompt | 모델의 역할/규칙을 정의하는 숨겨진 초기 지시문 | 직원 채용 시 받는 행동 강령 |

**UI 구성**

- 상단 검색창: 용어 실시간 필터링
- 카테고리 탭: 서버/백엔드 · 프론트엔드 · LLM/AI
- 각 용어 카드 구성:
  - 상단: 용어명 + 난이도 배지 (초급/중급/심화)
  - 중단: 한 줄 정의 (개발자 관점)
  - 하단: PM 비유 설명 (말풍선 스타일)
- 카드 클릭 시: 실제 코드/예시 또는 연관 페이지 링크 표시
- 연관 용어 태그: 카드 하단에 관련 용어 배지로 연결

**페이지 목적 명시**

> 이 페이지는 개발팀과 더 잘 소통하고 싶은 PM, 기획자, 디자이너를 위해 만들어졌습니다.
> 틀린 설명이 있다면 PR로 수정해 주세요.

---

## UI/UX 방향

### 디자인 컨셉
- Modern Developer Portfolio
- Tech Dashboard
- Clean Architecture Viewer
- Dark / Light 조합 가능
- 카드형 UI
- 다이어그램 중심
- 개발자 포트폴리오 느낌

### 톤앤매너
- 전문적
- 깔끔함
- 기술 중심
- 너무 무겁지 않게
- 시각적으로 이해하기 쉽게

### UI 규칙
- 복잡한 설명은 카드로 분리
- 흐름은 화살표 또는 step UI로 표현
- 기술 스택은 태그/배지 형태 사용
- 실시간 통신은 로그 UI로 표현
- 모바일에서도 읽기 쉽게 구성

---

## 코드 규칙

### 기본 규칙
- 들여쓰기 2칸
- 탭 사용 금지
- 세미콜론 사용하지 않음
- 작은따옴표보다 큰따옴표 사용
- 컴포넌트명은 PascalCase 사용
- 변수/함수명은 camelCase 사용
- 파일명은 PascalCase 또는 kebab-case 중 프로젝트 내에서 일관되게 사용
- 사용하지 않는 import 제거
- 중복 코드 최소화

### TypeScript 규칙
- `any` 사용 최소화
- 공통 타입은 `types` 폴더에 분리
- props 타입 명시
- mock data 타입 정의

---

## 폴더 구조

```
src/
  components/
    layout/
      Header.tsx
      Footer.tsx
      Sidebar.tsx

    sections/
      HeroSection.tsx
      ArchitectureOverview.tsx
      SocketFlowSection.tsx
      TechStackSection.tsx

    ui/
      Card.tsx
      Badge.tsx
      Button.tsx
      StatusIndicator.tsx

    diagrams/
      ArchitectureDiagram.tsx
      SocketFlowDiagram.tsx
      ApiFlowDiagram.tsx
      LLMFlowDiagram.tsx

  pages/
    DashboardPage.tsx
    SocketPage.tsx
    ArchitecturePage.tsx
    ApiFlowPage.tsx
    TechStackPage.tsx
    LLMFlowPage.tsx
    GlossaryPage.tsx

  data/
    techStacks.ts
    socketEvents.ts
    architecturePatterns.ts
    apiFlows.ts
    llmFlowSteps.ts
    glossaryTerms.ts

  types/
    architecture.ts
    socket.ts
    tech.ts
    llm.ts
    glossary.ts

  utils/
    format.ts
```

---

## 작업 프로세스

모든 작업은 아래 순서로 진행한다.

### 1. 기존 테스트 확인

코드 수정 전 기존 테스트와 빌드 상태를 먼저 확인한다.

```bash
npm test
npm run lint
npm run build
```

테스트가 없는 경우:
- 현재 빌드 가능 여부 확인
- 기존 화면 동작 확인
- 필요한 테스트 구조 추가

### 2. 기능 구현

기능 구현 시 다음 기준을 따른다.

- 한 번에 너무 큰 변경 금지
- 페이지 단위로 구현
- 컴포넌트 단위로 분리
- mock data 기반으로 먼저 구현
- 실제 서버가 없어도 UI에서 동작 방식이 이해되도록 구성

### 3. 테스트 코드 작성

필요한 경우 테스트 코드를 추가한다.

대상:
- 주요 컴포넌트 렌더링
- 데이터 렌더링
- 소켓 이벤트 mock 동작
- 버튼 클릭 시 상태 변경

### 4. 린트 확인

구현 후 린트 오류를 확인한다.

```bash
npm run lint
```

린트 오류는 방치하지 않는다.

### 5. 빌드 확인

최종적으로 빌드가 성공해야 한다.

```bash
npm run build
```

빌드 에러가 있으면 배포 전 반드시 수정한다.

---

## 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run lint` | 린트 확인 |
| `npm test` | 테스트 실행 |
| `npm run build` | 빌드 |
| `npm run preview` | 프리뷰 |

---

## 환경변수 목록

GitHub Pages 정적 배포 기준으로 실제 백엔드 서버는 사용하지 않는다.

필요 시 아래 환경변수를 사용할 수 있다.

```env
VITE_API_BASE_URL=
VITE_SOCKET_URL=
VITE_APP_TITLE=
```

> **주의:**
> - 민감한 키는 프론트에 넣지 않는다.
> - GitHub Pages에 노출되어도 되는 값만 사용한다.
> - 실제 API Key, Secret Key, Token은 사용 금지.

---

## API 문서

현재 프로젝트는 포트폴리오용 정적 사이트이므로 실제 API는 mock 기반으로 구현한다.

**문서화 대상:**
- REST API 흐름 예시
- WebSocket 이벤트 예시
- 인증 흐름 예시
- 에러 응답 예시

**예시:**

```
GET  /api/users
POST /api/auth/login
GET  /api/orders
POST /socket/message
```

---

## 디자인 시스템

### 색상

| 용도 | 색상 계열 |
|------|-----------|
| Primary | Blue / Indigo |
| Accent | Cyan / Emerald |
| Background | Dark navy 또는 Light gray |
| Card | White 또는 Dark card |
| Warning | Amber |
| Error | Red |
| Success | Green |

### 컴포넌트
- Button
- Card
- Badge
- Status Indicator
- Diagram Node
- Event Log
- Code Block
- Timeline

---

## 커밋 규칙

한글 커밋 메시지 사용 가능.

### 커밋 예시
```
초기 프로젝트 구조 설정
소켓 통신 시각화 페이지 추가
백엔드 아키텍처 카드 UI 구현
API 흐름 다이어그램 추가
GitHub Pages 배포 설정 추가
```

### 권장 prefix

| prefix | 설명 |
|--------|------|
| `feat:` | 기능 추가 |
| `fix:` | 버그 수정 |
| `style:` | UI 수정 |
| `refactor:` | 코드 개선 |
| `docs:` | 문서 수정 |
| `chore:` | 설정 변경 |

**한글 예시:**
```
feat: 소켓 통신 로그 UI 추가
fix: 모바일 레이아웃 깨짐 수정
docs: API 흐름 설명 추가
```

---

## 완료 기준

- [ ] 백엔드 기술 스택을 한눈에 볼 수 있다.
- [ ] 소켓 통신 흐름을 UI로 이해할 수 있다.
- [ ] 아키텍처 구조를 시각적으로 확인할 수 있다.
- [ ] API 요청/응답 흐름이 정리되어 있다.
- [ ] LLM 자연어 처리 흐름이 단계별 Flow로 시각화되어 있다.
- [ ] Tokenization 및 스트리밍 응답 시뮬레이션이 동작한다.
- [ ] PM 용어 사전 페이지에서 서버/프론트엔드/LLM 용어를 쉽게 찾을 수 있다.
- [ ] 용어 카드에 개발자 정의와 PM 비유 설명이 함께 표시된다.
- [ ] 용어 검색 및 카테고리 필터링이 동작한다.
- [ ] GitHub Pages로 배포 가능하다.
- [ ] `npm run build`가 성공한다.
- [ ] 포트폴리오용으로 보기 좋은 UI 완성도를 가진다.