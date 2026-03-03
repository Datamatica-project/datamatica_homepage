"use client";

import { useEffect, useRef, useState } from "react";

export default function VehicleScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const prevTranslateXRef = useRef(0);

  // 바퀴 크기 (px)
  const wheelSize = 170;

  // 바퀴 위치 (차량 컨테이너 기준)
  const wheelPositions = {
    color: {
      front: { left: 47, bottom: 48 },
      rear: { left: 498, bottom: 48 },
    },
    mesh: {
      front: { left: 47, bottom: 48 },
      rear: { left: 498, bottom: 48 },
    },
  };

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight =
        sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const newProgress = Math.max(0, Math.min(1, scrolled / sectionHeight));

      setProgress(newProgress);

      // Calculate wheel rotation based on movement
      const containerWidth = window.innerWidth * 2;
      const viewportWidth = window.innerWidth;
      const translateX = -newProgress * (containerWidth - viewportWidth);
      const deltaX = prevTranslateXRef.current - translateX;

      if (deltaX !== 0) {
        // 회전 방향: 스크롤 내리면 시계 반대 방향
        setRotation((prev) => prev - deltaX / (wheelSize / 2));
      }
      prevTranslateXRef.current = translateX;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate transforms
  const containerWidth =
    typeof window !== "undefined" ? window.innerWidth * 2 : 2000;
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1000;
  const translateX = -progress * (containerWidth - viewportWidth);

  // Background sketch opacity (fade out during transition)
  const sketchOpacity = Math.max(0, 1 - progress * 2.5);

  // Header text transition
  const showSecondHeader = progress > 0.6;

  // 바퀴 회전 각도 (라디안 → 도)
  const rotationDeg = (rotation * 180) / Math.PI;

  // 배경색 보간 (시작: #f5f5f0 → 끝: #F6F7F9)
  const lerp = (start: number, end: number, t: number) =>
    Math.round(start + (end - start) * t);
  const startColor = { r: 245, g: 245, b: 240 }; // #f5f5f0
  const endColor = { r: 246, g: 247, b: 249 }; // #F6F7F9
  const bgColor = `rgb(${lerp(startColor.r, endColor.r, progress)}, ${lerp(startColor.g, endColor.g, progress)}, ${lerp(startColor.b, endColor.b, progress)})`;

  return (
    <section ref={sectionRef} className="relative" style={{ height: "300vh" }}>
      {/* Sticky container */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          background: bgColor,
          transition: "background 0.2s ease-out",
        }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ccc 1px, transparent 1px),
              linear-gradient(to bottom, #ccc 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">DM</span>
            </div>
            <span className="font-semibold text-gray-800">DataMatica</span>
          </div>
          <nav className="flex gap-12 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-gray-900">
              사업분야
            </a>
            <a href="#" className="hover:text-gray-900">
              회사연혁
            </a>
            <a href="#" className="hover:text-gray-900">
              소식 / 뉴스
            </a>
            <a href="#" className="hover:text-gray-900">
              문의하기
            </a>
          </nav>
        </header>

        {/* Title section */}
        <div className="absolute top-24 left-0 right-0 z-40 text-center">
          {/* First header - 영문: BodoniXT 96px */}
          <h1
            className="text-gray-900 transition-all duration-500"
            style={{
              fontFamily: "BodoniXT, serif",
              fontSize: "80px",
              textShadow:
                "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)",
              opacity: showSecondHeader ? 0 : 1,
              transform: showSecondHeader
                ? "translateY(-20px)"
                : "translateY(0)",
            }}
          >
            From Physical to Digital.
          </h1>
          {/* Second header - 한글: A2Z 7Bold */}
          <h1
            className="absolute inset-x-0 top-0 text-5xl md:text-6xl transition-all duration-500 leading-tight"
            style={{
              fontFamily: "A2Z, sans-serif",
              fontWeight: 700,
              textShadow:
                "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)",
              opacity: showSecondHeader ? 1 : 0,
              transform: showSecondHeader
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            <span className="relative">
              <span className="relative z-10 text-[#121212]">
                보이는 것을, 분석 가능한 것으로.
              </span>
              <span
                className="absolute left-0 right-0 bottom-1 h-4 bg-[#e55058] -z-0"
                style={{ opacity: 0.6 }}
              />
            </span>
          </h1>
          <p className="text-lg  text-[#121212] font-bold border-t-1 border-b-1 border-[#121212]">
            실세계 객체를 디지털 구조로 변환하고, 분석 가능한 형태로
            재구성합니다.
          </p>
        </div>

        {/* Horizontal line decorations */}
        <div className="absolute top-52 left-0 right-0 h-px bg-gray-300" />
        <div className="absolute top-80 left-0 right-0 h-px bg-gray-300" />

        {/* Background sketches */}
        <div
          className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none"
          style={{
            opacity: sketchOpacity,
            transition: "opacity 0.3s ease-out",
          }}
        >
          {/* Top view sketch (left) */}
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ width: "280px", height: "450px" }}
          >
            <img
              src="/car/top_view.png"
              alt="Top View Sketch"
              className="w-full h-full object-contain opacity-40"
              style={{ transform: "rotate(-90deg)" }}
            />
          </div>

          {/* Front view sketch (right) */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ width: "300px", height: "300px" }}
          >
            <img
              src="/car/front_view.png"
              alt="Front View Sketch"
              className="w-full h-full object-contain opacity-40"
            />
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          className="absolute top-0 left-0 h-full flex"
          style={{
            width: `${containerWidth}px`,
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {/* Color vehicle */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: `${viewportWidth}px`, height: "100%" }}
          >
            <div
              className="relative"
              style={{ width: "700px", height: "450px" }}
            >
              {/* Shadow - 크기: width/height, 진하기: rgba의 0.4, 0.2 숫자 조절 */}
              <div
                className="absolute"
                style={{
                  width: "700px", // 그림자 너비
                  height: "50px", // 그림자 높이
                  left: "0px", // 좌우 위치
                  bottom: "15px", // 상하 위치
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
                  borderRadius: "50%",
                  filter: "blur(10px)", // 블러 정도
                  zIndex: 0,
                }}
              />
              {/* Body */}
              <img
                src="/car/color_body.png"
                alt="Color Vehicle Body"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ zIndex: 1 }}
              />
              {/* Front wheel */}
              <img
                src="/car/color_wheel.png"
                alt="Front Wheel"
                className="absolute"
                style={{
                  width: `${wheelSize}px`,
                  height: `${wheelSize}px`,
                  left: `${wheelPositions.color.front.left}px`,
                  bottom: `${wheelPositions.color.front.bottom}px`,
                  transform: `rotate(${rotationDeg}deg)`,
                  transition: "transform 0.15s ease-out",
                  zIndex: 2,
                }}
              />
              {/* Rear wheel */}
              <img
                src="/car/color_wheel.png"
                alt="Rear Wheel"
                className="absolute"
                style={{
                  width: `${wheelSize}px`,
                  height: `${wheelSize}px`,
                  left: `${wheelPositions.color.rear.left}px`,
                  bottom: `${wheelPositions.color.rear.bottom}px`,
                  transform: `rotate(${rotationDeg}deg)`,
                  transition: "transform 0.15s ease-out",
                  zIndex: 2,
                }}
              />
            </div>
          </div>

          {/* Mesh vehicle */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: `${viewportWidth}px`, height: "100%" }}
          >
            <div
              className="relative"
              style={{ width: "700px", height: "450px" }}
            >
              {/* Shadow */}
              {/* Shadow - 크기: width/height, 진하기: rgba의 0.35, 0.15 숫자 조절 */}
              <div
                className="absolute"
                style={{
                  width: "700px", // 그림자 너비
                  height: "50px", // 그림자 높이
                  left: "25px", // 좌우 위치
                  bottom: "15px", // 상하 위치
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)",
                  borderRadius: "50%",
                  filter: "blur(10px)", // 블러 정도
                  zIndex: 0,
                }}
              />
              {/* Body */}
              <img
                src="/car/Mesh_Body.png"
                alt="Mesh Vehicle Body"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ zIndex: 1 }}
              />
              {/* Front wheel */}
              <img
                src="/car/mesh_wheel.png"
                alt="Front Wheel"
                className="absolute"
                style={{
                  width: `${wheelSize}px`,
                  height: `${wheelSize}px`,
                  left: `${wheelPositions.mesh.front.left}px`,
                  bottom: `${wheelPositions.mesh.front.bottom}px`,
                  transform: `rotate(${rotationDeg}deg)`,
                  transition: "transform 0.15s ease-out",
                  zIndex: 2,
                }}
              />
              {/* Rear wheel */}
              <img
                src="/car/mesh_wheel.png"
                alt="Rear Wheel"
                className="absolute"
                style={{
                  width: `${wheelSize}px`,
                  height: `${wheelSize}px`,
                  left: `${wheelPositions.mesh.rear.left}px`,
                  bottom: `${wheelPositions.mesh.rear.bottom}px`,
                  transform: `rotate(${rotationDeg}deg)`,
                  transition: "transform 0.15s ease-out",
                  zIndex: 2,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
