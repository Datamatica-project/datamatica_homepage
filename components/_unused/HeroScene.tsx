"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import CoreWireframe from "./CoreWireframe";

export default function HeroScene() {
  return (
    <div
      className="relative w-full h-screen"
      style={{
        background:
          "radial-gradient(ellipse at center, #f5f7fa 0%, #e5e9ef 100%)",
      }}
    >
      <Canvas
        gl={{ alpha: true }}
        camera={{ position: [0, 1.5, 8], fov: 50 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 5]} intensity={1.1} />
        <directionalLight position={[-4, -3, -5]} intensity={0.4} />

        {/* Core 본체 + 와이어프레임 */}
        <CoreWireframe />

        {/* 부드러운 contact shadow */}
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.35}
          scale={8}
          blur={2.5}
          far={4}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
