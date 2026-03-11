"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Close, Moon, Sun } from "./Icons";

const NAV_ITEMS = ["사업분야", "회사연혁", "소식/뉴스"];

export default function Gnb({
  overlayOpacity,
  isDark,
  onThemeToggle,
}: {
  overlayOpacity: number;
  isDark: boolean;
  onThemeToggle: () => void;
}) {
  const router = useRouter();
  const isMain = overlayOpacity >= 1;
  // isMain 구간에서는 isDark 반영, terrain 구간은 항상 밝은 텍스트
  const iconColor = isMain
    ? isDark
      ? "rgba(255,255,255,0.9)"
      : "#121212"
    : "rgba(255,255,255,0.9)";
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // 드로어 배경색
  const drawerBg = isMain ? (isDark ? "#1a1a1b" : "#ffffff") : "#111111";
  const drawerText = isMain
    ? isDark
      ? "rgba(255,255,255,0.9)"
      : "#121212"
    : "rgba(255,255,255,0.9)";

  const handleNavItemClick = (label: string) => {
    // 현재는 회사연혁 메뉴만 별도 페이지로 이동합니다.
    if (label === "회사연혁") {
      router.push("/history");
    } else if (label === "소식/뉴스") {
      router.push("/news");
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300"
        style={
          isMain
            ? {
                backgroundColor: isDark
                  ? "rgba(17,17,19,1)"
                  : "rgba(255,255,255,1)",
                borderBottom: isDark
                  ? "1px solid #2a2a2a"
                  : "1px solid #ebebeb",
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
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
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
                filter: "none",
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
                    className="cursor-pointer text-[17px] font-semibold transition-colors duration-300"
                    style={{ color: iconColor }}
                    onClick={() => handleNavItemClick(label)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#d94a52";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        iconColor;
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
              className="cursor-pointer flex items-center justify-center w-[36px] h-[36px] rounded-full transition-colors duration-200"
              style={{
                color: iconColor,
                backgroundColor:
                  isMain && !isDark
                    ? "rgba(0,0,0,0.06)"
                    : "rgba(255,255,255,0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  isMain && !isDark
                    ? "rgba(0,0,0,0.12)"
                    : "rgba(255,255,255,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  isMain && !isDark
                    ? "rgba(0,0,0,0.06)"
                    : "rgba(255,255,255,0.12)";
              }}
            >
              {isDark ? <Sun /> : <Moon />}
            </button>
          </div>

          {/* 모바일: 테마토글 + 햄버거 */}
          <div className="flex md:hidden items-center gap-[12px]">
            <button
              onClick={onThemeToggle}
              aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
              className="cursor-pointer flex items-center justify-center w-[36px] h-[36px] rounded-full transition-colors duration-200"
              style={{
                color: iconColor,
                backgroundColor:
                  isMain && !isDark
                    ? "rgba(0,0,0,0.06)"
                    : "rgba(255,255,255,0.12)",
              }}
            >
              {isDark ? <Sun /> : <Moon />}
            </button>

            {/* 햄버거 버튼 */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="메뉴 열기/닫기"
              className="cursor-pointer flex flex-col justify-center items-center w-[36px] h-[36px] gap-[5px]"
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
            borderBottom: `1px solid ${isMain && !isDark ? "#ebebeb" : "#2a2a2a"}`,
          }}
        >
          <Image
            src="/header/headerlogo.png"
            alt="DataMatica"
            width={120}
            height={29}
            className="object-contain"
            style={{
              filter: isMain && !isDark ? "none" : "brightness(0) invert(1)",
            }}
          />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="메뉴 닫기"
            className="cursor-pointer flex items-center justify-center w-[36px] h-[36px]"
          >
            <Close color={drawerText} />
          </button>
        </div>

        {/* 드로어 메뉴 */}
        <ul className="flex flex-col px-[24px] py-[32px] gap-[8px]">
          {NAV_ITEMS.map((label) => (
            <li key={label}>
              <button
                className="cursor-pointer w-full text-left text-[20px] font-semibold py-[14px] transition-colors duration-200"
                style={{
                  color: drawerText,
                  borderBottom: `1px solid ${isMain && !isDark ? "#f0f0f0" : "#2a2a2a"}`,
                }}
                onClick={() => {
                  handleNavItemClick(label);
                  setMenuOpen(false);
                }}
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
