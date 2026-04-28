# ADR 001: EC2 + Docker Deployment

## Status

Accepted

## Context

study-timer는 개인용/MVP 규모의 Next.js PWA로 시작한다. 초기 트래픽은 작을 것으로 예상되며, 배포 비용을 낮추고 AWS 프리티어 또는 신규 크레딧 범위에서 운영을 시작하는 것이 중요하다. 동시에 추후 서비스가 커지면 ECS 또는 Elastic Beanstalk로 이전할 수 있어야 한다.

## Decision

1차 배포는 단일 EC2 인스턴스에서 Docker 기반으로 운영한다.

- 앱은 production Docker image로 빌드한다.
- EC2에는 앱 컨테이너와 reverse proxy만 둔다.
- DB는 EC2에 직접 설치하지 않고 Firebase Auth/Firestore를 사용한다.
- HTTPS는 Caddy 또는 Nginx로 처리한다. 단순성을 우선하면 Caddy를 기본 후보로 둔다.
- GitHub Actions에서 test, build, Docker image build, EC2 deploy, smoke test 순서로 배포한다.
- `/api/health`를 배포 상태 확인 엔드포인트로 둔다.

## Consequences

- 장점: 비용이 낮고 구조가 단순하며, Docker 경계 덕분에 이후 ECS/Elastic Beanstalk 이전이 쉽다.
- 장점: Firestore를 사용하므로 EC2에서 DB 백업, 패치, 장애 복구를 직접 관리하지 않아도 된다.
- 단점: EC2 OS 패치, 보안 그룹, SSL, 로그, 재시작 정책은 직접 관리해야 한다.
- 후속 작업: Dockerfile, docker-compose, reverse proxy 설정, GitHub Actions workflow, Billing Alert를 구현 단계에서 추가한다.
