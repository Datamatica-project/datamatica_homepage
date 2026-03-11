"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import SectionTitle from "./SectionTitle";
import NewsCard_main from "./NewsCard_main";
import { ChevronLeft, ChevronRight } from "./Icons";

const NEWS_DATA = [
  {
    date: "2024년 8월 30일",
    title: "[앱뉴스] 당진시, 스마트 경로당 구축 시연회 개최",
    description:
      "당진시(시장 오성환)가 총 187개소의 경로당에 스마트화상회의시스템과 IoT안전관리시스템 구축을 완료하고, 28일 노인회관 2층 대회의실에서 스마트경로당 구축 시연회를 성공적으로 마쳤다.",
    image: "/ourNews/news.avif",
    href: "#",
    year: 2024,
  },
  {
    date: "2024년 8월 06일",
    title: "[디지털투데이] 데이터메티카, AI 거닝 재현 데이터 사업 본격 추진",
    description:
      "데이터메티카는 2022년 15억원 이상 규모 한국지능정보사회진흥원(NIA) 재현 데이터 사업을 성공적으로 수행한 경험과 다양한 연구 노하우를 기반으로 재현 데이터(Synthetic Data) 사업을 본격화한다고 6일 밝혔다.",
    image: "/ourNews/news.avif",
    href: "#",
    year: 2024,
  },
  {
    date: "2024년 6월 21일",
    title:
      "[정보통신신문] 데이터메티카, 스마트 시티 사업 단과 스마트 시티 사업 본격화",
    description:
      "인공지능(AI) 학습 데이터 전문 기업 데이터메티카가 적극적으로 스마트 도시 구축에 박차를 가하기 위해 사업단을 구성했다고 21일 밝혔다.",
    image: "/ourNews/news.avif",
    href: "#",
    year: 2024,
  },
  {
    date: "2023년 11월 15일",
    title: "[전자신문] 데이터메티카, AI 데이터 구축 사업 수주",
    description:
      "데이터메티카가 한국지능정보사회진흥원(NIA)의 AI 학습용 데이터 구축 사업을 수주하며 데이터 분야 역량을 입증했다.",
    image: "/ourNews/news.avif",
    href: "#",
    year: 2023,
  },
];

const YEARS = [...new Set(NEWS_DATA.map((n) => n.year))].sort((a, b) => b - a);

export default function OurNews() {
  const [activeYear, setActiveYear] = useState<number | null>(YEARS[0]);
  const [visible, setVisible] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

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

  const filtered = activeYear
    ? NEWS_DATA.filter((n) => n.year === activeYear)
    : NEWS_DATA;

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

  const CARD_STEP = 344; // 카드 320px + gap 24px

  const slideLeft = useCallback(() => {
    sliderRef.current?.scrollBy({ left: -CARD_STEP, behavior: "smooth" });
  }, []);

  const slideRight = useCallback(() => {
    sliderRef.current?.scrollBy({ left: CARD_STEP, behavior: "smooth" });
  }, []);

  return (
    <section className="mt-[60px]  pb-[60px] ">
      <div className="flex flex-col md:flex-row md:items-start">
        {/* 좌측: 연도 필터 + 타이틀 + 버튼 */}
        <div
          className="shrink-0 flex flex-col md:flex-row md:gap-[40px] md:items-start gap-[20px] pr-[24px] md:pr-0"
          style={{ paddingLeft: "max(24px, calc((100vw - 1000px) / 2))" }}
        >
          {/* 연도 필터: 모바일에서 가로 탭 */}
          <div className="flex flex-row md:flex-col gap-[8px] md:gap-[30px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(activeYear === year ? null : year)}
                className={`shrink-0 transition-all
                  text-[13px] px-[16px] py-[6px] rounded-full border
                  md:text-[18px] md:px-[12px] md:py-[3px] md:rounded-none md:border-0 md:border-l-0 md:text-right
                  ${
                    activeYear === year
                      ? "bg-main text-white border-main md:bg-transparent md:text-main md:font-medium md:text-[22px] md:border-l-[5px] md:border-main"
                      : "bg-white text-description border-[#d8d8d8] md:bg-transparent md:border-0 hover:text-normal-text"
                  }`}
              >
                {year}년
              </button>
            ))}
          </div>

          <div className="shrink-0 md:mr-[40px]">
            <SectionTitle
              subtitle="Our news"
              title={
                <>
                  데이터메티카
                  <br />
                  <span className="text-main font-bold">소식</span>
                </>
              }
              description=""
              linkHref="/news"
            />

            {/* 슬라이드 좌우 버튼 */}
            <div className="hidden md:flex gap-[12px] mt-[20px]">
              <button
                onClick={slideLeft}
                className="w-[40px] h-[40px] rounded-full border border-[#d0d0d0] dark:border-[#3a3a3a] flex items-center justify-center hover:bg-[#f0f0f0] dark:hover:bg-[#252525] transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} className="text-normal-text" />
              </button>
              <button
                onClick={slideRight}
                className="w-[40px] h-[40px] rounded-full border border-[#d0d0d0] dark:border-[#3a3a3a] flex items-center justify-center hover:bg-[#f0f0f0] dark:hover:bg-[#252525] transition-colors cursor-pointer"
              >
                <ChevronRight size={18} className="text-normal-text" />
              </button>
            </div>
          </div>
        </div>

        {/* 우측: 카드 슬라이더 (타이틀 옆에서 화면 밖까지 확장) */}
        <div
          ref={sliderRef}
          className="flex-1 min-w-0 overflow-x-scroll select-none cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <ul
            ref={listRef}
            className="flex gap-[24px] w-max pr-[24px] py-[10px] list-none transition-[opacity,transform] duration-800 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(200px)",
            }}
          >
            {filtered.map((news, i) => (
              <li key={`${news.title}-${i}`}>
                <NewsCard_main
                  date={news.date}
                  title={news.title}
                  description={news.description}
                  image={news.image}
                  href={news.href}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
