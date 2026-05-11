"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    Promise.all([
      informationService.get(),
      technologyService.getAll(),
      socialNetworkService.getAll(),
    ]).then(([i, t, s]) => { setInfo(i); setTechs(t); setSocials(s); })
      .catch(console.error);
  }, []);

  const techGroups = groupByCategory(techs.filter(t => t.visible));

  return (
    <>
      {/* Fixed rock backdrop */}
      <div className={styles.rockStage} aria-hidden="true">
        <div className={styles.rockGlow} />
        <img src="/about-rock.jpg" alt="" />
      </div>

      {/* Gradient mask — above content, below nav and footer */}
      <div className={styles.scrollMask} aria-hidden="true" />

      <div className={styles.scrollWrap}>
        <div className={styles.blocks}>

          {/* 01 — Hello */}
          <section className={`${styles.block} ${styles.left}`}>
            <div className={`${styles.col} ${styles.colLeft}`}>
              <div className={styles.eyebrow}>
                <span className={styles.hairline} />
                <span>01 — Hello</span>
              </div>
              <h2>{info?.aboutTitle}</h2>
              <p>{info?.aboutText}</p>
            </div>
          </section>

          {/* 02 — Parcours */}
          <section className={`${styles.block} ${styles.right}`}>
            <div className={`${styles.col} ${styles.colRight}`}>
              <div className={styles.eyebrow}>
                <span className={styles.hairline} />
                <span>02 — Parcours</span>
              </div>
              {info?.careerTitle && <h2>{info.careerTitle}</h2>}
              {info?.careerText && <p>{info.careerText}</p>}
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
            <div className={`${styles.col} ${styles.colLeft}`}>
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
                      {items.map(t => <TechChip key={t.id} name={t.name} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 04 — Liens */}
          <section className={`${styles.block} ${styles.right}`}>
            <div className={`${styles.col} ${styles.colRight}`}>
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

      <div className={styles.footerWrap}>
        <Footer />
      </div>
    </>
  );
}
