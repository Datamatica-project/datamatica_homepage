"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
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

// --------------------
// Types & Data
// --------------------
type HeightFn = (x: number, z: number) => number;

const TECH_NODES = [
  { name: "DATA LABELING", x: -14, z: -120 },
  { name: "HD MAP", x: 20, z: -230 },
  { name: "AUTONOMOUS DRIVING", x: -10, z: -360 },
  { name: "DIGITAL TWIN", x: 24, z: -490 },
  { name: "SMART HEALTHCARE", x: -20, z: -620 },
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

function makeHeightFn() {
  const rng = mulberry32(123456);
  const noise2D = createNoise2D();
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
    return flatBase + mask * ridge * 18.0;
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
const BEAM_H = 22;

function DataBeacon({
  x,
  z,
  name,
  heightAt,
  phase = 0,
}: {
  x: number;
  z: number;
  name: string;
  heightAt: HeightFn;
  phase?: number;
}) {
  const y = heightAt(x, z);

  const beamGeo = useMemo(
    () => new THREE.CylinderGeometry(0.05, 0.7, BEAM_H, 8, 1, true),
    [],
  );
  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.5, 12, 12), []);
  const ringGeo = useMemo(() => {
    const g = new THREE.RingGeometry(0.9, 2.2, 32);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x00ddff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame(({ clock }) => {
    mat.opacity = 0.28 + Math.sin(clock.elapsedTime * 1.6 + phase) * 0.14;
  });

  return (
    <group position={[x, y, z]}>
      <mesh geometry={beamGeo} material={mat} position={[0, BEAM_H / 2, 0]} />
      <mesh geometry={dotGeo} material={mat} />
      <mesh geometry={ringGeo} material={mat} />
      <Html position={[0, BEAM_H + 2, 0]} center distanceFactor={80}>
        <div
          style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: "8.5px",
            letterSpacing: "0.25em",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,220,255,0.9)",
            userSelect: "none",
            padding: "3px 9px",
            border: "1px solid rgba(0,200,255,0.3)",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
          }}
        >
          {name}
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
  const heightAt = useMemo(() => makeHeightFn(), []);
  const circleTex = useMemo(() => createCircleTexture(), []);

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
          <Bloom
            intensity={0.22}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.9}
          />

          <Noise opacity={0.04} />

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

      {/* 타이틀 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-14 pointer-events-none select-none">
        <p className="text-white/40 text-xs tracking-[0.45em] uppercase mb-3">
          Vector Graphic
        </p>
        <h1 className="text-white text-6xl font-bold tracking-[0.15em] uppercase leading-none drop-shadow-lg">
          DATAMATICA
        </h1>
        <p className="text-white/40 text-xs tracking-[0.45em] uppercase mt-3">
          Visualization
        </p>
      </div>
    </div>
  );
}
