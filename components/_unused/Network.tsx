"use client";

import { useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3, BufferGeometry, BufferAttribute, Group } from "three";

const NODE_COUNT = 40;
const CONNECTION_DISTANCE = 100;
const MAX_CONNECTIONS_PER_NODE = 3;
const SPREAD = { x: 3.5, y: 2.5, z: 2 };

function getDepthOpacity(z: number) {
  const depthFactor = (z + SPREAD.z) / (SPREAD.z * 2);
  return 0.1 + depthFactor * 0.2;
}

interface NodeData {
  initial: Vector3;
  freq: { x: number; y: number; z: number };
  phase: { x: number; y: number; z: number };
  amp: number;
  highlighted: boolean;
}

export default function Network() {
  const nodeGroupRefs = useRef<(Group | null)[]>([]);
  const currentPositions = useRef<Vector3[]>([]);

  const nodes = useMemo<NodeData[]>(() => {
    const result = Array.from({ length: NODE_COUNT }, () => ({
      initial: new Vector3(
        (Math.random() - 0.5) * SPREAD.x * 2,
        (Math.random() - 0.5) * SPREAD.y * 2,
        (Math.random() - 0.5) * SPREAD.z * 2,
      ),
      freq: {
        x: 0.1 + Math.random() * 0.15,
        y: 0.1 + Math.random() * 0.15,
        z: 0.05 + Math.random() * 0.1,
      },
      phase: {
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
      },
      amp: 0.2 + Math.random() * 0.4,
      highlighted: Math.random() > 0.7,
    }));
    currentPositions.current = result.map((n) => n.initial.clone());
    return result;
  }, []);

  // 초기 위치 기준으로 연결 쌍 고정 (노드당 최대 MAX_CONNECTIONS_PER_NODE개)
  const connections = useMemo(() => {
    const connectionCount = new Array(nodes.length).fill(0);
    const pairSet = new Set<string>();

    // 모든 후보 쌍을 거리 순으로 정렬
    const candidates: { i: number; j: number; dist: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].initial.distanceTo(nodes[j].initial);
        if (dist < CONNECTION_DISTANCE) {
          candidates.push({ i, j, dist });
        }
      }
    }
    candidates.sort((a, b) => a.dist - b.dist);

    // 가까운 쌍부터 양쪽 노드 모두 한도 미만일 때만 연결
    for (const { i, j } of candidates) {
      if (
        connectionCount[i] < MAX_CONNECTIONS_PER_NODE &&
        connectionCount[j] < MAX_CONNECTIONS_PER_NODE
      ) {
        pairSet.add(`${i}-${j}`);
        connectionCount[i]++;
        connectionCount[j]++;
      }
    }

    return Array.from(pairSet).map((key) => {
      const [i, j] = key.split("-").map(Number);
      return [i, j] as [number, number];
    });
  }, [nodes]);

  // 선 geometry: 매 프레임 position buffer만 갱신
  const lineGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(connections.length * 6), 3),
    );
    return geo;
  }, [connections]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 노드 위치 업데이트
    nodes.forEach((node, i) => {
      const pos = currentPositions.current[i];
      pos.set(
        node.initial.x + Math.sin(t * node.freq.x + node.phase.x) * node.amp,
        node.initial.y + Math.sin(t * node.freq.y + node.phase.y) * node.amp,
        node.initial.z +
          Math.sin(t * node.freq.z + node.phase.z) * node.amp * 0.5,
      );
      nodeGroupRefs.current[i]?.position.copy(pos);
    });

    // 선 geometry 갱신
    const arr = lineGeo.attributes.position.array as Float32Array;
    connections.forEach(([i, j], idx) => {
      const a = currentPositions.current[i];
      const b = currentPositions.current[j];
      arr[idx * 6 + 0] = a.x;
      arr[idx * 6 + 1] = a.y;
      arr[idx * 6 + 2] = a.z;
      arr[idx * 6 + 3] = b.x;
      arr[idx * 6 + 4] = b.y;
      arr[idx * 6 + 5] = b.z;
    });
    lineGeo.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[0, 0, 2]}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.15} />
      </lineSegments>

      {nodes.map((node, i) => {
        const depthOpacity = getDepthOpacity(node.initial.z);
        const opacity = node.highlighted
          ? 0.5 + ((node.initial.z + SPREAD.z) / (SPREAD.z * 2)) * 0.3
          : depthOpacity;
        return (
          <group
            key={i}
            ref={(el) => {
              nodeGroupRefs.current[i] = el;
            }}
            position={node.initial}
          >
            <Billboard>
              <mesh>
                <circleGeometry args={[0.04, 32]} />
                <meshBasicMaterial
                  color={node.highlighted ? "#64748b" : "#94a3b8"}
                  transparent
                  opacity={opacity}
                />
              </mesh>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
