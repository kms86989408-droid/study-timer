# Definition Of Done Checklist

## Required

- 요청한 변경이 반영되었다.
- 관련 코드와 영향 범위를 확인했다.
- 적절한 테스트 또는 검증을 수행했다.
- 수행하지 못한 검증이 있으면 이유를 남겼다.
- 사용자에게 결과와 리스크를 전달했다.

## Recommended

- 관련 문서를 갱신했다.
- 반복될 수 있는 문제라면 테스트나 가드레일을 추가했다.
- 큰 변경이면 후속 작업을 분리해 적었다.
- 작업 진행률 %를 최신 step 상태에 맞춰 갱신했다.

## Project Commands

Next.js 프로젝트 생성 후 실제 package scripts와 맞춘다.

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `docker compose up --build`
- `curl -f http://localhost:3000/api/health`
