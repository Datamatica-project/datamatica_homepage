"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HistoryTimelineYear } from "@/data/history";
import HistoryYearNav from "./HistoryYearNav";
import HistoryYearSection from "./HistoryYearSection";

interface HistoryTimelineProps {
  timeline: HistoryTimelineYear[];
}

const SCROLL_OFFSET = 96;

export default function HistoryTimeline({ timeline }: HistoryTimelineProps) {
  const years = useMemo(() => timeline.map((item) => item.year), [timeline]);
  const [activeYear, setActiveYear] = useState<number>(years[0] ?? 0);
  const [activeEmphasizedYear, setActiveEmphasizedYear] = useState<number | null>(
    timeline[0]?.year ?? null
  );
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const outerSectionRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const [desktopNavFixed, setDesktopNavFixed] = useState(false);

  const setSectionRef = useCallback((year: number, node: HTMLElement | null) => {
    sectionRefs.current[year] = node;
  }, []);

  const handleSelectYear = useCallback((year: number) => {
    const section = sectionRefs.current[year];

    if (!section) return;

    const top = section.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!timeline.length) return;

    setActiveYear(timeline[0].year);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;

        const nextYear = Number(
          (visibleEntries[0].target as HTMLElement).dataset.year ?? years[0]
        );

        setActiveYear(nextYear);
      },
      {
        rootMargin: "-18% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    );

    timeline.forEach((item) => {
      const section = sectionRefs.current[item.year];
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [timeline, years]);

  // 뷰포트 중앙에 가장 가까운 연도 섹션을 강조
  useEffect(() => {
    const updateActiveYear = () => {
      const vh = window.innerHeight;
      const centerY = vh / 2;
      let closestYear: number | null = null;
      let minDist = Infinity;
      Object.values(sectionRefs.current).forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - centerY);
        const year = Number(el.dataset.year);
        if (dist < minDist && rect.top < vh && rect.bottom > 0 && !isNaN(year)) {
          minDist = dist;
          closestYear = year;
        }
      });
      setActiveEmphasizedYear(closestYear);
    };
    const handleScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        updateActiveYear();
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveYear();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const INITIAL_OFFSET = 36;
    const update = () => {
      const section = outerSectionRef.current;
      const nav = desktopNavRef.current;
      if (!section || !nav) return;
      const sectionTop = section.getBoundingClientRect().top;
      const navHeight = nav.offsetHeight;
      setDesktopNavFixed(sectionTop + INITIAL_OFFSET + navHeight / 2 <= window.innerHeight / 2);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!timeline.length) {
    return null;
  }

  return (
    <section ref={outerSectionRef} className="relative pb-[96px] md:pb-[140px]">
      <div className="sticky top-[64px] z-20 border-y border-[#ececec] bg-[#F6F7F9]/92 backdrop-blur lg:hidden dark:border-[#232325] dark:bg-[#1c1c1e]/92">
        <HistoryYearNav
          years={years}
          activeYear={activeYear}
          onSelectYear={handleSelectYear}
          orientation="mobile"
        />
      </div>

      <div
        ref={desktopNavRef}
        className="hidden lg:block z-20"
        style={{
          position: desktopNavFixed ? "fixed" : "absolute",
          top: desktopNavFixed ? "50%" : "36px",
          transform: desktopNavFixed ? "translateY(-50%)" : "none",
          left: "max(24px, calc((100vw - 1000px) / 2 - 122px))",
        }}
      >
        <HistoryYearNav
          years={years}
          activeYear={activeYear}
          onSelectYear={handleSelectYear}
        />
      </div>

      <div className="max-w-[1000px] mx-auto px-[24px] pt-[28px] md:pt-[36px]">
        <div className="space-y-[24px] md:space-y-[32px]">
          {timeline.map((yearData, index) => (
            <HistoryYearSection
              key={yearData.year}
              ref={(node) => setSectionRef(yearData.year, node)}
              yearData={yearData}
              isLast={index === timeline.length - 1}
              isLatestYear={index === 0}
              activeEmphasizedYear={activeEmphasizedYear}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
