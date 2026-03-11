"use client";

import { useState, useEffect, useCallback } from "react";

const SECTION_IDS = [
  "section-business",
  "section-projects",
  "section-clients",
  "section-news",
  "section-contact",
];

export default function NextButton() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const businessSection = document.getElementById("section-business");

      if (!businessSection) {
        setVisible(true);
        return;
      }

      const { top } = businessSection.getBoundingClientRect();

      // 첫 섹션이 화면 상단 기준점에 닿기 전까지만 버튼을 노출한다.
      // 다시 그 기준점 위로 올라오면 버튼이 다시 보인다.
      setVisible(top > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    const vh = window.innerHeight;
    const sy = window.scrollY;
    const businessSection = document.getElementById("section-business");

    if (!businessSection) {
      return;
    }

    const businessTop = businessSection.getBoundingClientRect().top;

    // 첫 섹션보다 위에 있으면 항상 section-business 상단으로 정확히 이동한다.
    // MainPage가 아직 translateY(100vh) 상태일 때만 보정값을 적용한다.
    if (businessTop > 0) {
      const hiddenOffset = businessTop > vh ? vh : 0;
      const targetTop = sy + businessTop - hiddenOffset;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
      return;
    }

    // 현재 뷰포트 기준으로 다음 섹션 탐색
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top > vh * 0.2) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  }, []);

  return (
    <button
      onClick={handleClick}
      aria-label="다음 섹션으로 이동"
      className="fixed bottom-[36px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-[6px] transition-opacity duration-500 cursor-pointer"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
    >
      {/* 라벨 */}
      <span
        className="text-[11px] font-semibold tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.7)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
      >
        Next
      </span>

      {/* 화살표 컨테이너 */}
      <div
        className="w-[44px] h-[44px] rounded-full flex items-center justify-center animate-bounce"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="rgba(255,255,255,0.9)"
        >
          <path
            fillRule="evenodd"
            d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
          />
        </svg>
      </div>
    </button>
  );
}
