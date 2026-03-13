"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightCircle } from "../Icons";

const FALLBACK_IMAGE = "/header/datamatica_logo.png";

interface NewsCardProps {
  date: string;
  title: string;
  description: string;
  image: string;
  href?: string;
  className?: string;
}

export default function NewsCard_main({
  date,
  title,
  description,
  image,
  href = "#",
  className = "w-[320px]",
}: NewsCardProps) {
  const [src, setSrc] = useState(image || FALLBACK_IMAGE);
  const isFallback = src === FALLBACK_IMAGE;

  const cardContent = (
    <>
      {/* 이미지 */}
      <div className="relative w-full aspect-16/10 overflow-hidden bg-[#fdf5f5] dark:bg-[#2a1a1a]">
        <Image
          src={src}
          alt={title}
          fill
          draggable={false}
          className={
            isFallback
              ? "object-contain p-[20px]"
              : "object-cover transition-transform duration-500 group-hover:scale-105"
          }
          onError={() => setSrc(FALLBACK_IMAGE)}
        />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col flex-1 p-[24px]">
        <span className="text-[14px] text-description font-medium">{date}</span>

        <h3 className="mt-[8px] min-h-[44.8px] text-[16px] font-bold leading-[1.4] text-normal-text line-clamp-2">
          {title}
        </h3>

        <p className="mt-[10px] min-h-[67.2px] text-[14px] leading-[1.6] text-description line-clamp-3">
          {description}
        </p>

        {/* 자세히보기 */}
        <div className="mt-[20px] inline-flex w-fit items-center gap-[8px] text-[14px] font-medium text-normal-text transition-colors group-hover:text-main">
          <ArrowRightCircle size={25} />
          자세히보기
        </div>
      </div>
    </>
  );

  const cardClassName = `${className} group rounded-[16px] overflow-hidden border border-[#e8e8e8] dark:border-[#3c3c3e] bg-white dark:bg-[#282829] shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:scale-[1.02]`;

  return (
    <div className="p-[10px]">
      {href.startsWith("http") ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClassName}
          draggable={false}
        >
          {cardContent}
        </a>
      ) : (
        <Link href={href} className={cardClassName} draggable={false}>
          {cardContent}
        </Link>
      )}
    </div>
  );
}
