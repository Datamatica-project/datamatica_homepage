"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import LogoMarquee from "./LogoMarquee";

const STATS = [
  { target: 1, suffix: "M+", label: "데이터 가공" },
  { target: 40, suffix: "+", label: "프로젝트 수행" },
  { target: 15, suffix: "+", label: "전략적 파트너십" },
];

const COUNT_DURATION = 1500;

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / COUNT_DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target]);

  return value;
}

function CountUpStat({
  target,
  suffix,
  label,
  started,
}: {
  target: number;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const count = useCountUp(target, started);

  return (
    <div className="text-center md:text-left">
      <p className="text-[26px] md:text-[36px] font-bold text-normal-text leading-tight">
        {count}
        {suffix}
      </p>
      <p className="text-[14px] text-description mt-[4px]">{label}</p>
    </div>
  );
}

export default function OurClients() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStatsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-[60px] md:mt-[120px] pb-[60px] md:pb-[120px]">
      <div className="max-w-[1000px] mx-auto px-[24px]">
        <div className="flex flex-col-reverse gap-[32px] md:flex-row md:gap-[60px] items-center">
          {/* 좌측: 이미지 */}
          <div className="relative w-full md:w-[480px] md:shrink-0 aspect-4/3 rounded-[12px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <Image
              src="/ourClient/ourClient.jpg"
              alt="Our Clients"
              fill
              className="object-cover"
            />
          </div>

          {/* 우측: 타이틀 + 통계 */}
          <div className="flex-1 text-center md:text-left">
            <SectionTitle
              subtitle="Our clients"
              title={
                <>
                  산업을 선도하는
                  <br />
                  <span className="text-main font-bold">파트너십</span>
                </>
              }
              description={
                <>
                  공공과 민간을 아우르는 협력을 통해
                  <br />
                  기술력을 입증해왔습니다.
                </>
              }
            />

            {/* 통계 수치: 뷰포트 진입 시 카운트업 */}
            <div
              ref={statsRef}
              className="flex justify-center md:justify-start gap-[24px] md:gap-[40px] mt-[28px] md:mt-[40px]"
            >
              {STATS.map((stat) => (
                <CountUpStat
                  key={stat.label}
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                  started={statsVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 로고 마키: full-width */}
      <LogoMarquee />
    </div>
  );
}
