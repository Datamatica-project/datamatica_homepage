import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#121212] text-white">
      <div className="max-w-[1200px] mx-auto px-[24px] pt-[64px] pb-[40px]">
        {/* 상단: 회사명 + 정보 */}
        <div className="flex flex-col md:flex-row md:justify-between gap-[40px] md:gap-[24px]">
          {/* 좌측: 브랜드 블록 (DataMatica + JBX) */}
          <div className="flex flex-col md:flex-row gap-[32px] md:gap-[24px]">
            {/* DataMatica */}
            <div className="flex flex-col gap-[16px]">
              <Image
                src="/header/headerlogo.png"
                alt="Datamatica"
                width={152}
                height={37}
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <p className="text-[13px] text-[#888888] leading-[1.8]">
                본사 / 연구소 : 경기 성남시 분당구 판교로255번길 9-22 우림
                W-City 809-1호
                <br />
                전북 사업장 : 전북특별자치도 전주시 덕진구 반룡로 111, 509호
                (한국전자기술연구원 전북지역본부)
              </p>
            </div>

            {/* 구분선 (가로 배치일 때만 표시) */}
            <div className="hidden md:block w-px bg-[#323234]" />

            {/* JBX */}
            <div className="flex flex-col items-start gap-[16px]">
              <Image
                src="/header/jbx_white.png"
                alt="JBX"
                width={826}
                height={443}
                className="object-contain h-[36px] w-auto"
              />
              <p className="text-[13px] text-[#888888] leading-[1.8] ">
                전북 자회사 : 전북특별자치도 전주시 완산구 전주객사5길 47
              </p>
            </div>
          </div>

          {/* 우측: 연락처 */}
          <div className="flex flex-col gap-[10px] text-[14px] md:text-right md:self-center">
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
