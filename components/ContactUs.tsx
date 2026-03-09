"use client";

import React, { useState, useEffect } from "react";
import SectionTitle from "./SectionTitle";
import { Envelope, Telephone } from "./Icons";

export default function ContactUs() {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // 3초 후 토스트 자동 닫힘
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      setToast("문의가 성공적으로 전송되었습니다.");
      e.currentTarget.reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-[1000px] mx-auto px-[24px] mt-[60px] md:mt-[120px] pb-[60px] md:pb-[120px]">
      <div className="flex flex-col gap-[40px] md:flex-row md:gap-[80px] items-start">
        {/* 좌측: 타이틀 + 연락처 */}
        <div className="shrink-0 text-center md:text-left w-full md:w-auto">
          <SectionTitle
            subtitle="Contact Us"
            title={
              <>
                <span className="text-main font-bold">협업</span> 및{" "}
                <span className="text-main font-bold">제안</span> 문의
              </>
            }
            description="프로젝트, 기술 협력, 파트너십 관련 상담을 진행합니다."
          />

          <div className="mt-[40px] flex flex-col gap-[20px] items-center md:items-start">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-[8px] text-[14px] text-description">
                <Envelope size={16} />
                이메일 (E-mail)
              </div>
              <a
                href="mailto:support@datamatica.kr"
                className="block text-[18px] font-bold text-normal-text mt-[4px] hover:underline"
              >
                support@datamatica.kr
              </a>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-[8px] text-[14px] text-description">
                <Telephone size={16} />
                전화번호 (Phone number)
              </div>
              <a
                href="tel:+820316288360"
                className="block text-[18px] font-bold text-normal-text mt-[4px] hover:underline"
              >
                (+82) 031-628-8360
              </a>
            </div>
          </div>
        </div>

        {/* 우측: 문의 폼 */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:flex-1 bg-white rounded-[10px] border px-[20px] py-[28px] md:px-[33px] md:py-[40px] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          {/* 이름 */}
          <label className="block text-[14px] font-medium text-normal-text mb-[6px]">
            이름 (Full Name)
            <span className="text-main">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="홍길동 / John Smith"
            className="text-normal-text w-full px-[16px] py-[10px] border border-[#E5E5E5] text-[14px] outline-none focus:border-main transition-colors mb-[20px] placeholder:text-[#9EA2A2]"
          />

          {/* 이메일 */}
          <label className="block text-[14px] font-medium text-normal-text mb-[6px]">
            이메일 (E-mail) <span className="text-main">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="sample123@gmail.com"
            className="text-normal-text w-full px-[16px] py-[10px] border border-[#E5E5E5] text-[14px] outline-none focus:border-main transition-colors mb-[20px] placeholder:text-[#9EA2A2]"
          />

          {/* 메시지 */}
          <label className="block text-[14px] font-medium text-normal-text mb-[6px]">
            메시지 (Message)
            <span className="text-main">*</span>
          </label>
          <textarea
            name="message"
            rows={5}
            required
            placeholder="메시지를 입력해주세요."
            className="text-normal-text w-full px-[16px] py-[10px] border border-[#E5E5E5] text-[14px] outline-none focus:border-main transition-colors resize-none mb-[24px] placeholder:text-[#9EA2A2]"
          />

          {/* 제출 버튼 */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-[36px] py-[16px] bg-main text-white text-[16px] font-medium rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "전송 중..." : "문의 보내기"}
            </button>
          </div>
        </form>
      </div>

      {/* 토스트 알림 */}
      <div
        className={`fixed bottom-[40px] left-1/2 -translate-x-1/2 z-50 px-[24px] py-[14px] bg-normal-text text-white text-[15px] rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300 ${
          toast
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[20px] pointer-events-none"
        }`}
      >
        {toast}
      </div>
    </section>
  );
}
