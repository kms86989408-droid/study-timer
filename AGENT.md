# study-timer Engineering System

## Mission

study-timer는 공부 시간과 휴식 시간을 5분 단위로 설정하고, 남은 시간이 시각적으로 줄어드는 이미지로 보이며, 일별 공부/휴식 기록을 캘린더에 남기는 개인용 PWA다.

이 문서는 에이전트가 study-timer 작업을 일관되고 안전하게 수행하기 위한 운영 기준이다. 에이전트는 추측보다 코드와 문서를 우선하고, 빠른 출력보다 검증 가능한 결과를 우선한다.

## Scope

- 기능 구현
- 버그 수정
- 리팩터링
- 코드 리뷰
- 테스트 및 검증
- 문서화

프로젝트 고유 배경지식은 `README.md`와 `context/`에, 반복 작업 규칙은 `playbooks/`와 `standards/`에 둔다.

## Confirmed Product Direction

- 앱 형태: Next.js 기반 PWA
- 핵심 기능: 5분 단위 공부/휴식 설정, 타이머, 줄어드는 이미지 기반 시각적 진행 UI, 일일/월간 캘린더 기록
- 데이터: 개별 세션과 일별 공부/휴식 집계를 함께 저장
- 인증/동기화: Firebase Auth Google 로그인 + Firestore 개인 데이터 동기화
- 배포: EC2 + Docker로 시작하고, 추후 ECS 또는 Elastic Beanstalk로 이전 가능하게 구성
- 비용 기준: 개인용/MVP 트래픽은 AWS 프리티어 또는 신규 크레딧 범위에서 시작한다.
- 진행률 %: 앱 타이머 UI가 아니라 개발 step 완료율을 의미한다.

## Source Of Truth

판단 우선순위는 아래 순서를 따른다.

1. 현재 사용자 요청
2. 실제 코드베이스와 실행 결과
3. `README.md`의 확정 플랜과 implementation steps
4. `context/`의 제품, 아키텍처, 용어, ADR 문서
5. 이 문서의 운영 규칙
6. `playbooks/`와 `standards/`의 세부 기준
7. 관례나 추정

코드, 설정, 테스트 결과와 충돌하는 추정은 버린다.

## Operating Principles

1. 먼저 이해한다. 수정 전에 관련 파일, 호출 흐름, 제약을 확인한다.
2. 작게 바꾼다. 한 번에 하나의 의도를 가진 변경을 선호한다.
3. 회귀를 막는다. 가능하면 테스트나 검증 명령으로 변경을 증명한다.
4. 추론을 노출한다. 가정, 리스크, 미검증 항목을 숨기지 않는다.
5. 기존 맥락을 존중한다. 이미 있는 패턴과 로컬 변경을 함부로 뒤집지 않는다.

## Standard Loop

모든 작업은 기본적으로 아래 루프를 따른다.

1. 요청을 재진술하고 성공 조건을 정리한다.
2. 관련 코드, 문서, 설정, 테스트를 탐색한다.
3. 작업 유형에 맞는 플레이북을 선택한다.
4. 변경 범위를 최소화한 계획을 세운다.
5. 현재 implementation step과 진행률 %에 미치는 영향을 확인한다.
6. 구현한다.
7. 가능한 범위에서 테스트, 린트, 수동 검증을 수행한다.
8. 결과, 리스크, 후속 작업을 간단히 보고한다.

## Routing

- 기능 구현: `playbooks/feature.md`
- 버그 수정: `playbooks/bugfix.md`
- 리팩터링: `playbooks/refactor.md`
- 코드 리뷰: `playbooks/review.md`
- 프론트엔드/UI 구현: `playbooks/frontend-design.md`

하나의 작업이 여러 성격을 가지면 주 작업을 기준으로 플레이북을 고르고, 나머지는 보조 체크리스트로만 사용한다.

## Project Documents

작업 전후로 아래 문서를 우선 확인하고 필요하면 갱신한다.

- 전체 플랜과 API outline: `README.md`
- 제품 목표와 범위: `context/product.md`
- 시스템 구조와 위험 구간: `context/architecture.md`
- 배포 결정: `context/adr-001-ec2-docker-deploy.md`
- 용어 정의: `context/glossary.md`
- 테스트 기준: `standards/testing.md`
- 완료 기준: `checks/done.md`

## UI Rules

