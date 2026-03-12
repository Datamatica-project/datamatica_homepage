# Business Page Layout Design

## 목적

메인 페이지의 **사업 분야 카드(6개 기술)**를 클릭했을 때 이동하는  
`사업 분야 페이지`의 구조를 설계한다.

본 페이지는 다음 목적을 가진다.

- 각 기술 분야별 사업 내용을 체계적으로 소개
- 사업 확장에 대응 가능한 구조 제공
- 이미지 및 프로젝트 결과물 표시
- 기존 홈페이지 디자인과 일관성 유지

---

# 페이지 구조

Business Page
│
├ Hero Section
│
├ Tech Category Tabs (6개 기술)
│
├ Selected Tech Overview
│
├ Projects Grid
│
├ Optional Highlight Section
│
└ Footer

---

# 1. Hero Section

페이지 상단에 사업 분야 전체를 설명하는 영역

### 구성

- 페이지 제목
- 간단한 설명
- 여백 중심 미니멀 디자인

### 예시

```
사업 분야

데이터 기반 기술을 통해 다양한 산업 문제를 해결합니다.
```

---

# 2. 기술 카테고리 탭

메인페이지에서 제공하는 **6개 기술 분야**를 탭으로 구성한다.

### 목적

- 하나의 페이지에서 분야 전환
- UX 단순화
- 구조 확장 가능

### UI 구조

```
[ 자율주행 ] [ AI 데이터 구축 ] [ 스마트 안전 ] [ ... ] [ ... ] [ ... ]
```

### 스타일

inactive

```
background: transparent
border-bottom: 1px solid #ddd
color: #666
```

active

```
border-bottom: 3px solid #D94A52
font-weight: 600
color: #111
```

---

# 3. 기술 설명 영역

선택된 기술의 개요를 보여주는 영역

### 구성

- 기술 이름
- 기술 설명
- 대표 이미지

### Wireframe

```
--------------------------------
자율주행 관제

센서 기반 데이터 분석과 실시간 모니터링을 통해
자율주행 환경을 구축합니다.

[ 대표 이미지 ]
--------------------------------
```

---

# 4. 프로젝트 목록 (핵심 영역)

각 기술에 속한 **세부 사업 목록**을 보여준다.

### 특징

- 카드형 구조
- 이미지 포함
- 확장 가능
- 동일한 디자인 유지

### Grid Layout

```
3 column grid
```

### Wireframe

```
┌───────────────┐
│               │
│ 프로젝트 이미지 │
│               │
├───────────────┤
│ 프로젝트 이름  │
│               │
│ 프로젝트 설명  │
│               │
│ → 자세히보기  │
└───────────────┘
```

### Grid Example

```
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ 프로젝트 이미지 │ │ 프로젝트 이미지 │ │ 프로젝트 이미지 │
│               │ │               │ │               │
│ HD MAP 구축   │ │ 차량 관제 시스템 │ │ 교통 데이터 분석 │
│ 설명 텍스트   │ │ 설명 텍스트     │ │ 설명 텍스트     │
│ → 자세히보기  │ │ → 자세히보기    │ │ → 자세히보기    │
└───────────────┘ └───────────────┘ └───────────────┘
```

---

# 5. 대표 프로젝트 Highlight (선택)

특정 기술 분야의 대표 프로젝트를 강조하는 영역

### 목적

- 핵심 기술 강조
- 시각적 임팩트

### 구조

```
대표 프로젝트

[ large image ]

Lidar 기반 3D 경로 생성 플랫폼
```

---

# 6. 확장 가능한 데이터 구조

사업이 추가되더라도 구조 변경 없이 확장 가능하도록 설계한다.

### Example Data Structure

```javascript
const businessFields = [
  {
    id: "autonomous",
    title: "자율주행 관제",
    description: "센서 기반 자율주행 기술",
    image: "/images/autonomous.jpg",
    projects: [
      {
        title: "HD MAP 구축",
        desc: "LiDAR 기반 고정밀 지도 생성",
        image: "/projects/hdmap.jpg",
      },
      {
        title: "차량 관제 시스템",
        desc: "실시간 차량 모니터링",
        image: "/projects/vehicle.jpg",
      }
    ]
  }
];
장점

기술 추가 가능

프로젝트 추가 가능

이미지 포함 가능

일관된 UI 유지

7. 디자인 원칙

현재 홈페이지 디자인과의 일관성을 유지한다.

유지 요소
✔ 넓은 여백
✔ 카드 중심 레이아웃
✔ 이미지 중심 콘텐츠
✔ minimal text
✔ hover interaction
카드 hover 효과
hover
 ├ image zoom
 ├ shadow 증가
 └ subtle animation
8. 최종 페이지 구조
Header

Hero Section

Tech Category Tabs

Tech Overview

Project Grid

Optional Highlight

Footer
기대 효과

이 구조를 사용하면 다음 장점이 있다.

사업 확장 대응 가능

UI 일관성 유지

유지보수 용이

콘텐츠 추가 쉬움

기업 기술 설명에 적합
```
