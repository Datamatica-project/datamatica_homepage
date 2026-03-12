"use client";

import React from "react";
import type { HistoryTimelineYear } from "@/data/history";

interface HistoryYearSectionProps {
  yearData: HistoryTimelineYear;
  isLast?: boolean;
}

const HistoryYearSection = React.forwardRef<
  HTMLElement,
  HistoryYearSectionProps
>(function HistoryYearSection({ yearData, isLast = false }, ref) {
  return (
    <section
      ref={ref}
      id={`history-year-${yearData.year}`}
      data-year={yearData.year}
      className={`relative ${
        isLast ? "pb-[40px] md:pb-[60px]" : "pb-[72px] md:pb-[120px]"
      }`}
    >
      <div className="grid grid-cols-1 gap-y-[28px] md:grid-cols-[140px_minmax(0,1fr)] md:gap-x-[60px]">
        <div className="md:sticky md:top-[104px] md:self-start">
          <div className="text-[56px] font-semibold leading-none tracking-[-0.04em] text-main lg:text-[64px]">
            {yearData.year}
          </div>
        </div>

        <div className="space-y-[34px] md:space-y-[52px]">
          {yearData.items.map((item) => (
            <div
              key={`${yearData.year}-${item.month}`}
              className="grid grid-cols-[56px_minmax(0,1fr)] gap-[18px] md:grid-cols-[70px_minmax(0,1fr)] md:gap-[28px]"
            >
              <div className="pt-[2px] text-[20px] font-semibold leading-none tracking-[-0.02em] text-[#9d9d9d] dark:text-[#666] md:text-[24px]">
                {item.month}
              </div>

              <div className="space-y-[10px] md:space-y-[12px]">
                {item.entries.map((entry) => (
                  <div
                    key={`${yearData.year}-${item.month}-${entry}`}
                    className="flex items-center gap-[10px]"
                  >
                    <span className="shrink-0 w-[5px] h-[5px] rounded-full bg-main/60" />
                    <p className="font-medium text-[15px] leading-[1.85] text-normal-text md:text-[18px] md:leading-[1.9]">
                      {entry}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HistoryYearSection;
