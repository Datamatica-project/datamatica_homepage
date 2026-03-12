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
    <div className="relative w-full bg-[#F6F7F9] dark:bg-[#1c1c1e]">
      {/* 컨텐츠: UI 등장 애니메이션 (CSS transition) */}
      <div
        className="relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${entered ? 0 : 100}vh)` }}
      >
        <div id="section-business"><OurBusiness /></div>
        <div id="section-projects"><OurProjects /></div>
        <div id="section-clients"><OurClients /></div>
        <div id="section-news"><OurNews /></div>
        <div id="section-contact"><ContactUs /></div>
      </div>
    </div>
  );
}
