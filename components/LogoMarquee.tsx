"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

const LOGO_FILES = [
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

const LOGOS = LOGO_FILES.map((file) => ({
  src: `/ourClient/logos/${file}`,
  alt: file.replace(/\.(png|jpg)$/, ""),
}));

const renderLogos = (keyPrefix: string) =>
  LOGOS.map((logo, i) => (
    <div
      key={`${keyPrefix}-${i}`}
      className="shrink-0 w-[100px] h-[44px] md:w-[140px] md:h-[60px] relative px-[10px] md:px-[16px]"
    >
      <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
    </div>
  ));

const SPEED = 0.5; // px per frame

export default function LogoMarquee() {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(0);
  const pausedRef = useRef(false);
  const inViewRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // 뷰포트 진입/이탈 감지
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

  const tick = useCallback(() => {
    if (!inViewRef.current) return;

    const el = trackRef.current;
    if (el && !pausedRef.current) {
      offsetRef.current -= SPEED;
      const halfWidth = el.scrollWidth / 2;
      if (Math.abs(offsetRef.current) >= halfWidth) {
        offsetRef.current += halfWidth;
      }
      el.style.transform = `translateX(${offsetRef.current}px)`;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  return (
    <div ref={containerRef} className="w-full mt-[40px] md:mt-[80px] bg-white dark:bg-[#1a1a1b] p-[20px] md:p-[30px]">
      <p className="text-center text-[14px] md:text-[18px] text-normal-text mb-[24px] md:mb-[30px] font-medium">
        주요 협력 기관
      </p>

      <div
        className="overflow-hidden select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-[40px] md:gap-[80px]"
          style={{ willChange: "transform" }}
        >
          {renderLogos("a")}
          {renderLogos("b")}
        </div>
      </div>
    </div>
  );
}
