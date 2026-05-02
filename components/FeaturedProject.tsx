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
      {/* feat-label-top: hairline + "Featured" label */}
      <div className="feat-label-top">
        <div className="feat-hairline" />
        <span className="feat-label-text">Featured</span>
      </div>

      {/* title-row: index + title + meta (same pattern as closed projects) */}
      <div className="title-row">
        <span className="closed-index">01 /</span>
        <h2 className="closed-title">
          {project.title}
        </h2>
        <span className="closed-meta">{meta}</span>
      </div>

      {/* feat-detail: description + CTA left, image right */}
      <div className="feat-detail">
        <div className="featured-left">
          <p className="feat-desc">{project.summary}</p>

          <div className="feat-meta">
            {project.technologies?.slice(0, 3).map((tech, i) => (
              <span key={tech.id} className="meta-item">
                {i > 0 && <span className="meta-dot" />}
                <span>{tech.name}</span>
              </span>
            ))}
            {project.technologies?.length > 0 && (
              <>
                <span className="meta-dot" />
                <span>{year}</span>
              </>
            )}
          </div>

          <button className="feat-cta" aria-label="Open project">
            <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="featured-right">
          <div className="feat-image-wrap">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />

            {image ? (
              <img
                className="feat-image"
                src={image.url}
                alt={project.title}
              />
            ) : (
              <div className="feat-image" style={{ background: "rgba(245,241,234,0.04)" }} />
            )}

            <span className="feat-index mono">— 01</span>
          </div>
        </div>
      </div>
    </a>
  );
}
