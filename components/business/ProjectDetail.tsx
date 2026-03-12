import React from "react";
import Image from "next/image";
import Link from "next/link";
import { skillData, type SkillDataItem, type ProjectItem } from "@/data";
import { ArrowRightCircle } from "@/components/Icons";

const FALLBACK_IMAGE = "/header/datamatica_logo.png";

function RelatedCard({
  skillId,
  project,
}: {
  skillId: string;
  project: ProjectItem;
}) {
  return (
    <Link
      href={`/business/${skillId}/${project.id}`}
      className="group rounded-[16px] overflow-hidden border border-[#e8e8e8] dark:border-[#3c3c3e] bg-white dark:bg-[#282829] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col transition-all duration-300 hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
    >
      <div className="relative w-full aspect-16/10 overflow-hidden bg-[#f0f0f0] dark:bg-[#323234]">
        <Image
          src={project.image || FALLBACK_IMAGE}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1 p-[20px]">
        <h4 className="text-[15px] font-bold text-normal-text leading-[1.4]">
          {project.title}
        </h4>
        <p className="mt-[8px] text-[13px] leading-[1.6] text-description line-clamp-2">
          {project.description}
        </p>
        <span className="mt-[16px] inline-flex items-center gap-[6px] text-[13px] font-medium text-main">
          <ArrowRightCircle size={20} />
          자세히보기
        </span>
      </div>
    </Link>
  );
}

export default function ProjectDetail({
  skill,
  project,
}: {
  skill: SkillDataItem;
  project: ProjectItem;
}) {
  const related = skill.projects.filter((p) => p.id !== project.id);

  return (
    <div className="max-w-[1000px] mx-auto px-[24px] pb-[80px] md:pb-[120px]">

      {/* 대표 이미지 */}
      <div className="relative w-full aspect-16/7 rounded-[20px] overflow-hidden bg-[#f0f0f0] dark:bg-[#282829] mb-[56px] md:mb-[72px]">
        <Image
          src={project.image || FALLBACK_IMAGE}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* 프로젝트 개요 */}
      <section className="mb-[60px] md:mb-[80px]">
        <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-main mb-[12px]">
          Project Overview
        </p>
        <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.3] tracking-[-0.02em] text-normal-text mb-[20px]">
          {project.title}
        </h2>
        <p className="text-[15px] md:text-[16px] leading-[1.9] text-description max-w-[720px]">
          {project.overview}
        </p>

        {/* 적용 분야 */}
        <div className="mt-[32px] inline-flex items-center gap-[12px] px-[20px] py-[14px] rounded-[12px] bg-[#fdf5f5] dark:bg-[#2a1a1a] border border-main/20">
          <span className="text-[13px] text-description font-medium">적용 분야</span>
          <span className="text-[14px] font-semibold text-main">{skill.title}</span>
        </div>
      </section>

      {/* 핵심 기술 */}
      <section className="mb-[60px] md:mb-[80px]">
        <h3 className="text-[20px] md:text-[24px] font-semibold text-normal-text mb-[24px]">
          핵심 기술
        </h3>
        <div className="flex flex-wrap gap-[10px]">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-[16px] py-[8px] rounded-full text-[13px] font-medium bg-white dark:bg-[#282829] border border-[#e0e0e0] dark:border-[#3c3c3e] text-normal-text"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 프로젝트 결과 */}
      <section className="mb-[60px] md:mb-[80px]">
        <h3 className="text-[20px] md:text-[24px] font-semibold text-normal-text mb-[24px]">
          프로젝트 성과
        </h3>
        <ul className="flex flex-col gap-[12px] list-none">
          {project.results.map((result, i) => (
            <li
              key={i}
              className="flex items-start gap-[14px] p-[20px] rounded-[14px] bg-white dark:bg-[#282829] border border-[#e8e8e8] dark:border-[#3c3c3e]"
            >
              <span className="shrink-0 w-[28px] h-[28px] rounded-full bg-main/10 text-main text-[13px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-[15px] leading-[1.6] text-normal-text pt-[2px]">
                {result}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 이미지 갤러리 */}
      {project.images.length > 0 && (
        <section className="mb-[60px] md:mb-[80px]">
          <h3 className="text-[20px] md:text-[24px] font-semibold text-normal-text mb-[24px]">
            프로젝트 이미지
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {project.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-16/10 rounded-[14px] overflow-hidden bg-[#f0f0f0] dark:bg-[#282829]"
              >
                <Image
                  src={img || FALLBACK_IMAGE}
                  alt={`${project.title} 이미지 ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 관련 프로젝트 */}
      {related.length > 0 && (
        <section>
          <h3 className="text-[20px] md:text-[24px] font-semibold text-normal-text mb-[24px]">
            관련 프로젝트
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] list-none">
            {related.map((p) => (
              <li key={p.id}>
                <RelatedCard skillId={skill.id} project={p} />
              </li>
            ))}
          </ul>

          <div className="mt-[40px] text-center">
            <Link
              href="/business"
              className="inline-flex items-center gap-[8px] px-[24px] py-[12px] rounded-full border border-[#d0d0d0] dark:border-[#434345] text-[14px] font-medium text-normal-text hover:border-main hover:text-main transition-colors"
            >
              ← 사업 분야 전체보기
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
