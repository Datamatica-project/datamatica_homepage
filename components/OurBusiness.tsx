"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import SectionTitle from "./SectionTitle";
import SkillBox from "./SkillBox";
import { skillData } from "@/data";

// 문자열에 포함된 "<br />"을 실제 줄바꿈으로 바꿔서 렌더링하는 헬퍼
function renderDescriptionWithBr(description: string) {
  const parts = description.split("<br />");
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

export default function OurBusiness() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseUp = useCallback(() => {
    dragState.current.isDown = false;
    if (sliderRef.current) sliderRef.current.style.cursor = "grab";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const { isDown, startX, scrollLeft } = dragState.current;
    const el = sliderRef.current;
    if (!isDown || !el) return;
    e.preventDefault();
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX);
  }, []);
  return (
    <>
      <div className="max-w-[1000px] pt-[60px] md:pt-[90px] mx-auto px-[24px]">
        <SectionTitle
          subtitle="Our business"
          title={
            <>
              <span className="text-main font-bold">데이터</span>로 설계하는
              기술
            </>
          }
          description={
            <>
              수집부터 분석, 시각화, 자동화까지 <br />
              데이터를 가치로 전환하는 핵심 기술을 소개합니다.
            </>
          }
        />
      </div>
      {/* 드래그 슬라이더: max-w 밖으로 full-width */}
      <div
        ref={sliderRef}
        className="overflow-x-scroll select-none cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <ul
          ref={listRef}
          className="flex gap-[16px] md:gap-[30px] w-max pl-[max(24px,calc((100vw-1000px)/2))] pr-[24px] pb-[60px] md:pb-[120px] pt-[20px] md:pt-[30px] transition-[opacity,transform] duration-800 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(200px)",
          }}
        >
          {skillData.map((item, index) => (
            <SkillBox
              key={`${item.title}-${index}`}
              index={index}
              title={item.title}
              description={renderDescriptionWithBr(item.description)}
              imageSrc={item.imageSrc}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
