# FutsalHub (풋살허브)

> **"풋살인들을 위한 스마트한 구장 예약 플랫폼"**

FutsalHub는 풋살 경기장 예약의 번거로움을 해결하고, 관리자와 사용자 모두에게 최적화된 예약 경험을 제공하는 풀스택 웹 애플리케이션

---

## 주요 기능 (Key Features)

* **스마트 구장 예약**: NestJS 기반의 견고한 백엔드 로직으로 중복 없는 실시간 예약 지원
* **구장 이미지 관리**: AWS S3를 연동하여 구장 정보를 시각적으로 관리하면서 이미지 업로드 기능 제공
* **자동 알림 시스템**: 예약 완료 시 이메일 알림 기능을 통해 사용자에게 즉각적인 피드백 제공
* **보안성 높은 인프라**: AWS(CloudFront, ALB, ECS)와 Cloudflare를 결합하여 높은 보안성 확보
* **커뮤니티 시스템**: 공지사항을 비롯한 게시판 기능의 커뮤니티를 통한 소통 시스템 제공

---

## 기술 스택 (Tech Stack)

### **Frontend**
- **Framework**: Next.js (App Router)
- **Styling**: CSS
- **State Management**: React Hooks & Context API

### **Backend**
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL (TypeORM)
- **Email**: Nodemailer

### **Infrastructure & DevOps**
- **Cloud**: AWS (S3, CloudFront, ECS, ECR, ALB, ACM)
- **DNS/Security**: Cloudflare (SSL/TLS Full, DNS Proxy)
- **CI/CD**: GitHub Actions

---

## 시스템 아키텍처 (Architecture)

```mermaid
graph LR
    User((사용자)) --> Cloudflare[Cloudflare DNS/WAF]
    Cloudflare --> CF[AWS CloudFront]
    CF --> S3[AWS S3 - Static Assets]
    
    Cloudflare --> ALB[AWS Application Load Balancer]
    ALB --> ECS[AWS ECS - NestJS Backend]
    ECS --> RDS[(PostgreSQL)]
