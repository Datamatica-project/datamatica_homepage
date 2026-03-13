"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import SectionTitle from "../common/SectionTitle";
import SkillBox from "../common/SkillBox";
import { skillData } from "@/data";
import { ChevronLeft, ChevronRight } from "../Icons";

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
  const dragOccurredRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const threshold = 2;
    setCanScrollLeft(el.scrollLeft > threshold);
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - threshold
    );
  }, []);

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

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollState();
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState, visible]);

  const DRAG_THRESHOLD = 5;

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    dragOccurredRef.current = false;
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
    const deltaX = Math.abs(e.pageX - el.offsetLeft - startX);
    if (deltaX > DRAG_THRESHOLD) dragOccurredRef.current = true;
    e.preventDefault();
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX);
  }, []);
  const CARD_STEP = 300;

  const slideLeft = useCallback(() => {
    sliderRef.current?.scrollBy({ left: -CARD_STEP, behavior: "smooth" });
  }, []);

  const slideRight = useCallback(() => {
    sliderRef.current?.scrollBy({ left: CARD_STEP, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="max-w-[1000px] pt-[60px] md:pt-[90px] mx-auto px-[24px]">
        <div className="flex items-end justify-between">
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
          <div className="hidden md:flex gap-[12px] mb-[4px] shrink-0">
            <button
              onClick={slideLeft}
              className="w-[40px] h-[40px] rounded-full border border-[#d0d0d0] dark:border-[#434345] flex items-center justify-center hover:bg-[#f0f0f0] dark:hover:bg-[#2e2e30] transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} className="text-normal-text" />
            </button>
            <button
              onClick={slideRight}
              className="w-[40px] h-[40px] rounded-full border border-[#d0d0d0] dark:border-[#434345] flex items-center justify-center hover:bg-[#f0f0f0] dark:hover:bg-[#2e2e30] transition-colors cursor-pointer"
            >
              <ChevronRight size={18} className="text-normal-text" />
            </button>
          </div>
        </div>
      </div>
      {/* 드래그 슬라이더 + 좌우 오버레이 버튼 */}
      <div className="relative group/slider">
        {/* 화면 양끝 좌우 이동 버튼: 끝에 있을 때 해당 방향 버튼 숨김 */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              slideLeft();
            }}
            aria-label="이전 슬라이드"
            className="absolute left-0 top-[20px] md:top-[30px] z-10 w-[48px] md:w-[56px] h-[300px] md:h-[485px] rounded-r-lg bg-black/20 dark:bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-30 hover:opacity-90 transition-opacity duration-200 cursor-pointer border-0 shadow-lg"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              slideRight();
            }}
            aria-label="다음 슬라이드"
            className="absolute right-0 top-[20px] md:top-[30px] z-10 w-[48px] md:w-[56px] h-[300px] md:h-[485px] rounded-l-lg bg-black/20 dark:bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-30 hover:opacity-90 transition-opacity duration-200 cursor-pointer border-0 shadow-lg"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        )}

        <div
          ref={sliderRef}
          className="overflow-x-scroll select-none cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={updateScrollState}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClickCapture={(e) => {
            if (dragOccurredRef.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
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
              href={`/business?tab=${item.id}`}
            />
          ))}
        </ul>
        </div>
      </div>
    </>
  );
}
