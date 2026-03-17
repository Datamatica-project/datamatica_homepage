"use client";

import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import SunriseGlow from "./SunriseGlow";
import { DataBeacon } from "./DataBeacon";
import { GlobeParticlesScene } from "./GlobeParticles";

const SEG_LEN = 600;
const WIDTH = 220;
const GRID = 70;
const N_TILES = 2;
const SCROLL_SPEED = 0.2;
const CAM_Y = 6;
const CAM_Z_BASE = 15;
const LOOK_AT = new THREE.Vector3(0, 2, -150);
const FOG_NEAR = 120;
const FOG_FAR = 800;
const FOG_COLOR = 0x021012; // 다크 틸
const TITLE_Z = -10; // 타이틀 월드 Z 좌표

// --------------------
// Types & Data
// --------------------
type HeightFn = (x: number, z: number) => number;

const TECH_NODES = [
  {
    name: "AI 모델 개발",
    code: "SYS.01 / AI Model Development",
    x: -9,
    z: -30,
    yOffset: -5,
  },
  {
    name: "소프트웨어 개발",
    code: "SYS.02 / Software Development",
    x: 10,
    z: -38,
    yOffset: -5,
  },
  {
    name: "데이터 라벨링",
    code: "SYS.03 / Data Annotation",
    x: -10,
    z: -55,
    yOffset: -4,
  },
  {
    name: "고정밀 지도",
    code: "SYS.04 / HD MAP",
    x: 10,
    z: -72,
    yOffset: -5,
  },
  {
    name: "차량용 SW 검증 시스템",
    code: "SYS.05 / Autonomous Driving Control",
    x: -10,
    z: -90,
    yOffset: -5,
  },
  {
    name: "디지털 트윈",
    code: "SYS.06 / Digital Twin",
    x: 10,
    z: -108,
    yOffset: -5,
  },
] as const;

// --------------------
// Math helpers
// --------------------
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// --------------------
// Texture for Points
// --------------------
function createGlowTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.7)");
  gradient.addColorStop(0.7, "rgba(255,255,255,0.2)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createCircleTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 0.5, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// --------------------
// Tile type
// --------------------
type Tile = {
  planeGeo: THREE.PlaneGeometry;
  posAttr: THREE.BufferAttribute;
  lineGeo: THREE.BufferGeometry;
  ptGeo: THREE.BufferGeometry;
  rows: number;
  cols: number;
  worldZ: number;
};

function createTile(initialWorldZ: number): Tile {
  const planeGeo = new THREE.PlaneGeometry(WIDTH, SEG_LEN, GRID, GRID);
  planeGeo.rotateX(-Math.PI / 2);
  const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
  const rows = GRID + 1;
  const cols = GRID + 1;

  // lineGeo: posAttr 공유 + 정적 인덱스 버퍼 (매 업데이트마다 복사 불필요)
  const lineIndices: number[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols - 1; c++) {
      lineIndices.push(r * cols + c, r * cols + c + 1);
    }
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows - 1; r++) {
      lineIndices.push(r * cols + c, (r + 1) * cols + c);
    }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", posAttr); // 공유
  lineGeo.setIndex(new THREE.BufferAttribute(new Uint32Array(lineIndices), 1));

  // ptGeo: posAttr 공유
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute("position", posAttr); // 공유

  return {
    planeGeo,
    posAttr,
    lineGeo,
    ptGeo,
    rows,
    cols,
    worldZ: initialWorldZ,
  };
}

// --------------------
// HeightMap 타입 / 샘플러
// --------------------
type HMapData = { pixels: Uint8ClampedArray; width: number; height: number };

const HMAP_DEPTH = 800; // Z world units per image tile
const HMAP_SCALE = 14; // heightmap amplitude (world units)
const MAP_HEIGHT = 35;
const CURVE = 1.8;
const MAP_WORLD_LEN = 800; // heightmap 1장이 커버하는 Z 월드 길이

/** 바이리니어 보간으로 [0,1] UV → 밝기 [0,1] 반환 */
function sampleHMap(hmap: HMapData, u: number, v: number): number {
  const { pixels: px, width: w, height: h } = hmap;
  const fx = Math.max(0, Math.min(1, u)) * (w - 1);
  const fy = Math.max(0, Math.min(1, v)) * (h - 1);
  const x0 = Math.floor(fx),
    x1 = Math.min(x0 + 1, w - 1);
  const y0 = Math.floor(fy),
    y1 = Math.min(y0 + 1, h - 1);
  const tx = fx - x0,
    ty = fy - y0;
  const r00 = px[(y0 * w + x0) * 4] / 255;
  const r10 = px[(y0 * w + x1) * 4] / 255;
  const r01 = px[(y1 * w + x0) * 4] / 255;
  const r11 = px[(y1 * w + x1) * 4] / 255;
  return (
    r00 * (1 - tx) * (1 - ty) +
    r10 * tx * (1 - ty) +
    r01 * (1 - tx) * ty +
    r11 * tx * ty
  );
}

