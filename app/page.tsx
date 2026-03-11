"use client";

import Footer from "@/components/layout/Footer";
import MainPage from "@/components/home/MainPage";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

const Terrain = dynamic(() => import("@/components/Terrain"), { ssr: false });

export default function Home() {
  const { isDark } = useTheme();
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  // 스크롤 오버레이
  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const fadeStart = 4.0 * vh;
      const fadeEnd = 5.0 * vh;

      let opacity = 0;
      if (sy >= fadeStart && sy < fadeEnd) {
        opacity = (sy - fadeStart) / (fadeEnd - fadeStart);
      } else if (sy >= fadeEnd) {
        opacity = 1;
      }
      setOverlayOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-[#F6F7F9] dark:bg-[#111113]">
      {/* White overlay: fixed, z-10, terrain 위 / MainPage 아래 */}
      <div
        className="fixed inset-0 z-10 bg-[#F6F7F9] dark:bg-[#111113] pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Terrain: 0~500vh 단일 스크롤 컨텍스트 */}
      <section className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <Terrain isDark={isDark} overlayOpacity={overlayOpacity} />
        </div>
      </section>

      {/* MainPage: 일반 문서 흐름, z-20 */}
      <div className="relative z-20">
        <MainPage overlayOpacity={overlayOpacity} />
        <Footer />
      </div>
    </main>
  );
}
