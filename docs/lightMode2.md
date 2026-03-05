Light Mode 컨셉은

White Base

- Blue-Gray Structure
- #D94A52 Accent

즉

배경은 차갑고 밝게

구조는 부드럽게

데이터는 또렷하게

2️⃣ 배경 (Background)
❌ 기존 (Dark)
#020617
#0F172A
✅ 변경 (Light)
Main BG : #F7F9FC
Sub Gradient : #EEF2F7
Horizon Glow : rgba(217,74,82,0.12)

👉 완전 흰색(#FFFFFF)보다
약간 푸른기 있는 화이트가 tech 느낌이 난다.

3️⃣ Terrain Base (지형 기본면)
❌ 기존
dark blue polygon
✅ 변경
Base : #E6ECF4
Shadow : #D8E0EB
Highlight : #FFFFFF

👉 종이 위에 3D 엠보싱된 느낌.

4️⃣ Point Cloud (점 데이터)
❌ 기존
red glow dots
✅ 변경

일반 점:

#94A3B8
opacity 0.6

강조 점:

#D94A52

Pulse Glow:

rgba(217,74,82,0.25)

👉 전체를 빨갛게 하면 촌스럽다.
포인트만 빨강.

5️⃣ Mesh Line (연결선)
❌ 기존
bright neon red / white
✅ 변경

기본선:

#C7D1E0
opacity 0.5

강조 연결선:

rgba(217,74,82,0.4)

👉 전부 선명하면 UI가 지저분해진다.

6️⃣ Grid Overlay (있다면)
#E2E8F0
opacity 0.4
7️⃣ 텍스트
Hero 타이포
Main : #0F172A
Sub
#64748B
HUD 패널 텍스트
Title : #334155
Value : #0F172A
8️⃣ 글라스 패널 (오른쪽 데이터 박스)
❌ 기존

투명 + 어두운 배경

✅ 변경
background: rgba(255,255,255,0.6)
border: 1px solid #E2E8F0
backdrop-filter: blur(10px)
9️⃣ Glow 조정 (가장 중요)

Dark 모드에서는 glow가 중심이었다.

Light 모드에서는 glow는 보조 역할이다.

기존:

강한 red core

변경:

radial-gradient(
rgba(217,74,82,0.15),
rgba(217,74,82,0.05),
transparent
)
🔥 최종 정리 (한 번에 보기)
역할 색상
Background #F7F9FC
Terrain Base #E6ECF4
Terrain Shadow #D8E0EB
Mesh Line #C7D1E0
Point Normal #94A3B8
Point Accent #D94A52
Glow rgba(217,74,82,0.2)
Main Text #0F172A
Sub Text #64748B
🎨 핵심 원칙

빨간색은 10~15%만 사용

나머지는 blue-gray

pure black 사용 금지

pure white 과다 사용 금지
