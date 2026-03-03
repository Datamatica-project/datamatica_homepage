"use client";

import dynamic from "next/dynamic";

const VehicleScrollSection = dynamic(
  () => import("@/components/VehicleScrollSection"),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <VehicleScrollSection />
      {/* Additional sections can be added below */}
      <section className="h-screen bg-white flex items-center justify-center">
        <p className="text-2xl text-gray-500">Next Section</p>
      </section>
    </main>
  );
}
