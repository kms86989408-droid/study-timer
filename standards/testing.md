# Testing Standards

## Default Expectations

1. 변경과 가장 가까운 검증부터 수행한다.
2. 버그 수정에는 가능한 한 재현 또는 회귀 검증을 추가한다.
3. 테스트를 못 돌렸다면 이유와 남은 리스크를 명확히 기록한다.

## Verification Order

1. 정적 검증: 타입, 린트, 빌드
2. 단위 검증: 변경 함수 또는 모듈
3. 통합 검증: 호출 흐름, API, 상태 전이
4. 수동 검증: UI, 운영 시나리오, 로그 확인

## Project Commands

아래 명령은 `package.json` scripts와 맞춰 유지한다.

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run build`
- `docker compose up --build`

## When Tests Are Missing

- 회귀 위험이 높은 경로면 테스트 추가를 우선 검토한다.
- 테스트 추가가 과도하면 최소한 재현 절차와 수동 검증 절차를 남긴다.

## Step-Level Rule

각 implementation step이 끝날 때마다 변경과 가장 가까운 unit test를 먼저 실행한다.

- 타이머 로직: 시간 감소, 상태 전환, 5분 단위 검증
- 시각적 진행 UI: 남은 시간별 이미지 상태와 UI 표시 검증
- 기록/캘린더: 세션 저장, 일별 집계, 월별 표시 검증
- 인증/API: 인증 처리, 사용자별 데이터 분리, validation 실패 검증
- 배포: Docker build, container health check, 배포 후 smoke test
