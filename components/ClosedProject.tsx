"use client";

import { useRouter } from "next/navigation";
import { Project } from "@/types";

interface ClosedProjectProps {
  project: Project;
  index: string;
  meta?: string;
}

export default function ClosedProject({ project, index, meta }: ClosedProjectProps) {
  const router = useRouter();

  return (
    <div
      className="closed"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <span className="closed-index">{index} /</span>
      <h2 className="closed-title">
        {project.title}
        <span className="title-underline" />
      </h2>

      {meta && <span className="closed-meta">{meta}</span>}
    </div>
  );
}
