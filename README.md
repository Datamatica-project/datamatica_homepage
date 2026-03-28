# DataMatica Homepage

DataMatica 공식 홈페이지 프로젝트입니다. 자율주행, 공간정보, AI 데이터 솔루션을 제공하는 데이터 전문 기업의 기업 소개 웹사이트입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| 3D Graphics | Three.js, @react-three/fiber, @react-three/drei |
| Email | Resend |
| Runtime | Node.js |

## 주요 기능

- **인터랙티브 3D 지형 시각화** - Three.js 기반 스크롤 연동 3D 애니메이션
- **다크/라이트 테마** - localStorage 기반 테마 유지
- **문의 폼** - Resend API를 통한 이메일 전송
- **SEO 최적화** - Open Graph, 구조화 데이터(JSON-LD), sitemap, robots.txt
- **반응형 디자인** - Tailwind CSS 기반 모바일 대응

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 메인 홈페이지 (3D 지형 + 섹션들) |
| `/business` | 사업 분야 소개 |
| `/business/[skillId]/[projectId]` | 프로젝트 상세 페이지 |
| `/history` | 회사 연혁 타임라인 |
| `/news` | 뉴스 및 공지사항 |

## 시작하기

### 요구 사항

- Node.js 18 이상
- [Resend](https://resend.com) 계정 (문의 폼 이메일 발송용)

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 설정합니다.

```
RESEND_API_KEY=your_resend_api_key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 린트

```bash
npm run lint
```

## 프로젝트 구조

```
datamatica_homepage/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 홈 페이지
│   ├── layout.tsx          # 루트 레이아웃
│   ├── business/           # 사업 분야 페이지
│   ├── history/            # 회사 연혁 페이지
│   ├── news/               # 뉴스 페이지
│   ├── api/contact/        # 문의 이메일 API
│   ├── sitemap.ts          # SEO 사이트맵
│   └── robots.ts           # SEO robots.txt
├── components/
│   ├── home/               # 홈 페이지 섹션 컴포넌트
│   ├── business/           # 사업 분야 컴포넌트
│   ├── history/            # 연혁 컴포넌트
│   ├── news/               # 뉴스 컴포넌트
│   ├── layout/             # Header, Footer
│   ├── common/             # 공통 컴포넌트
│   └── Icons/              # 아이콘 컴포넌트
├── data/                   # 정적 데이터
│   ├── index.ts            # 프로젝트·스킬 데이터
│   ├── news.ts             # 뉴스 데이터
│   └── history.ts          # 연혁 데이터
└── public/                 # 정적 에셋 (이미지, 폰트 등)
```
