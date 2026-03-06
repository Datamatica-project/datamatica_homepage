import React from "react";

export default function SectionTitle({
  subtitle,
  title,
  description,
  center = false,
}: {
  subtitle: string;
  title: React.ReactNode;
  description: React.ReactNode;
  center?: boolean;
}) {
  const subtitleBase = "text-[20px] text-description font-normal";
  const titleBase = "text-[40px] font-medium text-normal-text";
  const descriptionBase = "text-[18px] text-description";

  const alignClass = center ? "text-center" : "";

  return (
    <div>
      <span
        className={`${subtitleBase} ${alignClass} ${center ? "block" : ""}`}
      >
        {subtitle}
      </span>
      <h2 className={`${titleBase} ${alignClass}`}>{title}</h2>
      <p className={`${descriptionBase} ${alignClass}`}>{description}</p>
    </div>
  );
}
