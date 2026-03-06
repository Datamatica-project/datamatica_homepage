import React from "react";
import Image from "next/image";

export default function SkillBox({
  title,
  description,
  imageSrc,
}: {
  title: string;
  description: React.ReactNode;
  imageSrc: string;
}) {
  return (
    <li className="relative w-[485px] h-[485px] overflow-hidden rounded-[20px] px-[37px] py-[40px] text-white cursor-pointer">
      <Image
        src={imageSrc}
        alt=""
        aria-hidden
        fill
        sizes="485px"
        className="object-cover"
        priority={false}
      />

      {/* 이미지 위 검정 → 투명 그라디언트 */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* 텍스트는 최상단 레이어 */}
      <div className="relative z-10">
        <h3 className="text-[36px] font-medium">{title}</h3>
        <p className="mt-2 text-[16px] font-normal">{description}</p>
      </div>
    </li>
  );
}
