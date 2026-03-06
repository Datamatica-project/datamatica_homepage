UI를 이렇게 구성하면 좋음

        particle globe

[ DATA LABELING ]

        terrain

UI가 바닥에서 살짝 떠있는 느낌

보통 높이

y = 0.8 ~ 1.2

정도.

3️⃣ Floating UI 디테일 (중요)

Floating UI는 그냥 띄우면 밋밋함.

보통 3가지 효과를 같이 씀.

① hover animation

살짝 떠다니는 느낌

sin(time) \* 0.05

예

y = baseY + sin(time _ 1.5) _ 0.05
② subtle rotation

정면에서 완전히 평면이면 어색함

rotateX(-8deg)
③ soft glow
box-shadow:
0 0 8px #00E5FF,
0 0 20px rgba(0,229,255,0.35)
4️⃣ Floating UI 구조 (추천)

지금 UI 구조를 이렇게 바꾸는걸 추천

      ┌─────────────┐
      │ DATA LABEL  │
      │ SYS.01      │
      └─────────────┘
            │
         small glow
            │
        terrain

기둥 대신

soft glow circle
5️⃣ Tailwind 예시

패널

<div className="
bg-[rgba(0,229,255,0.08)]
backdrop-blur-[6px]
py-[6px]
px-[14px]
rounded-[6px]
border border-[#00E5FF]
shadow-[0_0_8px_#00E5FF,0_0_20px_rgba(0,229,255,0.35)]
">

텍스트

<p className="text-[#E6F7FF] tracking-[0.15em]">
DATA LABELING
</p>

<p className="text-[#7EDFFF] text-[12px]">
SYS.01 / LABEL_STREAM
</p>
6️⃣ Floating UI 배치 팁

지금처럼 멀리 있는 UI도 배치하는건 좋은데

거리별로

near
mid
far

스타일을 다르게 해야 함.

예

거리 opacity scale
near 1 1
mid 0.7 0.9
far 0.5 0.8

이러면 깊이감 생김.

7️⃣ 하나 더 추천 (진짜 좋음)

floating UI 아래에 data ripple 넣으면 좋음.

terrain
↓
cyan circle ripple
↓
floating panel

이거 들어가면

데이터 스캔 느낌

엄청 살아남.

three.js에서는

ring geometry
additive blending

로 쉽게 가능.

8️⃣ 지금 씬 기준 최종 추천

지금 씬에서 제일 좋은 구조는

particle globe
↓
DATAMATICA title
↓
floating data panels
↓
terrain grid

이 구조.