// --------------------
// Height field (simplex-noise 기반)
// --------------------
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeHeightFn(hmap?: HMapData) {
  const rng = mulberry32(19);
  const noise2D = createNoise2D(rng);
  const n = (x: number, z: number, f: number) => noise2D(x * f, z * f);
  const fbm = (x: number, z: number, f: number, oct = 4) => {
    let amp = 1,
      freq = f,
      sum = 0,
      norm = 0;
    for (let i = 0; i < oct; i++) {
      sum += n(x, z, freq) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return sum / norm;
  };
  const ridged = (x: number, z: number, f: number, oct = 5) => {
    return 1.0 - Math.abs(fbm(x, z, f, oct));
  };
  return (x: number, zWorld: number): number => {
    const warpX = fbm(x + 200, zWorld - 900, 0.01, 2) * 10.0;
    const warpZ = fbm(x - 700, zWorld + 300, 0.01, 2) * 10.0;
    const wx = x + warpX;
    const wz = zWorld + warpZ;
    const base = fbm(wx, wz, 0.0035, 3) * 2.0;
    const region = fbm(wx + 1200, wz - 2200, 0.0022, 2);
    const mask = smoothstep(0.12, 0.55, region);
    const ridge = Math.pow(ridged(wx, wz, 0.018, 5), 2.2);
    const flatBase = THREE.MathUtils.clamp(base, -2.2, 2.2);

    if (!hmap) {
      // heightmap 미로드 시 기존 noise 그대로 (fallback)
      return flatBase + mask * ridge * 18.0;
    }

    // heightmap + contrast curve → 대형 지형 형상
    const u = x / WIDTH + 0.5;
    // V_OFFSET: 카메라 근처(z=0)를 평탄하게, z≈-120 부근에 산맥 배치
    const V_OFFSET = 0.15;
    const v = (((-zWorld / MAP_WORLD_LEN) % 1) + 1 - V_OFFSET) % 1;
    let map = sampleHMap(hmap, u, v); // 0~1
    map = Math.pow(map, CURVE);
    const baseHeight = map * MAP_HEIGHT;
    return baseHeight;
  };
}

// --------------------
// Tile geometry bake (CPU)
// --------------------
function updateTile(tile: Tile, newWorldZ: number, heightAt: HeightFn) {
  tile.worldZ = newWorldZ;
  const posAttr = tile.posAttr;
  const arr = posAttr.array as Float32Array;

  // 직접 배열 접근으로 getter/setter 오버헤드 제거
  for (let i = 0; i < posAttr.count; i++) {
    const base = i * 3;
    arr[base + 1] = heightAt(arr[base], arr[base + 2] + newWorldZ);
  }
  // posAttr 공유이므로 needsUpdate 한 번으로 lineGeo·ptGeo 모두 반영
  posAttr.needsUpdate = true;
  tile.lineGeo.computeBoundingSphere();
  tile.ptGeo.computeBoundingSphere();
}

// --------------------
// TitleOverlay (스크롤 기반 fade)
// --------------------
function TitleOverlay({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      ref.current.style.opacity = window.scrollY > 60 ? "0" : "1";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="title-overlay-wrap"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 5,
        pointerEvents: "none",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(10px, 1.8vw, 18px)",
        textAlign: "center",
        maxWidth: "90vw",
        backgroundColor: isDark ? "rgba(0,0,0,0.84)" : "rgba(255,255,255,0.6)",
        padding: "clamp(16px, 2.5vw, 28px) clamp(28px, 4vw, 48px)",
        borderRadius: "8px",
        transition: "opacity 0.35s ease, background-color 0.7s ease",
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .title-billboard-h1 { font-size: clamp(36px, 11vw, 80px) !important; }
          .title-overlay-wrap { gap: 14px !important; padding: 20px 28px !important; }
        }
      `}</style>
      <p
        style={{
          color: isDark ? "rgba(255,255,255,0.8)" : "#64748B",
          fontSize: "clamp(10px, 1.8vw, 16px)",
          letterSpacing: "clamp(0.15em, 0.8vw, 0.45em)",
          textTransform: "uppercase",
          fontFamily: "noto sans kr",
          margin: 0,
          whiteSpace: "nowrap",
          fontWeight: "normal",
          textShadow: "0 1px 10px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.8)",
          transition: "color 0.7s ease",
        }}
      >
        인공지능 통합 솔루션 구축 기업
      </p>
      <h1
        className="title-billboard-h1"
        style={{
          color: isDark ? "white" : "#D94A52",
          fontSize: "clamp(36px, 10vw, 108px)",
          fontWeight: "500",
          letterSpacing: "clamp(0.05em, 0.5vw, 0.15em)",
          lineHeight: 1,
          textShadow:
            "0 0 32px rgba(255,80,130,1), 0 0 8px rgba(255,80,130,0.6), 0 2px 12px rgba(0,0,0,1)",
          margin: 0,
          whiteSpace: "nowrap",
          transition: "color 0.7s ease",
          fontFamily: "var(--font-a2z), sans-serif",
        }}
      >
        DataMatica
      </h1>
      <p
        style={{
          color: isDark ? "rgba(255,255,255,0.8)" : "#64748B",
          fontSize: "clamp(10px, 1.8vw, 16px)",
          letterSpacing: "clamp(0.15em, 0.8vw, 0.45em)",
          textTransform: "uppercase",
          fontFamily: "noto sans kr",
          margin: 0,
          whiteSpace: "nowrap",
          fontWeight: "normal",
          textShadow: "0 1px 10px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.8)",
          transition: "color 0.7s ease",
        }}
      >
        (주)데이터메티카
      </p>
    </div>
  );
}

// --------------------
// DeckOverlay (선수 갑판 — 다크 모드 전용)
// --------------------
function DeckOverlay({
  isDark,
  scrollEndVh,
}: {
  isDark: boolean;
  scrollEndVh: number;
}) {
  const wheelRef = useRef<HTMLImageElement>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLImageElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const lowRef = useRef<HTMLImageElement>(null);
  const midRef = useRef<HTMLImageElement>(null);
  const highRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 스크롤 → 선박·타륜 이동
  useEffect(() => {
    const SCROLL_END = 180;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
    let rafId: number | null = null;
    let lastScrollY = 0;

    if (shipRef.current)
      shipRef.current.style.transform = "translateX(-50%) translateY(110%)";
    if (wheelContainerRef.current)
      wheelContainerRef.current.style.transform =
        "translateX(-50%) translateY(140%)";

    const update = () => {
      const scrollY = lastScrollY;
      const progress = easeOut(Math.min(scrollY / SCROLL_END, 1));
      const isMobile = window.innerWidth < 640;

      if (shipRef.current) {
        const finalTy = isMobile ? 10 : 35;
        const ty = finalTy + (1 - progress) * 75;
        shipRef.current.style.transform = `translateX(-50%) translateY(${ty}%)`;
      }
      if (wheelContainerRef.current) {
        const finalTy = isMobile ? 25 : 50;
        const ty = finalTy + (1 - progress) * 90;
        wheelContainerRef.current.style.transform = `translateX(-50%) translateY(${ty}%)`;
      }
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${scrollY * 0.4}deg)`;
      }
      rafId = null;
    };

    const onScroll = () => {
      lastScrollY = window.scrollY;
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // 파도: 전체 3D 스크롤 범위를 3구간으로 나눠 1→2→3 순서로 전환
  useEffect(() => {
    const imgs = [lowRef.current, midRef.current, highRef.current];
    if (!imgs[0] || !imgs[1] || !imgs[2]) return;

    imgs.forEach((img) => {
      img!.style.transition = "none";
      img!.style.opacity = "0";
    });

    let rafId: number | null = null;

    // smoothstep
    const ss = (e0: number, e1: number, x: number) => {
      const v = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return v * v * (3 - 2 * v);
    };

    const update = () => {
      const total = scrollEndVh * window.innerHeight;
      const t = Math.min(window.scrollY / total, 1);
      const B = 0.07; // 경계 전환 구간 폭
      const t1 = 1 / 3;
      const t2 = 0.56; // 3단계 더 빨리

      // 등장 진행값 (0→1): 각 파도의 페이드인 구간
      const enter1 = ss(0.08, 0.16, t);
      const enter2 = ss(t1 - B, t1 + B, t);
      const enter3 = ss(t2 - B, t2 + B, t);

      // scale: 0.82에서 1.0으로 커지며 등장
      const sc1 = 0.82 + 0.18 * enter1;
      const sc2 = 0.82 + 0.18 * enter2;
      const sc3 = 0.82 + 0.18 * enter3;

      // 1단계: 더 늦게 등장 후 t1 경계에서 페이드아웃
      imgs[0]!.style.opacity = String(
        enter1 * (1 - ss(t1 - B, t1 + B, t)) * 0.48
      );
      imgs[0]!.style.transform = `translateX(-50%) scale(${sc1})`;
      // 2단계: t1에서 페이드인, t2에서 페이드아웃
      imgs[1]!.style.opacity = String(
        enter2 * (1 - ss(t2 - B, t2 + B, t)) * 0.48
      );
      imgs[1]!.style.transform = `translateX(-50%) scale(${sc2})`;
      // 3단계: t2에서 페이드인
      imgs[2]!.style.opacity = String(enter3 * 0.48);
      imgs[2]!.style.transform = `translateX(-50%) scale(${sc3})`;


      rafId = null;
    };

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [scrollEndVh]);

  // 선수 양측 파티클 — 스크롤 시 물 튀김 효과
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 선박 좌표 캐시 — resize 시에만 갱신, scroll마다 getBoundingClientRect 호출 방지
    let cachedCoords = { cx: 0, ty: 0, lx: 0, rx: 0, by: 0 };
    const updateShipCoords = () => {
      const shipEl = shipRef.current;
      const shipRect = shipEl ? shipEl.getBoundingClientRect() : null;
      const canvasRect = canvas.getBoundingClientRect();
      const cx = shipRect ? shipRect.left + shipRect.width * 0.5 - canvasRect.left : canvas.width * 0.5;
      const ty = shipRect ? shipRect.top - canvasRect.top : canvas.height * 0.7;
      cachedCoords = {
        cx,
        ty,
        lx: shipRect ? shipRect.left  - canvasRect.left  : cx - 400,
        rx: shipRect ? shipRect.right - canvasRect.left  : cx + 400,
        by: shipRect ? shipRect.bottom - canvasRect.top  : ty + 300,
      };
    };

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      updateShipCoords();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
      gravity: number;
    };
    type FlowParticle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
    };
    const particles: Particle[] = [];
    const bowParticles: Particle[] = [];
    const flowParticles: FlowParticle[] = [];
    let frameId: number;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;


    // 방향 벡터 기반 튀는 물보라 (파란색) — 빠른/느린 계층 분리
    const spawn = (side: -1 | 1, e = 1.0) => {
      const { cx, ty, lx, rx, by } = cachedCoords;
      const t = Math.random();
      const ex = side === -1 ? lx : rx;
      const sx = cx + (ex - cx) * t + (Math.random() - 0.5) * 20;
      const sy = ty + (by - ty) * t + (Math.random() - 0.5) * 10;

      const dirX = side * (0.6 + Math.random() * 0.4);
      const isFast = Math.random() < 0.3;
      const speed = (isFast ? 12 + Math.random() * 10 : 3 + Math.random() * 5) * e;
      particles.push({
        x: sx, y: sy,
        vx: dirX * speed,
        vy: (speed * 0.15 + Math.random() * 0.1) * e,
        life: 1.0,
        decay: 0.006 + Math.random() * 0.006,
        size: 0.8 + Math.random() * 2.0,
        gravity: 0.02 + Math.random() * 0.02,
      });
    };

    // 거품 (흰색) — 선체에 붙어 흐르는 느낌
    const spawnBow = (e = 1.0) => {
      const { cx, ty, lx, rx, by } = cachedCoords;
      const side = Math.random() < 0.5 ? -1 : 1;
      const t = Math.random();
      const ex = side === -1 ? lx : rx;
      const sx = cx + (ex - cx) * t + (Math.random() - 0.5) * 20;
      const sy = ty + (by - ty) * t + (Math.random() - 0.5) * 10;

      const dirX = side * (0.6 + Math.random() * 0.4);
      const isFast = Math.random() < 0.3;
      const speed = (isFast ? 12 + Math.random() * 10 : 3 + Math.random() * 5) * e;
      bowParticles.push({
        x: sx, y: sy,
        vx: dirX * speed,
        vy: (speed * 0.15 + Math.random() * 0.1) * e,
        life: 1.0,
        decay: 0.006 + Math.random() * 0.006,
        size: 0.6 + Math.random() * 1.8,
        gravity: 0.02 + Math.random() * 0.02,
      });
    };

    // 흐름 레이어 (느리고 오래 남는 안개층)
    const spawnFlow = (side: -1 | 1, e = 1.0) => {
      const { cx, ty, lx, rx, by } = cachedCoords;
      const t = Math.random();
      const ex = side === -1 ? lx : rx;
      const sx = cx + (ex - cx) * t + (Math.random() - 0.5) * 20;
      const sy = ty + (by - ty) * t + (Math.random() - 0.5) * 10;
      flowParticles.push({
        x: sx, y: sy,
        vx: side * (2 + Math.random() * 2) * e,
        vy: (0.5 + Math.random() * 0.3) * e,
        life: 1.0,
        decay: 0.003 + Math.random() * 0.003,
        size: 2 + Math.random() * 3,
      });
    };

    const SHIP_SCROLL_END = 180;
    const isMobileDevice = window.innerWidth < 768;
    let shipCoordsReady = false;
    const onScrollParticle = () => {
      const rawDelta = window.scrollY - lastScrollY;
      const delta = Math.abs(rawDelta);
      lastScrollY = window.scrollY;
      if (window.scrollY < SHIP_SCROLL_END) return;

      // 선박이 최종 위치에 도달한 후 처음 한 번만 좌표 갱신
      if (!shipCoordsReady) {
        updateShipCoords();
        shipCoordsReady = true;
      }

      // 후진 시 에너지 0.3, 파티클 수 0.3배
      const isForward = rawDelta > 0;
      const factor = isForward ? 1.0 : 0.3;
      const energy = isForward ? 1.0 : 0.3;

      // 모바일: 상한 50% 감소 + flowParticles 생략
      if (isMobileDevice) {
        const count    = Math.min(Math.ceil(delta * 0.55 * factor), 6);
        const bowCount = Math.min(Math.ceil(delta * 1.0  * factor), 10);
        for (let i = 0; i < count;    i++) { spawn(-1, energy); spawn(1, energy); }
        for (let i = 0; i < bowCount; i++) { spawnBow(energy); }
      } else {
        const count     = Math.min(Math.ceil(delta * 0.55 * factor), 12);
        const bowCount  = Math.min(Math.ceil(delta * 1.0  * factor), 20);
        const flowCount = Math.min(Math.ceil(delta * 1.2  * factor), 25);
        for (let i = 0; i < count;     i++) { spawn(-1, energy); spawn(1, energy); }
        for (let i = 0; i < flowCount; i++) { spawnFlow(-1, energy); spawnFlow(1, energy); }
        for (let i = 0; i < bowCount;  i++) { spawnBow(energy); }
      }
      // 파티클 생성 후 RAF가 멈춰있으면 재시작
      if (frameId === 0) frameId = requestAnimationFrame(animate);
    };
    window.addEventListener("scroll", onScrollParticle, { passive: true });

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.67, 3);
      lastTime = time;

      // 파티클이 없으면 캔버스 클리어 후 RAF 중단 — 다음 스크롤 때 재시작
      const totalCount = particles.length + bowParticles.length + flowParticles.length;
      if (totalCount === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frameId = 0;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      // 튀는 물보라 (파란색)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay * dt;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const flowBoost = 1 + (p.y / canvas.height) * 0.8;
        p.x += p.vx * flowBoost * dt;
        p.y += p.vy * flowBoost * dt;
        p.vy += p.gravity * dt;
        p.vx *= 1 - 0.08 * dt;
        p.vy *= 1 - 0.05 * dt;

        const alpha = p.life * 0.5;
        const r = p.size * 5;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0,   `rgba(220,248,255,${alpha.toFixed(2)})`);
        g.addColorStop(0.3, `rgba(0,210,255,${(alpha * 0.7).toFixed(2)})`);
        g.addColorStop(0.7, `rgba(60,30,210,${(alpha * 0.28).toFixed(2)})`);
        g.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // 거품 (흰색)
      for (let i = bowParticles.length - 1; i >= 0; i--) {
        const p = bowParticles[i];
        p.life -= p.decay * dt;
        if (p.life <= 0) { bowParticles.splice(i, 1); continue; }
        const flowBoost = 1 + (p.y / canvas.height) * 0.8;
        p.x += p.vx * flowBoost * dt;
        p.y += p.vy * flowBoost * dt;
        p.vy += p.gravity * 0.6 * dt;
        p.vx *= 1 - 0.15 * dt;
        p.vy *= 1 - 0.10 * dt;

        const bell = Math.sin(p.life * Math.PI);
        const alpha = bell * 0.6;
        const r = p.size * (0.5 + bell) * 4;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0,    `rgba(255,255,255,${alpha.toFixed(2)})`);
        g.addColorStop(0.35, `rgba(210,235,255,${(alpha * 0.55).toFixed(2)})`);
        g.addColorStop(1,    "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // 흐름 레이어
      for (let i = flowParticles.length - 1; i >= 0; i--) {
        const p = flowParticles[i];
        p.life -= p.decay * dt;
        if (p.life <= 0) { flowParticles.splice(i, 1); continue; }
        const flowBoost = 1 + (p.y / canvas.height) * 0.8;
        p.x += p.vx * flowBoost * dt;
        p.y += p.vy * flowBoost * dt;
        p.vx *= 1 - 0.04 * dt;

        const bell = Math.sin(p.life * Math.PI);
        const alpha = bell * 0.18;
        const r = p.size * (0.6 + bell * 0.8) * 6;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0,   `rgba(180,220,255,${alpha.toFixed(2)})`);
        g.addColorStop(0.5, `rgba(100,180,255,${(alpha * 0.4).toFixed(2)})`);
        g.addColorStop(1,   "rgba(100,180,255,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      frameId = requestAnimationFrame(animate);
    };
    frameId = 0;

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener("scroll", onScrollParticle);
    };
  }, []);

  if (!isDark) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "50vh",
        zIndex: 4,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <style>{`@media (max-width: 639px) { .wave-img { bottom: 8% !important; } }`}</style>

      {/* 파도 이미지 — 선박 아래 레이어 (low → mid → high 중첩) */}
      <div
        ref={waveRef}
        style={{
          display: "none",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "65%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={lowRef}
          src="/low.webp"
          alt=""
          draggable={false}
          className="wave-img"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "110%",
            maxWidth: "980px",
            transition: "opacity 0.08s",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={midRef}
          src="/mid.webp"
          alt=""
          draggable={false}
          className="wave-img"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "110%",
            maxWidth: "980px",
            transition: "opacity 0.08s",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={highRef}
          src="/high.webp"
          alt=""
          draggable={false}
          className="wave-img"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "860px",
            transition: "opacity 0.15s",
          }}
        />
      </div>


      {/* 파티클 캔버스 — 선박 아래 레이어 */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* 선박 — 파티클 위 레이어 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={shipRef}
        src="/shipBody.webp"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          width: "100%",
          maxWidth: "860px",
          opacity: 1,
          filter: "brightness(0.75) saturate(0.9)",
          willChange: "transform",
        }}
      />

      {/* 타륜 — filter는 정적 컨테이너에, rotate만 img에 적용 */}
      <div
        ref={wheelContainerRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          width: "clamp(180px, 28vmin, 340px)",
          height: "clamp(180px, 28vmin, 340px)",
          opacity: 0.55,
          filter:
            "drop-shadow(0 0 6px #00e5ff) drop-shadow(0 0 14px rgba(0,229,255,0.45))",
          willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={wheelRef}
          src="/shipWheel.png"
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", willChange: "transform" }}
        />
      </div>
    </div>
  );
}

