import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BusinessContent from "@/components/business/BusinessContent";

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
