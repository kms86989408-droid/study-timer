# study-timer

공부 시간과 휴식 시간을 5분 단위로 설정하고, 실행 중 남은 시간이 시각적으로 줄어드는 이미지로 보이는 개인용 공부 타이머 PWA.

## Confirmed Direction

- 앱 형태: Next.js 기반 PWA
- 배포: EC2 + Docker로 시작하고, 추후 ECS 또는 Elastic Beanstalk로 이전 가능하게 구성
- 데이터: Firebase Auth Google 로그인 + Firestore 개인 데이터 동기화
- 기록: 개별 세션과 일별 공부/휴식 집계를 함께 저장
- UI 핵심: 타이머, 5분 단위 설정, 줄어드는 이미지, 일일/월간 캘린더 기록
- 운영 목표: 개인용/MVP 트래픽은 AWS 프리티어 또는 신규 크레딧 범위에서 시작

## Recommended Stack

- Frontend/App: Next.js 16, React 19, TypeScript, PWA
- UI: Tailwind CSS, lucide-react
- API/Validation: Next.js Route Handlers, Zod
- Auth/Data: Firebase Auth, Firestore
- Tests: Vitest, React Testing Library, Playwright
- Deploy: EC2, Docker, Docker Compose, Caddy or Nginx, GitHub Actions
- Ops: AWS Billing Alert, CloudWatch logs, `/api/health`

## Project Commands

- `npm run dev`: Next.js 개발 서버
- `npm run typecheck`: TypeScript 정적 검증
- `npm run lint`: ESLint 검증
- `npm run test`: Vitest unit test
- `npm run test:unit`: Vitest unit test
- `npm run test:e2e`: Playwright end-to-end test
- `npm run build`: production build

## API Outline

- `GET /api/me`: 현재 사용자 프로필 조회
- `GET /api/settings`: 공부/휴식 기본 설정 조회
- `PUT /api/settings`: 5분 단위 공부/휴식 시간 저장
- `POST /api/sessions`: 공부 또는 휴식 세션 저장
- `GET /api/sessions?from=YYYY-MM-DD&to=YYYY-MM-DD`: 기간별 세션 조회
- `GET /api/daily-summary?month=YYYY-MM`: 월간 캘린더용 일별 집계 조회
- `PATCH /api/sessions/:id`: 세션 메모 또는 시간 보정
- `DELETE /api/sessions/:id`: 잘못 기록된 세션 삭제
- `GET /api/health`: EC2/Docker 배포 상태 확인

## Implementation Steps

현재 구현 진행률: 25% (2/8 step 완료)

진행률 계산: 완료된 step 수 / 전체 8개 step * 100

1. 프로젝트/문서 기반 세팅 - 완료
   - Next.js, TypeScript, Tailwind, 테스트 환경 구성
   - 제품 목적, 아키텍처, 테스트 명령, 완료 기준 문서 갱신
   - EC2 + Docker 배포 ADR 유지
   - 완료 후 unit test: 기본 렌더링, 설정 유틸 테스트 통과

2. 타이머 핵심 로직 - 완료
   - 공부/휴식 시간을 5분 단위로 선택
   - 시작, 일시정지, 재개, 종료, 초기화 상태 구현
   - 남은 시간 계산
   - 완료 후 unit test: 시간 감소, 상태 전환, 5분 단위 검증 통과

3. 시각적 진행 UI
   - 남은 시간에 따라 줄어드는 이미지/마스크 UI 구현
   - 숫자 타이머와 공부/휴식 모드 표시
   - 완료 후 unit test: 남은 시간별 이미지 상태와 UI 표시 검증

4. 기록 저장 및 캘린더
   - 로그인 전 로컬 세션 기록
   - 일별 공부/휴식 합계 계산
   - 월간 캘린더와 날짜별 세션 목록 구현
   - 완료 후 unit test: 세션 저장, 일별 집계, 월별 표시

5. Google 로그인 및 개인 데이터 연동
   - Firebase Auth Google 로그인 적용
   - Firestore 사용자별 settings/sessions/daily summaries 저장
   - 로그인 후 로컬 기록 동기화
   - 완료 후 unit test: 인증 처리, 저장/조회 mock 테스트

6. API 안정화
   - Zod validation 적용
   - 오류 응답 형식 통일
   - API client 모듈로 호출 경계 정리
   - `/api/health` 추가
   - 완료 후 unit test: 정상/실패 응답, 권한 없는 요청, validation 실패

7. EC2 + Docker 배포
   - Dockerfile, docker-compose, production env 예시 작성
   - EC2 보안 그룹은 22, 80, 443만 허용
   - reverse proxy와 HTTPS 설정
   - GitHub Actions 배포 workflow 구성
   - 완료 후 test: Docker build, container health check, 배포 후 smoke test

8. 작업 진행률 관리와 최종 검증
   - 각 step 완료 여부 기준으로 개발 진행률 % 산정
   - `templates/test-plan.md` 형식으로 검증 결과 정리
   - `checks/done.md` 기준으로 최종 완료 확인
   - 완료 후 test: typecheck, lint, unit, Playwright 핵심 시나리오
