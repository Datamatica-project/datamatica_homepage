"use client";

import { useState, useMemo } from "react";
import NewsCard_main from "@/components/common/NewsCard_main";
import { newsArticles } from "@/data/news";

const YEARS = [...new Set(newsArticles.map((n) => n.year))].sort(
  (a, b) => b - a
);
const PER_PAGE = 9;

type SortOrder = "newest" | "oldest";

export default function NewsGrid() {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = activeYear
      ? newsArticles.filter((n) => n.year === activeYear)
      : [...newsArticles];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) =>
      sortOrder === "newest"
        ? b.id.localeCompare(a.id)
        : a.id.localeCompare(b.id)
    );

    return result;
  }, [activeYear, query, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleYearChange = (year: number | null) => {
    setActiveYear((prev) => (year !== null && prev === year ? null : year));
    setPage(1);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
    setPage(1);
  };

  const selectCls =
    "h-[42px] px-[12px] pr-[28px] rounded-[8px] border border-[#d8d8d8] dark:border-[#3a3a3a] bg-white dark:bg-[#1a1a1b] text-[13px] text-normal-text outline-none focus:border-main transition-colors cursor-pointer shrink-0 appearance-none";
  const selectArrow = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3E%3Cpath fill='%23888' d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  };

  return (
    <section className="max-w-[1000px] mx-auto px-[24px] pb-[80px] md:pb-[120px]">

      {/* 필터 바: 연도(좌) + 검색·정렬(우) 한 줄 */}
      <div className="flex items-center justify-between gap-[8px] mb-[36px] md:mb-[48px]">
        {/* 좌: 연도 드롭다운 */}
        <select
          value={activeYear ?? ""}
          onChange={(e) =>
            handleYearChange(e.target.value ? Number(e.target.value) : null)
          }
          className={selectCls}
          style={selectArrow}
        >
          <option value="">전체 연도</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>

        {/* 우: 검색창 + 정렬 드롭다운 */}
        <div className="flex gap-[8px]">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="기사 검색"
            className="w-[180px] md:w-[240px] h-[42px] px-[14px] rounded-[8px] border border-[#d8d8d8] dark:border-[#3a3a3a] bg-white dark:bg-[#1a1a1b] text-[14px] text-normal-text placeholder:text-description outline-none focus:border-main transition-colors"
          />
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value as SortOrder)}
            className={selectCls}
            style={selectArrow}
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>

      {/* 뉴스 그리드 */}
      {paginated.length === 0 ? (
        <p className="text-description text-[15px] py-[60px] text-center">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[8px] gap-x-[8px] list-none">
          {paginated.map((news) => (
            <li key={news.id} className="flex">
              <NewsCard_main
                date={news.date}
                title={news.title}
                description={news.description}
                image={news.thumbnail}
                href={news.source}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-[6px] mt-[48px]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-[36px] h-[36px] rounded-[8px] border border-[#d8d8d8] dark:border-[#3a3a3a] flex items-center justify-center text-description transition-colors hover:text-normal-text disabled:opacity-30 disabled:cursor-default cursor-pointer"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-[36px] h-[36px] rounded-[8px] border text-[14px] font-medium transition-all cursor-pointer ${
                page === p
                  ? "bg-main text-white border-main"
                  : "border-[#d8d8d8] dark:border-[#3a3a3a] text-description hover:text-normal-text"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-[36px] h-[36px] rounded-[8px] border border-[#d8d8d8] dark:border-[#3a3a3a] flex items-center justify-center text-description transition-colors hover:text-normal-text disabled:opacity-30 disabled:cursor-default cursor-pointer"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
