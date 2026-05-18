"use client";

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
  isRevealed?: boolean; // true sur mobile quand le timer active cette card
}

export default function ClosedProject({ project, index, meta, isRevealed }: ClosedProjectProps) {
  const router = useRouter();

  return (
    <div
      className={`${styles.closed} w-full flex items-center justify-between gap-6${isRevealed ? " is-revealed" : ""}`}
      onClick={() => router.push(`/projects/${project.id}`)}
    >
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
