"use client";

import React from "react";

interface HistoryYearNavProps {
  years: number[];
  activeYear: number;
  onSelectYear: (year: number) => void;
  orientation?: "desktop" | "mobile";
  entryCounts?: Record<number, number>;
}

export default function HistoryYearNav({
  years,
  activeYear,
  onSelectYear,
  orientation = "desktop",
  entryCounts,
}: HistoryYearNavProps) {
  if (orientation === "mobile") {
    return (
      <div className="flex gap-[8px] overflow-x-auto px-[24px] py-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {years.map((year) => {
          const isActive = year === activeYear;
          const count = entryCounts?.[year];
          return (
            <button
              key={year}
              type="button"
              onClick={() => onSelectYear(year)}
              className={`shrink-0 cursor-pointer rounded-full border px-[16px] py-[6px] text-[13px] transition-all ${
                isActive
                  ? "border-main bg-main text-white"
                  : "border-[#d8d8d8] bg-white text-description dark:border-[#434345] dark:bg-[#252527]"
              }`}
            >
              {year}년
              {count != null && (
                <span
                  className={`ml-[5px] text-[11px] ${
                    isActive ? "text-white/70" : "text-description/60"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {years.map((year) => {
        const isActive = year === activeYear;
        const count = entryCounts?.[year];
        return (
          <button
            key={year}
            type="button"
            onClick={() => onSelectYear(year)}
            className={`cursor-pointer border-l-[3px] pl-[14px] text-left transition-all ${
              isActive
                ? "border-main"
                : "border-transparent hover:border-[#d0d0d0] dark:hover:border-[#444]"
            }`}
          >
            <div
              className={`leading-none transition-all ${
                isActive
                  ? "text-main font-semibold text-[20px]"
                  : "text-[18px] text-description hover:text-normal-text"
              }`}
            >
              {year}년
            </div>
            {count != null && (
              <div
                className={`mt-[5px] text-[11px] transition-colors ${
                  isActive ? "text-main/60" : "text-description/50"
                }`}
              >
                {count}건
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
