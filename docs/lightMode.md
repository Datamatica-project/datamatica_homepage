1️⃣ 색만 바꿔서 되는 요소들

(Geometry / Shader 로직 / Scene 구조 유지)

✅ A. Fog

구조 변경 없음

scene.fog.color만 변경

✅ B. CSS 배경 그라데이션

Three.js 구조 무관

CSS background만 변경

✅ C. 지형 솔리드 메시 색

Geometry 유지

material.color만 변경

✅ D. 격자선(LineSegments / wireframe)

Geometry 유지

lineMaterial.color / opacity 변경

✅ E. 데이터 포인트 (PointsMaterial)

Geometry 유지

pointsMaterial.color 변경

✅ F. Directional Light 색 / intensity

Light 객체 유지

color, intensity만 조정

✅ G. UI 표지판 / HTML Overlay 색상

CSS 컬러 변경만으로 해결 가능

2️⃣ 색만 바꿔서는 안 되고 구조 변경이 필요한 것들

이건 “조명 철학” 또는 “렌더링 방식”이 달라지는 부분이다.

❌ A. 태양 (SunriseGlow Shader)

현재 구조:

radial gradient

glow

emissive 기반 연출

발광 중심 오브젝트

라이트모드에서는:

glow 제거

emissive 제거

또는 태양 자체 제거

→ 쉐이더 로직 수정 필요

❌ B. Glow / Additive Blending

현재 다크는:

blending: THREE.AdditiveBlending

라이트모드에서 이거 쓰면 부자연스럽다.

→ blending 방식 변경 필요

❌ C. 발광 기반 포인트 연출

현재는 네온 강조.

라이트에서는:

발광 제거

단색 강조

그림자 기반 깊이

→ material 속성 일부 수정 필요

❌ D. 조명 구조 자체

다크:

colored lights 다수

분위기 중심

라이트:

white light 위주

그림자 중심

→ intensity 조정만이 아니라
→ 조명 배치/개수 일부 변경 필요

❌ E. 중앙 시각적 중심 (태양 의존 구조)

현재 씬은 태양 중심 구조다.

라이트모드에서 태양을 유지하면
기술 강조형과 충돌 가능.

→ 중앙 오브젝트 재설계 가능성 있음

3️⃣ 색만 바꿔서 되는 요소 — 원래 색 > 교체 색 매핑표

(기술 강조형 라이트모드 기준)

🌑 Fog
#021012
→ #F2F5F8
🌑 CSS 배경
#041818 → #CC3070
→
#F8FAFC → #E3E9F0
🌑 지형 솔리드
#0A1118
→ #E8EDF2
🌑 격자선
#00BBCC
→ #3A4B5C

(opacity 0.45 → 0.6)

🌑 데이터 포인트
#00CCFF
→ #D94A52

(브랜드 강조)

🌑 전면 / 후면 Directional Light
#D94A52
→ #FFFFFF 또는 #E6EAF0

intensity ↓

🌑 측면 블루 Light
#1A2A60
→ #DCE3EA
🌑 UI 텍스트
화이트 텍스트
→ #111827 (Dark gray)
📌 최종 구조 요약
1️⃣ 색만 바꾸면 되는 것

Fog

CSS 배경

지형 color

격자 color

포인트 color

light color/intensity

UI 색상

2️⃣ 구조 변경 필요한 것

태양 shader

glow 연출

additive blending

발광 기반 표현

중앙 시각적 중심
