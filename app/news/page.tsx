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
        description="DataMatica의 소식 및 뉴스를 제공합니다."
        watermark="Company News"
      />
      <NewsGrid />
      <Footer />
    </main>
  );
}
