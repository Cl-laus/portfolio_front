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
      className="closed flex items-baseline gap-[1.6em]"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <span className="closed-index pt-[0.7em] self-start">{index} /</span>
      <h2 className="closed-title inline-block m-0">
        {project.title}
      </h2>
      {meta && <span className="closed-meta pt-[0.85em] self-start">{meta}</span>}
    </div>
  );
}
