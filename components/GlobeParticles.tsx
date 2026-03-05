"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// --------------------
// Types
// --------------------
type AlphaData = { pixels: Uint8ClampedArray; width: number; height: number };

// --------------------
// Bilinear pixel sampler
// --------------------
function sampleAlpha(data: AlphaData, u: number, v: number): number {
  const { pixels: px, width: w, height: h } = data;
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
// 단색 원 텍스처 (빛번짐 없음)
// --------------------
function createCircleTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// --------------------
// Constants
// --------------------
const RADIUS = 5;
const N_CANDIDATES = 34000;
const LAND_THRESHOLD = 0.35;

// --------------------
// Globe particle mesh (R3F 내부)
// --------------------
function GlobePoints({ alphaData }: { alphaData: AlphaData }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const circleTex = useMemo(() => createCircleTexture(), []);
  const { size: canvasSize, camera } = useThree();

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const sizes: number[] = [];

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N_CANDIDATES; i++) {
      const ny = 1 - (i / (N_CANDIDATES - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - ny * ny));
      const theta = goldenAngle * i;
      const nx = r * Math.cos(theta);
      const nz = r * Math.sin(theta);

      const lat = Math.asin(ny);
      const lon = Math.atan2(nz, nx);
      const u = (lon + Math.PI) / (2 * Math.PI);
      const v = (Math.PI / 2 - lat) / Math.PI;

      if (sampleAlpha(alphaData, u, v) < LAND_THRESHOLD) continue;

      const jitter = 1 + (Math.random() - 0.5) * 0.015;
      positions.push(
        nx * RADIUS * jitter,
        ny * RADIUS * jitter,
        nz * RADIUS * jitter,
      );

      // 개별 크기: 제곱 분포
      const sr = Math.random();
      sizes.push(0.7 + Math.pow(sr, 2) * 2.3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3),
    );
    geo.setAttribute(
      "aSize",
      new THREE.BufferAttribute(new Float32Array(sizes), 1),
    );
    return geo;
  }, [alphaData]);

  // 커스텀 셰이더: aSize 어트리뷰트로 파티클 개당 크기 지정
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uScale: { value: 350 },
        uMap: { value: circleTex },
      },
      vertexShader: `
        attribute float aSize;
        varying vec3 vColor;
        uniform float uScale;

        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

          // 뷰 공간 X 기반 그라디언트 (오른쪽=0, 왼쪽=1)
          // 구의 뷰 공간 반지름 = 모델행렬 X열 스케일 × RADIUS
          float viewRadius = length(modelViewMatrix[0].xyz) * 5.0;
          float t = clamp(0.5 + mvPos.x / (viewRadius * 2.0), 0.0, 1.0);

          // 5색 그라디언트: #4139FB → #BA73EF → #FB23C5 → #FD3D79 → #FE6A54
          vec3 c0 = vec3(0.255, 0.224, 0.984);
          vec3 c1 = vec3(0.729, 0.451, 0.937);
          vec3 c2 = vec3(0.984, 0.137, 0.773);
          vec3 c3 = vec3(0.992, 0.239, 0.475);
          vec3 c4 = vec3(0.996, 0.416, 0.329);

          float s  = t * 4.0;
          vec3 col = mix(c0, c1, clamp(s,       0.0, 1.0));
          col      = mix(col, c2, clamp(s - 1.0, 0.0, 1.0));
          col      = mix(col, c3, clamp(s - 2.0, 0.0, 1.0));
          col      = mix(col, c4, clamp(s - 3.0, 0.0, 1.0));

          // 뒷면 어둡게 (깊이감)
          vec4 center = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float depth = clamp((mvPos.z - center.z) / viewRadius, -1.0, 1.0);
          col *= 0.55 + depth * 0.45;

          vColor = col;
          gl_PointSize = aSize * (uScale / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform sampler2D uMap;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          if (tex.a < 0.01) discard;
          gl_FragColor = vec4(vColor, tex.a);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    matRef.current = mat;
    return mat;
  }, [circleTex]);

  // 캔버스 크기 변경 시 uScale 갱신 (sizeAttenuation 동기화)
  useEffect(() => {
    if (!matRef.current) return;
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    matRef.current.uniforms.uScale.value =
      (canvasSize.height * 0.5) / Math.tan(fov / 2);
  }, [canvasSize, camera]);

  // 구 그라디언트 셰이더 (뷰 공간 기준 → 회전과 무관하게 방향 고정)
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(RADIUS, 64, 64), []);
  const sphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.NormalBlending,
        vertexShader: `
          varying vec3 vViewPos;
          void main() {
            vec4 vp = modelViewMatrix * vec4(position, 1.0);
            vViewPos = normalize(vp.xyz);
            gl_Position = projectionMatrix * vp;
          }
        `,
        fragmentShader: `
          varying vec3 vViewPos;
          void main() {
            // 7시 방향(좌하단): (-0.5, -0.866) — 3시 방향(우): (1.0, 0.0)
            // 두 방향의 dot 범위: 7시=1.0, 3시=-0.5 → 0~1로 정규화
            vec3  dir7 = vec3(-0.5, -0.866, 0.0);
            float d    = dot(vViewPos, dir7);
            float t    = clamp((d + 0.5) / 1.5, 0.0, 1.0); // 7시=1, 3시=0

            vec3  col   = vec3(0.973, 0.980, 0.988);
            float alpha = t * 0.88;

            gl_FragColor = vec4(col, alpha);
          }
        `,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    // rotation.x: 약간 아래로 기울여서 북반구 위주로 보이게 (이미지 1 참조)
    <group ref={groupRef} rotation={[0.35, -0.3, 0]}>
      <mesh geometry={sphereGeo} material={sphereMat} />
      <points geometry={geometry} material={material} />
    </group>
  );
}

// --------------------
// 기존 Canvas 안에서 사용할 때 (Terrain 등)
// --------------------
export function GlobeParticlesScene() {
  const [alphaData, setAlphaData] = useState<AlphaData | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/earth_alphaMap.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      setAlphaData({ pixels: data, width: img.width, height: img.height });
    };
  }, []);

  if (!alphaData) return null;
  return <GlobePoints alphaData={alphaData} />;
}

// --------------------
// 독립형 Canvas 포함 버전
// --------------------
export default function GlobeParticles({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [alphaData, setAlphaData] = useState<AlphaData | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/earth_alphaMap.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      setAlphaData({ pixels: data, width: img.width, height: img.height });
    };
  }, []);

  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 13], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={1} />
        {alphaData && <GlobePoints alphaData={alphaData} />}
      </Canvas>
    </div>
  );
}
