"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { projectService } from "@/services/projectService";
import { technologyService } from "@/services/technologyService";
import { Project, Technology } from "@/types";
import ProjectCarousel from "@/components/ProjectCarousel";
import CircleButton from "@/components/CircleButton";
import TechChip from "@/components/TechChip";
import LoadingSpinner from "@/components/LoadingSpinner";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projectId = Number(id);

  const [project, setProject]   = useState<Project | null>(null);
  const [allTechs, setAllTechs] = useState<Technology[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    Promise.all([
      projectService.getById(projectId),
      technologyService.getAll(),
    ])
      .then(([proj, techs]) => {
        if (proj.displayOrder > 3) { setIsNotFound(true); return; }
        setProject(proj);
        setAllTechs(techs);
      })
      .catch(() => setIsNotFound(true));
  }, [projectId]);

  if (isNotFound) notFound();
  if (!project) return <LoadingSpinner />;

  const { title, description, links, images, createdAt } = project;
  const year = createdAt ? new Date(createdAt).getFullYear() : null;

  const techIds = (project.technologies ?? []).map((t) =>
    typeof t === "number" ? t : (t as Technology).id
  );
  const projectTechs = allTechs.filter((tech) => techIds.includes(tech.id));

  return (
    <>
    <main className={`${styles.page} flex flex-col min-h-screen pt-8 px-4 pb-8 desktop:pt-16 desktop:px-20 desktop:pb-14`}>

      {/* Title + year above the carousel */}
      <div className={`${styles.metaLabel} label mb-8`}>
        {title}{year && ` · ${year}`}
      </div>

      <article className={`${styles.card} grid [grid-template-columns:1.05fr_1fr] gap-20 items-stretch flex-1 min-h-0`}>

        <ProjectCarousel images={images} title={title} />

        <section className="flex flex-col justify-between py-2">

          {/* Description — double newline = paragraph break */}
          <div className={styles.contentTop}>
            {description && description.split(/\n\n+/).map((para, i) => (
              <p key={i} className="text">{para.trim()}</p>
            ))}
          </div>

          {/* Technologies + Links */}
          <div className={`${styles.metaRow} flex justify-between items-start mt-12 pt-6 gap-8`}>

            {projectTechs.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className={`${styles.metaLabel} label`}>Built with</div>
                <div className="flex flex-wrap gap-2">
                  {projectTechs.map((tech) => (
                    <TechChip key={tech.id} name={tech.name} />
                  ))}
                </div>
              </div>
            )}

            <div className={`${styles.linksCol} flex flex-col items-end gap-4`}>
              <div className={`${styles.metaLabel} label`}>Links</div>
              {links && Object.keys(links).length > 0 ? (
                <div className="flex gap-3">
                  {Object.entries(links).map(([key, url]) => (
                    <CircleButton
                      key={key}
                      href={url}
                      icon={
                        key.toLowerCase().includes("github")
                          ? <FontAwesomeIcon icon={faGithub} />
                          : <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      }
                    />
                  ))}
                </div>
              ) : (
                <span className={styles.noLink}>Pas de lien externe</span>
              )}
            </div>
          </div>
        </section>
      </article>

      <Link
        className={`${styles.backLink} label inline-flex items-center gap-2 mt-14 self-center`}
        href="/"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Back to home</span>
      </Link>

    </main>
    <Footer />
    </>
  );
}
