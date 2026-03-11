import React from "react";
import Image from "next/image";
import { ArrowRightCircle } from "../Icons";

interface NewsCardProps {
  date: string;
  title: string;
  description: string;
  image: string;
  href?: string;
}

export default function NewsCard_main({
  date,
  title,
  description,
  image,
  href = "#",
}: NewsCardProps) {
  return (
    <div className="p-[20px]">
      <div className="w-[320px] rounded-[16px] overflow-hidden border border-[#e8e8e8] dark:border-[#333] bg-white dark:bg-[#1e1e1f] shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:scale-[1.02]">
        {/* 이미지 */}
        <div className="relative w-full aspect-16/10 overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-col flex-1 p-[24px]">
          <span className="text-[14px] text-description font-medium">
            {date}
          </span>

          <h3 className="text-[16px] font-bold text-normal-text mt-[8px] leading-[1.4] line-clamp-2">
            {title}
          </h3>

          <p className="text-[14px] text-description mt-[10px] leading-[1.6] line-clamp-3 flex-1">
            {description}
          </p>

          {/* 자세히보기 */}
          <a
            href={href}
            className="inline-flex items-center gap-[8px] mt-[20px] text-[14px] text-normal-text font-medium border border-none py-[8px] w-fit transition-colors"
          >
            <ArrowRightCircle size={25} />
            자세히보기
          </a>
        </div>
      </div>
    </div>
  );
}
