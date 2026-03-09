"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowRightCircle } from "./Icons";

export default function SectionTitle({
  subtitle,
  title,
  description,
  center = false,
  linkHref,
  linkText = "더보기",
}: {
  subtitle: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  center?: boolean;
  linkHref?: string;
  linkText?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const alignClass = center ? "text-center" : "";

  const lineClass = `overflow-hidden ${alignClass}`;

  const innerClass = `block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
  }`;

  return (
    <div ref={ref}>
      <div className={lineClass}>
        <span
          className={`text-[14px] md:text-[20px] text-description font-normal ${center ? "block" : ""} ${innerClass}`}
          style={{ transitionDelay: "0ms" }}
        >
          {subtitle}
        </span>
      </div>

      <div className={lineClass}>
        <h2
          className={`text-[26px] md:text-[40px] font-medium text-normal-text ${innerClass}`}
          style={{ transitionDelay: "120ms" }}
        >
          {title}
        </h2>
      </div>

      <div className={lineClass}>
        <p
          className={`text-[14px] md:text-[18px] text-description ${innerClass}`}
          style={{ transitionDelay: "240ms" }}
        >
          {description}
        </p>
      </div>

      {linkHref && (
        <div className={lineClass}>
          <a
            href={linkHref}
            className={`inline-flex items-center gap-[6px] text-[15px] text-description mt-[10px] hover:text-normal-text transition-colors ${innerClass}`}
            style={{ transitionDelay: "360ms" }}
          >
            <ArrowRightCircle size={18} />
            {linkText}
          </a>
        </div>
      )}
    </div>
  );
}
