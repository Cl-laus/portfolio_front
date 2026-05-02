"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Information, Technology, SocialNetwork } from "@/types";

import { informationService } from "@/services/informationService";
import { technologyService } from "@/services/technologyService";
import { socialNetworkService } from "@/services/socialNetworkService";
import { glassStyle } from "@/styles/glass";

export default function AboutPage() {
  const [info, setInfo] = useState<Information | null>(null);
  const [techs, setTechs] = useState<Technology[]>([]);
  const [socials, setSocials] = useState<SocialNetwork[]>([]);
  const [visible, setVisible] = useState<number[]>([]);

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const load = async () => {
      const [infoData, techData, socialData] = await Promise.all([
        informationService.get(),
        technologyService.getAll(),
        socialNetworkService.getAll(),
      ]);

      setInfo(infoData);
      setTechs(techData);
      setSocials(socialData);
    };

    load();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.index);

          if (entry.isIntersecting) {
            setVisible((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    refs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [info, techs, socials]);

  const sections = [
    {
      side: "left",
      content: (
        <Card style={glassStyle}>
          <CardHeader>
            <CardTitle>Présentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {info?.introText}
            </p>
          </CardContent>
        </Card>
      ),
    },

    {
      side: "left",
      content: (
        <Card style={glassStyle}>
          <CardHeader>
            <CardTitle>Compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {techs.map((t) => (
                <span
                  key={t.id}
                  className="px-2 py-1 text-xs rounded-md border bg-background"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },

    {
      side: "right",
      content: (
        <Card style={glassStyle}>
          <CardHeader>
            <CardTitle>Parcours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {info?.aboutText}
            </p>
          </CardContent>
        </Card>
      ),
    },

    {
      side: "right",
      content: (
        <Card style={glassStyle}>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {info?.email}
            </p>
          </CardContent>
        </Card>
      ),
    },

    {
      side: "right",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Social</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                className="text-sm underline text-primary opacity-80 hover:opacity-100"
              >
                {s.name}
              </a>
            ))}
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="min-h-screen">

      <div className="grid grid-cols-3 gap-12 px-10 py-20">

        {/* LEFT */}
        <div className="space-y-[32vh] md:space-y-[40vh]">
          {sections.map((s, i) =>
            s.side === "left" ? (
              <div
                key={i}
                ref={(el) => (refs.current[i] = el)}
                data-index={i}
                className={`transition-all duration-1000 ease-out
                  ${
                    visible.includes(i)
                      ? "opacity-100 translate-y-0 blur-0"
                      : "opacity-0 translate-y-16 blur-sm"
                  }`}
              >
                {s.content}
              </div>
            ) : (
              <div key={i} />
            )
          )}
        </div>

        {/* CENTER STICKY */}
        <div className="relative">
          <div className="sticky top-24 flex justify-center">
            <div className="w-[300px] h-[500px] border rounded-xl overflow-hidden bg-muted flex items-center justify-center">

              {info?.photoPath ? (
                <img
                  src={info.photoPath}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="opacity-50">Photo</span>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-[32vh] md:space-y-[40vh]">
          {sections.map((s, i) =>
            s.side === "right" ? (
              <div
                key={i}
                ref={(el) => (refs.current[i] = el)}
                data-index={i}
                className={`transition-all duration-1000 ease-out
                  ${
                    visible.includes(i)
                      ? "opacity-100 translate-y-0 blur-0"
                      : "opacity-0 translate-y-16 blur-sm"
                  }`}
              >
                {s.content}
              </div>
            ) : (
              <div key={i} />
            )
          )}
        </div>

      </div>
    </div>
  );
}