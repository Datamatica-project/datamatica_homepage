✅ 최종 권장 구조 (너 상황 기준 베스트)
1️⃣ 태양 미러 복사 (기본 구조)
<group position={[0, -yOffset, -300]} scale={[1, -1, 1]}>
<SunriseGlow />
</group>

👉 핵심:

scale Y = -1 → 뒤집기

위치는 수면 바로 아래

2️⃣ “reflection plane”으로 마스킹 (이게 핵심)

그냥 복사하면 안 됨
👉 반드시 plane 위에서만 보이게 해야 함

방법
<mesh position={[0, 0.1, -150]}>
<planeGeometry args={[WIDTH, SEG_LEN]} />
<meshBasicMaterial
    transparent
    opacity={0.35}
    blending={THREE.AdditiveBlending}
    depthWrite={false}
  />
</mesh>

👉 역할:

반사 영역 제한

바닥 위에 얇게 깔림

3️⃣ 왜곡 (Distortion) — 이거 없으면 가짜 티 남

지금 네 지형 이미 wave 느낌 있잖아
👉 그걸 반사에도 반영해야 함

간단 버전 (강추)
uv.x += sin(uv.y _ 20 + time) _ 0.01;

👉 효과:

물결 따라 반사 흔들림

“진짜 물 느낌” 핵심

🔥 완성 구조 (요약)
[태양]
↓
[뒤집힌 태양 (hidden layer)]
↓
[distortion + transparency plane]
↓
[지형]
💡 추가하면 퀄 급상승
✔ 거리 fade
opacity \*= smoothstep(-50, -200, z);

👉 가까운 곳 = 약함
👉 먼 곳 = 강함
→ 진짜 반사 느낌

✔ 색 톤 맞추기

지금 태양이 주황이니까
반사는 약간:

#ffb36b → rgba(255, 180, 100, 0.3)

👉 살짝 desaturate 해야 자연스러움

✔ blur 느낌
texture.repeat.set(1, 0.6)

또는 alpha 낮추기