// --------------------
// Stars
// --------------------
// 글로브와 동일한 5색 그라디언트 (X 위치 기반)
const STAR_COLORS = [
  new THREE.Color(0x4139fb),
  new THREE.Color(0xba73ef),
  new THREE.Color(0xfb23c5),
  new THREE.Color(0xfd3d79),
  new THREE.Color(0xfe6a54),
];
function starGradientColor(x: number, range: number): THREE.Color {
  const t = THREE.MathUtils.clamp(x / range + 0.5, 0, 1);
  const s = t * 4;
  const i = Math.min(Math.floor(s), 3);
  return STAR_COLORS[i].clone().lerp(STAR_COLORS[i + 1], s - i);
}

function Stars({ isDark }: { isDark: boolean }) {
  const geo = useMemo(() => {
    const n = 500;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    let s = 99991;
    const rng = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    const tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const x = (rng() - 0.5) * 800;
      const y = rng() * 180 + 10;
      const z = (rng() - 0.5) * 800;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      tmp.copy(starGradientColor(x, 400));
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: isDark ? 0xffffff : 0xffffff,
        vertexColors: !isDark,
        opacity: isDark ? 0.5 : 0.85,
        size: 1.2,
        sizeAttenuation: true,
        transparent: true,
      }),
    [isDark]
  );

  return <points geometry={geo} material={mat} />;
}

