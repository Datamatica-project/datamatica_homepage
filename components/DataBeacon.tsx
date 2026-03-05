"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export type HeightFn = (x: number, z: number) => number;

const BEAM_H = 11;

export function DataBeacon({
  x,
  z,
  name,
  code,
  heightAt,
  yOffset = 0,
  phase = 0,
}: {
  x: number;
  z: number;
  name: string;
  code: string;
  heightAt: HeightFn;
  yOffset?: number;
  phase?: number;
}) {
  const y = heightAt(x, z) + yOffset;

  const coreGeo = useMemo(
    () => new THREE.CylinderGeometry(0.04, 0.04, BEAM_H, 8),
    [],
  );
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
      <mesh
        geometry={coreGeo}
        material={coreMat}
        position={[0, BEAM_H / 2, 0]}
      />
      <mesh
        geometry={glowGeo}
        material={glowMat}
        position={[0, BEAM_H / 2, 0]}
      />
      <mesh geometry={ringGeo} material={coreMat} />
      <Html position={[0, BEAM_H + 1.5, 0]} center distanceFactor={80}>
        <div className="flex pointer-events-none select-none">
          <div className="bg-black/10 py-[5px] px-[10px] backdrop-blur-[10px] rounded-[5px] border border-white/10 border-1-0">
            <p
              className="text-[#ffffff] text-[12px] tracking-[0.15em] uppercase m-0 whitespace-nowrap"
              style={{
                fontFamily: "var(--font-a2z), sans-serif",
                fontWeight: "700",
              }}
            >
              {name}
            </p>
            <p
              className="text-[rgba(255,255,255,0.92)] text-[10px] tracking-[0.10em] uppercase mt-[3px] mb-0 mx-0 whitespace-nowrap"
              style={{
                fontFamily: "noto sans kr",
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
