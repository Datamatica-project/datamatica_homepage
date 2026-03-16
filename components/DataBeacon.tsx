"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export type HeightFn = (x: number, z: number) => number;

const FLOAT_H = 8;

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
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const bob = Math.sin(clock.elapsedTime * 1.6 + phase) * 0.4;
    groupRef.current.position.y = y + bob;
  });

  return (
    <group ref={groupRef} position={[x, y, z]}>
      <Html position={[0, FLOAT_H, 0]} center distanceFactor={80}>
        <div className="flex pointer-events-none select-none" style={{ transform: isMobile ? `scale(0.5) perspective(400px) rotateY(${x > 0 ? -20 : 20}deg)` : `perspective(400px) rotateY(${x > 0 ? -20 : 20}deg)`, transformOrigin: "center center" }}>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: isDark
                ? "rgba(0,15,25,0.5)"
                : "rgba(240,248,255,0.65)",
              border: `1px solid ${isDark ? "#00E5FF" : "#00C2FF"}`,
              boxShadow: isDark
                ? "0 0 2px #00E5FF, 0 0 10px rgba(0,229,255,0.4)"
                : "0 1px 6px rgba(0,194,255,0.35)",
              transition:
                "background-color 0.7s ease, border-color 0.7s ease, box-shadow 0.7s ease",
            }}
          >
            <p
              style={{
                color: isDark ? "#E6F7FF" : "#004C63",
                fontFamily: "var(--font-a2z), sans-serif",
                fontWeight: 500,
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
                whiteSpace: "nowrap",
                transition: "color 0.7s ease",
              }}
            >
              {name}
            </p>
            <p
              style={{
                color: isDark ? "#7EDFFF" : "#004C63",
                fontFamily: "noto sans kr",
                fontSize: "10px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                margin: "3px 0 0",
                whiteSpace: "nowrap",
                transition: "color 0.7s ease",
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
