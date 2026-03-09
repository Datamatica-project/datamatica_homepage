"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { ChevronLeft, ChevronRight } from "./Icons";

const PROJECTS = [
  {
    tab: "고정밀 지도",
    name: "Lidar 기반 3D 경로 생성 플랫폼",
    image: "/business/AM.png",
  },
  {
    tab: "라벨링 서비스",
    name: "AI 학습용 고품질 데이터 구축 솔루션",
    image: "/business/Labeling.png",
  },
  {
    tab: "AI 챗봇 서비스",
    name: "산업 맞춤형 AI 대화 자동화 플랫폼",
    image: "/business/Safty.png",
  },
  {
    tab: "인공지능 데이터 구축",
    name: "AI 학습용 고품질 데이터 구축 솔루션",
    image: "/business/Labeling.png",
  },
  {
    tab: "고정밀 지도",
    name: "Lidar 기반 3D 경로 생성 플랫폼",
    image: "/business/AM.png",
  },
];

const VISIBLE_COUNT = 3;

export default function OurProjects() {
  const [activeProject, setActiveProject] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tabOffset, setTabOffset] = useState(0);

  const canScrollLeft = tabOffset > 0;
  const canScrollRight = tabOffset + VISIBLE_COUNT < PROJECTS.length;

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

      {/* 탭: 항상 3개 표시, 초과 시 좌우 버튼으로 이동 */}
      <div className="flex items-end mt-[30px] md:mt-[50px] gap-[8px]">
        {PROJECTS.length > VISIBLE_COUNT && (
          <button
            onClick={() => setTabOffset((prev) => prev - 1)}
            disabled={!canScrollLeft}
            className={`pb-[14px] transition-opacity ${canScrollLeft ? "opacity-100 cursor-pointer" : "opacity-20 cursor-default"}`}
          >
            <ChevronLeft size={23} color="#000000" />
          </button>
        )}

        <div className="flex-1 overflow-hidden border-b border-[#e0e0e0]">
          <div
            className="flex transition-transform duration-400 ease-out"
            style={{
              width: `${(PROJECTS.length / VISIBLE_COUNT) * 100}%`,
              transform: `translateX(-${(tabOffset / PROJECTS.length) * 100}%)`,
            }}
          >
            {PROJECTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveProject(i)}
                className={
                  "pb-[14px] text-[13px] md:text-[20px] transition-colors relative " +
                  (activeProject === i
                    ? "text-normal-text font-bold cursor-default"
                    : "text-description font-medium hover:text-normal-text cursor-pointer")
                }
                style={{ width: `${100 / PROJECTS.length}%` }}
              >
                {p.tab}
                {activeProject === i && (
                  <span
                    key={activeProject}
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-normal-text rounded-full origin-center animate-[expandX_0.3s_ease-out_forwards]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {PROJECTS.length > VISIBLE_COUNT && (
          <button
            onClick={() => setTabOffset((prev) => prev + 1)}
            disabled={!canScrollRight}
            className={`pb-[14px] transition-opacity ${canScrollRight ? "opacity-100 cursor-pointer" : "opacity-20 cursor-default"}`}
          >
            <ChevronRight size={23} color="#000000" />
          </button>
        )}
      </div>

      {/* 이미지 영역 */}
      <div
        className="relative mt-[24px] w-full aspect-video rounded-[12px] overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={PROJECTS[activeProject].image}
          alt={PROJECTS[activeProject].name}
          fill
          className="object-cover transition-transform duration-500"
        />
        <div
          className={
            "absolute inset-0 bg-black transition-opacity duration-300 " +
            (hovered ? "opacity-60" : "opacity-0")
          }
        />
        <div
          className={
            "absolute bottom-[14px] left-[14px] md:bottom-[28px] md:left-[28px] text-white text-[15px] md:text-[22px] font-bold transition-opacity duration-300 " +
            (hovered ? "opacity-100" : "opacity-0")
          }
        >
          {PROJECTS[activeProject].name}
        </div>
      </div>
    </div>
  );
}
