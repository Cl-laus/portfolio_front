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
    <div className="about-overlay" onClick={onClose}>
      <button className="about-close" onClick={onClose}>
        <span>Close</span>
        <span className="about-close-x" />
      </button>

      <div className="about-card" onClick={(e) => e.stopPropagation()}>
        <div className="about-card-label">About</div>

        <h2>{info.aboutTitle || info.fullName}</h2>

        <p>{info.introText}</p>
        {info.aboutText && info.aboutText !== info.introText && (
          <p>{info.aboutText}</p>
        )}

        <div className="about-row">
          <div>
            Status
            <strong>Open · Q2 2026</strong>
          </div>
          {info.email && (
            <div>
              Contact
              <strong>
                <a href={`mailto:${info.email}`}>{info.email}</a>
              </strong>
            </div>
          )}
          {info.cv && (
            <div>
              CV
              <strong>
                <a href={info.cv} target="_blank" rel="noopener noreferrer">Download</a>
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
