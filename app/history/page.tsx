import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HistoryTimeline from "@/components/history/HistoryTimeline";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import { historyTimeline } from "@/data/history";
import React from "react";

export const metadata: Metadata = {
  title: "회사 연혁",
  description:
    "DataMatica의 회사 연혁을 소개합니다. 국내외 주요 기관과의 협력을 통해 데이터 기술 역량을 축적하며 자율주행과 공간정보 산업의 혁신을 이어가고 있습니다.",
  alternates: { canonical: "/history" },
  openGraph: {
    title: "회사 연혁 | DataMatica",
    description:
      "DataMatica의 회사 연혁을 소개합니다. 국내외 주요 기관과의 협력을 통해 데이터 기술 역량을 축적하며 자율주행과 공간정보 산업의 혁신을 이어가고 있습니다.",
    url: "/history",
  },
};

export default function page() {
  return (
    <main className="bg-[#F6F7F9] dark:bg-[#1c1c1e]">
      <Header
        breadcrumbLabel="회사연혁"
        title="회사 연혁"
        description={
          <>데이터 기술로 자율주행·공간정보 산업의 혁신을 추구합니다.</>
        }
        watermark="Company History"
      />
      <HistoryTimeline timeline={historyTimeline} />
      <ScrollToTopButton />
      <Footer />
    </main>
  );
}
