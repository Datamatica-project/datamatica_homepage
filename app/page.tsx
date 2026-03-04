"use client";

import dynamic from "next/dynamic";
const Terrain = dynamic(() => import("@/components/Terrain"), { ssr: false });

const VehicleScrollSection = dynamic(
  () => import("@/components/VehicleScrollSection"),
  { ssr: false },
);

export default function Home() {
  return (
    <main>
      <section className="relative" style={{ height: "600vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <Terrain />
        </div>
      </section>
    </main>
  );
}
