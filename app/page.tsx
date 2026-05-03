"use client";

import { useEffect, useState } from "react";
import { projectService }     from "@/services/projectService";
import { informationService } from "@/services/informationService";
import { Project, Information } from "@/types";
import HeroSection     from "@/components/HeroSection";
import FeaturedProject from "@/components/FeaturedProject";
import ClosedProject   from "@/components/ClosedProject";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [info,     setInfo]     = useState<Information | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsData, infoData] = await Promise.all([
          projectService.getTop3(),
          informationService.get(),
        ]);
        setProjects(projectsData);
        setInfo(infoData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !info) {
    return (
      <div className="loading-screen fixed-overlay flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  const featured = projects[0];
  const closed   = projects.slice(1);

  const closedMeta = (p: Project) => {
    const year = p.createdAt ? new Date(p.createdAt).getFullYear() : "";
    const cat  = p.technologies?.[0]?.category || p.technologies?.[0]?.name || "Web";
    return year ? `${cat} · ${year}` : cat;
  };

  return (
    <>
      <HeroSection info={info} />

      <section className="projects-section pt-[12em] px-[5.5em] pb-[7em]">
        {/* Section header */}
        <div className="section-head flex items-center gap-[1em] mb-[5.5em]">
          <span className="section-title">Réalisations</span>
          <span className="head-line flex-1" />
          <span className="head-count">
            {String(projects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Featured project */}
        {featured && <FeaturedProject project={featured} />}

        {/* Thin dividers + closed projects */}
        {closed.map((project, i) => (
          <div key={project.id}>
            <div className="project-divider my-[5.5em]" />
            <ClosedProject
              project={project}
              index={String(i + 2).padStart(2, "0")}
              meta={closedMeta(project)}
            />
          </div>
        ))}
      </section>

      <footer className="portfolio-footer flex justify-center items-center py-[3.5em] px-[5.5em]">
        <span>© 2026 Lucas Luisetti</span>
      </footer>
    </>
  );
}
