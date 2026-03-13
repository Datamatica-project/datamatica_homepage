"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "../common/SectionTitle";
import { ChevronLeft, ChevronRight } from "../Icons";
import { skillData } from "@/data";

// 각 사업 분야의 가장 최근 프로젝트(첫 번째) 1개씩 추출
const PROJECTS = skillData.map((skill) => ({
  tab: skill.title,
  skillId: skill.id,
  project: skill.projects[0],
}));

const VISIBLE_COUNT_MOBILE = 2;
const VISIBLE_COUNT_DESKTOP = 3;

export default function OurProjects() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tabOffset, setTabOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT_DESKTOP);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () =>
      setVisibleCount(mq.matches ? VISIBLE_COUNT_DESKTOP : VISIBLE_COUNT_MOBILE);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    setTabOffset((prev) =>
      Math.min(prev, Math.max(0, PROJECTS.length - visibleCount))
    );
  }, [visibleCount]);

  const active = PROJECTS[activeIdx];
  const canScrollLeft = tabOffset > 0;
  const canScrollRight = tabOffset + visibleCount < PROJECTS.length;

  return (
    <div className="max-w-[1000px] mx-auto px-[24px] pb-[60px] md:pb-[120px]">
      <SectionTitle
        subtitle="Our Projects"
        title={
          <>
            <span className="text-main font-bold">기술</span>을 넘어,{" "}
            <span className="text-main font-bold">결과</span>를 만들다
          </>
        }
        description={
          <>
            실제 산업 현장에 적용된 웹 서비스와 시스템을 통해
            <br />
            데이터 기술의 완성도를 증명합니다.
          </>
        }
        center={true}
      />

      {/* 탭 */}
      <div className="flex items-end mt-[30px] md:mt-[50px] gap-[8px]">
        {canScrollLeft && (
          <button
            onClick={() => setTabOffset((prev) => prev - 1)}
            className="pb-[14px] text-black dark:text-white cursor-pointer"
          >
            <ChevronLeft size={23} />
          </button>
        )}

        <div className="flex-1 overflow-hidden border-b border-[#e0e0e0] dark:border-[#323234]">
          <div
            className="flex transition-transform duration-400 ease-out"
            style={{
              width: `${(PROJECTS.length / visibleCount) * 100}%`,
              transform: `translateX(-${(tabOffset / PROJECTS.length) * 100}%)`,
            }}
          >
            {PROJECTS.map((p, i) => (
              <button
                key={p.skillId}
                onClick={() => { setActiveIdx(i); setHovered(false); }}
                className={
                  "pb-[14px] text-[13px] md:text-[18px] transition-colors relative whitespace-nowrap " +
                  (activeIdx === i
                    ? "text-normal-text font-bold cursor-default"
                    : "text-description font-medium hover:text-normal-text cursor-pointer")
                }
                style={{ width: `${100 / PROJECTS.length}%` }}
              >
                {p.tab}
                {activeIdx === i && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-normal-text rounded-full origin-center animate-[expandX_0.3s_ease-out_forwards]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {canScrollRight && (
          <button
            onClick={() => setTabOffset((prev) => prev + 1)}
            className="pb-[14px] text-black dark:text-white cursor-pointer"
          >
            <ChevronRight size={23} />
          </button>
        )}
      </div>

      {/* 이미지 + 호버 오버레이 */}
      <Link
        href={`/business/${active.skillId}/${active.project.id}`}
        className="block relative mt-[24px] w-full aspect-video rounded-[12px] overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={active.project.image || "/header/datamatica_logo.png"}
          alt={active.project.title}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
        />

        {/* 어두운 오버레이 */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${hovered ? "opacity-65" : "opacity-0"}`} />

        {/* 오버레이 콘텐츠 */}
        <div className={`absolute inset-0 flex flex-col justify-end p-[20px] md:p-[36px] transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
          {/* 사업 분야 태그 */}
          <span className="mb-[10px] inline-block w-fit px-[12px] py-[4px] rounded-full bg-main/80 text-white text-[11px] md:text-[13px] font-medium">
            {active.tab}
          </span>

          {/* 프로젝트 제목 */}
          <h3 className="text-white text-[18px] md:text-[26px] font-bold leading-[1.3] mb-[10px]">
            {active.project.title}
          </h3>

          {/* 한 줄 설명 */}
          <p className="text-white/80 text-[13px] md:text-[15px] leading-[1.6] mb-[14px] line-clamp-2">
            {active.project.description}
          </p>

          {/* 주요 성과 첫 번째 항목 */}
          <p className="text-white/60 text-[12px] md:text-[13px] leading-[1.5] line-clamp-1">
            ✦ {active.project.results[0]}
          </p>

          {/* 기술 태그 (최대 4개) */}
          <div className="flex flex-wrap gap-[6px] mt-[14px]">
            {active.project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-[10px] py-[3px] rounded-full bg-white/15 text-white text-[11px] md:text-[12px] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
