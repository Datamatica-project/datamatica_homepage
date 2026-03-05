"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DataCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => new THREE.SphereGeometry(100, 128, 128), []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        uniforms: {
          time: { value: 0 },
        },

        vertexShader: `
          uniform float time;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vNormal = normal;
            vPosition = position;

            // 일렁이는 표면 변형
            float disp =
              sin(position.y * 2.8 + time * 1.8) * 0.9
            + sin(position.x * 3.5 + time * 2.2) * 0.6
            + sin(position.z * 2.2 + time * 1.5) * 0.7
            + sin((position.x + position.z) * 1.8 + time * 2.8) * 0.4;

            vec3 displaced = position + normal * disp;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
          }
        `,

        fragmentShader: `
          uniform float time;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            // 상→하 그라데이션 기준
            float t = clamp(vNormal.y * 0.5 + 0.5, 0.0, 1.0);

            vec3 colTop = vec3(0.95, 0.97, 1.0);          // 차가운 화이트
            vec3 colMid = vec3(0.58, 0.64, 0.72);          // #94A3B8 블루그레이
            vec3 colBot = vec3(0.851, 0.290, 0.322);        // #D94A52 레드

            vec3 baseCol = t > 0.5
              ? mix(colMid, colTop, (t - 0.5) * 2.0)
              : mix(colBot, colMid, t * 2.0);

            // shimmer: 표면을 흐르는 빛 결
            float shimmer =
              sin(vPosition.x * 0.6 + time * 2.0) *
              sin(vPosition.y * 0.8 + time * 1.6) *
              sin(vPosition.z * 0.5 + time * 2.4);
            shimmer = shimmer * 0.12 + 0.88;

            // 프레넬: 외곽 살짝 투명하게
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.8);
            float alpha = mix(0.75, 0.92, 1.0 - fresnel);

            gl_FragColor = vec4(baseCol * shimmer, alpha);
          }
        `,
      }),
    [],
  );

  useFrame(({ clock }) => {
    mat.uniforms.time.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.08;
    }
  });

  return <mesh ref={meshRef} geometry={geo} material={mat} position={[0, 66, -320]} />;
}
