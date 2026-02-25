# 🎯 Next.js Hero Lab - 3D Core + Abstract Field Workflow

## 목적

Three.js 기반 중앙 코어 오브젝트 + Abstract Field 네트워크를  
실험/디자인하기 위한 전용 Next.js 환경 구축

---

# 1️⃣ 프로젝트 생성

## 1.1 Next.js App Router 기반 생성

npx create-next-app@latest hero-lab
cd hero-lab

옵션:

- TypeScript: Yes
- App Router: Yes
- Tailwind: 선택 (있으면 편함)
- src directory: Yes
- ESLint: Yes

---

# 2️⃣ 3D 라이브러리 설치

npm install three @react-three/fiber @react-three/drei

선택 (후처리용):
npm install @react-three/postprocessing

---

# 3️⃣ 폴더 구조 설계

src/
├── app/
│ └── page.tsx
├── components/
│ ├── HeroScene.tsx
│ ├── Core.tsx
│ └── Network.tsx
└── styles/

---

# 4️⃣ 기본 Scene 구성

## 4.1 HeroScene.tsx

구성 계층:

[Canvas]
├── Lights
├── Core (Z = 0)
└── Network (Z 분산)

카메라 기본값:
position: [0, 0, 8]
fov: 50

---

# 5️⃣ Core 구현 단계

## 5.1 Geometry 선택

기본: Icosahedron

<icosahedronGeometry args={[2, 0]} />

---

## 5.2 Material 세팅 (화이트 프리미엄 기준)

color: #e8ebef
roughness: 0.55
metalness: 0.25

---

## 5.3 조명 기본값

ambientLight: 0.3

directionalLight A:
position: [5, 5, 5]
intensity: 1.2

directionalLight B:
position: [-4, -3, -5]
intensity: 0.4

---

## 5.4 회전 설정

Y축: 0.002
X축: 0.0005

→ 보일 듯 말 듯

---

# 6️⃣ Network 설계 전략 (Abstract Field)

## 6.1 구조 원칙

- Core를 감싸지 않음
- 일부 노드만 시각적으로 강조
- 선 opacity 0.1 ~ 0.2 유지
- 노드 수 30~50

---

## 6.2 공간 분포

Network Z 범위:
-3 ~ +3

Core Z:
0

Camera Z:
8

---

# 7️⃣ 레이어 구성 원칙

Z-depth 구조:

Background gradient → Z -10
Network → Z -2 ~ +2
Core → Z 0
UI → DOM 레이어 (absolute)

---

# 8️⃣ 스타일링 전략

## 배경 (화이트 기준)

radial-gradient:
#f5f7fa → #e5e9ef

또는 다크:

#0f172a

---

# 9️⃣ 성능 관리

- 노드 최대 60개 이하 유지
- distance 계산 최소화
- useMemo로 초기 좌표 고정
- 매 프레임 재계산 금지

---

# 🔟 실험 순서

1. Core만 렌더링
2. 조명 확정
3. 카메라 확정
4. Network 최소 노드 테스트
5. 밀도 조정
6. 색상 조정
7. 미묘한 인터랙션 추가

---

# 🚫 하지 말 것

- OrbitControls 과한 사용
- 네트워크 밀도 과다
- 순백색 material 사용
- 빠른 회전
- 과한 Bloom

---

# 🎨 디자인 체크리스트

□ Core가 1초 안에 시선 집중되는가?
□ Network가 배경처럼 느껴지는가?
□ 과하지 않은가?
□ 정적 상태에서도 고급스러운가?

---

# 🔥 다음 단계

- Bloom 추가 실험
- Edge 라인 추가
- 마우스 Parallax 추가
- 다크 테마 버전 비교

---

End of Workflow
