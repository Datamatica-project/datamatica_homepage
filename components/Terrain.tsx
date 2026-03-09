"use client";

import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import SunriseGlow from "./SunriseGlow";
import { DataBeacon } from "./DataBeacon";
import { GlobeParticlesScene } from "./GlobeParticles";

const SEG_LEN = 600;
const WIDTH = 220;
const GRID = 100;
const N_TILES = 3;
const SCROLL_SPEED = 0.05;
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
    name: "데이터 라벨링",
    code: "SYS.01 / Data Annotation",
    x: -9,
    z: -50,
    yOffset: -5,
  },
  { name: "정밀 지도", code: "SYS.02 / HD MAP", x: 10, z: -80, yOffset: -5 },
  {
    name: "자율 주행",
    code: "SYS.03 / Autonomous Mobility",
    x: -10,
    z: -110,
    yOffset: -4,
  },
  {
    name: "디지털 트윈",
    code: "SYS.04 / Digital Twin",
    x: 10,
    z: -140,
    yOffset: -5,
  },
  {
    name: "스마트 헬스 케어",
    code: "SYS.05 / Smart Healthcare",
    x: -10,
    z: -170,
    yOffset: -5,
  },
  {
    name: "안전 모니터링",
    code: "SYS.06 / Smart Safety System",
    x: 10,
    z: -200,
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
  lineArray: Float32Array;
  rows: number;
  cols: number;
  worldZ: number;
};

function createTile(initialWorldZ: number): Tile {
  const planeGeo = new THREE.PlaneGeometry(WIDTH, SEG_LEN, GRID, GRID);
  planeGeo.rotateX(-Math.PI / 2);
  const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;
  const rows = GRID + 1;
  const cols = GRID + 1;
  const segCount = rows * (cols - 1) + cols * (rows - 1);
  const lineArray = new Float32Array(segCount * 2 * 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(lineArray, 3));
  const ptGeo = new THREE.BufferGeometry();
  const ptArray = new Float32Array(arr.length);
  ptGeo.setAttribute("position", new THREE.BufferAttribute(ptArray, 3));
  return {
    planeGeo,
    posAttr,
    lineGeo,
    ptGeo,
    lineArray,
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
    const v = (((-zWorld / MAP_WORLD_LEN) % 1) + 1) % 1;
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
  const planeArr = posAttr.array as Float32Array;

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const zWorld = posAttr.getZ(i) + newWorldZ;
    posAttr.setY(i, heightAt(x, zWorld));
  }
  posAttr.needsUpdate = true;

  // 조명 반사를 위해 법선 재계산 (flatShading 핵심)
  tile.planeGeo.computeVertexNormals();

  const ptPos = tile.ptGeo.getAttribute("position") as THREE.BufferAttribute;
  (ptPos.array as Float32Array).set(planeArr);
  ptPos.needsUpdate = true;

  const { rows, cols, lineArray } = tile;
  let w = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const a = (r * cols + c) * 3,
        b = (r * cols + c + 1) * 3;
      lineArray[w++] = planeArr[a];
      lineArray[w++] = planeArr[a + 1];
      lineArray[w++] = planeArr[a + 2];
      lineArray[w++] = planeArr[b];
      lineArray[w++] = planeArr[b + 1];
      lineArray[w++] = planeArr[b + 2];
    }
  }
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 1; r++) {
      const a = (r * cols + c) * 3,
        b = ((r + 1) * cols + c) * 3;
      lineArray[w++] = planeArr[a];
      lineArray[w++] = planeArr[a + 1];
      lineArray[w++] = planeArr[a + 2];
      lineArray[w++] = planeArr[b];
      lineArray[w++] = planeArr[b + 1];
      lineArray[w++] = planeArr[b + 2];
    }
  }

  const linePos = tile.lineGeo.getAttribute(
    "position"
  ) as THREE.BufferAttribute;
  linePos.needsUpdate = true;
  tile.lineGeo.computeBoundingSphere();
  tile.ptGeo.computeBoundingSphere();
}

