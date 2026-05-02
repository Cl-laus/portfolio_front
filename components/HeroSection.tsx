'use client';

import { Information } from '@/types';

interface HeroSectionProps {
  info: Information;
}

export default function HeroSection({ info }: HeroSectionProps) {
  const [firstName, ...rest] = (info.fullName ?? '').split(' ');
  const lastName = rest.join(' ');

  return (
    <section className="hero-section">
      {/* LEFT CONTENT */}
      <div className="hero-left">
        <h1 className="hero-name flex flex-col">
          <span>{firstName}</span>
          <span>{lastName}</span>
        </h1>
        <div className="hero-tagline">{info.tagLine}</div>
        <div className="flex flex-col gap-2">
          <span>{info.jobTitle}</span>
          <span>Lyon · FR</span>
          <span>Open to CDI</span>
        </div>
      </div>

      {/* FISSURE — centered vertically, label to the right */}
      <div className="hero-center">
        <div className="scroll-fissure" />
        <div className="scroll-label">Scroll down</div>
      </div>
    </section>
  );
}
