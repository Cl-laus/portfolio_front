"use client";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ProjectSummary } from "@/types";
import CircleButton from "./CircleButton";
import styles from "./FeaturedProject.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface FeaturedProjectProps {
  project: ProjectSummary;
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const router = useRouter();

  const year       = project.createdAt ? new Date(project.createdAt).getFullYear() : null;
  const categories = project.technologies?.map(t => t.category).filter(Boolean) ?? [];
  const cats       = categories.slice(0, 2).join(" · ");
  const meta       = [cats, year].filter(Boolean).join(" · ");

  return (
    <a
      className={`${styles.featured} block`}
      href={`/projects/${project.id}`}
      onClick={(e) => { e.preventDefault(); router.push(`/projects/${project.id}`); }}
    >
      <div className="inline-flex items-center gap-3 mb-6">
        <div className={styles.featHairline} />
        <span className={`${styles.featLabelText} label`}>En une</span>
      </div>

      <div className={`${styles.titleRow} flex items-baseline gap-6`}>
        <span className="proj-index pt-3 self-start">01 /</span>
        <h2 className="proj-title inline-block m-0">{project.title}</h2>
        {meta && <span className="proj-meta label pt-3 self-start">{meta}</span>}
      </div>

      <div className={`${styles.featDetail} grid grid-cols-2 gap-20 items-stretch mt-16 pl-20`}>
        <div className={`${styles.featuredLeft} flex flex-col`}>
          <p className={`${styles.featDesc} text`}>{project.summary}</p>

          <div className={`${styles.ctaArea} mt-auto self-end flex items-center gap-6 pb-8 pr-10`}>
            <span className={`${styles.featCtaLabel} label`}>Voir détail du projet</span>
            <CircleButton
              icon={<FontAwesomeIcon icon={faArrowRight} />}
              size="lg"
              className={`${styles.ctaBtn} shrink-0`}
            />
          </div>
        </div>

        <div className={`${styles.featuredRight} flex flex-col`}>
          <div className={`${styles.featImageWrap} relative w-full flex-1 overflow-hidden`}>
            {project.image ? (
              <img
                className={`${styles.featImage} img-cover`}
                src={`${API_URL}${project.image.url}`}
                alt={project.title}
              />
            ) : (
              <div className={`${styles.featImage} ${styles.featImageFallback} img-cover`} />
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
