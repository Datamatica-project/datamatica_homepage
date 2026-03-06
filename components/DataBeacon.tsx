"use client";

import { useMemo, useEffect } from "react";
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
  isDark = true,
}: {
  x: number;
  z: number;
  name: string;
  code: string;
  heightAt: HeightFn;
  yOffset?: number;
  phase?: number;
  isDark?: boolean;
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

  useEffect(() => {
    if (isDark) {
      coreMat.color.setHex(0xffffff);
      coreMat.blending = THREE.AdditiveBlending;
      glowMat.color.setHex(0x88ccff);
      glowMat.blending = THREE.AdditiveBlending;
    } else {
      coreMat.color.setHex(0xd94a52);
      coreMat.blending = THREE.NormalBlending;
      glowMat.color.setHex(0xd94a52);
      glowMat.blending = THREE.NormalBlending;
    }
    coreMat.needsUpdate = true;
    glowMat.needsUpdate = true;
  }, [isDark, coreMat, glowMat]);

  useFrame(({ clock }) => {
    const t = Math.sin(clock.elapsedTime * 1.6 + phase);
    coreMat.opacity = isDark ? 0.65 + t * 0.2 : 0.75 + t * 0.15;
    glowMat.opacity = isDark ? 0.1 + t * 0.06 : 0.08 + t * 0.04;
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
          {isDark ? (
            <div
              className="
                bg-[rgba(0,229,255,0.08)]
                backdrop-blur-[6px]
                py-[6px]
                px-[12px]
                rounded-[4px]
                border border-[#00E5FF]
                shadow-[0_0_2px_#00E5FF,0_0_10px_rgba(0,229,255,0.4)]
                "
            >
              <p
                className="text-[#E6F7FF] font-medium text-[12px] tracking-[0.15em] uppercase m-0 whitespace-nowrap"
                style={{ fontFamily: "var(--font-a2z), sans-serif" }}
              >
                {name}
              </p>
              <p
                className="text-[#7EDFFF] text-[12px] tracking-[0.10em] uppercase mt-[3px] mb-0 mx-0 whitespace-nowrap"
                style={{ fontFamily: "noto sans kr" }}
              >
                {code}
              </p>
            </div>
          ) : (
            <div
              className="
                bg-[rgba(255,255,255,0.6)]
                backdrop-blur-[6px]
                py-[6px]
                px-[12px]
                rounded-[4px]
                border border-[#00C2FF]
                shadow-[0_1px_6px_rgba(0,194,255,0.35)]
                "
            >
              <p
                className="text-[#004C63] font-medium text-[12px] tracking-[0.15em] uppercase m-0 whitespace-nowrap"
                style={{ fontFamily: "var(--font-a2z), sans-serif" }}
              >
                {name}
              </p>
              <p
                className="text-[#004C63] text-[12px] tracking-[0.10em] uppercase mt-[3px] mb-0 mx-0 whitespace-nowrap"
                style={{ fontFamily: "noto sans kr" }}
              >
                {code}
              </p>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
