import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsGrid from "@/components/news/NewsGrid";
import React from "react";

export default function page() {
  return (
    <main className="bg-[#F6F7F9] dark:bg-[#111113]">
      <Header
        breadcrumbLabel="소식 / 뉴스"
        title="소식 / 뉴스"
        description="국내외 주요 기관 및 기업과의 협업 성과와 데이터 기반 산업 혁신 사례를 전합니다."
        watermark="Company News"
      />
      <NewsGrid />
      <Footer />
    </main>
  );
}
