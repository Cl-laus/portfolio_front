"use client";

import { useEffect, useRef, useState } from "react";
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

  // Index de la card active sur mobile (-1 = aucune)
  // 0 = FeaturedProject, 1 = ClosedProject[0], 2 = ClosedProject[1]
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  // Animation séquentielle sur mobile uniquement
  // FeaturedProject → ClosedProject 1 → ClosedProject 2 → pause 5s → boucle
  useEffect(() => {
    if (!projects.length) return;

    // Ne tourne que sur mobile (écran < 960px — même breakpoint que le CSS)
    const isMobile = window.matchMedia("(max-width: 959px)").matches;
    if (!isMobile) return;

    const STEP_DURATION  = 1000; // 1s par card
    const PAUSE_DURATION = 5000; // 5s de pause entre les cycles
    const ITEM_COUNT     = projects.length; // 3 projets

    let cancelled = false;
    let step = 0;

    const run = () => {
      if (cancelled) return;

      setRevealedIndex(step); // active la card courante

      timerRef.current = setTimeout(() => {
        if (cancelled) return;
        step++;

        if (step < ITEM_COUNT) {
          // Passe à la card suivante
          run();
        } else {
          // Fin du cycle → tout éteindre, puis pause 5s
          setRevealedIndex(-1);
          timerRef.current = setTimeout(() => {
            if (cancelled) return;
            step = 0;
            run(); // recommence depuis le début
          }, PAUSE_DURATION);
        }
      }, STEP_DURATION);
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
      setRevealedIndex(-1);
    };
  }, [projects.length]);

  if (loading || !info) return <LoadingSpinner />;

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

      <section className={`${styles.projectsSection} pt-16 px-20 pb-16 mr-10`}>
        <div className={`${styles.sectionHead} flex items-center gap-4 mb-24`}>
          <span className={styles.sectionTitle}>Réalisations</span>
          <span className={`${styles.headLine} flex-1 h-px`} />
          <span className={styles.headCount}>
            {String(projects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {featured && (
          <FeaturedProject
            project={featured}
            isRevealed={revealedIndex === 0}
          />
        )}

        {closed.map((project, i) => (
          <div key={project.id}>
            <div className={`${styles.projectDivider} my-24 h-px`} />
            <ClosedProject
              project={project}
              index={String(i + 2).padStart(2, "0")}
              meta={closedMeta(project)}
              isRevealed={revealedIndex === i + 1}
            />
          </div>
        ))}
      </section>

      <Footer />
    </>
  );
}
