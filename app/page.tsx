"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const Terrain = dynamic(() => import("@/components/Terrain"), { ssr: false });

export default function Home() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;

      // 500~590vh: 페이드 IN (3D 섹션 덮기)
      const fadeInStart = 5.0 * vh;
      const fadeInEnd = 5.9 * vh;
      // 700~800vh: 페이드 OUT (2D 섹션 드러내기)
      const fadeOutStart = 7.0 * vh;
      const fadeOutEnd = 8.0 * vh;

      let opacity = 0;
      if (sy >= fadeInStart && sy < fadeInEnd) {
        opacity = (sy - fadeInStart) / (fadeInEnd - fadeInStart);
      } else if (sy >= fadeInEnd && sy <= fadeOutStart) {
        opacity = 1;
      } else if (sy > fadeOutStart && sy <= fadeOutEnd) {
        opacity = 1 - (sy - fadeOutStart) / (fadeOutEnd - fadeOutStart);
      }

      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(opacity);
      }

      // 오버레이가 걷히기 시작할 때 ConText 등장
      setTextVisible(sy >= fadeOutStart + 0.1 * vh);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
      {/* 전체 페이드 오버레이 (fixed) */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 500,
          background: "#ffffff",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* 3D 섹션: 700vh */}
      <section className="relative" style={{ height: "700vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <Terrain />
        </div>
      </section>

      {/* 2D 컨텐츠 섹션: 100vh 여백 후 ConText */}
      <section
        style={{
          minHeight: "200vh",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "BodoniXT, serif",
            fontSize: "clamp(48px, 8vw, 120px)",
            fontWeight: "normal",
            color: "#111111",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            userSelect: "none",
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(60px)",
            transition:
              "opacity 0.8s ease, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          ConText
        </h1>
      </section>
    </main>
  );
}
