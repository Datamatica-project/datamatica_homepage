"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const MAX_TILT = 12;
const PERSPECTIVE = 800;

export default function SkillBox({
  title,
  description,
  imageSrc,
  href,
  index = 0,
}: {
  title: string;
  description: React.ReactNode;
  imageSrc: string;
  href?: string;
  index?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const normalizedX =
      (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const normalizedY =
      (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${-normalizedY * MAX_TILT}deg) rotateY(${normalizedX * MAX_TILT}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  const card = (
    <div
      ref={cardRef}
      className="relative w-[300px] h-[300px] md:w-[485px] md:h-[485px] overflow-hidden rounded-[16px] md:rounded-[20px] px-[20px] py-[24px] md:px-[37px] md:py-[40px] text-white cursor-pointer shadow-[0_2.5rem_3.5rem_rgba(0,0,0,0)] hover:shadow-[0_2.5rem_3.5rem_rgba(0,0,0,0.25)]"
      style={{
        transition: "transform 0.15s ease-out, box-shadow 0.3s ease-out",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={imageSrc}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 768px) 300px, 485px"
        className="object-cover"
        priority={false}
      />

      {/* 이미지 위 검정 → 투명 그라디언트 */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* 텍스트는 최상단 레이어 */}
      <div className="relative z-10">
        <h3 className="text-[22px] md:text-[36px] font-medium">{title}</h3>
        <p className="mt-2 text-[13px] md:text-[16px] font-normal">{description}</p>
      </div>
    </div>
  );

  return (
    <li className="shrink-0">
      {href ? <Link href={href}>{card}</Link> : card}
    </li>
  );
}