// --------------------
// Main scene
// --------------------
function TerrainScene({
  isDark,
  scrollEndVh,
  isMobile,
}: {
  isDark: boolean;
  scrollEndVh: number;
  isMobile: boolean;
}) {
  const { camera, scene } = useThree();
  const scrollY = useRef(0);
  const groupRefs = useRef<THREE.Group[]>([]);
  // 비콘 그룹 refs — 단일 useFrame에서 일괄 애니메이션
  const beaconGroupRefs = useMemo<React.MutableRefObject<THREE.Group | null>[]>(
    () => TECH_NODES.map(() => ({ current: null })),
    []
  );
  const circleTex = useMemo(() => createCircleTexture(), []);
  const glowTex = useMemo(() => createGlowTexture(), []);

  // 테마 전환 진행값: 0 = 다크, 1 = 라이트
  const progressRef = useRef(0);

  // 색상 쌍 (lerp용)
  const C = useMemo(
    () => ({
      solidDark: new THREE.Color(0x0a1118),
      solidLight: new THREE.Color(0xd0dae6),
      lineDark: new THREE.Color(0x00bbcc),
      lineLight: new THREE.Color(0xc7d1e0),
      ptDark: new THREE.Color(0x00ccff),
      ptLight: new THREE.Color(0xd94a52),
      fogDark: new THREE.Color(0x021012),
      fogLight: new THREE.Color(0xf2f5f8),
      l2Dark: new THREE.Color(0xd94a52),
      l2Light: new THREE.Color(0xe6eaf0),
      l3Dark: new THREE.Color(0x1a2a60),
      l3Light: new THREE.Color(0xdce3ea),
      l4Dark: new THREE.Color(0xd94a52),
      l4Light: new THREE.Color(0xe6eaf0),
    }),
    []
  );

  // 조명 ref
  const light1Ref = useRef<THREE.DirectionalLight>(null);
  const light2Ref = useRef<THREE.DirectionalLight>(null);
  const light3Ref = useRef<THREE.DirectionalLight>(null);
  const light4Ref = useRef<THREE.DirectionalLight>(null);

  // heightMap.png 비동기 로드 → 픽셀 데이터 추출
  const [hmapData, setHmapData] = useState<HMapData | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = "/heightMap.png";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      setHmapData({ pixels: data, width: img.width, height: img.height });
    };
  }, []);

  // hmapData 로드 완료 시 heightAt 재생성 → tiles 자동 재갱신
  const heightAt = useMemo(
    () => makeHeightFn(hmapData ?? undefined),
    [hmapData]
  );

  // 비콘 baseY 사전 계산 — heightAt은 노이즈 연산이라 매 프레임 호출 비용이 큼
  const beaconBaseYs = useMemo(
    () => TECH_NODES.map(node => heightAt(node.x, node.z) + (node.yOffset ?? 0)),
    [heightAt]
  );

  // 솔리드 flat-shaded 지형 (조명 반사 핵심)
  const solidMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x0a1118, // 초기값: 다크
        flatShading: true,
        metalness: 0.1,
        roughness: 0.6,
        polygonOffset: true,      // 라인과 z-fighting 방지
        polygonOffsetFactor: 1,   // 메시를 깊이버퍼에서 카메라 반대쪽으로 밀어냄
        polygonOffsetUnits: 1,
      }),
    []
  );

  // 격자 선 (은은한 오버레이)
  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0x00bbcc, // 초기값: 다크
        transparent: true,
        opacity: 0.45,
      }),
    []
  );

  // 데이터 점: 분홍 계열
  const ptMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x00ccff, // 초기값: 다크
        size: 0.38,
        sizeAttenuation: true,
        map: circleTex,
        transparent: true,
        alphaTest: 0.01,
        depthWrite: false,
        opacity: 0.6,
      }),
    [circleTex]
  );

  const tiles = useMemo(() => {
    const t = Array.from({ length: N_TILES }, (_, i) =>
      createTile(-i * SEG_LEN)
    );
    for (const tile of t) updateTile(tile, tile.worldZ, heightAt);
    return t;
  }, [heightAt]);

  useEffect(() => {
    scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
    camera.position.set(0, CAM_Y, CAM_Z_BASE);
    camera.lookAt(LOOK_AT);
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [camera, scene]);

  const recycleIfNeeded = useCallback(
    (cz: number) => {
      let frontMost = Infinity;
      for (const tile of tiles) frontMost = Math.min(frontMost, tile.worldZ);
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        if (tile.worldZ > cz + SEG_LEN / 2) {
          const newWorldZ = frontMost - SEG_LEN;
          frontMost = newWorldZ;
          const g = groupRefs.current[i];
          if (g) g.position.z = newWorldZ;
          updateTile(tile, newWorldZ, heightAt);
        }
      }
    },
    [tiles, heightAt]
  );

  useFrame(({ clock }) => {
    // 테마 진행값 lerp
    const target = isDark ? 0 : 1;
    const diff = target - progressRef.current;
    const isThemeStable = Math.abs(diff) < 0.001;
    if (!isThemeStable) {
      progressRef.current += diff * 0.06;
    }
    const t = progressRef.current;

    // 카메라 수렴 여부
    const cappedScroll = Math.min(scrollY.current, scrollEndVh * window.innerHeight);
    const targetZ = CAM_Z_BASE - cappedScroll * SCROLL_SPEED;
    const camDiff = targetZ - camera.position.z;
    const isCamStable = Math.abs(camDiff) < 0.01;

    // 비콘 bob 애니메이션 (6개 → 단일 루프)
    const elapsed = clock.elapsedTime;
    for (let i = 0; i < TECH_NODES.length; i++) {
      const g = beaconGroupRefs[i].current;
      if (!g) continue;
      const phase = (i * Math.PI * 2) / TECH_NODES.length;
      g.position.y = beaconBaseYs[i] + Math.sin(elapsed * 1.6 + phase) * 0.4;
    }

    // 테마 안정 + 카메라 수렴 시 material/light 업데이트 생략
    if (isThemeStable && isCamStable) return;

    if (!isThemeStable) {
      // 머티리얼 색상 lerp
      solidMat.color.lerpColors(C.solidDark, C.solidLight, t);
      lineMat.color.lerpColors(C.lineDark, C.lineLight, t);
      lineMat.opacity = 0.45 + (0.5 - 0.45) * t;
      ptMat.color.lerpColors(C.ptDark, C.ptLight, t);

      // blending 전환 (중간 지점에서 스위치)
      const blendTarget =
        t < 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending;
      if (lineMat.blending !== blendTarget) {
        lineMat.blending = blendTarget;
        lineMat.needsUpdate = true;
      }
      if (ptMat.blending !== blendTarget) {
        ptMat.blending = blendTarget;
        ptMat.needsUpdate = true;
      }

      // 텍스처 전환 (중간 지점에서 스위치)
      const mapTarget = t < 0.5 ? circleTex : glowTex;
      if (ptMat.map !== mapTarget) {
        ptMat.map = mapTarget;
        ptMat.needsUpdate = true;
      }

      // 안개 색상 lerp
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.color.lerpColors(C.fogDark, C.fogLight, t);
      }

      // 조명 강도/색상 lerp
      if (light1Ref.current) {
        light1Ref.current.intensity = 1.7 + (1.2 - 1.7) * t;
      }
      if (light2Ref.current) {
        light2Ref.current.color.lerpColors(C.l2Dark, C.l2Light, t);
        light2Ref.current.intensity = 1.8 + (1.0 - 1.8) * t;
      }
      if (light3Ref.current) {
        light3Ref.current.color.lerpColors(C.l3Dark, C.l3Light, t);
        light3Ref.current.intensity = 0.7 + (0.5 - 0.7) * t;
      }
      if (light4Ref.current) {
        light4Ref.current.color.lerpColors(C.l4Dark, C.l4Light, t);
        light4Ref.current.intensity = 0.6 + (0.4 - 0.6) * t;
      }
    }

    camera.position.z += camDiff * 0.1;
    recycleIfNeeded(camera.position.z);
  });

  return (
    <>
      {/* 전체 기저 조명: 어두운 파랑으로 지형 윤곽 살림 */}
      <ambientLight intensity={0.7} />

      <directionalLight
        ref={light1Ref}
        color={0xffffff}
        intensity={1.7}
        position={[40, 80, 60]}
      />

      <directionalLight
        ref={light2Ref}
        color={0xd94a52}
        intensity={1.8}
        position={[0, 20, 80]}
      />

      <directionalLight
        ref={light3Ref}
        color={0x1a2a60}
        intensity={0.7}
        position={[-80, 40, 0]}
      />

      <directionalLight
        ref={light4Ref}
        color={0xd94a52}
        intensity={0.6}
        position={[-40, 30, -200]}
      />

      {/* 하늘 요소 */}
      <Stars isDark={isDark} />
      {isDark ? (
        <SunriseGlow />
      ) : (
        <group position={[0, 66, -300]} scale={[18, 18, 18]}>
          <GlobeParticlesScene />
        </group>
      )}

      {/* 지형 타일 */}
      {tiles.map((tile, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) groupRefs.current[i] = el;
          }}
          position={[0, 0, tile.worldZ]}
        >
          {/* 솔리드 메시: 조명 받아 face마다 명암 */}
          <mesh geometry={tile.planeGeo} material={solidMat} />
          {/* 격자 선 오버레이 */}
          <lineSegments geometry={tile.lineGeo} material={lineMat} />
          {/* 데이터 점 */}
          <points geometry={tile.ptGeo} material={ptMat} />
        </group>
      ))}

      {/* 데이터 비콘 + 라벨 */}
      {TECH_NODES.map((node, i) => (
        <DataBeacon
          key={node.name}
          x={node.x}
          z={node.z}
          name={node.name}
          code={node.code}
          heightAt={heightAt}
          yOffset={node.yOffset}
          isDark={isDark}
          isMobile={isMobile}
          groupRef={beaconGroupRefs[i]}
        />
      ))}
    </>
  );
}

