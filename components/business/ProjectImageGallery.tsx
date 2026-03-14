"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Close } from "@/components/Icons";

const FALLBACK_IMAGE = "/header/datamatica_logo.png";

function Lightbox({
  images,
  title,
  initialIndex,
  onClose,
}: {
  images: string[];
  title: string;
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute top-[20px] right-[20px] w-[44px] h-[44px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
      >
        <Close size={20} className="text-white" />
      </button>

      {/* 이미지 */}
      <div
        className="relative w-full max-w-[90vw] max-h-[85vh] aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index] || FALLBACK_IMAGE}
          alt={`${title} 이미지 ${index + 1}`}
          fill
          className="object-contain"
          sizes="90vw"
        />
      </div>

      {/* 좌우 버튼 */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="이전 이미지"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-[16px] md:left-[32px] w-[44px] h-[44px] rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-[16px] md:right-[32px] w-[44px] h-[44px] rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {images.length > 1 && (
        <div
          className="absolute bottom-[24px] flex gap-[8px]"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-[8px] h-[8px] rounded-full transition-all cursor-pointer ${
                i === index ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

export default function ProjectImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 2;
    setCanScrollLeft(el.scrollLeft > threshold);
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - threshold
    );
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState]);

  const slide = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-[16px]">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="shrink-0 w-full md:w-[calc(50%-8px)] snap-start relative aspect-16/10 rounded-[14px] overflow-hidden bg-[#f0f0f0] dark:bg-[#282829] cursor-zoom-in"
              >
                <Image
                  src={img || FALLBACK_IMAGE}
                  alt={`${title} 이미지 ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 480px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 데스크탑 전용 좌우 버튼 */}
        {images.length > 2 && (
          <>
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="이전 이미지"
              disabled={!canScrollLeft}
              className="hidden md:flex absolute left-[-20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white dark:bg-[#2e2e30] border border-[#e0e0e0] dark:border-[#3c3c3e] shadow-md items-center justify-center transition-opacity duration-200 cursor-pointer disabled:opacity-20"
            >
              <ChevronLeft size={18} className="text-normal-text" />
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="다음 이미지"
              disabled={!canScrollRight}
              className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white dark:bg-[#2e2e30] border border-[#e0e0e0] dark:border-[#3c3c3e] shadow-md items-center justify-center transition-opacity duration-200 cursor-pointer disabled:opacity-20"
            >
              <ChevronRight size={18} className="text-normal-text" />
            </button>
          </>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          title={title}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
