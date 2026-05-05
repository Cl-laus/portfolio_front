"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
      className="closed flex items-center justify-between gap-6"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <div className="flex items-baseline gap-6">
        <span className="closed-index pt-3 self-start">{index} /</span>
        <h2 className="closed-title inline-block m-0">
          {project.title}
        </h2>
        {meta && <span className="closed-meta label pt-3 self-start">{meta}</span>}
      </div>
      <button className="feat-cta btn-circle w-24 h-24 inline-flex items-center justify-center shrink-0" aria-label="Open project">
        <ArrowUpRight size={24} />
      </button>
    </div>
  );
}
