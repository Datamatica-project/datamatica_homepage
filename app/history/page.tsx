import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HistoryTimeline from "@/components/history/HistoryTimeline";
import { historyTimeline } from "@/data/history";
import React from "react";

export default function page() {
  return (
    <main className="bg-[#F6F7F9] dark:bg-[#1c1c1e]">
      <Header
        breadcrumbLabel="회사연혁"
        title="회사 연혁"
        description={
          <>
            국내외 주요 기관과의 협력을 통해 데이터 기술 역량을 축적해왔으며,
            <br />
            자율주행과 공간정보 산업에서 지속 가능한 혁신을 실현하고 있습니다.
          </>
        }
        watermark="Company History"
      />
      <HistoryTimeline timeline={historyTimeline} />
      <Footer />
    </main>
  );
}
