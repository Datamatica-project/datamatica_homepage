"use client";

import React, { useRef, useEffect, useState } from "react";
import type { HistoryTimelineItem, HistoryTimelineYear } from "@/data/history";

// ─── 항목 유형 태그 ──────────────────────────────────────────────
type TagInfo = { label: string; cls: string };

function getEntryTag(entry: string): TagInfo | null {
  if (/수주/.test(entry))
    return { label: "수주", cls: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" };
  if (/MoU|체결/.test(entry))
    return { label: "협력", cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" };
  if (/인증/.test(entry))
    return { label: "인증", cls: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400" };
  if (/투자/.test(entry))
    return { label: "투자", cls: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" };
  if (/설립/.test(entry))
    return { label: "설립", cls: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400" };
  return null;
}

// ─── 월별 블록 ───────────────────────────────────────────────────
function HistoryMonthBlock({
  year,
  item,
  isEmphasized,
}: {
  year: number;
  item: HistoryTimelineItem;
  isEmphasized: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative pl-[28px] md:pl-[32px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
      }}
    >
      {/* 타임라인 도트 */}
      <div
        className={`absolute left-[5px] top-[5px] w-[10px] h-[10px] rounded-full border-[2px] transition-colors duration-500 ${
          isEmphasized
            ? "bg-main border-white dark:border-[#1c1c1e]"
            : "bg-[#d8d8d8] border-[#f5f5f5] dark:bg-[#484848] dark:border-[#1c1c1e]"
        }`}
      />

      {/* 월 + 항목 */}
      <div className="flex flex-col gap-[8px] md:grid md:grid-cols-[60px_minmax(0,1fr)] md:gap-[28px]">
        {/* 월 */}
        <div
          className={`font-semibold leading-none tracking-[-0.02em] text-[16px] md:pt-[1px] md:text-[20px] transition-colors duration-500 ${
            isEmphasized
              ? "text-[#9d9d9d] dark:text-[#666]"
              : "text-[#c0c0c0] dark:text-[#555]"
          }`}
        >
          {parseInt(item.month)}월
        </div>

        {/* 항목 목록 */}
        <div className="space-y-[10px] md:space-y-[12px]">
          {item.entries.map((entry, idx) => {
            const tag = getEntryTag(entry);
            return (
              <div key={`${year}-${item.month}-${idx}`} className="flex items-start gap-[8px]">
                {tag && (
                  <span
                    className={`shrink-0 mt-[1.5px] px-[6px] py-[2.5px] rounded-[4px] text-[11px] font-semibold leading-none ${tag.cls}`}
                  >
                    {tag.label}
                  </span>
                )}
                <p
                  className={`leading-[1.5] text-[14px] md:text-[16px] transition-colors duration-500 ${
                    isEmphasized
                      ? "text-normal-text"
                      : "text-[#aaaaaa98] dark:text-[#666]"
                  }`}
                >
                  {entry.split("\n").map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 연도 섹션 ───────────────────────────────────────────────────
interface HistoryYearSectionProps {
  yearData: HistoryTimelineYear;
  isLast?: boolean;
  isLatestYear?: boolean;
  activeEmphasizedYear: number | null;
}

const HistoryYearSection = React.forwardRef<HTMLElement, HistoryYearSectionProps>(
  function HistoryYearSection(
    { yearData, isLast = false, isLatestYear = false, activeEmphasizedYear },
    ref
  ) {
    const isEmphasized = activeEmphasizedYear === yearData.year;
    const items = [...yearData.items].reverse();

    return (
      <section
        ref={ref}
        id={`history-year-${yearData.year}`}
        data-year={yearData.year}
        className={`relative ${
          isLast ? "pb-[40px] md:pb-[60px]" : "pb-[72px] md:pb-[120px]"
        }`}
      >
        {/* 연도 워터마크 */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[24px] top-1/2 -translate-y-1/2 z-0 select-none text-[120px] font-semibold leading-none tracking-[-0.04em] text-main/6 md:text-[160px] lg:text-[180px]"
        >
          {yearData.year}
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-y-[28px] md:grid-cols-[140px_minmax(0,1fr)] md:gap-x-[60px]">
          {/* 연도 헤딩 */}
          <div className="md:sticky md:top-[104px] md:self-start">
            <div className="text-[56px] font-semibold leading-none tracking-[-0.04em] text-main lg:text-[64px]">
              {yearData.year}
            </div>
          </div>

          {/* 타임라인 콘텐츠 */}
          <div className="relative">
            {/* 수직 연결선 */}
            <div
              className={`absolute left-[9px] top-[10px] bottom-0 w-[2px] rounded-full transition-colors duration-500 ${
                isEmphasized
                  ? "bg-gradient-to-b from-main/50 via-main/15 to-transparent"
                  : "bg-gradient-to-b from-[#ddd] via-[#e8e8e8]/30 to-transparent dark:from-[#3a3a3c] dark:via-[#3a3a3c]/20"
              }`}
            />

            {/* 월별 블록 */}
            <div className="space-y-[40px] md:space-y-[52px]">
              {items.map((item) => (
                <HistoryMonthBlock
                  key={`${yearData.year}-${item.month}`}
                  year={yearData.year}
                  item={item}
                  isEmphasized={isEmphasized}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
);

export default HistoryYearSection;