// --------------------
// TitleBillboard (3D 월드 공간 타이틀)
// --------------------
function TitleBillboard({ isDark }: { isDark: boolean }) {
  const { camera } = useThree();
  const innerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (!innerRef.current) return;
    // camera.z - TITLE_Z: 양수 = 카메라가 타이틀 앞, 음수 = 통과 후
    const dist = camera.position.z - TITLE_Z;
    // dist 25 이상: 완전히 보임 / dist 0 이하: 완전히 사라짐
    const opacity = Math.max(0, Math.min(1, (dist - 0) / 25));
    innerRef.current.style.opacity = String(opacity);
  });

  return (
    <Html position={[0, 7, TITLE_Z]} center distanceFactor={55}>
      <div
        ref={innerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
          userSelect: "none",
          textAlign: "center",
          backgroundColor: isDark ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          padding: "clamp(8px, 2vw, 10px) clamp(12px, 4vw, 20px)",
          borderRadius: "5px",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255,255,255,0.1)",
          transition: "background-color 0.7s ease",
        }}
      >
        <p
          style={{
            color: isDark ? "rgba(255,255,255,0.4)" : "#64748B",
            fontSize: "clamp(8px, 2.5vw, 10px)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontFamily: "noto sans kr",
            margin: 0,
            whiteSpace: "nowrap",
            fontWeight: "normal",
            transition: "color 0.7s ease",
          }}
        >
          {/* Public Data · AI · Digital Infrastructure */}
          인공지능 통합 솔루션 구축 기업
        </p>
        <h1
          style={{
            color: isDark ? "white" : "#D94A52",
            fontSize: "clamp(28px, 10vw, 58px)",
            fontWeight: "300",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            lineHeight: 1,
            textShadow: "0 0 30px rgba(255,100,150,0.7)",
            margin: 0,
            whiteSpace: "nowrap",
            transition: "color 0.7s ease",
            fontFamily: "var(--font-a2z), sans-serif",
          }}
        >
          DATAMATICA
        </h1>
        <p
          style={{
            color: isDark ? "rgba(255,255,255,0.4)" : "#64748B",
            fontSize: "clamp(8px, 2.5vw, 10px)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontFamily: "noto sans kr",
            margin: 0,
            whiteSpace: "nowrap",
            fontWeight: "normal",
            transition: "color 0.7s ease",
          }}
        >
          (주)데이터메티카
        </p>
      </div>
    </Html>
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
function TerrainScene({ isDark }: { isDark: boolean }) {
  const { camera, scene } = useThree();
  const scrollY = useRef(0);
  const groupRefs = useRef<THREE.Group[]>([]);
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
    img.src = "/heightMap3.png";

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

  // 솔리드 flat-shaded 지형 (조명 반사 핵심)
  const solidMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x0a1118, // 초기값: 다크
        flatShading: true,
        metalness: 0.1,
        roughness: 0.6,
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

  useFrame(() => {
    // 테마 진행값 lerp
    const target = isDark ? 0 : 1;
    progressRef.current += (target - progressRef.current) * 0.06;
    const t = progressRef.current;

    // 머티리얼 색상 lerp
    solidMat.color.lerpColors(C.solidDark, C.solidLight, t);
    lineMat.color.lerpColors(C.lineDark, C.lineLight, t);
    lineMat.opacity = 0.45 + (0.5 - 0.45) * t;
    ptMat.color.lerpColors(C.ptDark, C.ptLight, t);

    // blending 전환 (중간 지점에서 스위치)
    const blendTarget = t < 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending;
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

    // 카메라 스크롤 (원 등장 지점인 500vh에서 고정)
    const cappedScroll = Math.min(scrollY.current, 5.0 * window.innerHeight);
    const targetZ = CAM_Z_BASE - cappedScroll * SCROLL_SPEED;
    camera.position.z += (targetZ - camera.position.z) * 0.1;
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
      <TitleBillboard isDark={isDark} />

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
          phase={(i * Math.PI * 2) / TECH_NODES.length}
          isDark={isDark}
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
export default function Terrain({ isDark }: { isDark: boolean }) {
  const [themeProgress, setThemeProgress] = useState(0); // 0 = 다크, 1 = 라이트
  const tpRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
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
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", position: "relative", zIndex: 1 }}
      >
        <TerrainScene isDark={isDark} />

        <EffectComposer>
          <Vignette
            eskil={false}
            offset={vignetteOffset}
            darkness={vignetteDarkness}
          />
        </EffectComposer>
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
    </div>
  );
}
