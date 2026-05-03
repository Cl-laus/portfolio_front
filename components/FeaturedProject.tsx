"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types";

interface FeaturedProjectProps {
  project: Project;
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const router = useRouter();
  const image  = project.images?.[0];
  const year   = project.createdAt ? new Date(project.createdAt).getFullYear() : "2025";
  const techs  = project.technologies?.slice(0, 2).map(t => t.name).join(" · ") || "Web";
  const meta   = `${techs} · ${year}`;

  return (
    <a
      className="featured"
      href={`/projects/${project.id}`}
      onClick={(e) => { e.preventDefault(); router.push(`/projects/${project.id}`); }}
    >
      <div className="feat-label-top inline-flex items-center gap-[0.85em] mb-[1.6em]">
        <div className="feat-hairline" />
        <span className="feat-label-text label">En une</span>
      </div>

      <div className="title-row flex items-baseline gap-[1.6em]">
        <span className="closed-index pt-[0.7em] self-start">01 /</span>
        <h2 className="closed-title inline-block m-0">
          {project.title}
        </h2>
        <span className="closed-meta label pt-[0.85em] self-start">{meta}</span>
      </div>

      <div className="feat-detail grid grid-cols-2 gap-[5.5em] items-stretch mt-[4em] pl-[5em]">
        <div className="featured-left">
          <p className="feat-desc">{project.summary}</p>

          <div className="feat-meta label mt-[1.5em] flex gap-[0.85em] items-center">
            {project.technologies?.slice(0, 3).map((tech, i) => (
              <span key={tech.id} className="contents">
                {i > 0 && <span className="meta-dot w-[0.18em] h-[0.18em] shrink-0 inline-block" />}
                <span>{tech.name}</span>
              </span>
            ))}
            {project.technologies?.length > 0 && (
              <>
                <span className="meta-dot w-[0.18em] h-[0.18em] shrink-0 inline-block" />
                <span>{year}</span>
              </>
            )}
          </div>

          <div className="mt-auto self-end flex items-center gap-[1.5em] pb-[2em] pr-[2.5em]">
            <span className="feat-cta-label label">Voir détail du projet</span>
            <button className="feat-cta btn-circle w-[6em] h-[6em] inline-flex items-center justify-center" aria-label="Open project">
              <ArrowUpRight size={24} />
            </button>
          </div>
        </div>

        <div className="featured-right">
          <div className="feat-image-wrap w-full">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />

            {image ? (
              <img className="feat-image img-cover" src={image.url} alt={project.title} />
            ) : (
              <div className="feat-image img-cover" style={{ background: "rgba(245,241,234,0.04)" }} />
            )}

          </div>
        </div>
      </div>
    </a>
  );
}
