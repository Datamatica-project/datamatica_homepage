# Canvas(Terrain) → MainPage 전환 구조 개선 제안

## 1. 현재 구조 요약

현재 페이지는 **3D Terrain(Canvas)** 위에 **흰색 오버레이**를 페이드인시키는 방식으로 MainPage로 전환된다.

레이어 구조는 다음과 같다.

```
[3D Terrain (Canvas)]  ───────────── 항상 렌더링
        ↑
[White Overlay]        opacity 0 → 1
        ↑
[MainPage Content]     overlay 내부에서 등장
```

동작 흐름

1. 사용자가 스크롤
2. 500vh ~ 600vh 구간에서 overlay opacity 증가
3. opacity = 1 이 되면 `contentLifted = true`
4. body overflow 변경
5. MainPage 애니메이션 실행
6. overlay 내부 스크롤로 전환

현재 구현 로직

```
scroll
  ↓
opacity 계산
  ↓
setOverlayOpacity
  ↓
setContentLifted(opacity >= 1)
  ↓
body overflow 변경
  ↓
MainPage 애니메이션
```

---

# 2. 현재 구조의 장점

## 2.1 3D Canvas 안정성

3D Terrain의 opacity를 변경하지 않고
**overlay를 덮는 방식**이기 때문에

- WebGL 렌더링 안정
- shader 영향 없음
- GPU state 유지

3D 인터랙티브 사이트에서 흔히 사용하는 패턴이다.

---

## 2.2 자연스러운 UX

사용자에게 보이는 흐름

```
3D 공간
↓
화이트 전환
↓
사이트 UI
```

이는 다음과 같은 사이트에서도 사용하는 방식이다.

- Apple
- Stripe
- Tesla

---

## 2.3 레이어 구조 명확

레이어가 명확하게 분리되어 있다.

```
Canvas (3D)
Overlay (transition layer)
MainPage (UI)
```

이 구조는 유지하는 것이 좋다.

---

# 3. 현재 구조의 문제점

## 3.1 상태(state) 의존 전환

현재 구조

```
scroll
 → opacity
 → contentLifted
 → overflow 변경
 → animation
```

문제

- state 증가
- 로직 복잡
- re-render 발생 가능

---

## 3.2 body overflow 변경

현재 코드

```
document.body.style.overflow = "hidden"
```

이 방식은 다음 문제를 유발할 수 있다.

- scroll jump
- 모바일 bounce
- history scroll 오류
- inertia scroll 끊김

특히 iOS Safari에서 문제가 자주 발생한다.

---

## 3.3 scroll hack 사용

현재 코드

```
window.scrollTo(6vh - 1)
```

이 방식은 다음 문제를 발생시킨다.

- scroll 위치 꼬임
- UX 부자연스러움
- 유지보수 어려움

---

# 4. 개선 방향

레이어 구조는 유지하고
**스크롤 제어 로직만 단순화**한다.

핵심 아이디어

```
scrollY
  ↓
progress (0~1)
  ↓
overlay opacity
  ↓
mainpage transform
```

즉

- contentLifted 제거
- body overflow 제거
- scroll hack 제거

---

# 5. 개선된 구조

## 5.1 레이어 구조 (유지)

```
[Canvas Terrain]
position: fixed
z-index: 0

[White Overlay]
position: fixed
z-index: 10

[MainPage]
position: relative
z-index: 20
```

---

## 5.2 스크롤 진행도(progress)

스크롤 위치를 0~1 값으로 정규화한다.

```
progress = scrollY / maxScroll
```

예

```
maxScroll = 600vh
```

---

## 5.3 Overlay opacity

```
opacity = clamp((progress - 0.8) * 5)
```

즉

```
0.8 → 1 구간에서 fade
```

---

## 5.4 MainPage 애니메이션

```
translateY: 100vh → 0
```

예

```
transform: translateY((1 - opacity) * 100vh)
```

---

# 6. 개선된 흐름

기존

```
scroll
 → opacity
 → contentLifted
 → overflow 변경
 → animation
```

개선

```
scroll
 ↓
progress 계산
 ↓
overlay opacity
 ↓
mainpage transform
```

단일 흐름으로 단순화된다.

---

# 7. 기대 효과

## 코드 단순화

제거되는 요소

```
contentLifted
body overflow
scroll hack
```

---

## 안정성 향상

문제 해결

- scroll jump
- 모바일 스크롤 오류
- state dependency

---

## 성능 개선

state 기반이 아닌

```
scroll → transform
```

구조가 되어

- re-render 감소
- animation 부드러움

---

# 8. 최종 권장 구조

```
[3D Canvas Terrain]
        ↓
[White Overlay Fade]
        ↓
[MainPage Content]
```

스크롤 제어

```
scrollY
 ↓
progress
 ↓
overlay opacity
 ↓
mainpage transform
```

---

# 결론

현재 **레이어 구조 자체는 매우 적절하다.**

따라서

- Canvas 구조 유지
- White overlay 전환 유지

대신

다음 요소를 제거하는 것이 권장된다.

```
contentLifted
body overflow 변경
scroll hack
```

그리고 전환 로직을

```
scroll progress 기반
```

으로 단순화하는 것이 가장 안정적이다.
