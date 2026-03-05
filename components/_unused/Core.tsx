"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export default function Core() {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.002;
    meshRef.current.rotation.x += 0.0005;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <icosahedronGeometry args={[2, 0]} />
      <meshStandardMaterial color="#e8ebef" roughness={0.55} metalness={0.25} />
    </mesh>
  );
}
