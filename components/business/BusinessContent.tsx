"use client";

import React, { useState } from "react";
import Image from "next/image";
import { skillData } from "@/data";
import { ArrowRightCircle } from "@/components/Icons";

const FALLBACK_IMAGE = "/header/datamatica_logo.png";

function ProjectCard({
  title,
  description,
  image,
  href,
}: {
  title: string;
  description: string;
  image: string;
  href: string;
}) {
  const [src, setSrc] = useState(image || FALLBACK_IMAGE);
  const isFallback = src === FALLBACK_IMAGE;

  return (
    <div className="rounded-[16px] overflow-hidden border border-[#e8e8e8] dark:border-[#333] bg-white dark:bg-[#1e1e1f] shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:scale-[1.02]">
      <div className="relative w-full aspect-16/10 overflow-hidden bg-[#fdf5f5] dark:bg-[#2a1a1a]">
        <Image
          src={src}
          alt={title}
          fill
          className={isFallback ? "object-contain p-[20px]" : "object-cover transition-transform duration-500 group-hover:scale-105"}
          onError={() => setSrc(FALLBACK_IMAGE)}
        />
      </div>
      <div className="flex flex-col flex-1 p-[24px]">
        <h3 className="text-[16px] font-bold leading-[1.4] text-normal-text">
          {title}
        </h3>
        <p className="mt-[10px] flex-1 text-[14px] leading-[1.6] text-description">
          {description}
        </p>
        <a
          href={href}
          className="mt-[20px] inline-flex w-fit items-center gap-[8px] text-[14px] font-medium text-normal-text transition-colors hover:text-main"
        >
          <ArrowRightCircle size={25} />
          자세히보기
        </a>
      </div>
    </div>
  );
}

export default function BusinessContent() {
  const [activeId, setActiveId] = useState(skillData[0].id);
  const active = skillData.find((s) => s.id === activeId) ?? skillData[0];

  return (
    <div className="max-w-[1000px] mx-auto px-[24px] pb-[80px] md:pb-[120px]">

      {/* 기술 카테고리 탭 */}
      <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-[#e0e0e0] dark:border-[#2e2e2e] mb-[48px] md:mb-[60px]">
        {skillData.map((skill) => (
          <button
            key={skill.id}
            onClick={() => setActiveId(skill.id)}
            className={`shrink-0 px-[16px] py-[14px] text-[14px] md:text-[15px] font-medium transition-all whitespace-nowrap cursor-pointer
              ${
                activeId === skill.id
                  ? "border-b-[3px] border-main text-normal-text font-semibold -mb-px"
                  : "border-b-[3px] border-transparent text-description hover:text-normal-text"
              }`}
          >
            {skill.title}
          </button>
        ))}
      </div>

      {/* 기술 설명 영역 */}
      <div className="flex flex-col md:flex-row gap-[32px] md:gap-[48px] mb-[60px] md:mb-[80px]">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-main mb-[12px]">
            Our Business
          </p>
          <h2 className="text-[28px] md:text-[36px] font-semibold leading-[1.2] tracking-[-0.02em] text-normal-text mb-[20px]">
            {active.title}
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[1.8] text-description">
            {active.overview}
          </p>
        </div>
        <div className="relative shrink-0 w-full md:w-[380px] aspect-4/3 rounded-[16px] overflow-hidden bg-[#f0f0f0] dark:bg-[#1e1e1f]">
          <Image
            src={active.imageSrc}
            alt={active.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* 프로젝트 그리드 */}
      <div>
        <h3 className="text-[18px] md:text-[20px] font-semibold text-normal-text mb-[24px]">
          주요 프로젝트
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] list-none">
          {active.projects.map((project) => (
            <li key={project.title}>
              <ProjectCard
                title={project.title}
                description={project.description}
                image={project.image}
                href={project.href}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
