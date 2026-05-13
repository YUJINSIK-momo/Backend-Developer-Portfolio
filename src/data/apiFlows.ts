export interface ApiFlowStep {
  id: string
  label: string
  description: string
  code?: string
  color: string
  icon: string
  details: string[]
}

export interface ApiExample {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  description: string
  request?: Record<string, unknown>
  response: Record<string, unknown>
  statusCode: number
}

export const apiFlowSteps: ApiFlowStep[] = [
  {
    id: "frontend",
    label: "Frontend",
    description: "사용자 인터랙션이 시작되는 브라우저/앱",
    code: `fetch('/api/users/me', {\n  headers: { Authorization: 'Bearer <token>' }\n})`,
    color: "blue",
    icon: "monitor",
    details: ["HTTP 요청 생성", "Authorization 헤더 첨부", "fetch / axios 사용", "에러 핸들링"],
  },
  {
    id: "auth-middleware",
    label: "Auth Middleware",
    description: "JWT 토큰 검증 및 사용자 정보 추출",
    code: `// JWT 검증\nconst decoded = jwt.verify(token, SECRET)\nreq.user = decoded`,
    color: "purple",
    icon: "shield",
    details: ["Bearer 토큰 파싱", "JWT 서명 검증", "토큰 만료 확인", "req.user에 페이로드 주입"],
  },
  {
    id: "controller",
    label: "Controller",
    description: "요청 파라미터 파싱 및 Service 레이어 호출",
    code: `@Get('/users/:id')\nasync getUser(@Param('id') id: string) {\n  return this.userService.findById(id)\n}`,
    color: "green",
    icon: "cpu",
    details: ["URL 파라미터 추출", "요청 유효성 검사", "Service 위임", "응답 형식 정의"],
  },
  {
    id: "service",
    label: "Service",
    description: "비즈니스 로직 처리 및 트랜잭션 관리",
    code: `async findById(id: string) {\n  const cached = await redis.get(id)\n  if (cached) return JSON.parse(cached)\n  return this.userRepo.findOne(id)\n}`,
    color: "amber",
    icon: "zap",
    details: ["비즈니스 규칙 적용", "캐시 조회 (Redis)", "트랜잭션 시작", "도메인 이벤트 발행"],
  },
  {
    id: "repository",
    label: "Repository",
    description: "데이터베이스 접근 추상화 레이어",
    code: `async findOne(id: string): Promise<User> {\n  return this.em.findOneOrFail(User, { id })\n}`,
    color: "cyan",
    icon: "database",
    details: ["SQL 쿼리 생성", "ORM 엔티티 매핑", "인덱스 활용", "N+1 문제 방지"],
  },
  {
    id: "database",
    label: "Database",
    description: "PostgreSQL 쿼리 실행 및 결과 반환",
    code: `SELECT * FROM users\nWHERE id = $1\nLIMIT 1`,
    color: "slate",
    icon: "hard-drive",
    details: ["쿼리 실행 계획", "인덱스 스캔", "데이터 직렬화", "커넥션 풀 반환"],
  },
]

export const apiExamples: ApiExample[] = [
  {
    method: "GET",
    path: "/api/users/me",
    description: "현재 로그인한 사용자 정보 조회",
    statusCode: 200,
    response: {
      id: "usr_abc123",
      email: "user@example.com",
      name: "홍길동",
      role: "user",
      createdAt: "2024-01-15T09:00:00Z",
    },
  },
  {
    method: "POST",
    path: "/api/auth/login",
    description: "이메일/비밀번호로 로그인 및 JWT 발급",
    request: { email: "user@example.com", password: "••••••••" },
    statusCode: 200,
    response: {
      accessToken: "eyJhbGciOiJIUzI1NiJ9...",
      refreshToken: "eyJhbGciOiJIUzI1NiJ9...",
      expiresIn: 3600,
    },
  },
  {
    method: "GET",
    path: "/api/orders?status=pending&page=1",
    description: "주문 목록 페이지네이션 조회",
    statusCode: 200,
    response: {
      data: [{ id: "ord_1", status: "pending", amount: 29900 }],
      total: 42,
      page: 1,
      pageSize: 20,
    },
  },
  {
    method: "POST",
    path: "/api/orders",
    description: "새 주문 생성 (트랜잭션 포함)",
    request: { productId: "prod_xyz", quantity: 2, paymentMethod: "card" },
    statusCode: 201,
    response: { id: "ord_new", status: "created", amount: 59800 },
  },
  {
    method: "DELETE",
    path: "/api/orders/:id",
    description: "주문 취소 (소프트 삭제)",
    statusCode: 204,
    response: {},
  },
]

export const httpStatusCodes = [
  { code: 200, label: "OK", description: "요청 성공", color: "green" },
  { code: 201, label: "Created", description: "리소스 생성 성공", color: "green" },
  { code: 204, label: "No Content", description: "성공, 응답 본문 없음", color: "green" },
  { code: 400, label: "Bad Request", description: "잘못된 요청 형식", color: "amber" },
  { code: 401, label: "Unauthorized", description: "인증 필요", color: "amber" },
  { code: 403, label: "Forbidden", description: "권한 없음", color: "amber" },
  { code: 404, label: "Not Found", description: "리소스 없음", color: "amber" },
  { code: 409, label: "Conflict", description: "리소스 충돌", color: "amber" },
  { code: 422, label: "Unprocessable", description: "유효성 검사 실패", color: "orange" },
  { code: 429, label: "Too Many Requests", description: "요청 빈도 초과", color: "orange" },
  { code: 500, label: "Internal Server Error", description: "서버 내부 오류", color: "red" },
  { code: 503, label: "Service Unavailable", description: "서비스 일시 중단", color: "red" },
]
