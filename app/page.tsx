"use client";

import { useEffect, useState } from "react";
import { projectService }     from "@/services/projectService";
import { informationService } from "@/services/informationService";
import { ProjectSummary, Information } from "@/types";
import HeroSection     from "@/components/HeroSection";
import FeaturedProject from "@/components/FeaturedProject";
import ClosedProject   from "@/components/ClosedProject";
import LoadingSpinner  from "@/components/LoadingSpinner";
import Footer from "@/components/Footer";
import GlowSeparator from "@/components/GlowSeparator";
import styles from "./page.module.css";

export default function HomePage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
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
      <LoadingSpinner />
    );
  }

  const featured = projects[0];
  const closed   = projects.slice(1);

  const closedMeta = (p: ProjectSummary) => {
    const year = p.createdAt ? new Date(p.createdAt).getFullYear() : null;
    const cat  = p.technologies?.[0]?.category || null;
    return [cat, year].filter(Boolean).join(" · ");
  };

  return (
    <>
      <HeroSection info={info} />
      <GlowSeparator />

      <section className="pt-48 px-24 pb-28">
        <div className={`${styles.sectionHead} flex items-center gap-4 mb-24`}>
          <span className={styles.sectionTitle}>Réalisations</span>
          <span className={`${styles.headLine} flex-1 h-px`} />
          <span className={styles.headCount}>
            {String(projects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {featured && <FeaturedProject project={featured} />}

        {closed.map((project, i) => (
          <div key={project.id}>
            <div className={`${styles.projectDivider} my-24 h-px`} />
            <ClosedProject
              project={project}
              index={String(i + 2).padStart(2, "0")}
              meta={closedMeta(project)}
            />
          </div>
        ))}
      </section>

      <Footer />
    </>
  );
}
