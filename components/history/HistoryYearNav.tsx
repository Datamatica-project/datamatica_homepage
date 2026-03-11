"use client";

import React from "react";

interface HistoryYearNavProps {
  years: number[];
  activeYear: number;
  onSelectYear: (year: number) => void;
  orientation?: "desktop" | "mobile";
}

export default function HistoryYearNav({
  years,
  activeYear,
  onSelectYear,
  orientation = "desktop",
}: HistoryYearNavProps) {
  if (orientation === "mobile") {
    return (
      <div className="flex gap-[8px] overflow-x-auto px-[24px] py-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {years.map((year) => {
          const isActive = year === activeYear;

          return (
            <button
              key={year}
              type="button"
              onClick={() => onSelectYear(year)}
              className={`shrink-0 cursor-pointer rounded-full border px-[16px] py-[6px] text-[13px] transition-all ${
                isActive
                  ? "border-main bg-main text-white"
                  : "border-[#d8d8d8] bg-white text-description dark:border-[#3a3a3a] dark:bg-[#1a1a1b]"
              }`}
            >
              {year}년
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[30px]">
      {years.map((year) => {
        const isActive = year === activeYear;

        return (
          <button
            key={year}
            type="button"
            onClick={() => onSelectYear(year)}
            className={`cursor-pointer border-l-[5px] pl-[14px] text-right text-[18px] leading-none transition-all ${
              isActive
                ? "border-main text-main text-[22px]"
                : "border-transparent text-description hover:text-normal-text"
            }`}
          >
            {year}년
          </button>
        );
      })}
    </div>
  );
}
