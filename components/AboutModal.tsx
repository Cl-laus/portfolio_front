"use client";

import { useEffect } from "react";
import { Information } from "@/types";

interface AboutModalProps {
  info: Information;
  onClose: () => void;
}

export default function AboutModal({ info, onClose }: AboutModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="about-overlay fixed-overlay flex items-center justify-center p-[5.5em]" onClick={onClose}>
      <button className="about-close inline-flex items-center gap-[0.6em] p-0" onClick={onClose}>
        <span>Close</span>
        <span className="about-close-x" />
      </button>

      <div className="about-card" onClick={(e) => e.stopPropagation()}>
        <div className="about-card-label label mb-[1.6em]">About</div>

        <h2 className="mb-[1.6em]">{info.aboutTitle || info.fullName}</h2>

        <p className="mb-[0.85em]">{info.introText}</p>
        {info.aboutText && info.aboutText !== info.introText && (
          <p className="mb-[0.85em]">{info.aboutText}</p>
        )}

        <div className="about-row label flex gap-[3em] mt-[2em]">
          <div>
            Status
            <strong className="block mt-[0.4em]">Open · Q2 2026</strong>
          </div>
          {info.email && (
            <div>
              Contact
              <strong className="block mt-[0.4em]">
                <a href={`mailto:${info.email}`}>{info.email}</a>
              </strong>
            </div>
          )}
          {info.cv && (
            <div>
              CV
              <strong className="block mt-[0.4em]">
                <a href={info.cv} target="_blank" rel="noopener noreferrer">Download</a>
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