const DARK_BG = `linear-gradient(
  to bottom,
  #041818  0%,
  #071c22 20%,
  #0e1030 40%,
  #260840 60%,
  #5a1a5a 75%,
  #9a2066 85%,
  #cc3070 100%
)`;

const LIGHT_BG = `linear-gradient(
  to bottom,
  #f8fafc  0%,
  #edf1f5 30%,
  #e3e9f0 70%,
  #dce3ea 100%
)`;

// --------------------
// Export
// --------------------
export default function Terrain({
  isDark,
  overlayOpacity = 0,
  scrollEndVh = 1.0,
}: {
  isDark: boolean;
  overlayOpacity?: number;
  scrollEndVh?: number;
}) {
  const [themeProgress, setThemeProgress] = useState(0); // 0 = 다크, 1 = 라이트
  const tpRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);
  // CSS/Vignette용 themeProgress RAF 애니메이션
  useEffect(() => {
    const target = isDark ? 0 : 1;
    const step = () => {
      const diff = target - tpRef.current;
      if (Math.abs(diff) > 0.001) {
        tpRef.current += diff * 0.06;
        setThemeProgress(tpRef.current);
        rafRef.current = requestAnimationFrame(step);
      } else {
        tpRef.current = target;
        setThemeProgress(target);
      }
    };
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [isDark]);

  const vignetteOffset = 0.1 + (0.6 - 0.1) * themeProgress;
  const vignetteDarkness = 0.8 + (0.12 - 0.8) * themeProgress;

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: DARK_BG }}
    >
      {/* 라이트 모드 배경 (opacity로 크로스페이드) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: LIGHT_BG,
          opacity: themeProgress,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* alpha:true → Canvas 배경 투명, CSS 그라데이션 비침 */}
      <Canvas
        camera={{ position: [0, CAM_Y, CAM_Z_BASE], fov: 70 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        frameloop={overlayOpacity >= 1 ? "never" : "always"}
        style={{ background: "transparent", position: "relative", zIndex: 1 }}
      >
        <TerrainScene isDark={isDark} scrollEndVh={scrollEndVh} isMobile={isMobile} />

        {/* 모바일에서는 post-processing 생략 — GPU 패스 절감 */}
        {!isMobile && (
          <EffectComposer>
            <Vignette
              eskil={false}
              offset={vignetteOffset}
              darkness={vignetteDarkness}
            />
          </EffectComposer>
        )}
      </Canvas>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: isDark
            ? "radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.6) 100%)"
            : "radial-gradient(circle at center, transparent 72%, rgba(220,226,232,0.32) 100%)",
          transition: "background 0.7s ease",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />

      <DeckOverlay isDark={isDark} scrollEndVh={scrollEndVh} />
      <TitleOverlay isDark={isDark} />
    </div>
  );
}
