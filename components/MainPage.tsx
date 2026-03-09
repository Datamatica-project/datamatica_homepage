import React from "react";
import OurBusiness from "./OurBusiness";
import OurProjects from "./OurProjects";
import OurClients from "./OurClients";
import OurNews from "./OurNews";
import ContactUs from "./ContactUs";

export default function MainPage({
  overlayOpacity,
}: {
  overlayOpacity: number;
}) {
  const entered = overlayOpacity >= 1;

  return (
    <div className="relative w-full bg-[#F6F7F9] dark:bg-[#111113]">
      {/* 패럴랙스 워터마크: UI 등장 애니메이션 (CSS transition) */}
      <div
        className="relative inset-0 z-0 pointer-events-none select-none transition-transform duration-1200 delay-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${entered ? 0 : 115}vh)` }}
      >
        <div className="absolute top-0 left-0 translate-x-full translate-y-[30%] [writing-mode:vertical-rl] rotate-180 text-[#f9eaeb] dark:text-[#2a1214] text-[64px] md:text-[128px] font-black leading-none">
          Datamatica
        </div>
      </div>

      {/* 컨텐츠: UI 등장 애니메이션 (CSS transition) */}
      <div
        className="relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${entered ? 0 : 100}vh)` }}
      >
        <OurBusiness />
        <OurProjects />
        <OurClients />
        <OurNews />
        <ContactUs />
      </div>
    </div>
  );
}
