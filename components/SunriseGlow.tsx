import { useMemo } from "react";
import * as THREE from "three";

export default function HorizonLight() {
  const geo = useMemo(() => new THREE.PlaneGeometry(1920, 1080), []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {},

        vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,

        fragmentShader: `
        varying vec2 vUv;

        void main(){
          // 태양 중심 및 크기 (aspect ratio 보정으로 정원)
          float aspect = 1920.0 / 1080.0;
          float dx = (vUv.x - 0.5) * aspect / 0.10;
          float dy = (vUv.y - 0.55) / 0.10;
          float dist = sqrt(dx*dx + dy*dy);

          // 선명한 원 disc 경계
          float disc = smoothstep(1.02, 0.96, dist);

          // 검은 가로줄: 중심(0.55) 아래에만, 균일 간격, 얇게
          float stripePos = clamp((0.58 - vUv.y) / 0.10, 0.0, 1.0); // 0=시작, 1=하단
          float stripeThresh = mix(0.08, 0.9, stripePos); // 상단=두껍게, 하단=얇게
          float stripe = step(stripeThresh, mod(vUv.y * 80.0, 1.0));
          float stripeMask = 1.0 - smoothstep(0.56, 0.58, vUv.y); // 시작점 아래=1, 위=0
          float face = disc * mix(1.0, stripe, stripeMask);

          // 노랑 → 주황 그라데이션 (상→하)
          float t = clamp((vUv.y - 0.544) / 0.096, 0.0, 1.0);
          vec3 colTop = vec3(1.0, 0.96, 0.40);   // 노랑+화이트
          vec3 colBot = vec3(0.95, 0.30, 0.05);  // 주황 채도 -10%
          vec3 sunCol = mix(colBot, colTop, t);

          // 얇은 네온 외곽 글로우
          float halo = smoothstep(1.2, 1.0, dist) * (1.0 - disc);
          halo = pow(halo, 2.5);
          vec3 haloCol = vec3(0.90, 0.08, 0.08);

          vec3 finalCol = sunCol * face + haloCol * halo * 0.49;
          float alpha = face + halo * 0.315;

          gl_FragColor = vec4(finalCol, alpha);
        }
      `,
      }),
    [],
  );

  return <mesh geometry={geo} material={mat} position={[0, 12, -320]} />;
}
