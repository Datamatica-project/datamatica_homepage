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
        <div
          style={{
            display: "flex",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.1)",
              padding: "5px 10px",
              borderLeft: "none",
              backdropFilter: "blur(10px)",
              borderRadius: "5px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p
              style={{
                color: "#D94A52",
                fontSize: "12px",
                fontFamily: "var(--font-bebas-neue), sans-serif",
                letterSpacing: "0.15em",
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
                fontSize: "10px",
                fontFamily: "noto sans kr",
                letterSpacing: "0.10em",
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
