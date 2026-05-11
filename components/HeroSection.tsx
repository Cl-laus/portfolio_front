'use client';

import { Information } from '@/types';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  info: Information;
}

export default function HeroSection({ info }: HeroSectionProps) {
  const [firstName, ...rest] = (info.fullName ?? '').split(' ');
  const lastName = rest.join(' ');

  return (
    <section className={`${styles.heroSection} grid grid-cols-2 h-screen overflow-hidden`}>

      <div className={`${styles.heroLeft} flex flex-col justify-center pl-20 max-w-2xl`}>
        <h1 className={`${styles.heroName} flex flex-col`}>
          <span>{firstName}</span>
          <span>{lastName}</span>
        </h1>
        <div className={styles.heroTagline}>{info.tagLine}</div>
        <div className="flex flex-col gap-2">
          {(info.introText ?? '').split('\n').filter(Boolean).map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      </div>

      <div className={`${styles.heroCenter} flex items-center`}>
        <div className={styles.scrollFissure} />
        <div className={`${styles.scrollLabel} pl-5 pr-20`}>Découvrir</div>
      </div>

    </section>
  );
}
