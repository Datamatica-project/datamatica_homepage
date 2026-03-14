"use client";

import Footer from "@/components/layout/Footer";
import MainPage from "@/components/home/MainPage";
import NextButton from "@/components/home/NextButton";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

const Terrain = dynamic(() => import("@/components/Terrain"), { ssr: false });

const TERRAIN_MOTION_END_VH = 1.0;
const TERRAIN_FADE_START_VH = 0.7;
const TERRAIN_SECTION_HEIGHT_VH = TERRAIN_MOTION_END_VH + 1;

export default function HomeClient() {
  const { isDark } = useTheme();
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const fadeStart = TERRAIN_FADE_START_VH * vh;
      const fadeEnd = TERRAIN_MOTION_END_VH * vh;

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
    <main className="bg-[#F6F7F9] dark:bg-[#1c1c1e]">
      <NextButton />
      <div
        className="fixed inset-0 z-10 bg-[#F6F7F9] dark:bg-[#1c1c1e] pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      <section
        className="relative"
        style={{ height: `${TERRAIN_SECTION_HEIGHT_VH * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <Terrain
            isDark={true}
            overlayOpacity={overlayOpacity}
            scrollEndVh={TERRAIN_MOTION_END_VH}
          />
        </div>
      </section>

      <div className="relative z-20">
        <MainPage />
        <Footer />
      </div>
    </main>
  );
}
