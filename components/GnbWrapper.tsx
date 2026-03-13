"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Gnb from "./Gnb";
import { useTheme } from "./ThemeProvider";

export default function GnbWrapper() {
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const [overlayOpacity, setOverlayOpacity] = useState(isMainPage ? 0 : 1);
  const [sectionBusinessInView, setSectionBusinessInView] = useState(false);

  useEffect(() => {
    if (!isMainPage) {
      setOverlayOpacity(1);
      return;
    }

    const handleScroll = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const fadeStart = 3.5 * vh;
      const fadeEnd = 4.0 * vh;

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
  }, [isMainPage]);

  useEffect(() => {
    if (!isMainPage) {
      return;
    }
    const el = document.getElementById("section-business");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSectionBusinessInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMainPage]);

  const effectiveOpacity = sectionBusinessInView ? 1 : overlayOpacity;

  return (
    <Gnb
      overlayOpacity={effectiveOpacity}
      isDark={isDark}
      onThemeToggle={toggleTheme}
    />
  );
}
