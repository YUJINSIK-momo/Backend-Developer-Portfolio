# 유진식 포트폴리오

**사이트: https://yujinsik-momo.github.io/Backend-Developer-Portfolio/**

AI 가 일하는 길을 깔고, 사람이 결정하는 자리를 지키는 AI · AX 백엔드 / 인프라 개발자 유진식의 포트폴리오입니다.

| 메뉴 | 내용 |
|---|---|
| [프로젝트](https://yujinsik-momo.github.io/Backend-Developer-Portfolio/work) | 운영 중인 회사 시스템과 개인 프로젝트 — 분야별 필터 |
| [디자인 시스템 하네스](https://yujinsik-momo.github.io/Backend-Developer-Portfolio/work/design-harness) | Slack 화면 요청 → 에이전트 화면 생성 → 배포 → 승인 버튼 |
| [블루맵스 상권 분석 서비스](https://yujinsik-momo.github.io/Backend-Developer-Portfolio/work/blue-maps) | Terraform AWS 인프라 · 보안 설계 · GPT 리뷰 릴리스 하네스 |
| [AI · AX](https://yujinsik-momo.github.io/Backend-Developer-Portfolio/ax) | 하네스 엔지니어링 원칙과 부품 |
| [학습 노트](https://yujinsik-momo.github.io/Backend-Developer-Portfolio/notes) | LLM · Claude Code · 백엔드 · 인프라 개념 정리 18편 |

하네스를 새 프로젝트에 적용하는 방법은 [Design-Dev-Infra-Pipeline](https://github.com/YUJINSIK-momo/Design-Dev-Infra-Pipeline) 문서에 정리했습니다.

## 개발

```bash
npm ci
npm run dev      # 개발 서버
npm test         # 데이터 정합성 + 공개 금지 식별자 검사
npm run lint
npm run build
```

`main` 에 push 하면 GitHub Actions 가 lint → test → build 를 통과한 경우에만 GitHub Pages 로 배포합니다.

화면은 직접 만든 **yuyu UI**(`src/components/yuyu`, 토큰 `src/styles/yuyu-tokens.css`)로 그립니다 — 견본: [/yuyu](https://yujinsik-momo.github.io/Backend-Developer-Portfolio/yuyu).
