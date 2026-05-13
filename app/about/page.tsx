"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Information, Technology, SocialNetwork } from "@/types";
import { informationService } from "@/services/informationService";
import { technologyService } from "@/services/technologyService";
import { socialNetworkService } from "@/services/socialNetworkService";
import TechChip from "@/components/TechChip";
import CircleButton from "@/components/CircleButton";
import Footer from "@/components/Footer";
import GlowSeparator from "@/components/GlowSeparator";
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
        const dist    = r.top + r.height / 2 - center;
        const absDist = Math.abs(dist);
        const p = absDist <= fadeIn  ? 1
                : absDist >= fadeOut ? 0
                : 1 - (absDist - fadeIn) / (fadeOut - fadeIn);

        el.style.setProperty("--p",   p.toFixed(3));
        el.style.setProperty("--dir", dist >= 0 ? "1" : "-1");
      }
    };

    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [info, techs, socials]);

  const techGroups = groupByCategory(techs.filter(t => t.visible));

  return (
    <>
      <div className={styles.mobileBg} aria-hidden="true">
        <img src="/about-rock.jpg" alt="" />
      </div>

      <div className={`${styles.stage} relative`}>

        {/* Image de fond — sticky, pleine fenêtre */}
        <div
          className={`${styles.rockStage} sticky top-0 h-screen w-screen flex items-center justify-center pointer-events-none`}
          aria-hidden="true"
        >
          <div className={`${styles.rockGlow} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`} />
          <GlowSeparator vertical />
          <img src="/about-rock.jpg" alt="" />
          <GlowSeparator vertical />
        </div>

        {/* Contenu scrollable */}
        <div className={`${styles.scrollWrap} relative`}>
          <div className={styles.tabletPhoto} aria-hidden="true">
            <img src="/about-rock.jpg" alt="" />
          </div>

          <div className={`${styles.blocks} flex flex-col gap-48`}>

            {/* 01 — Hello */}
            <section className={`${styles.block} ${styles.left}`}>
              <div className={`${styles.col} min-w-0`} ref={el => { colRefs.current[0] = el; }}>
                <div className={styles.eyebrow}>
                  <span className={styles.hairline} />
                  <span>01 — Hello</span>
                </div>
                <h2 className="title">{info?.aboutTitle}</h2>
                <p className="text">{info?.aboutText}</p>
              </div>
            </section>

            {/* 02 — Parcours */}
            <section className={`${styles.block} ${styles.right}`}>
              <div className={`${styles.col} min-w-0`} ref={el => { colRefs.current[1] = el; }}>
                <div className={styles.eyebrow}>
                  <span className={styles.hairline} />
                  <span>02 — Parcours</span>
                </div>
                {info?.careerTitle && <h2 className="title">{info.careerTitle}</h2>}
                {info?.careerText  && <p  className="text">{info.careerText}</p>}
                <a className={`${styles.cvBtn} inline-flex items-center gap-3 mt-6 py-3 px-5`} href={info?.cv ?? undefined} download={!!info?.cv}>
                  <FontAwesomeIcon icon={faDownload} />
                  Télécharger mon CV
                </a>
              </div>
            </section>

            {/* 03 — Stack */}
            <section className={`${styles.block} ${styles.left}`}>
              <div className={`${styles.col} min-w-0`} ref={el => { colRefs.current[2] = el; }}>
                <div className={styles.eyebrow}>
                  <span className={styles.hairline} />
                  <span>03 — Stack</span>
                </div>
                <h2 className="title">Technologies utilisées.</h2>
                <div className="flex flex-col gap-5 mt-2">
                  {Object.entries(techGroups).map(([category, items]) => (
                    <div key={category} className="flex flex-col gap-2">
                      <div className={styles.groupLabel}>{category}</div>
                      <div className="flex gap-2 items-center flex-wrap">
                        {items.map(t => <TechChip key={t.id} name={t.name} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 04 — Liens */}
            <section className={`${styles.block} ${styles.right}`}>
              <div className={`${styles.col} min-w-0`} ref={el => { colRefs.current[3] = el; }}>
                <div className={styles.eyebrow}>
                  <span className={styles.hairline} />
                  <span>04 — Liens</span>
                </div>
                <h2 className="title">Restons en contact.</h2>
                <p className="text">
                  {info?.email
                    ? `Disponible par email à ${info.email}.`
                    : "I'm most active on GitHub."}
                </p>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {socials.map(s => (
                    <CircleButton key={s.id} href={s.url} icon={socialIcon(s.name)} />
                  ))}
                  {info?.email && (
                    <CircleButton href={`mailto:${info.email}`} icon={<FontAwesomeIcon icon={faEnvelope} />} />
                  )}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      <div className={`${styles.footerWrap} relative`}>
        <Footer />
      </div>
    </>
  );
}
