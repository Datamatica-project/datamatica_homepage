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
      {/* 컨텐츠: UI 등장 애니메이션 (CSS transition) */}
      <div
        className="relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${entered ? 0 : 100}vh)` }}
      >
        <OurBusiness />
        <OurProjects />

        {/* 워터마크 */}
        {/* <div className="overflow-hidden pointer-events-none select-none py-[20px] md:py-[40px]">
          <p className="whitespace-nowrap text-[#f0e4e5] dark:text-[#2a1214] text-[80px] md:text-[160px] font-black leading-none tracking-tight">
            Datamatica
          </p>
        </div> */}

        <OurClients />
        <OurNews />
        <ContactUs />
      </div>
    </div>
  );
}
