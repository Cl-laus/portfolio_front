"use client";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Project } from "@/types";
import CircleButton from "./CircleButton";
import styles from "./FeaturedProject.module.css";

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
      className={styles.featured}
      href={`/projects/${project.id}`}
      onClick={(e) => { e.preventDefault(); router.push(`/projects/${project.id}`); }}
    >
      <div className="inline-flex items-center gap-3 mb-6">
        <div className={styles.featHairline} />
        <span className={`${styles.featLabelText} label`}>En une</span>
      </div>

      <div className={`${styles.titleRow} flex items-baseline gap-6`}>
        <span className="closed-index pt-3 self-start">01 /</span>
        <h2 className="closed-title inline-block m-0">{project.title}</h2>
        <span className="closed-meta label pt-3 self-start">{meta}</span>
      </div>

      <div className={`${styles.featDetail} grid grid-cols-2 gap-20 items-stretch mt-16 pl-20`}>
        <div className={styles.featuredLeft}>
          <p className={styles.featDesc}>{project.summary}</p>

          <div className={`${styles.featMeta} label mt-6 flex gap-3 items-center`}>
            {project.technologies?.slice(0, 3).map((tech, i) => (
              <span key={tech.id} className="contents">
                {i > 0 && <span className={`${styles.metaDot} w-1 h-1 shrink-0 inline-block`} />}
                <span>{tech.name}</span>
              </span>
            ))}
            {project.technologies?.length > 0 && (
              <>
                <span className={`${styles.metaDot} w-1 h-1 shrink-0 inline-block`} />
                <span>{year}</span>
              </>
            )}
          </div>

          <div className="mt-auto self-end flex items-center gap-6 pb-8 pr-10">
            <span className={`${styles.featCtaLabel} label`}>Voir détail du projet</span>
            <CircleButton icon={<FontAwesomeIcon icon={faArrowRight} />} size="lg" className={styles.ctaBtn} />
          </div>
        </div>

        <div className={styles.featuredRight}>
          <div className={`${styles.featImageWrap} w-full`}>
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            {image ? (
              <img className={`${styles.featImage} img-cover`} src={image.url} alt={project.title} />
            ) : (
              <div className={`${styles.featImage} img-cover`} style={{ background: "rgba(245,241,234,0.04)" }} />
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