- 화면, 컴포넌트, 대시보드, 상호작용 UI를 구현하거나 다듬는 작업은 `playbooks/frontend-design.md`를 함께 참고한다.
- UI를 변경한 모든 작업은 마무리 전에 `standards/ui-eval.md` 기준으로 검토한다.
- 타이머 첫 화면은 실제 사용 가능한 앱이어야 하며, 홍보용 랜딩 페이지로 시작하지 않는다.
- 남은 시간은 숫자 타이머와 함께 줄어드는 이미지 또는 마스크 UI로 확인 가능해야 한다.
- 진행률 %를 타이머 UI 요구사항으로 추가하지 않는다. 진행률 %는 작업 진행률 문서에만 사용한다.
- 기존 제품 UI가 확립되면 새 스타일을 강요하지 않고, 기존 시각 언어 안에서 품질을 끌어올린다.

## API And Data Rules

- 공개 API 변경은 `README.md`의 API outline과 `context/architecture.md`에 반영한다.
- 시간 설정은 5분 배수만 허용한다.
- 세션 원본과 일별 집계는 함께 유지한다.
- 로그인 전 로컬 기록은 Google 로그인 후 Firestore 데이터와 동기화하는 흐름을 고려한다.
- 사용자별 데이터 분리와 권한 없는 요청 차단은 API 테스트 대상이다.
- Firebase/AWS 시크릿은 코드와 문서에 직접 저장하지 않는다.

## Deployment Rules

- 1차 배포는 EC2 + Docker 기준으로 구현한다.
- EC2에는 앱 컨테이너와 reverse proxy만 둔다. DB는 EC2에 직접 설치하지 않는다.
- Docker 경계를 유지해 ECS 또는 Elastic Beanstalk로 이전 가능하게 한다.
- RDS, ALB, NAT Gateway는 프리티어/크레딧 범위 유지를 위해 1차 범위에서 제외한다.
- 배포 구현 시 `/api/health`, container health check, 배포 후 smoke test를 포함한다.

## Escalation Rules

아래 상황에서는 바로 진행하지 말고 리스크를 먼저 드러낸다.

- 데이터 삭제, 대량 변경, 마이그레이션처럼 되돌리기 어려운 작업
- 아키텍처 경계나 공개 인터페이스를 바꾸는 작업
- 외부 의존성 추가, 배포 파이프라인 변경, 보안 설정 변경
- 기존 로컬 변경과 충돌하는 작업
- 테스트 불가 상태에서 고위험 코드를 수정해야 하는 경우
- AWS 비용이 늘어날 수 있는 리소스 추가

## Definition Of Done

작업 종료 전 `checks/done.md`를 확인한다.
최소 완료 기준은 아래와 같다.

- 요청한 변경이 실제로 반영되었다.
- 관련 검증을 수행했거나, 수행하지 못한 이유를 명확히 적었다.
- 새 동작, 제약, 리스크를 전달했다.
- 후속 작업이 필요하면 숨기지 않고 남겼다.
- implementation step이 끝났다면 가장 가까운 unit test를 실행했다.
- 진행률 %가 바뀌는 작업이면 `README.md`와 관련 문서를 갱신했다.

## Documentation Discipline

- 확정 플랜과 단계별 진행률: `README.md`
- 제품 목적과 사용자 맥락: `context/product.md`
- 아키텍처 개요와 경계: `context/architecture.md`
- 배포 같은 큰 결정: `context/adr-*.md`
- 용어 정의: `context/glossary.md`
- 코드/테스트/리뷰/UI 품질 기준: `standards/`
- 반복 작업 방법과 UI 구현 플레이북: `playbooks/`
- 산출물 형식: `templates/`

자주 바뀌는 정보는 `AGENT.md`에 넣지 말고 하위 문서로 이동한다.

## Current Implementation Plan

현재 기준 implementation steps는 `README.md`를 따른다.

1. 프로젝트/문서 기반 세팅
2. 타이머 핵심 로직
3. 시각적 진행 UI
4. 기록 저장 및 캘린더
5. Google 로그인 및 개인 데이터 연동
6. API 안정화
7. EC2 + Docker 배포
8. 작업 진행률 관리와 최종 검증

각 step이 끝날 때마다 `standards/testing.md` 기준으로 가까운 unit test를 먼저 실행하고, `checks/done.md` 기준으로 완료 여부를 확인한다.
