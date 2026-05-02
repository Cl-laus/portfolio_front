"use client";

import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectService } from "@/services/projectService";
import { Project } from "@/types";
import { glassStyle } from "@/styles/glass";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [index, setIndex] = useState(0);

  const currentIndex = projects.findIndex((p) => p.id === project?.id);

  useEffect(() => {
    projectService.getById(Number(id)).then(setProject);
    projectService.getTop3().then(setProjects);
  }, [id]);

  useEffect(() => {
    if (!project?.images?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % project.images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [project?.images?.length]);

  const goToProject = (newIndex: number) => {
    const target = projects[newIndex];
    if (!target) return;
    window.location.href = `/projects/${target.id}`;
  };

  if (!project) return null;

  return (
    <div className="">

      {/* CONTENT CENTRÉ */}
      <div className="max-w-5xl mx-auto p-6 space-y-10"   >

        <h1 className="text-4xl font-bold text-left">
          {project.title}
        </h1>

        {/* DESCRIPTION */}
        <Card style={glassStyle}>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div>
                <h3 className="font-semibold mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.id}
                      className="px-2 py-1 text-xs rounded-md border bg-background"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {project.links && (
                <div>
                  <h3 className="font-semibold mb-3">Liens</h3>
                  <div className="flex flex-col gap-2">
                    {Object.entries(project.links).map(([key, value]) => (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        className="text-sm underline text-primary"
                      >
                        {key}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </CardContent>
        </Card>

        {/* IMAGES */}
        <Card style={glassStyle}>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>

          <CardContent>
            {project.images.length > 0 && (
              <div className="relative w-full h-[550px] overflow-hidden rounded-lg border">
                <img
                  src={`${API_URL}${project.images[index].url}`}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                />
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* NAVIGATION FIXE */}
      <div className="hidden md:block">
        <button
          onClick={() => goToProject(currentIndex - 1)}
          disabled={currentIndex <= 0}
          className="project-nav project-nav--left"
        >
          ← Projet précédent
        </button>

        <button
          onClick={() => goToProject(currentIndex + 1)}
          disabled={currentIndex >= projects.length - 1}
          className="project-nav project-nav--right"
        >
          Projet suivant →
        </button>
      </div>

      {/* CSS DANS LA PAGE */}
      <style jsx>{`
        .project-nav {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          font-weight: 500;
          color: #666;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .project-nav:hover {
          color: #111;
        }

        .project-nav:disabled {
          opacity: 0.3;
          pointer-events: none;
        }

        .project-nav--left {
          left: 24px;
        }

        .project-nav--right {
          right: 24px;
        }
      `}</style>

    </div>
  );
}