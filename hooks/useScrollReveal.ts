"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────
// useScrollReveal
//
// Surveille des éléments HTML au scroll et leur applique
// soit une valeur continue (mode "continuous") soit un
// basculement activé/désactivé (mode "threshold").
//
// Mode "continuous" — page À Propos
//   Calcule --reveal (0 à 1) selon la distance de l'élément
//   au centre du viewport. Utilisé pour des fondus progressifs.
//
// Mode "threshold" — page Home (cards projets)
//   Ajoute ou retire la classe "is-revealed" quand l'élément
//   entre ou sort du viewport. Utilisé pour déclencher
//   les animations de hover sur mobile.
//
// Utilisation :
//   const { register } = useScrollReveal({ mode: "continuous" }, [data]);
//   <div ref={register(0)} />
// ─────────────────────────────────────────────────────────

type Mode = "continuous" | "threshold";

interface Options {
  mode: Mode;
  // En mode "threshold" : pourcentage de l'élément visible
  // avant de le considérer "révélé" (0.4 = 40%)
  threshold?: number;
}

export function useScrollReveal(options: Options, deps: unknown[] = []) {
  // Tableau interne qui stocke les références aux éléments DOM
  const elements = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = elements.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    // ── Mode threshold : IntersectionObserver (simple, binaire) ──
    if (options.mode === "threshold") {
      const threshold = options.threshold ?? 0.4;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // Ajoute "is-revealed" quand visible, retire quand hors écran
          entry.target.classList.toggle("is-revealed", entry.isIntersecting);
        });
      }, { threshold });

      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }

    // ── Mode continuous : scroll manuel (valeur 0 → 1) ──
    let raf: number | null = null;

    const update = () => {
      raf = null;
      const vh         = window.innerHeight;
      const center     = vh / 2;
      const fadeStart  = vh * 0.25; // commence à disparaître à 25% du centre
      const fadeEnd    = vh * 0.60; // complètement invisible à 60% du centre

      for (const el of els) {
        const rect         = el.getBoundingClientRect();
        const elCenter     = rect.top + rect.height / 2;
        const distCenter   = elCenter - center;      // positif = sous le centre
        const absDist      = Math.abs(distCenter);

        // Calcul de la visibilité : 1 = pleinement visible, 0 = invisible
        let reveal: number;
        if (absDist <= fadeStart)  reveal = 1;
        else if (absDist >= fadeEnd) reveal = 0;
        else reveal = 1 - (absDist - fadeStart) / (fadeEnd - fadeStart);

        // --reveal   : 0 → 1, contrôle l'opacité / les animations CSS
        // --enter-from : 1 si l'élément arrive par le bas, -1 par le haut
        el.style.setProperty("--reveal",     reveal.toFixed(3));
        el.style.setProperty("--enter-from", distCenter >= 0 ? "1" : "-1");
      }
    };

    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update(); // calcul initial sans attendre le scroll

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Retourne une fonction pour attacher un élément au tableau
  // Utilisation : ref={register(0)}, ref={register(1)}, etc.
  const register = (index: number) => (el: HTMLElement | null) => {
    elements.current[index] = el;
  };

  return { register };
}
