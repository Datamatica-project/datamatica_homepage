import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "DataMatica",
  description:
    "수집부터 분석, 시각화, 자동화까지 데이터를 가치로 전환하는 DataMatica. 자율주행, 공간정보, AI 데이터 전문 기업입니다.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DataMatica — 데이터로 설계하는 기술",
    description:
      "수집부터 분석, 시각화, 자동화까지 데이터를 가치로 전환하는 DataMatica. 자율주행, 공간정보, AI 데이터 전문 기업입니다.",
    url: "/",
  },
};

export default function Home() {
  return <HomeClient />;
}
