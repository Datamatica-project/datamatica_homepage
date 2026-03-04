이 세 가지는 사실 게임 엔진에서 자주 쓰는 시네마틱 연출입니다.

1️⃣ horizon volumetric glow
2️⃣ terrain rim lighting
3️⃣ distance atmospheric scattering

각각을 지금 코드 기준으로 어디에 추가하는지 정확히 설명하겠습니다.

1️⃣ Horizon Volumetric Glow

(수평선 안개빛)

지금은 단순 plane glow 입니다.

PlaneGeometry

그래서 2D 빛 띠처럼 보입니다.

볼륨 느낌을 만들려면
transparent fog cylinder를 하나 추가하면 됩니다.

새 컴포넌트
function HorizonVolume() {
const geo = useMemo(
() => new THREE.CylinderGeometry(200, 500, 180, 64, 1, true),
[]
)

const mat = useMemo(
() =>
new THREE.MeshBasicMaterial({
color: 0xff4a6e,
transparent: true,
opacity: 0.08,
side: THREE.BackSide,
depthWrite: false,
}),
[]
)

return (
<mesh
geometry={geo}
material={mat}
position={[0, 60, -420]}
/>
)
}
TerrainScene에 추가
<Stars />
<HorizonGlow />
<HorizonVolume />
효과
기존
──────── glow line

추가 후

```volumetric fog glow

즉 빛이 공기 속에서 퍼지는 느낌이 생깁니다.

2️⃣ Terrain Rim Lighting

(지형 윤곽선 빛)

지금 지형은

MeshStandardMaterial

만 사용해서 윤곽이 조금 평면적입니다.

Rim light는 view angle 기반 emission을 추가하는 방식입니다.

Three.js에서는 onBeforeCompile shader patch로 쉽게 넣을 수 있습니다.

terrain material 수정

기존

const solidMat = new THREE.MeshStandardMaterial({
  color: 0x2b4a88,
  flatShading: true,
  roughness: 0.35,
  metalness: 0.35,
})

아래 코드 추가

solidMat.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <dithering_fragment>",
    `
      float rim = 1.0 - dot(normalize(vNormal), normalize(vViewPosition));
      rim = pow(rim, 2.5);

      gl_FragColor.rgb += rim * vec3(1.0, 0.2, 0.4) * 0.25;

      #include <dithering_fragment>
    `
  )
}
효과

멀리 있는 산이

어두움

에서

윤곽선이 핑크로 빛남

으로 바뀝니다.

이건 레퍼런스 이미지에서 산 능선이 밝은 이유입니다.

3️⃣ Distance Atmospheric Scattering

(거리 안개)

현재 fog는

scene.fog = new THREE.Fog(...)

입니다.

이건 선형 안개라서 조금 단순합니다.

추천은 FogExp2입니다.

수정

기존

scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR)

→ 변경

scene.fog = new THREE.FogExp2(FOG_COLOR, 0.0018)
효과
가까움 → 선명
멀어짐 → 부드럽게 사라짐

즉

distance haze

가 생깁니다.

⭐ 보너스 (추천)

현재 별이 terrain 뒤에서도 보입니다.

이걸 막으면 훨씬 자연스럽습니다.

Stars material 수정

depthWrite: false,
depthTest: true,
적용 후 씬 구조
TerrainScene
 ├ Stars
 ├ HorizonGlow
 ├ HorizonVolume   ⭐ 새로 추가
 ├ Terrain tiles
 ├ RimLighting terrain shader
 └ DataBeacon
결과 변화

적용 전

flat synthwave scene

적용 후

cinematic volumetric scene

특히 좋아지는 부분

산 능선 강조

수평선 공기 빛

거리 깊이
```
