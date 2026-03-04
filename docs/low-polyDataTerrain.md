# Low-Poly Data Terrain + Beacon + Label 연출 구현 가이드

스크롤 기반 **데이터 지형 시각화 히어로 섹션** 제작 문서

---

# 1. 개요

본 문서는 다음과 같은 연출을 웹에서 구현하는 방법을 설명한다.

특징

- Low-poly terrain
- 데이터 포인트 그리드
- 데이터 비콘(light pillar)
- 기술 라벨 표시
- 카메라 이동 기반 탐색 연출

대표 사용 사례

- 기술 회사 홈페이지 히어로 섹션
- 데이터 플랫폼 소개 페이지
- AI / 데이터 시각화 컨셉 디자인

---

# 2. 전체 구조

연출은 **여러 레이어로 구성된다**

```
Scene
 ├ Background Sky
 ├ Terrain Mesh
 ├ Ground Data Points
 ├ Data Beacon
 └ Floating Labels
```

렌더링 엔진

```
Three.js
또는
React Three Fiber
```

---

# 3. Terrain 생성

## Geometry

지형은 **PlaneGeometry** 기반으로 생성한다.

```
PlaneGeometry(width, height, segmentsX, segmentsY)
```

예

```javascript
const geometry = new THREE.PlaneGeometry(300, 300, 100, 100);
```

---

## Vertex Height 생성

vertex displacement로 산을 만든다.

예

```javascript
const pos = geometry.attributes.position;

for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const z = pos.getZ(i);

  const height = Math.sin(x * 0.1) * 3 + Math.cos(z * 0.15) * 4;

  pos.setY(i, height);
}

pos.needsUpdate = true;
```

---

## Material 설정

low-poly 스타일

```javascript
const material = new THREE.MeshStandardMaterial({
  color: "#1b2338",
  flatShading: true,
});
```

옵션

```
wireframe
flatShading
matcap
```

---

# 4. Ground Data Points

지면에 **데이터 포인트 필드**를 만든다.

구조

```
PointsGeometry
PointsMaterial
```

예

```javascript
const pointsMaterial = new THREE.PointsMaterial({
  color: "#ff4a5a",
  size: 0.2,
});

const points = new THREE.Points(geometry, pointsMaterial);
```

효과

```
data field
sensor grid
data nodes
```

---

# 5. Data Beacon (빛 기둥)

특정 위치에 데이터 포인트를 강조한다.

구조

```
ConeGeometry
transparent material
additive blending
```

예

```javascript
const beaconGeo = new THREE.ConeGeometry(1, 10, 16);

const beaconMat = new THREE.MeshBasicMaterial({
  color: "#ff4a5a",
  transparent: true,
  opacity: 0.6,
});

const beacon = new THREE.Mesh(beaconGeo, beaconMat);
```

위치

```
beacon.position.set(x, terrainHeight + 5, z)
```

---

# 6. Floating Labels

지형 위에 **데이터 라벨 / 기술 이름**을 표시한다.

예

```
AUTONOMOUS DRIVING
HD MAP
DATA LABELING
DIGITAL TWIN
SMART HEALTHCARE
```

---

## 라벨 구현 방법

### 방법 1 (추천)

HTML Overlay

```
3D position
→ screen projection
→ DOM element
```

React Three Fiber

```
<Html />
```

---

### 방법 2

Canvas Texture

```
Canvas
→ texture
→ Sprite
```

---

### 방법 3

3D Text

```
TextGeometry
troika-three-text
```

---

# 7. 카메라 이동

연출 핵심

```
camera forward movement
```

예

```javascript
camera.position.z -= speed;
```

또는

```
scroll 기반 이동
```

```javascript
window.addEventListener("scroll", () => {
  const scroll = window.scrollY;

  camera.position.z = baseZ - scroll * 0.02;
});
```

---

# 8. Depth Fog

깊이감을 만든다.

```javascript
scene.fog = new THREE.Fog(0x000000, 50, 300);
```

효과

```
멀리 있는 지형
→ 점점 사라짐
```

---

# 9. 조명

추천 구조

```
AmbientLight
DirectionalLight
```

예

```javascript
const ambient = new THREE.AmbientLight(0xffffff, 0.4);

const directional = new THREE.DirectionalLight(0xffffff, 1);
```

---

# 10. 라벨 데이터 구조

추천 데이터 구조

```javascript
const techNodes = [
  {
    name: "AUTONOMOUS DRIVING",
    position: [10, 0, -40],
  },

  {
    name: "HD MAP",
    position: [-15, 0, -90],
  },

  {
    name: "DATA LABELING",
    position: [25, 0, -140],
  },
];
```

---

# 11. 성능 최적화

권장 값

```
terrain segments
80 ~ 120
```

points 수

```
5k ~ 20k
```

라벨

```
30 이하
```

---

# 12. 회사 홈페이지 히어로 구조

추천 구조

```
Hero Scene

 ├ Terrain
 ├ Data Points
 ├ Data Beacons
 ├ Technology Labels
 └ Camera Motion
```

연출

```
스크롤
→ 지형 전진
→ 기술 라벨 등장
→ 데이터 비콘 강조
```

---

# 13. 디자인 스타일

다크 테마

```
terrain : dark blue
points : red / cyan
beacon : glow
labels : white
```

화이트 테마

```
terrain : light gray
points : #D94A52
beacon : red accent
labels : dark gray
```

---

# 14. 확장 가능 기능

추가 가능한 요소

```
scan line animation
particle flow
network connections
glow nodes
data flow animation
```

---

# 15. 요약

핵심 구성

```
Terrain Mesh
+ Data Points
+ Beacon
+ Labels
+ Camera Movement
```

결과

```
데이터 지형 위를 이동하며
기술 포인트를 탐색하는
인터랙티브 데이터 시각화
```
