import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsGrid from "@/components/news/NewsGrid";
import React from "react";

export const metadata: Metadata = {
  title: "소식 / 뉴스",
  description:
    "DataMatica의 최신 소식과 뉴스를 확인하세요. 자율주행, 공간정보, AI 데이터 분야의 업계 동향과 회사 소식을 제공합니다.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "소식 / 뉴스 | DataMatica",
    description:
      "DataMatica의 최신 소식과 뉴스를 확인하세요. 자율주행, 공간정보, AI 데이터 분야의 업계 동향과 회사 소식을 제공합니다.",
    url: "/news",
  },
};

export default function page() {
  return (
    <main className="bg-[#F6F7F9] dark:bg-[#1c1c1e]">
      <Header
        breadcrumbLabel="소식 / 뉴스"
        title="소식 / 뉴스"
        description="DataMatica의 소식 및 뉴스를 제공합니다."
        watermark="Company News"
      />
      <NewsGrid />
      <Footer />
    </main>
  );
}
