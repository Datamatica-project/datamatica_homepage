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
const FOG_COLOR = 0x5a2048; // 수평선 안쪽 어두운 보라 (CSS 그라데이션 중간과 매칭)
const TITLE_Z = -10; // 타이틀 월드 Z 좌표

// --------------------
// Types & Data
// --------------------
type HeightFn = (x: number, z: number) => number;

const TECH_NODES = [
  { name: "DATA LABELING", code: "SYS.01 / LABEL.STREAM", x: -14, z: -60 },
  { name: "HD MAP", code: "SYS.02 / MAP.SYNC", x: 20, z: -120 },
  { name: "AUTONOMOUS DRIVING", code: "SYS.03 / AUTO.DRIVE", x: -10, z: -190 },
  { name: "DIGITAL TWIN", code: "SYS.04 / TWIN.SYNC", x: 24, z: -260 },
  { name: "SMART HEALTHCARE", code: "SYS.05 / HEALTH.AI", x: -20, z: -330 },
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
    "position",
  ) as THREE.BufferAttribute;
  linePos.needsUpdate = true;
  tile.lineGeo.computeBoundingSphere();
  tile.ptGeo.computeBoundingSphere();
}

// --------------------
// TitleBillboard (3D 월드 공간 타이틀)
// --------------------
function TitleBillboard() {
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
          backgroundColor: "rgba(0,0,0,0.1)",
          padding: "10px 20px",
          borderRadius: "5px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "10px",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontFamily: "noto sans kr",
            margin: 0,
            whiteSpace: "nowrap",
            fontWeight: "normal",
          }}
        >
          Vector Graphic
        </p>
        <h1
          style={{
            color: "white",
            fontSize: "58px",
            fontWeight: "bold",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            lineHeight: 1,
            textShadow: "0 0 30px rgba(255,100,150,0.7)",
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          DATAMATICA
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "10px",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontFamily: "noto sans kr",
            margin: 0,
            whiteSpace: "nowrap",
            fontWeight: "normal",
          }}
        >
          Visualization
        </p>
      </div>
    </Html>
  );
}

// --------------------
// Stars
// --------------------
function Stars() {
  const geo = useMemo(() => {
    const n = 500;
    const arr = new Float32Array(n * 3);
    // 고정 시드 RNG
    let s = 99991;
    const rng = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (rng() - 0.5) * 800;
      arr[i * 3 + 1] = rng() * 180 + 10; // 하늘 위쪽
      arr[i * 3 + 2] = (rng() - 0.5) * 800;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xffffff,
        opacity: 0.5,
        size: 1.2,
        sizeAttenuation: true,
        transparent: true,
      }),
    [],
  );

  return <points geometry={geo} material={mat} />;
}

// --------------------
// DataBeacon
// --------------------
const BEAM_H = 11;

