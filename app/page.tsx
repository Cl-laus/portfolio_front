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
      <div className="loading-screen">
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

      <section className="projects-section">
        {/* Section header */}
        <div className="section-head">
          <span>Selected Work</span>
          <span className="head-line" />
          <span className="head-count">
            {String(projects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Featured project */}
        {featured && <FeaturedProject project={featured} />}

        {/* Thin dividers + closed projects */}
        {closed.map((project, i) => (
          <div key={project.id}>
            <div className="project-divider" />
            <ClosedProject
              project={project}
              index={String(i + 2).padStart(2, "0")}
              meta={closedMeta(project)}
            />
          </div>
        ))}
      </section>

      <footer className="portfolio-footer">
        <span>© 2026 Lucas Luisetti</span>
      </footer>
    </>
  );
}
