# Canvas(Terrain) → MainPage 전환 개선 사항 정리

## 개요

현재 Canvas(Terrain)에서 MainPage로 전환하는 구조는 다음과 같은 특징을 가진다.

- 3D Terrain(Canvas)은 항상 렌더링됨
- 흰색 오버레이가 `opacity 0 → 1` 로 페이드인
- 그 위에 MainPage 콘텐츠가 등장
- 특정 시점에서 `contentLifted` 상태로 전환
- body `overflow` 변경 후 overlay 내부 스크롤 사용

이 구조에서 **레이어 구조 자체는 적절하지만**, 스크롤 제어 방식 때문에 복잡도가 증가하고 잠재적인 스크롤 문제가 발생할 수 있다.

따라서 **단일 스크롤 컨텍스트(single scroll context)** 기반 구조로 개선하는 것을 권장한다.

---

# 1. MainPage 상태 전달 방식 개선

## 현재 방식

현재는 `contentLifted`라는 boolean state를 사용하여 MainPage 상태를 제어한다.

```ts
<MainPage contentLifted={contentLifted} />
```

`contentLifted`는 다음 조건으로 계산된다.

```ts
contentLifted = overlayOpacity >= 1;
```

즉 **스크롤 상태를 boolean으로 변환한 뒤 전달하는 구조**이다.

---

## 문제점

이 방식의 한계는 다음과 같다.

- 애니메이션 제어 정보 손실 (0~1 progress → boolean)
- UI 확장성 제한
- state 관리 증가
- 애니메이션 유연성 부족

---

## 개선 방식

boolean state 대신 **progress 값을 전달**하는 방식으로 변경한다.

```ts
<MainPage progress={progress} />
```

또는

```ts
<MainPage overlayOpacity={overlayOpacity} />
```

---

## 장점

progress 기반 전달의 장점

- 애니메이션 제어 범위 확대
- 상태 감소
- UI 확장성 증가

예시

```ts
const translateY = (1 - progress) * 100;
```

```css
transform: translateY(100vh → 0);
```

이를 통해 MainPage 내부에서 다양한 인터랙션을 구현할 수 있다.

---

# 2. Scroll 기반 애니메이션 처리 방식

## 현재 방식

현재 MainPage 애니메이션은 Tailwind `transition` 기반으로 처리된다.

예시

```css
transition-transform duration-700
```

문제는 **scroll 기반 애니메이션과 transition을 동시에 사용하는 구조**이다.

---

## 문제점

스크롤은 프레임마다 값이 업데이트된다.

```ts
scrollY → transform
```

이때 transition이 존재하면 다음 문제가 발생할 수 있다.

- 애니메이션 lag
- scroll jank
- 반응성 저하

---

## 개선 방식

scroll 기반 애니메이션은 **inline transform style**로 직접 제어한다.

예시

```ts
style={{
  transform: `translateY(${value}px)`
}}
```

transition을 제거하면 scroll과 애니메이션이 1:1로 동기화된다.

---

## 권장 사용 방식

애니메이션 유형에 따라 방식을 구분한다.

| 애니메이션 유형         | 권장 방식           |
| ----------------------- | ------------------- |
| scroll driven animation | inline transform    |
| UI 등장 애니메이션      | Tailwind transition |

즉

- scroll 기반 이동 → inline transform
- UI fade / 등장 → Tailwind transition

이렇게 혼합 사용하는 것이 가장 안정적이다.

---

# 3. 뒤로 스크롤 UX (복귀 구조)

## 현재 방식

현재 구조는 다음과 같은 흐름을 가진다.

```text
body scroll
↓
overlay 활성
↓
overlay 내부 scroll
```

즉 **스크롤 컨텍스트가 두 개** 존재한다.

- body scroll
- overlay scroll

이 때문에 overlay 최상단에서 위로 스크롤 시 다음과 같은 코드가 실행된다.

```ts
window.scrollTo(6vh - 1)
```

이는 scroll 위치를 강제로 이동시키는 **scroll hack**이다.

---

## 문제점

이 구조는 다음 문제를 발생시킬 수 있다.

- scroll jump
- 모바일 scroll bounce
- inertia scroll 문제
- history scroll 위치 오류
- 유지보수 어려움

---

## 개선 방향

**단일 스크롤 컨텍스트(single scroll context)** 구조로 변경한다.

즉 전체 페이지가 하나의 scroll 흐름을 가진다.

```text
body scroll
0vh ~ 700vh
```

구조 예시

```text
0 ~ 500vh   3D Terrain 영역
500 ~ 600vh white overlay fade
600vh ~     MainPage 콘텐츠
```

이 경우

- overlay fade는 scroll progress 기반
- MainPage 등장도 scroll 기반

---

## 결과

사용자가 스크롤을 내리면

```text
3D Terrain
↓
white overlay fade
↓
MainPage
```

사용자가 스크롤을 올리면

```text
MainPage
↓
overlay fade out
↓
3D Terrain
```

자연스럽게 복귀한다.

따라서

```ts
window.scrollTo(...)
```

와 같은 scroll hack이 필요 없어지게 된다.

---

# 최종 권장 구조

레이어 구조는 유지한다.

```text
[Canvas Terrain]
        ↓
[White Overlay Fade]
        ↓
[MainPage Content]
```

하지만 스크롤 제어는 다음과 같이 변경한다.

```text
scrollY
↓
progress (0~1)
↓
overlay opacity
↓
mainpage transform
```

---

# 핵심 정리

현재 구조에서 유지할 것

- 3D Canvas 구조
- White overlay 전환 방식
- MainPage overlay UI

제거할 것

- contentLifted state
- body overflow 변경
- scroll hack

도입할 것

- scroll progress 기반 애니메이션
- single scroll context
- transform 기반 애니메이션 제어

---

# 결론

현재 레이어 구조는 올바르다.

하지만 스크롤 전환 구조를 **단일 스크롤 컨텍스트 기반으로 단순화**하면

- 코드 복잡도 감소
- 스크롤 안정성 증가
- 애니메이션 확장성 확보
- 모바일 호환성 개선

이라는 효과를 얻을 수 있다.
