"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Information, Technology, SocialNetwork } from "@/types";
import { informationService } from "@/services/informationService";
import { technologyService } from "@/services/technologyService";
import { socialNetworkService } from "@/services/socialNetworkService";
import styles from "./page.module.css";

function socialIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("github"))   return <FontAwesomeIcon icon={faGithub} />;
  if (n.includes("linkedin")) return <FontAwesomeIcon icon={faLinkedin} />;
  return <FontAwesomeIcon icon={faEnvelope} />;
}

function groupByCategory(techs: Technology[]): Record<string, Technology[]> {
  return techs.reduce<Record<string, Technology[]>>((acc, t) => {
    const key = t.category || "Autre";
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});
}

export default function AboutPage() {
  const [info,    setInfo]    = useState<Information | null>(null);
  const [techs,   setTechs]   = useState<Technology[]>([]);
  const [socials, setSocials] = useState<SocialNetwork[]>([]);

  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    Promise.all([
      informationService.get(),
      technologyService.getAll(),
      socialNetworkService.getAll(),
    ]).then(([i, t, s]) => { setInfo(i); setTechs(t); setSocials(s); })
      .catch(console.error);
  }, []);

  // Scroll-driven opacity/transform animation
  useEffect(() => {
    const cols = colRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cols.length) return;

    let raf: number | null = null;

    const update = () => {
      raf = null;
      const vh     = window.innerHeight;
      const center = vh / 2;
      const fadeIn  = vh * 0.25;
      const fadeOut = vh * 0.60;

      for (const el of cols) {
        const r       = el.getBoundingClientRect();
        const elCenter = r.top + r.height / 2;
        const dist    = elCenter - center;
        const absDist = Math.abs(dist);

        let p: number;
        if (absDist <= fadeIn)       p = 1;
        else if (absDist >= fadeOut) p = 0;
        else p = 1 - (absDist - fadeIn) / (fadeOut - fadeIn);

        el.style.setProperty("--p",   p.toFixed(3));
        el.style.setProperty("--dir", dist >= 0 ? "1" : "-1");
      }
    };

    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [info, techs, socials]);

  const techGroups = groupByCategory(techs.filter(t => t.visible));

  return (
    <>
      {/* Fixed rock backdrop */}
      <div className={styles.rockStage} aria-hidden="true">
        <div className={styles.rockGlow} />
        <img src="/about-rock.jpg" alt="" />
      </div>

      <div className={styles.scrollWrap}>
        <div className={styles.blocks}>

          {/* 01 — Hello */}
          <section className={`${styles.block} ${styles.left}`}>
            <div
              className={`${styles.col} ${styles.colLeft}`}
              ref={el => { colRefs.current[0] = el; }}
            >
              <div className={styles.eyebrow}>
                <span className={styles.hairline} />
                <span>01 — Hello</span>
              </div>
              <h2>Designer-turned-developer.</h2>
              <p>{info?.introText}</p>
            </div>
          </section>

          {/* 02 — Parcours */}
          <section className={`${styles.block} ${styles.right}`}>
            <div
              className={`${styles.col} ${styles.colRight}`}
              ref={el => { colRefs.current[1] = el; }}
            >
              <div className={styles.eyebrow}>
                <span className={styles.hairline} />
                <span>02 — Parcours</span>
              </div>
              <h2>From Cinema 4D to TypeScript.</h2>
              <p>{info?.aboutText}</p>
              {info?.cv && (
                <a className={styles.cvBtn} href={info.cv} download>
                  <FontAwesomeIcon icon={faDownload} />
                  Télécharger mon CV
                </a>
              )}
            </div>
          </section>

          {/* 03 — Stack */}
          <section className={`${styles.block} ${styles.left}`}>
            <div
              className={`${styles.col} ${styles.colLeft}`}
              ref={el => { colRefs.current[2] = el; }}
            >
              <div className={styles.eyebrow}>
                <span className={styles.hairline} />
                <span>03 — Stack</span>
              </div>
              <h2>What I build with.</h2>
              <div className={styles.techGroups}>
                {Object.entries(techGroups).map(([category, items]) => (
                  <div key={category} className={styles.techGroup}>
                    <div className={styles.groupLabel}>{category}</div>
                    <div className={styles.techList}>
                      {items.map(t => (
                        <span key={t.id} className={styles.techChip}>{t.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 04 — Liens */}
          <section className={`${styles.block} ${styles.right}`}>
            <div
              className={`${styles.col} ${styles.colRight}`}
              ref={el => { colRefs.current[3] = el; }}
            >
              <div className={styles.eyebrow}>
                <span className={styles.hairline} />
                <span>04 — Liens</span>
              </div>
              <h2>Find me online.</h2>
              <p>
                {info?.email
                  ? `Disponible par email à ${info.email}.`
                  : "I'm most active on GitHub."}
              </p>
              <div className={styles.links}>
                {socials.map(s => (
                  <a
                    key={s.id}
                    className={styles.linkBtn}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                  >
                    {socialIcon(s.name)}
                  </a>
                ))}
                {info?.email && (
                  <a className={styles.linkBtn} href={`mailto:${info.email}`} title="Email">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>

      <footer className={styles.footer}>
        <span>© 2026 Lucas Luisetti</span>
      </footer>
    </>
  );
}
