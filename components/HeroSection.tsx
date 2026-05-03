'use client';

import { Information } from '@/types';

interface HeroSectionProps {
  info: Information;
}

export default function HeroSection({ info }: HeroSectionProps) {
  const [firstName, ...rest] = (info.fullName ?? '').split(' ');
  const lastName = rest.join(' ');

  return (
    <section className="hero-section grid grid-cols-2 h-screen overflow-hidden">

      <div className="hero-left flex flex-col justify-center pl-[5.5em] max-w-[42em]">
        <h1 className="hero-name flex flex-col">
          <span>{firstName}</span>
          <span>{lastName}</span>
        </h1>
        <div className="hero-tagline">{info.tagLine}</div>
        <div className="flex flex-col gap-2">
          <span>{info.jobTitle}</span>
          <span>Lyon · FR</span>
          <span>Disponible</span>
        </div>
      </div>

      <div className="hero-center flex items-center">
        <div className="scroll-fissure" />
        <div className="scroll-label pl-[1.2em] pr-[5.5em]">Découvrir</div>
      </div>

    </section>
  );
}
