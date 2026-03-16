# DataMatica 메인 히어로 섹션 – 선박 항해 컨셉 강화 가이드

현재 메인 히어로 섹션은  
**데이터 바다(Data Ocean) + 항해(Navigation) 컨셉**을 기반으로 구성되어 있다.

- Synthwave 스타일 배경
- Wireframe Terrain
- Horizon Sun
- Data Grid Mesh

그러나 현재 구성은 **선박(Ship) 자체의 시각적 정보가 부족하여**  
사용자가 직관적으로 선박을 인식하기 어렵다.

따라서 다음과 같은 요소를 추가하여 **선박 항해 컨셉을 강화할 수 있다.**

---

# 1. Ship Bow (선수) 실루엣 추가

가장 효과적인 방법은 **선수(Bow) 형태의 실루엣을 추가하는 것**이다.

현재 화면 중앙 하단 영역에 선박의 구조를 암시하는  
wireframe 형태의 라인을 추가하면 선박 인식도가 크게 올라간다.

## 추천 요소

- 선수 외곽 라인
- 좌우 갑판 라인
- 중앙 축 라인

예시 구조

    /\

/ \
 / \

_/ _

## 스타일

color: cyan
opacity: 0.4
style: wireframe

이 구조는 다음과 같은 의미를 전달한다.

> 데이터 메쉬 위를 항해하는 선박

---

# 2. Ship Bridge (조타실 / 갑판 구조물)

선박의 특징적인 구조 중 하나는 **조타실(Bridge)** 이다.

현재 중앙 하단 영역에 작은 구조물을 추가하면  
선박의 존재감을 강화할 수 있다.

## 추천 요소

- Radar Dome
- Navigation Tower
- Antenna

예시 구조

┌───────┐
│Bridge │
└───────┘
│
─────┼─────

스타일은 **네온 UI 느낌의 구조물**로 표현하면 전체 컨셉과 잘 맞는다.

---

# 3. Navigation Lights (항해등)

선박 느낌을 가장 빠르게 강화하는 요소는 **항해등(Navigation Lights)** 이다.

선박에는 항상 다음과 같은 항해등이 존재한다.

| 위치                     | 색    |
| ------------------------ | ----- |
| 좌현 (Left / Port)       | Red   |
| 우현 (Right / Starboard) | Green |

## 적용 방식

화면 하단 선박 위치에 다음 요소 추가

왼쪽 : 작은 red light
오른쪽 : 작은 green light

이 두 개만 추가해도 사용자는 자연스럽게 **선박을 인식하게 된다.**

---

# 4. Wake (항적 / 물살)

선박이 이동할 때는 뒤쪽에 **물살(Wake)** 이 발생한다.

현재 데이터 메쉬 위에 **항적 효과**를 추가하면  
선박이 실제로 항해하는 느낌을 만들 수 있다.

## 추천 효과

- Particle trail
- V-shape ripple
- Glow wake line

예시 형태

\ | /
\ | /
\ | /
\ | /
|/
▲

---

# 5. Navigation Radar UI

항해 컨셉을 강화하기 위해 **항해 레이더 UI**를 추가할 수 있다.

현재 하단 UI 요소를 다음과 같은 항해 시스템 UI로 변경하는 것을 고려할 수 있다.

## 추천 UI

- Radar Sweep
- Compass
- AIS Target Blips

예시 UI

circular radar
rotating sweep line
target dots

이 요소는 다음과 같은 메시지를 전달한다.

> 데이터 환경을 탐색하며 항해하는 AI 시스템

---

# 6. Horizon Navigation Line

선박 항해에서 중요한 기준은 **수평선(Horizon)** 이다.

태양 아래에 얇은 수평선을 추가하고  
거리 정보를 표시하면 항해 컨셉이 강화된다.

예시

────────────
10km 20km 30km

---

# 우선 적용 추천 요소 (Minimal Update)

디자인 변경을 최소화하면서 효과가 큰 요소는 다음 세 가지이다.

1. **Ship Bow Wireframe 추가**
2. **Navigation Lights (Red / Green)**
3. **Wake Trail (항적 효과)**

이 세 가지 요소만 추가해도 사용자가 자연스럽게

> "데이터 바다를 항해하는 선박"

이라는 컨셉을 인식하게 된다.

---

# 디자인 스타일 유지 전략

현재 디자인 스타일

Synthwave
Neon Lighting
Wireframe Terrain
Retro Futuristic

따라서 새로 추가되는 요소도 다음 스타일을 유지하는 것이 좋다.

wireframe ship hull
neon navigation lights
radar HUD
data ocean concept

---

# 기대 효과

이러한 요소를 적용하면 다음과 같은 효과를 얻을 수 있다.

- 선박 항해 컨셉 강화
- 사용자 직관적 이해도 상승
- Data Ocean 메타포 명확화
- AI Navigation 메시지 강화
