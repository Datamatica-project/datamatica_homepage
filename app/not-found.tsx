import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import GnbWrapper from "@/components/GnbWrapper";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청하신 페이지를 찾을 수 없습니다.",
};

export default function NotFound() {
  return (
    <>
      <GnbWrapper />
      <main className="bg-[#F6F7F9] dark:bg-[#1c1c1e] min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-[24px] py-[120px] text-center">
          <p className="text-[80px] md:text-[120px] font-bold leading-none text-main/15 select-none">
            404
          </p>
          <h1 className="mt-[-8px] text-[24px] md:text-[32px] font-semibold text-normal-text tracking-[-0.02em]">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="mt-[16px] text-[14px] md:text-[16px] text-description leading-[1.8] max-w-[400px]">
            요청하신 페이지가 존재하지 않거나
            <br />
            이동 또는 삭제되었을 수 있습니다.
          </p>
          <Link
            href="/"
            className="mt-[40px] inline-flex items-center gap-[8px] px-[28px] py-[14px] rounded-full bg-main text-white text-[14px] font-medium hover:bg-main/85 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
        <Footer />
      </main>
    </>
  );
}
