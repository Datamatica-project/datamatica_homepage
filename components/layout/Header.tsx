import React from "react";
import Link from "next/link";
import { Home } from "@/components/Icons";

interface HeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  watermark?: string;
  breadcrumbLabel: string;
  className?: string;
}

export default function Header({
  title,
  description,
  watermark,
  breadcrumbLabel,
  className = "",
}: HeaderProps) {
  return (
    <section
      className={`relative overflow-hidden pt-[108px] pb-[56px] md:pt-[132px] md:pb-[72px] ${className}`}
    >
      <div className="relative z-10 max-w-[1000px] mx-auto px-[24px]">
        <div className="flex items-center gap-[8px] text-[12px] md:text-[13px] text-description">
          <Link
            href="/"
            aria-label="홈으로 이동"
            className="inline-flex items-center justify-center text-description transition-colors hover:text-normal-text"
          >
            <Home />
          </Link>
          <span className="text-[#cfcfcf] dark:text-[#444444]">/</span>
          <span className="truncate">{breadcrumbLabel}</span>
        </div>

        <div className="mt-[18px] md:mt-[22px] max-w-[720px]">
          <h1 className="text-[34px] leading-[1.15] font-semibold tracking-[-0.02em] text-normal-text md:text-[56px]">
            {title}
          </h1>

          {description && (
            <p className="mt-[14px] text-[14px] leading-[1.8] text-description md:mt-[18px] md:text-[17px]">
              {description}
            </p>
          )}
        </div>
      </div>

      {watermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[24px] bottom-[8px] z-0 hidden select-none text-[56px] font-semibold tracking-[-0.03em] text-main/8 md:block md:text-[88px] lg:right-[6%] lg:text-[104px]"
        >
          {watermark}
        </div>
      )}
    </section>
  );
}
