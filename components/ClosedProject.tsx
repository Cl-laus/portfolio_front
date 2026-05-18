"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ProjectSummary } from "@/types";
import CircleButton from "./CircleButton";
import styles from "./ClosedProject.module.css";

interface ClosedProjectProps {
  project: ProjectSummary;
  index: string;
  meta?: string;
}

export default function ClosedProject({ project, index, meta }: ClosedProjectProps) {
  const router = useRouter();
  // État d'activation tactile : premier tap = révèle, second tap = navigue
  const [activated, setActivated] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleClick = () => {
    // Sur appareil tactile : premier tap = active, second tap = navigue
    if (navigator.maxTouchPoints > 0) {
      if (!activated) {
        setActivated(true);
        clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setActivated(false), 2500);
        return;
      }
      clearTimeout(resetTimer.current);
      setActivated(false);
    }
    router.push(`/projects/${project.id}`);
  };

  return (
    <div
      className={`${styles.closed} ${activated ? styles.activated : ""} w-full flex items-center justify-between gap-6`}
      onClick={handleClick}
    >
      {/* Pill ambiant — conteneur fixe avec overflow:hidden, light passe dedans */}
      <span className={styles.shimmerPill} aria-hidden="true" />
      <div className="flex items-baseline gap-6 min-w-0 flex-1">
        <span className="proj-index pt-3 self-start">{index} /</span>
        <h2 className="proj-title inline-block m-0">{project.title}</h2>
        {meta && <span className="proj-meta label pt-3 self-start">{meta}</span>}
      </div>
      <CircleButton
        icon={<FontAwesomeIcon icon={faArrowRight} />}
        ariaLabel="Voir le projet"
        size="lg"
        className="shrink-0"
      />
    </div>
  );
}
