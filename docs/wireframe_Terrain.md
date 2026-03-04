Wireframe Terrain (Point Landscape) 구현 가이드

스크롤 기반 1인칭 시점 지형 애니메이션

1. 개요

이 문서는 웹사이트에서 사용하는 Wireframe Terrain / Point Landscape 배경을 구현하는 방법을 설명한다.

주요 특징

와이어프레임 지형 생성

1인칭 시점 카메라 이동

스크롤 기반 전진 애니메이션

데이터 시각화 스타일 배경

대표 활용

기술 회사 히어로 섹션

데이터 플랫폼 소개 페이지

AI / 데이터 / 네트워크 컨셉 사이트

2. 구현 방식 개요

기본 구조

Plane Geometry (격자 평면)
↓
Vertex Height 생성 (Noise / Sin)
↓
Wireframe 렌더링
↓
Camera Forward Movement
↓
Scroll 기반 애니메이션

필요 데이터

없음

지형은 수학 함수로 생성한다.

3. 사용 기술

추천 기술 스택

Three.js
또는
React Three Fiber

보조 라이브러리

simplex-noise
three-noise
drei (R3F 사용 시) 4. 기본 지형 생성
Plane Geometry 생성
PlaneGeometry(width, height, widthSegments, heightSegments)

예시

const geometry = new THREE.PlaneGeometry(
200,
2000,
200,
200
)

설명

속성 설명
width 지형 가로
height 지형 길이
segments 지형 디테일 5. 지형 높이 생성

vertex 높이를 변경하여 산 형태를 만든다.

예시

const pos = geometry.attributes.position

for (let i = 0; i < pos.count; i++) {

const x = pos.getX(i)
const z = pos.getZ(i)

const height =
Math.sin(x _ 0.2) _ 2 +
Math.cos(z _ 0.15) _ 3

pos.setY(i, height)
}

pos.needsUpdate = true

결과

flat plane
→
mountain terrain 6. 와이어프레임 스타일 적용
const material = new THREE.MeshBasicMaterial({
color: 0x00ffff,
wireframe: true
})

또는

EdgesGeometry
LineSegments

사용 가능.

7. 지형 배치

지형을 바닥 방향으로 회전한다.

terrain.rotation.x = -Math.PI / 2 8. 카메라 설정 (1인칭 시점)
camera.position.set(
0,
5,
20
)

camera.lookAt(0,0,-100)

시점 구조

camera

↓

wireframe terrain 9. 스크롤 기반 전진 애니메이션

스크롤 값과 카메라 이동을 연결한다.

window.addEventListener("scroll", () => {

const scroll = window.scrollY

camera.position.z = 20 - scroll \* 0.02

})

동작

scroll down
→ camera forward
→ terrain fly-through 10. 무한 지형 구현

지형을 여러 개 배치하여 루프를 만든다.

terrain A
terrain B
terrain C

카메라 이동 시

뒤로 지나간 terrain
→ 앞쪽으로 재배치

결과

infinite terrain effect 11. 시각적 퀄리티 개선
Fog 추가
scene.fog = new THREE.Fog(
0x000000,
10,
200
)

효과

depth perception
Grid 밀도 조절
segments 증가

예

200 x 200
300 x 300
Glow 색상

데이터 스타일 추천 색상

cyan
blue
purple
red accent 12. 데이터 스타일 요소 추가
데이터 포인트
vertex 위치에 glow point
네트워크 노드
point → line connection
스캔 라인
horizontal scan beam
HUD 텍스트

예

X: 142.33
Y: -82.12
Mesh Density: 2.4M
Points: 1,243,221 13. 성능 최적화

추천 값

segments
150 ~ 250

렌더링 옵션

antialias true
pixelRatio 제한 14. 회사 홈페이지 적용 예

히어로 구조

Hero Section
├ Wireframe Terrain
├ Data Nodes
├ Scan Lines
└ Title Typography

예시 카피

From Raw Data
To Structured Intelligence 15. React Three Fiber 구조

추천 컴포넌트 구조

components
├ Terrain.jsx
├ CameraController.jsx
├ DataNodes.jsx
└ HeroScene.jsx 16. 확장 가능 기능

가능한 확장

mouse parallax
scroll speed control
terrain animation
shader based terrain
data flow particles 17. 참고 키워드

검색 키워드

threejs terrain noise
wireframe landscape
webgl terrain shader
scroll camera threejs
perlin noise terrain 18. 요약

구현 핵심

Plane Geometry

- Noise Height
- Wireframe
- Camera Movement
- Scroll Control

필요 데이터

없음

결과

데이터 지형 위를 이동하는 1인칭 시점 애니메이션
