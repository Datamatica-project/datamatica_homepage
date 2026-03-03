1. 목표 (Objective)

스크롤 기반으로 차량이 가로로 이동하며
이동 거리와 물리적으로 일치하는 휠 회전을 구현한다.

구조적으로 Rivian 메인 페이지와 동일한 패턴을 따른다.

2. 전체 구조 개요
   [ section (height: 300~400vh) ]
   └─ [ horizontal-container (width: 200vw 이상) ]
   ├─ vehicle-wrapper (컬러 차량)
   │ ├─ body img
   │ └─ canvas (wheel layer)
   │
   └─ vehicle-wrapper (메쉬 차량)
   ├─ body img
   └─ canvas (wheel layer)
3. 레이아웃 설계
   3.1 Scroll Section
   .scroll-section {
   position: relative;
   height: 300vh;
   }

스크롤 구간 확보용.

3.2 Horizontal Container
.horizontal-container {
position: sticky;
top: 0;
height: 100vh;
width: 200vw;
display: flex;
}

sticky를 사용해 스크롤 구간 동안 화면에 고정

내부를 가로로 배치

3.3 Vehicle Wrapper
.vehicle-wrapper {
position: relative;
width: 100vw;
height: 100%;
}

각 차량은 viewport 너비를 차지.

4. 스크롤 로직
   4.1 Progress 계산
   progress = clamp(
   (scrollY - sectionStart) / sectionHeight,
   0,
   1
   )
   4.2 Container 이동
   translateX = -progress \* (containerWidth - viewportWidth)

적용:

container.style.transform = `translate3d(${translateX}px, 0, 0)`

GPU 가속을 위해 translate3d 사용.

5. 휠 회전 수식 (핵심)
   5.1 이동 거리 기반 계산
   이동거리 = 이전 translateX - 현재 translateX

바퀴 반지름 r일 때:

회전각(rad) += 이동거리 / r

이 공식은 실제 구름 운동과 동일.

5.2 왜 이 수식이 필요한가?

회전각을 단순히:

rotation = progress \* 360

로 계산하면 비물리적임.

이동 거리 기반 계산을 해야 실제 주행처럼 보임.

6. Canvas 렌더링 구조
   6.1 휠 중심 좌표 정의
   frontWheel = { x: 420, y: 540 }
   rearWheel = { x: 980, y: 540 }
   radius = 110

(이미지 기준 픽셀 좌표로 측정 필요)

6.2 드로잉 로직
function drawWheel(ctx, img, x, y, rotation) {
ctx.save()
ctx.translate(x, y)
ctx.rotate(rotation)
ctx.drawImage(img, -radius, -radius, radius _ 2, radius _ 2)
ctx.restore()
}
6.3 프레임 루프
function render() {
ctx.clearRect(0, 0, canvas.width, canvas.height)

drawWheel(ctx, wheelImg, frontWheel.x, frontWheel.y, rotation)
drawWheel(ctx, wheelImg, rearWheel.x, rearWheel.y, rotation)

requestAnimationFrame(render)
} 7. 초기 상태 정의

초기 상태:

컬러 차량 중앙

메쉬 차량 오른쪽 대기

progress = 0 일 때:

translateX = 0

progress = 1 일 때:

translateX = -100vw 8. 전환 구간
progress 상태
0.0 컬러 차량 중앙
0.5 두 차량 절반 교차
1.0 메쉬 차량 중앙 9. 성능 설계
9.1 Scroll 이벤트 직접 사용 금지

scroll → state 업데이트

실제 렌더는 requestAnimationFrame에서 처리

9.2 transform만 변경

left/top 변경 금지

translate3d만 사용

9.3 이미지 최적화

body는 WebP

wheel은 투명 PNG

10. 확장 가능 구조
    10.1 컬러 → 메쉬 크로스 전환

옵션:

opacity crossfade

clip-path reveal

mask transition

10.2 감속/가속 효과
rotation += deltaX / r \* 0.98

감쇠값 적용 가능.

11. 구현 난이도
    항목 난이도
    가로 스크롤 구조 ★★
    이동거리 기반 회전 ★★★
    정확한 휠 좌표 정렬 ★★★
    완성도 높은 감각 연출 ★★★★
12. Three.js 사용 여부

필요 없음.

이 구조는:

WebGL 불필요

2D Canvas + DOM transform

광고형 인터랙션에 최적

13. 최종 구현 체크리스트

section height 충분한가?

container sticky 동작 정상?

translate3d 적용?

deltaX 기반 회전 적용?

휠 중심 정확한가?

60fps 유지되는가?

최종 결론

이 설계는 Rivian 메인 인터랙션과
구조적으로 동일한 패턴이다.

차이점은 시각적 스토리텔링 설계에 따라 결정된다.
