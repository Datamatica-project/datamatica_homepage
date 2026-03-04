import { useMemo } from "react";
import * as THREE from "three";

export default function HorizonLight() {
  const geo = useMemo(() => new THREE.PlaneGeometry(1200, 550), []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          color: { value: new THREE.Color("#ff4a6e") },
        },

        vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,

        fragmentShader: `
        varying vec2 vUv;
        uniform vec3 color;

        void main(){

        // horizon 위치
        float horizon = abs(vUv.y - 0.18);

        // 중심 glow (강함)
        float core = smoothstep(0.18, 0.0, horizon);
        core = pow(core, 4.0);

        // 넓은 glow
        float wide = smoothstep(0.55, 0.0, horizon);
        wide = pow(wide, 2.0);

        float glow = core * 1.4 + wide * 0.4;

        gl_FragColor = vec4(color, glow);
        }
      `,
      }),
    [],
  );

  return <mesh geometry={geo} material={mat} position={[0, 12, -320]} />;
}
