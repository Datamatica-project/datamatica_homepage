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

    card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${-normalizedY * MAX_TILT}deg) rotateY(${normalizedX * MAX_TILT}deg) scale(1.03)`;
    card.style.boxShadow = "0 2rem 3rem rgba(0,0,0,0.22)";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    card.style.boxShadow = "0 0.5rem 1.5rem rgba(0,0,0,0.08)";
  };

  const inner = (
    <div className="w-[300px] md:w-[485px] cursor-pointer">
      {/* 이미지 영역만 tilt + 그림자 */}
      <div
        ref={cardRef}
        className="relative w-full h-[300px] md:h-[485px] overflow-hidden rounded-[16px] md:rounded-[20px]"
        style={{
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease-out",
          willChange: "transform",
          boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,0.08)",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 300px, 485px"
          className="object-cover"
          priority={false}
          draggable={false}
        />
      </div>

      {/* 텍스트 영역: 배경에 붙어있음 */}
      <div className="pt-[14px] md:pt-[18px] px-[2px]">
        <h3 className="text-[17px] md:text-[22px] font-semibold text-normal-text leading-tight">
          {title}
        </h3>
        <p className="mt-[6px] text-[13px] md:text-[14px] text-description leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <li className="shrink-0">
      {href ? <Link href={href} draggable={false}>{inner}</Link> : inner}
    </li>
  );
}
