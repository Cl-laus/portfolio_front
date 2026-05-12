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
      const vh      = window.innerHeight;
      const center  = vh / 2;
      const fadeIn  = vh * 0.25;
      const fadeOut = vh * 0.60;

      for (const el of cols) {
        const r        = el.getBoundingClientRect();
        const elCenter = r.top + r.height / 2;
        const dist     = elCenter - center;
        const absDist  = Math.abs(dist);

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

      <div className={styles.stage}>
        <div
          className={`${styles.rockStage} sticky top-0 flex items-center justify-center z-[6]`}
          style={{ height: '100vh', width: '100vw' }}
          aria-hidden="true"
        >
          <div className={`${styles.rockGlow} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[100vw]`}
            style={{ width: '900px', height: '900px' }}
          />
          <GlowSeparator vertical />
          <img src="/about-rock.jpg" alt="" />
          <GlowSeparator vertical />
        </div>

        <div className={`${styles.scrollWrap} relative z-[7] max-w-[1480px] mx-auto px-24`}
          style={{ marginTop: '-100vh' }}
        >
          <div className={styles.tabletPhoto} aria-hidden="true">
            <img src="/about-rock.jpg" alt="" />
          </div>

        <div className={`${styles.blocks} relative z-[4] flex flex-col`}
          style={{ gap: '400px', padding: '35vh 0 240px' }}
        >

          {/* 01 — Hello */}
          <section className={`${styles.block} ${styles.left} grid grid-cols-2 items-start`}>
            <div className={`${styles.col} ${styles.colLeft} min-w-0`} ref={el => { colRefs.current[0] = el; }}>
              <div className={`${styles.eyebrow} flex items-center gap-3 mb-[18px]`}>
                <span className={styles.hairline} />
                <span>01 — Hello</span>
              </div>
              <h2 className="title">{info?.aboutTitle}</h2>
              <p className="text">{info?.aboutText}</p>
            </div>
          </section>

          {/* 02 — Parcours */}
          <section className={`${styles.block} ${styles.right} grid grid-cols-2 items-start`}>
            <div className={`${styles.col} ${styles.colRight} min-w-0`} ref={el => { colRefs.current[1] = el; }}>
              <div className={`${styles.eyebrow} flex items-center gap-3 mb-[18px]`}>
                <span className={styles.hairline} />
                <span>02 — Parcours</span>
              </div>
              {info?.careerTitle && <h2 className="title">{info.careerTitle}</h2>}
              {info?.careerText && <p className="text">{info.careerText}</p>}
              {info?.cv && (
                <a className={`${styles.cvBtn} mt-6 inline-flex items-center gap-3 px-[22px] py-[14px]`} href={info.cv} download>
                  <FontAwesomeIcon icon={faDownload} />
                  Télécharger mon CV
                </a>
              )}
            </div>
          </section>

          {/* 03 — Stack */}
          <section className={`${styles.block} ${styles.left} grid grid-cols-2 items-start`}>
            <div className={`${styles.col} ${styles.colLeft} min-w-0`} ref={el => { colRefs.current[2] = el; }}>
              <div className={`${styles.eyebrow} flex items-center gap-3 mb-[18px]`}>
                <span className={styles.hairline} />
                <span>03 — Stack</span>
              </div>
              <h2 className="title">What I build with.</h2>
              <div className={`${styles.techGroups} flex flex-col mt-2`} style={{ gap: '22px' }}>
                {Object.entries(techGroups).map(([category, items]) => (
                  <div key={category} className={`${styles.techGroup} flex flex-col gap-2.5`}>
                    <div className={styles.groupLabel}>{category}</div>
                    <div className={`${styles.techList} flex gap-2.5 items-center flex-wrap`}>
                      {items.map(t => <TechChip key={t.id} name={t.name} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 04 — Liens */}
          <section className={`${styles.block} ${styles.right} grid grid-cols-2 items-start`}>
            <div className={`${styles.col} ${styles.colRight} min-w-0`} ref={el => { colRefs.current[3] = el; }}>
              <div className={`${styles.eyebrow} flex items-center gap-3 mb-[18px]`}>
                <span className={styles.hairline} />
                <span>04 — Liens</span>
              </div>
              <h2 className="title">Find me online.</h2>
              <p className="text">
                {info?.email
                  ? `Disponible par email à ${info.email}.`
                  : "I'm most active on GitHub."}
              </p>
              <div className={`${styles.links} flex gap-3 mt-2 flex-wrap`}>
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

      <div className={`${styles.footerWrap} relative z-[8]`}>
        <Footer />
      </div>
    </>
  );
}
