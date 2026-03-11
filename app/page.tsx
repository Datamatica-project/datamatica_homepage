"use client";

import Footer from "@/components/Footer";
import Gnb from "@/components/Gnb";
import MainPage from "@/components/MainPage";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Terrain = dynamic(() => import("@/components/Terrain"), { ssr: false });

export default function Home() {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isDark, setIsDark] = useState(true); // Terrain 기본값과 일치

  // 테마 초기화 (localStorage / OS 설정)
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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
      <Gnb
        overlayOpacity={overlayOpacity}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

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
