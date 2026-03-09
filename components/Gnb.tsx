"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const NAV_ITEMS = ["사업분야", "회사연혁", "소식/뉴스"];

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Gnb({
  overlayOpacity,
  isDark,
  onThemeToggle,
}: {
  overlayOpacity: number;
  isDark: boolean;
  onThemeToggle: () => void;
}) {
  const isMain = overlayOpacity >= 1;
  const iconColor = isMain ? "#121212" : "rgba(255,255,255,0.9)";
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // 드로어 배경색: isMain이면 흰색, 아니면 반투명 다크
  const drawerBg = isMain ? "#ffffff" : "#111111";
  const drawerText = isMain ? "#121212" : "rgba(255,255,255,0.9)";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300"
        style={
          isMain
            ? {
                backgroundColor: "rgba(255,255,255,1)",
                borderBottom: "1px solid #ebebeb",
              }
            : {
                backgroundColor: "rgba(0,0,0,0.22)",
                backdropFilter: "blur(8px)",
              }
        }
      >
        <div className="max-w-[1200px] mx-auto px-[24px] h-[64px] flex items-center justify-between">
          {/* 로고 – 클릭 시 페이지 최상단으로 스크롤 */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="cursor-pointer"
          >
            <Image
              src="/header/headerlogo.png"
              alt="DataMatica"
              width={148}
              height={36}
              className="object-contain"
              style={{
                filter: isMain ? "none" : "brightness(0) invert(1)",
                transition: "filter 0.3s ease",
              }}
              priority
            />
          </a>

          {/* 데스크탑: 메뉴 + 테마 토글 */}
          <div className="hidden md:flex items-center gap-[36px]">
            <ul className="flex items-center gap-[36px]">
              {NAV_ITEMS.map((label) => (
                <li key={label}>
                  <button
                    className="text-[15px] font-medium transition-colors duration-300"
                    style={{
                      color: isMain ? "#121212" : "rgba(255,255,255,0.9)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        isMain ? "#d94a52" : "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        isMain ? "#121212" : "rgba(255,255,255,0.9)";
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            {/* 라이트 / 다크 토글 */}
            <button
              onClick={onThemeToggle}
              aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-full transition-colors duration-200"
              style={{
                color: iconColor,
                backgroundColor: isMain
                  ? "rgba(0,0,0,0.06)"
                  : "rgba(255,255,255,0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  isMain ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  isMain ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.12)";
              }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* 모바일: 테마토글 + 햄버거 */}
          <div className="flex md:hidden items-center gap-[12px]">
            <button
              onClick={onThemeToggle}
              aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-full transition-colors duration-200"
              style={{
                color: iconColor,
                backgroundColor: isMain
                  ? "rgba(0,0,0,0.06)"
                  : "rgba(255,255,255,0.12)",
              }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* 햄버거 버튼 */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="메뉴 열기/닫기"
              className="flex flex-col justify-center items-center w-[36px] h-[36px] gap-[5px]"
            >
              <span
                className="block w-[22px] h-[2px] rounded-full transition-all duration-300 origin-center"
                style={{
                  backgroundColor: iconColor,
                  transform: menuOpen
                    ? "translateY(7px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                className="block w-[22px] h-[2px] rounded-full transition-all duration-300"
                style={{
                  backgroundColor: iconColor,
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-[22px] h-[2px] rounded-full transition-all duration-300 origin-center"
                style={{
                  backgroundColor: iconColor,
                  transform: menuOpen
                    ? "translateY(-7px) rotate(-45deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* 모바일 드로어 오버레이 */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* 모바일 드로어 패널 */}
      <div
        className="fixed top-0 right-0 h-full w-[280px] z-50 md:hidden flex flex-col transition-transform duration-300 ease-out"
        style={{
          backgroundColor: drawerBg,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* 드로어 헤더 */}
        <div
          className="flex items-center justify-between px-[24px] h-[64px] shrink-0"
          style={{
            borderBottom: `1px solid ${isMain ? "#ebebeb" : "#2a2a2a"}`,
          }}
        >
          <Image
            src="/header/headerlogo.png"
            alt="DataMatica"
            width={120}
            height={29}
            className="object-contain"
            style={{ filter: isMain ? "none" : "brightness(0) invert(1)" }}
          />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="메뉴 닫기"
            className="flex items-center justify-center w-[36px] h-[36px]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={drawerText}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 드로어 메뉴 */}
        <ul className="flex flex-col px-[24px] py-[32px] gap-[8px]">
          {NAV_ITEMS.map((label) => (
            <li key={label}>
              <button
                className="w-full text-left text-[18px] font-medium py-[14px] transition-colors duration-200"
                style={{
                  color: drawerText,
                  borderBottom: `1px solid ${isMain ? "#f0f0f0" : "#2a2a2a"}`,
                }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
