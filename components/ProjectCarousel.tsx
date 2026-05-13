"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Image } from "@/types";
import styles from "./ProjectCarousel.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ProjectCarouselProps {
  images: Image[];
  title: string;
}

export default function ProjectCarousel({ images, title }: ProjectCarouselProps) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!images?.length) return;
    const t = setInterval(
      () => setSlide((prev) => (prev + 1) % images.length),
      4500
    );
    return () => clearInterval(t);
  }, [images?.length]);

  const goTo = (n: number) => {
    if (!images?.length) return;
    setSlide((n + images.length) % images.length);
  };

  return (
    <section className={`${styles.carousel} h-full relative overflow-hidden`} aria-label="Project screenshots">
      {images?.length > 0 ? (
        images.map((img, i) => (
          <div key={img.id} className={`${styles.slide} absolute inset-0${i === slide ? " active" : ""}`}>
            <img className="img-cover" src={`${API_URL}${img.url}`} alt={`${title} — ${i + 1}`} />
          </div>
        ))
      ) : (
        <div className={`${styles.slide} ${styles.slideFallback} absolute inset-0 active`} />
      )}

      {images?.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.arrowLeft} inline-flex items-center justify-center absolute top-1/2 -translate-y-1/2 w-10 h-10`}
            onClick={() => goTo(slide - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className={`${styles.arrow} ${styles.arrowRight} inline-flex items-center justify-center absolute top-1/2 -translate-y-1/2 w-10 h-10`}
            onClick={() => goTo(slide + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <div className={`${styles.dots} absolute left-1/2 bottom-4 -translate-x-1/2 flex gap-2`}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} p-0${i === slide ? " active" : ""}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
