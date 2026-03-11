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

  useEffect(() => {
    if (!isMainPage) {
      setOverlayOpacity(1);
      return;
    }

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
  }, [isMainPage]);

  return (
    <Gnb
      overlayOpacity={overlayOpacity}
      isDark={isDark}
      onThemeToggle={toggleTheme}
    />
  );
}
