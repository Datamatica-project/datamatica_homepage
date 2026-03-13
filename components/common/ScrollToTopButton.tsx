"use client";

import { useState, useEffect, useCallback } from "react";

const SCROLL_THRESHOLD = 200;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className="fixed bottom-[36px] right-[24px] z-30 w-[48px] h-[48px] rounded-full flex items-center justify-center border border-[#d0d0d0] dark:border-[#434345] bg-[#F6F7F9] dark:bg-[#252527] hover:bg-[#ebebeb] dark:hover:bg-[#323234] transition-all duration-300 shadow-lg cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="text-normal-text"
      >
        <path
          fillRule="evenodd"
          d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
        />
      </svg>
    </button>
  );
}
