"use client";

import MainPage from "@/components/MainPage";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const Terrain = dynamic(() => import("@/components/Terrain"), { ssr: false });

export default function Home() {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [contentLifted, setContentLifted] = useState(false);
  const overlayRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;

      // 캔버스 애니메이션 끝(500vh) 이후, 500~600vh에서 앞쪽 박스 투명도 서서히 상승
      const fadeStart = 5.0 * vh;
      const fadeEnd = 6.0 * vh;

      let opacity = 0;
      if (sy >= fadeStart && sy < fadeEnd) {
        opacity = (sy - fadeStart) / (fadeEnd - fadeStart);
      } else if (sy >= fadeEnd) {
        opacity = 1;
      }
      setOverlayOpacity(opacity);

      // 투명도 100% → marginTop 0 (콘텐츠 솟아오름), 투명도 0 → marginTop 100vh 복원
      setContentLifted(opacity >= 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 한 번 실행
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // contentLifted 시 window 스크롤 잠금 → overlay 내부에서 스크롤
  useEffect(() => {
    if (contentLifted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [contentLifted]);

  // overlay 최상단에서 위로 스크롤 시 → body 잠금 해제 후 window 스크롤 복원
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleWheel = (e: WheelEvent) => {
      if (!contentLifted) return;
      if (overlay.scrollTop === 0 && e.deltaY < 0) {
        document.body.style.overflow = "";
        // fadeEnd(6vh) 직전으로 되돌려 fade-out 트리거
        window.scrollTo({ top: window.innerHeight * 6 - 1 });
      }
    };

    overlay.addEventListener("wheel", handleWheel, { passive: true });
    return () => overlay.removeEventListener("wheel", handleWheel);
  }, [contentLifted]);

  return (
    <main>
      {/* 3D 섹션 (뒤): contentLifted시 포인터 이벤트 차단 */}
      <section
        className={`relative h-[700vh] ${contentLifted ? "pointer-events-none" : ""}`}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <Terrain />
        </div>
      </section>

      {/* Context 박스 (앞): 고정 오버레이, 투명 → 불투명 후 콘텐츠 솟아오름 */}
      <section
        ref={overlayRef}
        className={`fixed inset-0 z-500 bg-white transition-opacity duration-250 ease-out ${contentLifted ? "pointer-events-auto overflow-y-auto" : "pointer-events-none overflow-hidden"}`}
        style={{ opacity: overlayOpacity }}
      >
        <MainPage contentLifted={contentLifted} />
      </section>
    </main>
  );
}
