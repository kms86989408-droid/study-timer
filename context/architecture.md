# Architecture Context

## System Shape

- Client: Next.js PWA, React UI, 타이머 상태, 로컬 기록 캐시
- API: Next.js Route Handlers, Zod validation, Firebase ID token 검증
- Auth/Data: Firebase Auth Google 로그인, Firestore 사용자별 데이터 저장
- Deploy: EC2 + Docker + reverse proxy, 추후 ECS/Elastic Beanstalk 이전 가능 구조
- Observability: `/api/health`, container logs, AWS Billing Alert, 기본 CloudWatch 확인

## Key Components

- Timer core: 5분 단위 설정, 시작/일시정지/재개/종료/초기화 상태, 남은 시간 계산
- Visual timer: 남은 시간에 따라 줄어드는 이미지 또는 마스크 UI
- Session records: 공부/휴식 개별 세션과 일별 집계
- Calendar view: 월간 일별 공부/휴식 기록과 날짜별 세션 목록
- API client: 웹 UI와 API 호출 경계를 분리해 추후 앱 전환을 쉽게 한다.

## Current Code Structure

- `src/app`: Next.js App Router 진입점, 전역 스타일, PWA manifest
- `src/components`: 앱 화면을 구성하는 React UI 컴포넌트
- `src/features/settings`: 5분 단위 시간 설정 유틸과 unit test
- `src/features/timer`: 타이머 상태 머신, 공부/휴식 모드, 시작/일시정지/재개/종료/초기화 로직과 unit test
- `public`: PWA 아이콘 같은 정적 에셋
- Root config: TypeScript, Tailwind, ESLint, Vitest, Playwright 설정

## Data Flow

1. 사용자가 공부/휴식 시간을 5분 단위로 설정하고 타이머를 시작한다.
2. 클라이언트 타이머 로직이 남은 시간을 계산하고 시각적 이미지 상태를 갱신한다.
3. 세션 종료 시 로컬 기록에 먼저 저장한다.
4. 로그인 상태이면 API client를 통해 Firebase 인증 토큰과 함께 서버 API를 호출한다.
5. API는 사용자별 Firestore 문서에 세션과 일별 집계를 저장한다.
6. 캘린더 화면은 월간 집계와 날짜별 세션 목록을 조회해 표시한다.

## Integration Boundaries

- Firebase Auth: Google 로그인과 ID token 발급 경계
- Firestore: 사용자별 settings, sessions, daily summaries 저장 경계
- API routes: 웹과 추후 앱이 공유할 서버 인터페이스
- EC2 deploy: Docker image, environment variables, reverse proxy, health check 경계
- 시크릿: Firebase/AWS 키는 환경변수 또는 AWS 관리형 secret 저장소로만 주입한다.

## Risky Areas

- 타이머 정확도: 브라우저 백그라운드, sleep, tab 전환 시 시간 계산 오차
- 날짜 경계: 자정, 월 변경, 타임존 차이에 따른 일별 집계 오류
- 동기화: 로그인 전 로컬 기록과 Firestore 기록 병합
- 인증: 사용자별 데이터 분리와 권한 없는 API 요청 차단
- 배포: EC2 프리티어 리소스 제한, Docker 재시작, HTTPS 갱신

## Architecture TODO

- Firestore collection/document 구조 확정
- Dockerfile, docker-compose, reverse proxy 설정 확정
- ECS/Elastic Beanstalk 이전 시 필요한 배포 경계 문서화
