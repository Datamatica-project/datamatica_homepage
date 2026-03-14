import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BusinessContent from "@/components/business/BusinessContent";

export const metadata: Metadata = {
  title: "사업 분야",
  description:
    "DataMatica의 핵심 사업 분야를 소개합니다. 자율주행, 공간정보, AI 데이터 수집부터 분석·시각화·자동화까지 데이터 기반 기술을 제공합니다.",
  alternates: { canonical: "/business" },
  openGraph: {
    title: "사업 분야 | DataMatica",
    description:
      "DataMatica의 핵심 사업 분야를 소개합니다. 자율주행, 공간정보, AI 데이터 수집부터 분석·시각화·자동화까지 데이터 기반 기술을 제공합니다.",
    url: "/business",
  },
};

export default function page() {
  return (
    <main className="bg-[#F6F7F9] dark:bg-[#1c1c1e]">
      <Header
        breadcrumbLabel="사업 분야"
        title="사업 분야"
        description="데이터 기반 기술을 통해 다양한 산업 문제를 해결합니다."
        watermark="Business"
      />
      <Suspense>
        <BusinessContent />
      </Suspense>
      <Footer />
    </main>
  );
}
