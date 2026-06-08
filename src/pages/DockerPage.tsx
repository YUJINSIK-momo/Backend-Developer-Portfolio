import { useState } from "react"
import {
  Box,
  Boxes,
  Package,
  Layers,
  Server,
  Terminal,
  HardDrive,
  Network,
  RefreshCw,
  Activity,
  Scale,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Ship,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { CodeBlock } from "../components/ui/CodeBlock"

type ConceptId = string | null

const concepts = [
  {
    id: "image",
    name: "이미지 (Image)",
    icon: Package,
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    oneLiner: "앱 + 실행 환경을 통째로 찍어낸 설계도(스냅샷)",
    analogy: "냉동 도시락. 아직 데우지 않은 완성품. 몇 개든 똑같이 복제 가능",
    detail:
      "OS 베이스 + Node.js 런타임 + 내 코드 + 라이브러리까지 한 덩어리로 굳혀놓은 읽기 전용 파일. 이 이미지 하나만 있으면 어느 컴퓨터에서든 똑같이 실행된다. 한 번 만들면 내용이 바뀌지 않는다.",
  },
  {
    id: "container",
    name: "컨테이너 (Container)",
    icon: Box,
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    oneLiner: "이미지를 실제로 실행한 상태. 살아 움직이는 프로세스",
    analogy: "도시락을 데워서 먹고 있는 상태. 같은 냉동 도시락(이미지)으로 여러 개 데울 수 있음",
    detail:
      "이미지를 docker run 하면 컨테이너가 된다. 하나의 이미지로 컨테이너를 1개든 100개든 띄울 수 있다. 컨테이너는 격리된 작은 가상 공간에서 돌아가며, 끄면 사라진다(데이터는 볼륨에 따로 저장).",
  },
  {
    id: "dockerfile",
    name: "Dockerfile",
    icon: Terminal,
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    oneLiner: "이미지를 어떻게 만들지 적은 레시피 텍스트 파일",
    analogy: "도시락 조리법. '밥 깔고 → 반찬 올리고 → 포장' 순서를 글로 적어둔 것",
    detail:
      "베이스 이미지 선택(FROM) → 코드 복사(COPY) → 라이브러리 설치(RUN) → 실행 명령(CMD)을 한 줄씩 적는다. 이 파일을 docker build 하면 이미지가 만들어진다. 코드처럼 Git에 올려서 팀이 공유한다.",
  },
  {
    id: "volume",
    name: "볼륨 (Volume)",
    icon: HardDrive,
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    oneLiner: "컨테이너가 꺼져도 데이터를 남기는 외장 저장소",
    analogy: "도시락 통은 버려도 반찬은 따로 보관하는 냉장고",
    detail:
      "컨테이너는 끄면 내부 데이터가 사라진다. DB 데이터처럼 보존해야 하는 건 볼륨에 연결해 컨테이너 바깥에 저장한다. 컨테이너를 새로 띄워도 같은 볼륨을 붙이면 데이터가 유지된다.",
  },
  {
    id: "network",
    name: "네트워크 (Network)",
    icon: Network,
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    oneLiner: "컨테이너끼리 이름으로 서로 통신하는 통로",
    analogy: "같은 건물 안 내선전화. 'db', 'redis' 같은 이름으로 바로 연결",
    detail:
      "서버 컨테이너가 DB 컨테이너에 접속할 때 IP가 아니라 서비스 이름(예: postgres://db:5432)으로 부른다. docker-compose가 같은 네트워크로 묶어주면 컨테이너들이 서로를 이름으로 찾는다.",
  },
  {
    id: "registry",
    name: "레지스트리 (Registry)",
    icon: Boxes,
    color: "text-pink-400",
    border: "border-pink-500/30",
    bg: "bg-pink-500/10",
    oneLiner: "만든 이미지를 올리고 내려받는 창고 (Docker Hub 등)",
    analogy: "도시락 중앙 물류창고. 만든 도시락을 올려두면 어디서든 받아감",
    detail:
      "내 PC에서 build한 이미지를 docker push로 레지스트리에 올리면, 서버에서 docker pull로 똑같은 이미지를 내려받아 실행한다. 이게 '로컬과 서버가 같아지는' 핵심 통로다. Docker Hub, AWS ECR, GitHub Container Registry 등.",
  },
]

const macSteps = [
  {
    step: 1,
    title: "Docker Desktop 설치",
    desc: "맥에 Docker 엔진 + GUI 한 번에 설치",
    lang: "bash",
    code: `# Homebrew로 설치 (가장 간단)
brew install --cask docker

# 설치 후 Docker Desktop 앱을 한 번 실행
# 상단 메뉴바에 고래 아이콘이 뜨면 준비 완료

# 설치 확인
docker --version
docker run hello-world   # 테스트 컨테이너 실행`,
    note: "Apple Silicon(M1~M4) / Intel 맥 모두 지원. Docker Desktop이 켜져 있어야 docker 명령이 동작한다.",
  },
  {
    step: 2,
    title: "Dockerfile 작성",
    desc: "내 백엔드 앱을 어떻게 이미지로 만들지 정의",
    lang: "dockerfile",
    code: `# 프로젝트 루트에 'Dockerfile' 파일 생성 (Node.js 백엔드 예시)
FROM node:20-alpine        # 1. 가벼운 Node.js 20 베이스
WORKDIR /app               # 2. 컨테이너 안 작업 폴더

COPY package*.json ./      # 3. 의존성 목록만 먼저 복사
RUN npm ci                 # 4. 라이브러리 설치 (캐시 활용)

COPY . .                   # 5. 나머지 소스 전체 복사
RUN npm run build          # 6. 빌드 (TypeScript -> JS)

EXPOSE 3000                # 7. 3000 포트 사용 명시
CMD ["node", "dist/main.js"]   # 8. 컨테이너 시작 시 실행할 명령`,
    note: "package.json을 먼저 복사하는 이유: 코드만 바뀌면 npm 설치 단계는 캐시를 재사용해 빌드가 훨씬 빨라진다(레이어 캐싱).",
  },
  {
    step: 3,
    title: "이미지 빌드",
    desc: "Dockerfile → 실제 이미지로 굽기",
    lang: "bash",
    code: `# 현재 폴더(.)의 Dockerfile로 이미지 생성, 이름은 my-api
docker build -t my-api .

# 만들어진 이미지 확인
docker images
# REPOSITORY   TAG      SIZE
# my-api       latest   180MB`,
    note: "-t는 이미지에 붙이는 태그(이름). 끝의 '.'은 Dockerfile이 있는 현재 폴더를 빌드 대상으로 지정한다는 뜻.",
  },
  {
    step: 4,
    title: "컨테이너 실행",
    desc: "이미지를 데워서(run) 실제 서버 띄우기",
    lang: "bash",
    code: `# 이미지를 컨테이너로 실행
docker run -d -p 3000:3000 --name api my-api
#   -d        백그라운드 실행
#   -p 3000:3000   내 맥의 3000 -> 컨테이너의 3000 연결
#   --name api     컨테이너 이름 지정

# 이제 브라우저에서 http://localhost:3000 접속 가능

docker ps              # 실행 중인 컨테이너 목록
docker logs api        # 로그 확인
docker stop api        # 정지
docker rm api          # 삭제`,
    note: "-p(포트 매핑)를 안 하면 컨테이너는 격리돼 있어 맥에서 접속할 수 없다. 왼쪽이 내 맥, 오른쪽이 컨테이너 포트.",
  },
  {
    step: 5,
    title: "docker-compose로 여러 서비스 한 번에",
    desc: "서버 + DB + Redis를 명령어 하나로",
    lang: "yaml",
    code: `# docker-compose.yml — 백엔드 + PostgreSQL + Redis 한 묶음
services:
  api:
    build: .              # 위에서 만든 Dockerfile 사용
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:pw@db:5432/app
      REDIS_URL: redis://cache:6379
    depends_on: [db, cache]

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pw
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data   # 데이터 보존

  cache:
    image: redis:7

volumes:
  pgdata:`,
    note: "api에서 DB를 부를 때 IP가 아니라 서비스 이름 'db'로 접속하는 점에 주목. 같은 네트워크로 자동으로 묶이기 때문이다.",
  },
  {
    step: 6,
    title: "전체 스택 실행 / 종료",
    desc: "compose 명령어 한 줄로 환경 통째로 켜고 끄기",
    lang: "bash",
    code: `# 정의한 서비스 전부 한 번에 빌드 + 실행
docker compose up -d

docker compose ps        # 상태 확인
docker compose logs -f   # 전체 로그 실시간

# 전부 종료 + 컨테이너 정리
docker compose down

# 볼륨까지 같이 삭제 (DB 데이터 초기화)
docker compose down -v`,
    note: "이 한 줄(compose up)이면 새 팀원이 DB·Redis를 따로 설치할 필요 없이 동일한 개발 환경을 즉시 띄운다.",
  },
]

const cheatSheet = [
  { cmd: "docker ps", desc: "실행 중인 컨테이너 목록" },
  { cmd: "docker ps -a", desc: "정지된 것 포함 전체 컨테이너" },
  { cmd: "docker images", desc: "보유한 이미지 목록" },
  { cmd: "docker exec -it api sh", desc: "실행 중인 컨테이너 안으로 진입(셸)" },
  { cmd: "docker logs -f api", desc: "컨테이너 로그 실시간 확인" },
  { cmd: "docker stop / start api", desc: "컨테이너 정지 / 재시작" },
  { cmd: "docker rm api", desc: "컨테이너 삭제" },
  { cmd: "docker rmi my-api", desc: "이미지 삭제" },
  { cmd: "docker system prune", desc: "안 쓰는 컨테이너·이미지 일괄 정리" },
  { cmd: "docker compose up -d", desc: "compose 전체 백그라운드 실행" },
]

const k8sConcepts = [
  {
    name: "Pod",
    icon: Box,
    color: "text-cyan-400",
    desc: "컨테이너를 감싼 가장 작은 실행 단위. 보통 컨테이너 1개 = Pod 1개",
    analogy: "도시락 한 개",
  },
  {
    name: "Deployment",
    icon: Layers,
    color: "text-blue-400",
    desc: "'이 앱을 항상 3개 띄워둬'라고 원하는 상태를 선언. K8s가 알아서 맞춤",
    analogy: "'도시락 3개 항상 유지' 지시서",
  },
  {
    name: "ReplicaSet / 셀프힐링",
    icon: RefreshCw,
    color: "text-green-400",
    desc: "Pod가 죽으면 자동으로 새로 띄워 개수를 유지. 사람이 안 봐도 복구",
    analogy: "도시락 하나 상하면 즉시 새로 제조",
  },
  {
    name: "Service",
    icon: Network,
    color: "text-purple-400",
    desc: "여러 Pod 앞에 고정 주소를 두고 트래픽을 골고루 분배(내부 로드밸런서)",
    analogy: "주문 창구. 어느 도시락이 나가든 손님은 한 창구만 봄",
  },
  {
    name: "오토스케일링 (HPA)",
    icon: Scale,
    color: "text-amber-400",
    desc: "트래픽/CPU가 오르면 Pod 개수를 자동으로 늘리고, 한가하면 줄임",
    analogy: "점심 피크엔 도시락 라인 증설, 한가하면 축소",
  },
  {
    name: "Rolling Update",
    icon: Activity,
    color: "text-pink-400",
    desc: "새 버전을 하나씩 교체해 서비스 중단 없이 무중단 배포",
    analogy: "운영하면서 도시락 레시피를 한 통씩 교체",
  },
]

const k8sMacSteps = [
  {
    step: 1,
    title: "도구 설치 + 로컬 클러스터 시작",
    desc: "kubectl(조작 도구) + minikube(내 맥 안의 미니 쿠버네티스)",
    lang: "bash",
    code: `# 조작 도구 + 로컬 클러스터 설치
brew install kubectl
brew install minikube

# 내 맥 안에 1노드짜리 쿠버네티스 클러스터 시작
# (Docker Desktop이 켜져 있어야 함)
minikube start

# 클러스터 노드 확인
kubectl get nodes
# NAME       STATUS   ROLES           AGE   VERSION
# minikube   Ready    control-plane   30s   v1.30.0`,
    note: "minikube는 실제 K8s를 내 맥 안에 통째로 띄워 연습용으로 쓰는 도구. Docker Desktop 설정에서 Kubernetes를 켜는 방법도 있다.",
  },
  {
    step: 2,
    title: "내가 만든 이미지를 클러스터에 로드",
    desc: "앞서 docker build한 my-api를 minikube 안으로",
    lang: "bash",
    code: `# Docker 섹션에서 만든 my-api 이미지를 minikube로 복사
minikube image load my-api:latest`,
    note: "minikube는 내 맥의 도커와 분리된 환경이라 로컬 이미지를 바로 못 본다. load로 넣어줘야 한다. (Docker Hub 등 레지스트리에 push한 이미지면 이 단계는 불필요)",
  },
  {
    step: 3,
    title: "Deployment + Service 작성",
    desc: "'api를 3개 띄우고, 하나의 창구로 노출'을 선언",
    lang: "yaml",
    code: `# k8s.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3                 # Pod 3개를 항상 유지
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: my-api:latest
          imagePullPolicy: Never   # 로컬 로드한 이미지 사용
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  type: NodePort             # 외부에서 접속 가능하게 노출
  selector: { app: api }
  ports:
    - port: 3000
      targetPort: 3000`,
    note: "위가 Deployment(원하는 상태 선언), 아래가 Service(여러 Pod 앞의 고정 창구). replicas: 3 한 줄이 'Pod 3개 항상 유지'를 뜻한다.",
  },
  {
    step: 4,
    title: "배포 + 상태 확인",
    desc: "선언한 상태로 클러스터를 맞추고 접속",
    lang: "bash",
    code: `# 매니페스트 적용 (선언한 상태로 알아서 맞춰줌)
kubectl apply -f k8s.yaml

kubectl get pods         # Pod 3개가 Running 인지 확인
kubectl get deployment
kubectl get service

# 브라우저로 접속 (minikube가 URL을 열어줌)
minikube service api`,
    note: "apply는 '이 상태가 되게 해줘'라는 선언. 명령형으로 하나씩 띄우는 docker run과 달리, 원하는 결과만 적으면 K8s가 맞춘다.",
  },
  {
    step: 5,
    title: "셀프힐링 · 스케일 · 무중단 배포 체험",
    desc: "K8s가 자동으로 하는 일을 눈으로 확인",
    lang: "bash",
    code: `# Pod 하나를 강제로 삭제해본다
kubectl delete pod <pod-이름>
kubectl get pods    # 자동으로 새 Pod가 떠서 다시 3개 유지 → 셀프힐링

# 손으로 5개로 늘리기
kubectl scale deployment api --replicas=5

# 무중단 롤링 업데이트 (새 버전 이미지로 교체)
kubectl set image deployment/api api=my-api:v2
kubectl rollout status deployment/api`,
    note: "Pod를 지워도 다시 살아나는 게 셀프힐링, replicas 숫자만 바꾸면 즉시 늘어나는 게 스케일. 사람이 손대지 않아도 원하는 개수를 유지한다.",
  },
  {
    step: 6,
    title: "정리 / 클러스터 종료",
    desc: "리소스 삭제 후 minikube 정지",
    lang: "bash",
    code: `# 배포한 리소스 삭제
kubectl delete -f k8s.yaml

# 클러스터 정지 (다음에 minikube start로 재사용)
minikube stop

# 클러스터 완전 삭제 (초기화)
minikube delete`,
    note: "연습이 끝나면 minikube stop으로 자원을 아끼고, 완전히 비울 땐 delete. 정지는 상태 보존, 삭제는 초기화.",
  },
]

const dockerVsK8s = [
  { item: "역할", docker: "컨테이너 1개를 만들고 실행", k8s: "수십~수백 개 컨테이너를 자동 관리" },
  { item: "비유", docker: "도시락 통 하나", k8s: "도시락 공장 관리자" },
  { item: "단위", docker: "이미지 / 컨테이너", k8s: "Pod / Deployment / Service" },
  { item: "장애 복구", docker: "수동 재시작", k8s: "죽으면 자동으로 재생성(셀프힐링)" },
  { item: "확장", docker: "직접 여러 개 run", k8s: "트래픽 따라 자동 증감(오토스케일)" },
  { item: "적정 규모", docker: "로컬 개발 · 단일 서버", k8s: "다중 서버 · 대규모 트래픽" },
  { item: "학습 난이도", docker: "낮음 (먼저 익힐 것)", k8s: "높음 (필요해질 때 도입)" },
]

export function DockerPage() {
  const [openConcept, setOpenConcept] = useState<ConceptId>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Ship size={20} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Docker & Kubernetes</h1>
          <Badge variant="blue">Container</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          앱을 컨테이너에 담아 어디서든 똑같이 실행하는 Docker, 그리고 그 컨테이너들을 자동으로 관리하는 Kubernetes를
          도시락 비유로 이해하고 맥에서 직접 실행하는 방법까지 정리합니다.
        </p>
      </div>

      {/* 멘탈 모델 — 도시락 비유 */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Box size={18} className="text-blue-400" />
            <span className="text-base font-semibold text-blue-300">Docker = 도시락 통 하나</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            그 안에 백엔드 앱을 담아 실행하는 느낌. 통 하나에 코드·라이브러리·실행 환경을 전부 넣어두면,
            어느 컴퓨터에서 열어도 똑같이 작동한다.
          </p>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Boxes size={18} className="text-purple-400" />
            <span className="text-base font-semibold text-purple-300">Kubernetes = 도시락 공장 관리자</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            도시락을 몇 개 만들지, 어디에 보낼지, 문제가 생기면 다시 만들지 관리한다.
            Docker가 통 하나라면, K8s는 그 통 수십~수백 개를 자동으로 운영하는 공장장이다.
          </p>
        </div>
      </div>

      {/* 왜 Docker를 쓰는가 — Before / After */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-1">왜 쓰는가 — "내 컴퓨터에선 되는데" 문제</h2>
        <p className="text-xs text-slate-500 mb-5">
          Docker의 핵심 가치: 로컬 · 스테이징 · 프로덕션 환경을 거의 동일하게 만든다.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-lg border border-red-500/25 bg-red-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={15} className="text-red-400" />
              <span className="text-sm font-semibold text-red-300">Docker 없이</span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2"><span className="text-red-500/70">·</span>내 맥은 Node 20, 서버는 Node 18 → 동작 다름</div>
              <div className="flex items-start gap-2"><span className="text-red-500/70">·</span>새 팀원이 DB·Redis 일일이 직접 설치</div>
              <div className="flex items-start gap-2"><span className="text-red-500/70">·</span>"내 PC에선 되는데 서버에선 터져요"</div>
              <div className="flex items-start gap-2"><span className="text-red-500/70">·</span>OS·버전 차이로 배포할 때마다 변수 발생</div>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/25 bg-green-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={15} className="text-green-400" />
              <span className="text-sm font-semibold text-green-300">Docker로</span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2"><span className="text-green-500/70">·</span>환경까지 이미지에 담겨 어디서나 동일 실행</div>
              <div className="flex items-start gap-2"><span className="text-green-500/70">·</span>compose up 한 줄로 DB·Redis까지 즉시 구동</div>
              <div className="flex items-start gap-2"><span className="text-green-500/70">·</span>로컬에서 검증한 이미지를 그대로 서버에 배포</div>
              <div className="flex items-start gap-2"><span className="text-green-500/70">·</span>"내 PC = 서버" → 환경 차이가 사라짐</div>
            </div>
          </div>
        </div>
      </div>

      {/* 로컬 = 서버 동일 흐름 다이어그램 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-1">하나의 이미지, 어디서나 동일</h2>
        <p className="text-xs text-slate-500 mb-6">
          build로 만든 이미지를 레지스트리에 올리면, 로컬 · 스테이징 · 프로덕션이 같은 이미지를 pull해 실행한다.
        </p>
        <div className="flex flex-col items-center gap-0">
          <div className="rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-center">
            <div className="text-sm font-semibold text-purple-300">Dockerfile</div>
            <div className="text-xs text-slate-500">레시피</div>
          </div>
          <div className="flex flex-col items-center"><ArrowDown size={14} className="text-slate-500 my-1" /><span className="text-xs text-slate-600 mb-1">docker build</span></div>
          <div className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-5 py-2.5 text-center">
            <div className="text-sm font-semibold text-blue-300">이미지 (Image)</div>
            <div className="text-xs text-slate-500">앱 + 환경 스냅샷</div>
          </div>
          <div className="flex flex-col items-center"><ArrowDown size={14} className="text-slate-500 my-1" /><span className="text-xs text-slate-600 mb-1">push → pull (레지스트리)</span></div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
            {[
              { env: "로컬 (내 맥)", badge: "green" as const, c: "border-green-500/30 bg-green-500/5 text-green-300" },
              { env: "스테이징", badge: "amber" as const, c: "border-amber-500/30 bg-amber-500/5 text-amber-300" },
              { env: "프로덕션", badge: "pink" as const, c: "border-red-500/30 bg-red-500/5 text-red-300" },
            ].map((e) => (
              <div key={e.env} className={`rounded-lg border p-3 text-center ${e.c}`}>
                <Box size={16} className="mx-auto mb-1.5 opacity-80" />
                <div className="text-xs font-semibold">{e.env}</div>
                <div className="text-xs text-slate-500 mt-0.5">컨테이너 실행</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            세 환경 모두 <span className="text-blue-400">같은 이미지</span>를 실행 → 환경 차이로 인한 버그가 원천 제거된다.
          </p>
        </div>
      </div>

      {/* 핵심 개념 카드 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1">핵심 개념</h2>
        <p className="text-xs text-slate-500 mb-4">카드를 클릭하면 상세 설명이 펼쳐집니다.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {concepts.map((c) => {
            const Icon = c.icon
            const isOpen = openConcept === c.id
            return (
              <button
                key={c.id}
                onClick={() => setOpenConcept(isOpen ? null : c.id)}
                className={`text-left rounded-lg border p-4 transition-all hover:bg-slate-700/20 ${
                  isOpen ? `${c.border} ${c.bg}` : "border-slate-700/40"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${c.border} ${c.bg}`}>
                    <Icon size={13} className={c.color} />
                  </div>
                  <span className="text-sm font-semibold text-white">{c.name}</span>
                  <ChevronRight size={13} className={`text-slate-500 ml-auto transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{c.oneLiner}</p>
                <div className="mt-2 text-xs text-slate-500 flex items-start gap-1.5">
                  <span className="shrink-0">🍱</span>
                  <span>{c.analogy}</span>
                </div>
                {isOpen && (
                  <div className={`mt-3 p-3 rounded-lg border ${c.border} ${c.bg} text-xs ${c.color} leading-relaxed`}>
                    {c.detail}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 이미지 vs 컨테이너 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">이미지 vs 컨테이너 — 가장 헷갈리는 구분</h2>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={15} className="text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">이미지</span>
              <Badge variant="blue">설계도 · 정적</Badge>
            </div>
            <p className="text-xs text-slate-400">한 번 만들면 안 바뀌는 냉동 도시락. 디스크에 저장된 읽기 전용 파일.</p>
          </div>
          <div className="flex items-center justify-center text-slate-500">
            <ArrowRight size={18} className="hidden sm:block" />
            <ArrowDown size={18} className="sm:hidden" />
            <span className="text-xs mx-2">docker run</span>
          </div>
          <div className="flex-1 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Box size={15} className="text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300">컨테이너</span>
              <Badge variant="cyan">실행 · 동적</Badge>
            </div>
            <p className="text-xs text-slate-400">이미지를 데워 실행한 살아있는 프로세스. 하나의 이미지로 여러 개 띄울 수 있다.</p>
          </div>
        </div>
      </div>

      {/* 맥에서 실행하기 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Terminal size={16} className="text-cyan-400" />
          맥(macOS)에서 직접 실행하기
        </h2>
        <p className="text-xs text-slate-500 mb-5">설치부터 compose로 전체 스택을 띄우기까지 순서대로 따라하면 됩니다.</p>
        <div className="space-y-5">
          {macSteps.map((s) => (
            <div key={s.step} className="rounded-lg border border-slate-700/40 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-cyan-400">{s.step}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{s.title}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
              </div>
              <CodeBlock code={s.code} language={s.lang} />
              <div className="mt-2.5 flex items-start gap-2 text-xs text-slate-500 bg-slate-700/20 border border-slate-600/30 rounded-lg p-2.5">
                <span className="text-cyan-500/70 shrink-0">i</span>
                <span className="leading-relaxed">{s.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 명령어 치트시트 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">자주 쓰는 명령어 치트시트</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {cheatSheet.map((c) => (
            <div key={c.cmd} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-slate-900/50 border border-slate-700/40">
              <code className="text-xs font-mono text-cyan-400 shrink-0">{c.cmd}</code>
              <span className="text-xs text-slate-500 text-right ml-auto">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kubernetes 섹션 */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Boxes size={18} className="text-purple-400" />
          <h2 className="text-base font-semibold text-purple-300">Kubernetes — 컨테이너들의 공장 관리자</h2>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Docker로 컨테이너 하나는 잘 띄웠다. 그런데 <span className="text-slate-300">트래픽이 몰려 10개로 늘려야 하고</span>,
          <span className="text-slate-300"> 하나가 죽으면 자동 복구되어야 하고</span>,
          <span className="text-slate-300"> 무중단으로 새 버전을 배포</span>해야 한다면? 이걸 사람이 손으로 하긴 어렵다.
          Kubernetes(K8s)는 이 모든 걸 <span className="text-purple-300">자동으로 관리하는 오케스트레이터</span>다.
        </p>
      </div>

      {/* K8s 핵심 개념 */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">Kubernetes 핵심 개념</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {k8sConcepts.map((k) => {
            const Icon = k.icon
            return (
              <div key={k.name} className="rounded-lg border border-slate-700/40 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className={k.color} />
                  <span className={`text-sm font-semibold ${k.color}`}>{k.name}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{k.desc}</p>
                <div className="mt-2 text-xs text-slate-500 flex items-start gap-1.5">
                  <span className="shrink-0">🍱</span>
                  <span>{k.analogy}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 맥에서 K8s 실행하기 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Terminal size={16} className="text-purple-400" />
          맥(macOS)에서 Kubernetes 실행하기
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          minikube로 내 맥에 미니 클러스터를 띄우고, 앞서 만든 my-api 이미지를 3개로 배포해 셀프힐링·스케일까지 직접 체험합니다.
        </p>
        <div className="space-y-5">
          {k8sMacSteps.map((s) => (
            <div key={s.step} className="rounded-lg border border-slate-700/40 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-purple-400">{s.step}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{s.title}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
              </div>
              <CodeBlock code={s.code} language={s.lang} />
              <div className="mt-2.5 flex items-start gap-2 text-xs text-slate-500 bg-slate-700/20 border border-slate-600/30 rounded-lg p-2.5">
                <span className="text-purple-500/70 shrink-0">i</span>
                <span className="leading-relaxed">{s.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Docker vs Kubernetes */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-1">Docker vs Kubernetes — 언제 무엇을</h2>
        <p className="text-xs text-slate-500 mb-4">
          Docker를 먼저 충분히 익히고, 단일 서버로 감당이 안 될 때 Kubernetes를 도입하는 순서를 권장한다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2.5 px-3 text-xs text-slate-500 font-medium">항목</th>
                <th className="text-left py-2.5 px-3 text-xs text-blue-500 font-medium">Docker</th>
                <th className="text-left py-2.5 px-3 text-xs text-purple-500 font-medium">Kubernetes</th>
              </tr>
            </thead>
            <tbody>
              {dockerVsK8s.map((row) => (
                <tr key={row.item} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="py-2.5 px-3 text-xs text-slate-500">{row.item}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-300">{row.docker}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-300">{row.k8s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 마무리 원칙 */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
        <div className="flex items-start gap-3">
          <Server size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-blue-300 mb-1.5">정리</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              <span className="text-blue-300 font-medium">Docker</span>는 앱을 담는 도시락 통 — 로컬과 서버를 같은 환경으로 만든다.{" "}
              <span className="text-purple-300 font-medium">Kubernetes</span>는 그 도시락을 대량으로 운영·복구·확장하는 공장 관리자다.
              개인 프로젝트와 단일 서버는 Docker(+compose)로 충분하고, 트래픽과 가용성이 중요해지면 K8s로 확장한다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
