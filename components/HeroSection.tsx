"use client";

import { useEffect, useState } from "react";
import AboutModal from "./AboutModal";
import { Information } from "@/types";

interface HeroSectionProps {
  info: Information;
}

export default function HeroSection({ info }: HeroSectionProps) {
  const [showAbout,     setShowAbout]     = useState(false);
  const [hideAboutLink, setHideAboutLink] = useState(false);

  // Split fullName into first / last — no hardcoding
  const [firstName, ...rest] = (info.fullName ?? "").split(" ");
  const lastName = rest.join(" ");

  useEffect(() => {
    const onScroll = () =>
      setHideAboutLink(window.scrollY > window.innerHeight * 0.65);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button
        className={`about-link${hideAboutLink ? " hidden" : ""}`}
        onClick={() => setShowAbout(true)}
      >
        About
      </button>

      <section className="hero-section">
        {/* Background image — swap src for <video autoPlay muted loop> later */}
        <div className="hero-bg" />
        <div className="hero-overlay" />

        {/* Left 1/3 — name, tagline, meta from API */}
        <div className="hero-left">
          <h1 className="hero-name">
            {firstName}<br />{lastName}
          </h1>
          <div className="hero-tagline">{info.tagLine}</div>
          <div className="hero-meta">
            <span>{info.jobTitle}</span>
            <span>Lyon · FR</span>
            <span>Open to CDI</span>
          </div>
        </div>

        {/* Right 2/3 — scroll fissure + label, vertically centered */}
        <div className="hero-right">
          <div className="scroll-group">
            <div className="scroll-label">Scroll down</div>
            <div className="scroll-fissure" />
          </div>
        </div>
      </section>

      {showAbout && <AboutModal info={info} onClose={() => setShowAbout(false)} />}
    </>
  );
}
