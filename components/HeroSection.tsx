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
    <section className={`${styles.heroSection} h-screen flex items-center overflow-hidden`}>
      <div className={`${styles.heroContent} flex flex-col pl-20`}>
        <h1 className={`${styles.heroName} flex flex-col`}>
          <span>{firstName}</span>
          <span>{lastName}</span>
        </h1>
        <div className={styles.heroTagline}>{info.tagLine}</div>
        <div className={`${styles.heroIntro} flex flex-col gap-2`}>
          {(info.introText ?? '').split('\n').filter(Boolean).map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
