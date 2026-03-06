import React, { useRef, useCallback, useState } from "react";
import SectionTitle from "./SectionTitle";
import SkillBox from "./SkillBox";
import Image from "next/image";
import OurBusiness from "./OurBusiness";

const PROJECTS = [
  {
    tab: "고정밀 지도",
    name: "Lidar 기반 3D 경로 생성 플랫폼",
    image: "/business/AM.png",
  },
  {
    tab: "인공지능 데이터 구축",
    name: "AI 학습용 고품질 데이터 구축 솔루션",
    image: "/business/Labeling.png",
  },
  {
    tab: "AI 챗봇 서비스",
    name: "산업 맞춤형 AI 대화 자동화 플랫폼",
    image: "/business/Safty.png",
  },
];

export default function MainPage({
  contentLifted,
}: {
  contentLifted: boolean | undefined;
}) {
  
  const [activeProject, setActiveProject] = useState(0);
  const [hovered, setHovered] = useState(false);



  return (
    <div className="relative w-full">
      {/* 패럴랙스 워터마크: 컨텐츠보다 느리게 올라옴 */}
      <div
        className={
          "absolute inset-0 z-0 pointer-events-none select-none " +
          "transition-transform duration-1200 delay-250 ease-[cubic-bezier(0.16,1,0.3,1)] " +
          (contentLifted ? "translate-y-0" : "translate-y-[115vh]")
        }
      >
        <div className="absolute top-1/2 left-0 translate-x-1/2 -translate-y-[100%] [writing-mode:vertical-rl] rotate-180 text-[#f9eaeb] text-[128px] font-black leading-none">
          Datamatica
        </div>
      </div>

      {/* 컨텐츠: 700ms로 먼저 올라옴 */}
      <div
        className={
          "relative z-10 transition-[margin-top] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] " +
          (contentLifted ? "mt-0" : "mt-[100vh]")
        }
      >
        <OurBusiness />

        {/* Our Projects 섹션 */}
        <div className="max-w-[1000px] mt-[120px] mx-auto pb-[120px]">
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
          <div className="flex mt-[50px] border-b border-[#e0e0e0] ">
            {PROJECTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveProject(i)}
                className={
                  "w-1/3 pb-[14px] text-[20px] transition-colors relative " +
                  (activeProject === i
                    ? "text-normal-text font-bold cursor-default"
                    : "text-description font-medium hover:text-normal-text cursor-pointer")
                }
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

          {/* 이미지 영역 */}
          <div
            className="relative mt-[24px] w-full aspect-[16/9] rounded-[12px] overflow-hidden cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Image
              src={PROJECTS[activeProject].image}
              alt={PROJECTS[activeProject].name}
              fill
              className="object-cover transition-transform duration-500"
            />
            {/* 호버 오버레이 */}
            <div
              className={
                "absolute inset-0 bg-black transition-opacity duration-300 " +
                (hovered ? "opacity-60" : "opacity-0")
              }
            />
            {/* 프로젝트 이름 */}
            <div
              className={
                "absolute bottom-[28px] left-[28px] text-white text-[22px] font-bold transition-opacity duration-300 " +
                (hovered ? "opacity-100" : "opacity-0")
              }
            >
              {PROJECTS[activeProject].name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
