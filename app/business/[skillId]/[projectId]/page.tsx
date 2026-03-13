import { notFound } from "next/navigation";
import { skillData } from "@/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProjectDetail from "@/components/business/ProjectDetail";

export function generateStaticParams() {
  return skillData.flatMap((skill) =>
    skill.projects.map((project) => ({
      skillId: skill.id,
      projectId: project.id,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ skillId: string; projectId: string }>;
}) {
  const { skillId, projectId } = await params;
  const skill = skillData.find((s) => s.id === skillId);
  const project = skill?.projects.find((p) => p.id === projectId);
  if (!skill || !project) return {};
  return {
    title: `${project.title} | ${skill.title} | DataMatica`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ skillId: string; projectId: string }>;
}) {
  const { skillId, projectId } = await params;
  const skill = skillData.find((s) => s.id === skillId);
  const project = skill?.projects.find((p) => p.id === projectId);

  if (!skill || !project) notFound();

  return (
    <main className="bg-[#F6F7F9] dark:bg-[#1c1c1e]">
      <Header
        breadcrumbLabel={`사업 분야 / ${skill.title}`}
        title={project.title}
        description={project.description}
        watermark={skill.titleEn}
      />
      <ProjectDetail skill={skill} project={project} />
      <Footer />
    </main>
  );
}