function DataBeacon({
  x,
  z,
  name,
  code,
  heightAt,
  phase = 0,
}: {
  x: number;
  z: number;
  name: string;
  code: string;
  heightAt: HeightFn;
  phase?: number;
}) {
  const y = heightAt(x, z);

  // 가느다란 흰색 코어 빔
  const coreGeo = useMemo(
    () => new THREE.CylinderGeometry(0.04, 0.04, BEAM_H, 8),
    [],
  );
  // 넓은 소프트 글로우 (아래 넓고 위로 좁아짐)
  const glowGeo = useMemo(
    () => new THREE.CylinderGeometry(0.02, 0.45, BEAM_H, 8, 1, true),
    [],
  );
  const ringGeo = useMemo(() => {
    const g = new THREE.RingGeometry(0.7, 2.0, 32);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const coreMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = Math.sin(clock.elapsedTime * 1.6 + phase);
    coreMat.opacity = 0.65 + t * 0.2;
    glowMat.opacity = 0.1 + t * 0.06;
  });

  return (
    <group position={[x, y, z]}>
      <mesh geometry={coreGeo} material={coreMat} position={[0, BEAM_H / 2, 0]} />
      <mesh geometry={glowGeo} material={glowMat} position={[0, BEAM_H / 2, 0]} />
      <mesh geometry={ringGeo} material={coreMat} />
      <Html position={[0, BEAM_H + 1.5, 0]} center distanceFactor={80}>
        <div
          style={{
            display: "flex",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {/* 왼쪽 오렌지 액센트 바 */}
          <div
            style={{
              width: "3px",
              background: "#ff6a3d",
              flexShrink: 0,
            }}
          />
          {/* 텍스트 영역 */}
          <div
            style={{
              background: "rgba(0,0,8,0.82)",
              padding: "5px 10px",
              border: "1px solid rgba(255,100,50,0.25)",
              borderLeft: "none",
            }}
          >
            <p
              style={{
                color: "#ff6a3d",
                fontSize: "8px",
                fontFamily: "monospace",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: "11px",
                fontFamily: "monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                margin: "3px 0 0",
                whiteSpace: "nowrap",
              }}
            >
              {code}
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
}

// --------------------
// Main scene
// --------------------
function TerrainScene() {
  const { camera, scene } = useThree();
  const scrollY = useRef(0);
  const groupRefs = useRef<THREE.Group[]>([]);
  const circleTex = useMemo(() => createCircleTexture(), []);

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
    [hmapData],
  );

  // 솔리드 flat-shaded 지형 (조명 반사 핵심)
  const solidMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x2b4a88, // 밝혀진 네이비 블루
        flatShading: true,
        metalness: 0.1,
        roughness: 0.6,
      }),
    [],
  );

  // 격자 선 (은은한 오버레이)
  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0x1a3060,
        transparent: true,
        opacity: 0.15,
      }),
    [],
  );

  // 데이터 점: 분홍 계열
  const ptMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xc04070,
        size: 0.38,
        sizeAttenuation: true,
        map: circleTex,
        transparent: true,
        alphaTest: 0.01,
        depthWrite: false,
        opacity: 0.6,
      }),
    [circleTex],
  );

  const tiles = useMemo(() => {
    const t = Array.from({ length: N_TILES }, (_, i) =>
      createTile(-i * SEG_LEN),
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
    [tiles, heightAt],
  );

  useFrame(() => {
    const targetZ = CAM_Z_BASE - scrollY.current * SCROLL_SPEED;
    camera.position.z += (targetZ - camera.position.z) * 0.1;
    recycleIfNeeded(camera.position.z);
  });

  return (
    <>
      {/* 전체 기저 조명: 어두운 파랑으로 지형 윤곽 살림 */}
      <ambientLight intensity={0.7} />
      {/* 위에서 내리는 채움광: 평평한 면들이 어둡지 않도록 */}

      <directionalLight
        color={0xffffff}
        intensity={1.5}
        position={[40, 80, 60]}
      />

      <directionalLight color={0xc03060} intensity={3} position={[0, 20, 80]} />

      <directionalLight
        color={0x1a2a60}
        intensity={0.5}
        position={[-80, 40, 0]}
      />

      <directionalLight
        color={0xff4a6e}
        intensity={0.5}
        position={[-40, 30, -200]}
      />

      {/* 하늘 요소 */}
      <Stars />
      <SunriseGlow />
      <TitleBillboard />

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
          phase={(i * Math.PI * 2) / TECH_NODES.length}
        />
      ))}
    </>
  );
}

// --------------------
// Export
// --------------------
export default function Terrain() {
  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        // 레퍼런스: 상단 어두운 네이비 → 중단 보라 → 하단 핑크 노을
        background: `linear-gradient(
          to bottom,
          #040810  0%,
          #080f22 22%,
          #130828 48%,
          #3e153a 68%,
          #88204a 82%,
          #c83056 91%,
          #e84c6e 100%
        )`,
      }}
    >
      {/* alpha:true → Canvas 배경 투명, CSS 그라데이션 비침 */}
      <Canvas
        camera={{ position: [0, CAM_Y, CAM_Z_BASE], fov: 70 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <TerrainScene />

        <EffectComposer>
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </Canvas>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
