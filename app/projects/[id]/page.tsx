"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { projectService } from "@/services/projectService";
import { technologyService } from "@/services/technologyService";
import { Project, Technology } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [project, setProject]       = useState<Project | null>(null);
  const [allTechs, setAllTechs]     = useState<Technology[]>([]);
  const [slide, setSlide]           = useState(0);

  useEffect(() => {
    Promise.all([
      projectService.getById(Number(id)),
      technologyService.getAll(),
    ]).then(([proj, techs]) => {
      setProject(proj);
      setAllTechs(techs);
    });
  }, [id]);

  // auto-advance carousel
  useEffect(() => {
    if (!project?.images?.length) return;
    const t = setInterval(
      () => setSlide((prev) => (prev + 1) % project.images.length),
      4500
    );
    return () => clearInterval(t);
  }, [project?.images?.length]);

  const goTo = (n: number) => {
    if (!project?.images?.length) return;
    setSlide((n + project.images.length) % project.images.length);
  };

  if (!project)
    return (
      <div className="loading-screen fixed-overlay flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );

  const { title, summary, description, links, images, createdAt } = project;
  const year     = createdAt ? new Date(createdAt).getFullYear() : null;

  // Résoudre les techs : le backend peut retourner des objets ou des IDs
  const techIds = (project.technologies ?? []).map((t) =>
    typeof t === "number" ? t : (t as Technology).id
  );
  const projectTechs = allTechs.filter((tech) => techIds.includes(tech.id));

  const topLabel = projectTechs[0]?.category || projectTechs[0]?.name || "Project";

  return (
    <main className="pd-page flex flex-col min-h-screen pt-[4.5em] px-[5.5em] pb-[3.5em]">

      {/* Top label */}
      <div className="feat-label-text label mb-[2em]">
        {topLabel}{year && ` · ${year}`}
      </div>

      {/* Main card: carousel left / content right */}
      <article className="pd-card grid [grid-template-columns:1.05fr_1fr] gap-[5em] items-stretch flex-1 min-h-0">

        {/* ── LEFT: image carousel ── */}
        <section className="pd-carousel" aria-label="Project screenshots">
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />

          {images.length > 0 ? (
            images.map((img, i) => (
              <div key={img.id} className={`pd-slide${i === slide ? " active" : ""}`}>
                <img className="img-cover" src={`${API_URL}${img.url}`} alt={`${title} — ${i + 1}`} />
              </div>
            ))
          ) : (
            <div className="pd-slide active" style={{ background: "rgba(245,241,234,0.04)" }} />
          )}

          {images.length > 1 && (
            <>
              <button
                className="pd-arrow-btn btn-circle prev inline-flex items-center justify-center"
                onClick={() => goTo(slide - 1)}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18 9 12l6-6" />
                </svg>
              </button>
              <button
                className="pd-arrow-btn btn-circle next inline-flex items-center justify-center"
                onClick={() => goTo(slide + 1)}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <div className="pd-dots flex gap-[0.5em]">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`pd-dot${i === slide ? " active" : ""}`}
                    onClick={() => setSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── RIGHT: text content ── */}
        <section className="pd-content flex flex-col justify-between py-[0.5em]">
          <div className="pd-content-top">
            <h1 className="mb-[0.38em]">{title}</h1>
            {summary && <p>{summary}</p>}
            {description && description !== summary && (
              <p className="mt-[1em]">{description}</p>
            )}
          </div>

          <div className="pd-meta-row flex justify-between items-start mt-[3em] pt-[1.6em] gap-[2em]">

            {/* Tech stack */}
            {projectTechs.length > 0 && (
              <div className="flex flex-col">
                <div className="pd-meta-label label mb-[1.3em]">Built with</div>
                <div className="flex flex-wrap gap-[0.6em] items-center">
                  {projectTechs.map((tech) => (
                    <span
                      key={tech.id}
                      className="pd-tech-chip inline-flex items-center px-[0.85em] py-[0.5em]"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External links */}
            {links && Object.keys(links).length > 0 && (
              <div className="flex flex-col items-end">
                <div className="pd-meta-label label mb-[1.3em]">Links</div>
                <div className="flex gap-[0.7em]">
                  {Object.entries(links).map(([key, url]) => (
                    <a
                      key={key}
                      className="pd-link-btn btn-circle inline-flex items-center justify-center"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                    >
                      {key.toLowerCase().includes("github") ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 2-.4 3-.4s2 .1 3 .4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.8-5.8 7.8-10.9C23.5 5.7 18.3.5 12 .5z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <path d="M15 3h6v6" />
                          <path d="m10 14 11-11" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </article>

      {/* Back to home */}
      <Link
        className="pd-back-link label inline-flex items-center gap-[0.6em] mt-[3.5em] self-center"
        href="/"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span>Back to home</span>
      </Link>

    </main>
  );
}
