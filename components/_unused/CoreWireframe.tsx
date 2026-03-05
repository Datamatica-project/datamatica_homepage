"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { IcosahedronGeometry, EdgesGeometry, Group } from "three";

// 와이어프레임 반지름은 코어보다 커야 선이 잘리지 않음
// 정20면체 엣지 중간 지점 구심 거리 = WIRE_RADIUS × 0.851
// WIRE_RADIUS × 0.851 > CORE_RADIUS → WIRE_RADIUS > 2.35
const CORE_RADIUS = 2;
const WIRE_RADIUS = 2.5; // 엣지 중간 최소 거리 ≈ 2.13 > CORE_RADIUS

export default function CoreWireframe() {
  const groupRef = useRef<Group>(null);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef({ ry: 0, rx: 0 }); // 관성 속도

  const { edgesGeo, vertices } = useMemo(() => {
    const base = new IcosahedronGeometry(WIRE_RADIUS, 0);
    const edgesGeo = new EdgesGeometry(base);

    const posAttr = base.getAttribute("position");
    const vertexMap = new Map<string, [number, number, number]>();
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
      vertexMap.set(key, [x, y, z]);
    }

    base.dispose();
    return { edgesGeo, vertices: Array.from(vertexMap.values()) };
  }, []);

  // 드래그 중 mousemove/mouseup은 window에서 처리 (마우스가 코어 밖으로 나가도 유지)
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !groupRef.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      groupRef.current.rotation.y += dx * 0.005;
      groupRef.current.rotation.x += dy * 0.005;
      velocity.current = { ry: dx * 0.005, rx: dy * 0.005 }; // 마지막 속도 기록
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      // velocity는 유지 → useFrame에서 관성 처리
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current || isDragging.current) return;

    const speed = Math.abs(velocity.current.ry) + Math.abs(velocity.current.rx);

    if (speed > 0.0001) {
      // 관성 적용 후 감쇠
      groupRef.current.rotation.y += velocity.current.ry;
      groupRef.current.rotation.x += velocity.current.rx;
      velocity.current.ry *= 0.92;
      velocity.current.rx *= 0.92;
    } else {
      // 관성 소진 → 자동 회전 재개
      velocity.current = { ry: 0, rx: 0 };
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 솔리드 코어 — 포인터 이벤트 + depth buffer 기록 */}
      <mesh
        castShadow
        onPointerDown={(e) => {
          e.stopPropagation();
          isDragging.current = true;
          velocity.current = { ry: 0, rx: 0 }; // 이전 관성 초기화
          lastPointer.current = { x: e.clientX, y: e.clientY };
          document.body.style.cursor = "grabbing";
        }}
        onPointerOver={() => {
          if (!isDragging.current) document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          if (!isDragging.current) document.body.style.cursor = "";
        }}
      >
        <icosahedronGeometry args={[CORE_RADIUS, 0]} />
        <meshStandardMaterial
          color="#e8ebef"
          roughness={0.55}
          metalness={0.25}
        />
      </mesh>

      {/* 와이어프레임 엣지 — 코어보다 크므로 선이 잘리지 않음 */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#7a7d80" transparent opacity={0.7} />
      </lineSegments>

      {/* 꼭짓점 원 */}
      {vertices.map((pos, i) => (
        <Billboard key={i} position={pos}>
          <mesh>
            <circleGeometry args={[0.07, 32]} />
            <meshBasicMaterial color="#6c6c6c" />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}
