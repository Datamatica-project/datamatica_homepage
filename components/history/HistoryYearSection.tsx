"use client";

import React from "react";
import type { HistoryTimelineItem, HistoryTimelineYear } from "@/data/history";

interface HistoryMonthBlockProps {
  year: number;
  item: HistoryTimelineItem;
  isEmphasized: boolean;
}

function HistoryMonthBlock({
  year,
  item,
  isEmphasized,
}: HistoryMonthBlockProps) {
  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-[18px] md:grid-cols-[70px_minmax(0,1fr)] md:gap-[28px]">
      <div
        className={`pt-[2px] font-semibold leading-none tracking-[-0.02em] text-[20px] md:text-[24px] transition-colors duration-300 ${
          isEmphasized
            ? "text-[#9d9d9d] dark:text-[#666]"
            : "text-[#c0c0c0] dark:text-[#555]"
        }`}
      >
        {item.month}
      </div>
      <div className="space-y-[10px] md:space-y-[14px]">
        {item.entries.map((entry) => (
          <div
            key={`${year}-${item.month}-${entry}`}
            className="flex items-center gap-[10px]"
          >
            <span
              className={`shrink-0 w-[5px] h-[5px] rounded-full transition-colors duration-300 ${
                isEmphasized ? "bg-main/60" : "bg-main/40"
              }`}
            />
            <p
              className={`font-normal leading-[1.45] md:leading-normal text-[15px] md:text-[18px] transition-colors duration-300 ${
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
        ))}
      </div>
    </div>
  );
}

interface HistoryYearSectionProps {
  yearData: HistoryTimelineYear;
  isLast?: boolean;
  isLatestYear?: boolean;
  activeEmphasizedYear: number | null;
}

const HistoryYearSection = React.forwardRef<
  HTMLElement,
  HistoryYearSectionProps
>(function HistoryYearSection(
  { yearData, isLast = false, isLatestYear = false, activeEmphasizedYear },
  ref
) {
  return (
    <section
      ref={ref}
      id={`history-year-${yearData.year}`}
      data-year={yearData.year}
      className={`relative ${
        isLast ? "pb-[40px] md:pb-[60px]" : "pb-[72px] md:pb-[120px]"
      }`}
    >
      {/* 연도 워터마크: 우측 배경 */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[24px] top-1/2 -translate-y-1/2 z-0 select-none text-[120px] font-semibold leading-none tracking-[-0.04em] text-main/6 md:text-[160px] lg:text-[180px]"
      >
        {yearData.year}
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-y-[28px] md:grid-cols-[140px_minmax(0,1fr)] md:gap-x-[60px]">
        <div className="md:sticky md:top-[104px] md:self-start">
          <div className="text-[56px] font-semibold leading-none tracking-[-0.04em] text-main lg:text-[64px]">
            {yearData.year}
          </div>
        </div>

        <div className="space-y-[48px] md:space-y-[64px]">
          {[...yearData.items].reverse().map((item) => (
            <HistoryMonthBlock
              key={`${yearData.year}-${item.month}`}
              year={yearData.year}
              item={item}
              isEmphasized={activeEmphasizedYear === yearData.year}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default HistoryYearSection;
