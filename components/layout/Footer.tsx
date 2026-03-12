import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#121212] text-white">
      <div className="max-w-[1000px] mx-auto px-[24px] pt-[64px] pb-[40px]">
        {/* 상단: 회사명 + 정보 */}
        <div className="flex flex-col md:flex-row md:justify-between gap-[40px]">
          {/* 좌측: 브랜드 + 주소 */}
          <div className="flex flex-col gap-[16px]">
            <Image
              src="/header/headerlogo.png"
              alt="Datamatica"
              width={120}
              height={29}
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="text-[14px] text-[#888888] leading-[1.8]">
              809-1, Urim W City, 9-22, Pangyo-ro 255beon-gil,
              <br />
              Bundang-gu, Seongnam-si, Gyeonggi-do,
              <br />
              Republic of Korea
            </p>
          </div>

          {/* 우측: 연락처 */}
          <div className="flex flex-col gap-[10px] text-[14px] md:text-right">
            <div className="flex md:justify-end gap-[8px]">
              <span className="text-[#555555]">Tel</span>
              <span className="text-[#cccccc]">(+82) 031-628-8360</span>
            </div>
            <div className="flex md:justify-end gap-[8px]">
              <span className="text-[#555555]">Fax</span>
              <span className="text-[#cccccc]">(+82) 031-628-8361</span>
            </div>
            <div className="flex md:justify-end gap-[8px]">
              <span className="text-[#555555]">Email</span>
              <a
                href="mailto:support@datamatica.kr"
                className="text-[#cccccc] hover:text-white transition-colors"
              >
                support@datamatica.kr
              </a>
            </div>
            <div className="flex md:justify-end gap-[8px]">
              <span className="text-[#555555]">Hours</span>
              <span className="text-[#cccccc]">Weekdays 9am – 6pm</span>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="mt-[48px] border-t border-[#323234]" />

        {/* 하단: CEO + Copyright */}
        <div className="mt-[24px] flex flex-col md:flex-row md:justify-between gap-[8px] text-[13px] text-[#555555]">
          <span>CEO &amp; Founder · 곡세홍</span>
          <span>
            Copyright © 2020 DataMatica Co., Ltd. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
