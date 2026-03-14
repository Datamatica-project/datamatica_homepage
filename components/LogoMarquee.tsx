"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";

// ─── 1열 로고 데이터 ────────────────────────────────────────────
const ROW1_LOGO_FILES = [
  "BASICAI 로고.png",
  "Databaker 로고.png",
  "JLAB 로고.png",
  "KETI_CI국문---어두운배경1.png",
  "LK시스템 로고.png",
  "NIA 로고.png",
  "SD시스템 로고.png",
  "ssl 로고.png",
  "가천대 로고.png",
  "강릉시 로고.png",
  "강원도 로고.png",
  "글로벌메타 로고.png",
  "기상청 로고.png",
  "내담 로고.png",
  "당진시 로고.png",
  "동부ICT 로고.png",
  "롯데정보통신 로고.png",
  "맥케이 로고.png",
  "메타빌드 로고.png",
  "사람과모빌리티 로고.png",
];

// ─── 2열 로고 데이터 ────────────────────────────────────────────
const ROW2_LOGO_FILES = [
  "상상할수없는 로고.jpg",
  "시흥시 로고.png",
  "어빌리티 로고.png",
  "엘케이시스 로고.png",
  "웨인 로고.png",
  "유시스 로고.png",
  "익산시 로고.png",
  "인하대학교 로고.png",
  "전라북도 로고.png",
  "제주대학교 로고.png",
  "지멘스 로고.png",
  "진선 로고.png",
  "철기연 로고.png",
  "충남 로고.png",
  "한국 교통연구원(KOTI) 로고.png",
  "한국교통안전공단(TS) 로고.png",
  "한국자동차연구원 로고.png",
  "한국전자통신연구원(ETRI) 로고.png",
  "한양대 로고.png",
  "화성시 로고.png",
];

const toLogoList = (files: string[]) =>
  files.map((file) => ({
    src: `/ourClient/logos/${file}`,
    alt: file.replace(/\.(png|jpg)$/, ""),
  }));

const SPEED = 0.5;

// ─── 단일 마키 행 컴포넌트 ─────────────────────────────────────
function MarqueeRow({
  logos,
  direction,
}: {
  logos: { src: string; alt: string }[];
  direction: "left" | "right";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(0);
  const inViewRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const sign = direction === "left" ? -1 : 1;

  const wrapOffset = useCallback((offset: number) => {
    const el = trackRef.current;
    if (!el) return offset;
    const halfWidth = el.scrollWidth / 2;
    if (halfWidth <= 0) return offset;
    let o = offset % halfWidth;
    if (sign === -1 && o > 0) o -= halfWidth;
    if (sign === 1 && o < -halfWidth) o += halfWidth;
    return o;
  }, [sign]);

  const tick = useCallback(() => {
    if (!inViewRef.current) return;
    const el = trackRef.current;
    if (el && !isDraggingRef.current) {
      offsetRef.current += sign * -SPEED;
      offsetRef.current = wrapOffset(offsetRef.current);
      el.style.transform = `translateX(${offsetRef.current}px)`;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [sign, wrapOffset]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDrag = useCallback((clientX: number) => {
    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    dragStartOffsetRef.current = offsetRef.current;
  }, []);

  const moveDrag = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    const el = trackRef.current;
    if (!el) return;
    const delta = clientX - dragStartXRef.current;
    offsetRef.current = wrapOffset(dragStartOffsetRef.current + delta);
    el.style.transform = `translateX(${offsetRef.current}px)`;
  }, [wrapOffset]);

  const endDrag = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const renderItems = (keyPrefix: string) =>
    logos.map((logo, i) => (
      <div
        key={`${keyPrefix}-${i}`}
        className="shrink-0 w-[100px] h-[44px] md:w-[140px] md:h-[60px] relative px-[10px] md:px-[16px]"
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          fill
          sizes="120px"
          draggable={false}
          className="object-contain dark:brightness-0 dark:invert pointer-events-none"
        />
      </div>
    ));

  return (
    <div
      ref={containerRef}
      className="overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => startDrag(e.clientX)}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX); }}
      onTouchEnd={endDrag}
    >
      <div
        ref={trackRef}
        className="flex w-max gap-[40px] md:gap-[80px]"
        style={{ willChange: "transform" }}
      >
        {renderItems("a")}
        {renderItems("b")}
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────
export default function LogoMarquee() {
  const row1 = toLogoList(ROW1_LOGO_FILES);
  const row2 = toLogoList(ROW2_LOGO_FILES);

  return (
    <div className="w-full mt-[40px] md:mt-[80px] bg-white dark:bg-[#252527] p-[20px] md:p-[30px]">
      <div className="flex items-center gap-[16px] mb-[24px] md:mb-[30px]">
        <div className="flex-1 h-px bg-[#e0e0e0] dark:bg-[#363638]" />
        <span className="shrink-0 text-[13px] md:text-[15px] font-medium text-description tracking-[0.08em] uppercase">
          주요 협력 기관
        </span>
        <div className="flex-1 h-px bg-[#e0e0e0] dark:bg-[#363638]" />
      </div>
      <div className="flex flex-col gap-[20px] md:gap-[28px]">
        <MarqueeRow logos={row1} direction="left" />
        <MarqueeRow logos={row2} direction="right" />
      </div>
    </div>
  );
}
