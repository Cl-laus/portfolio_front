'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { projectService } from '@/services/projectService';
import { technologyService } from '@/services/technologyService';
import { Technology } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import LoadingPage from '@/app/batcave/loading';
import { useProtectedRoute } from '@/hooks/useProtectedRoute'; // <-- notre hook

export default function ProjectFormPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();
  const router = useRouter();
  const params = useParams();

  const isEdit = params?.id !== 'new';
  const projectId = isEdit ? Number(params?.id) : null;

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<{ key: string; value: string }[]>([]);
  const [techIds, setTechIds] = useState<number[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  // ===================== DATA FETCH =====================
  useEffect(function () {
    if (!isAuth) return; // si pas auth, on ne fetch pas

    async function loadData() {
      try {
        // fetch toutes les technologies
        const techs = await technologyService.getAll();
        setTechnologies(techs);

        // si édition, fetch du projet
        if (isEdit && projectId) {
          const p = await projectService.getById(projectId);
          setTitle(p.title);
          setSummary(p.summary);
          setDescription(p.description);
          setTechIds(p.technologies.map(getTechId));
          setImages(p.images ?? []);

          if (p.links) {
            setLinks(Object.entries(p.links).map(mapLinkEntry));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuth]);

  // ===================== HELPERS =====================
  function getTechId(t: Technology) {
    return t.id;
  }

  function mapLinkEntry([k, v]: [string, string]) {
    return { key: k, value: v };
  }

  // ===================== LINKS =====================
  function addLink() {
    setLinks(function (prev) {
      return [...prev, { key: '', value: '' }];
    });
  }

  function updateLink(index: number, field: 'key' | 'value', value: string) {
    setLinks(function (prev) {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  }

  function removeLink(index: number) {
    setLinks(function (prev) {
      return prev.filter(function (_, i) { return i !== index; });
    });
  }

  function formatLinks() {
    const obj: Record<string, string> = {};
    links.forEach(function (l) {
      if (l.key) obj[l.key] = l.value;
    });
    return Object.keys(obj).length ? obj : null;
  }

  // ===================== TECHNOLOGIES =====================
  function toggleTech(id: number) {
    setTechIds(function (prev) {
      if (prev.includes(id)) {
        return prev.filter(function (t) { return t !== id; });
      } else {
        return [...prev, id];
      }
    });
  }

  // ===================== SAVE =====================
  function handleSave() {
    if (isEdit && projectId) {
      projectService.update(projectId, {
        title,
        summary,
        description,
        links: formatLinks(),
        technologies: techIds,
      })
      .then(uploadImages)
      .then(goBack)
      .catch(console.error);
    } else {
      projectService.create({
        title,
        summary,
        description,
        links: formatLinks(),
        technologies: techIds,
      })
      .then(goBack)
      .catch(console.error);
    }
  }

  function uploadImages() {
    if (files.length > 0 && projectId) {
      return projectService.addImages(projectId, files);
    }
    return Promise.resolve();
  }

  function goBack() {
    router.push('/batcave/projects');
  }

  // ===================== LOADING UI =====================
  if (checkingAuth || loading) {
    return <LoadingPage />;
  }

  if (!isAuth) {
    return null; // la redirection est gérée par le hook
  }

  // ===================== UI =====================
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Informations</h2>

        <Input placeholder="Titre" value={title} onChange={function(e){setTitle(e.target.value)}} />
        <Input placeholder="Résumé" value={summary} onChange={function(e){setSummary(e.target.value)}} className="mt-2" />
        <Textarea placeholder="Description" value={description} onChange={function(e){setDescription(e.target.value)}} className="mt-2 min-h-[150px]" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Liens</h2>
        {links.map(function (l, i) {
          return (
            <div key={i} className="flex gap-2 mb-2">
              <Input placeholder="Label" value={l.key} onChange={function(e){updateLink(i,'key',e.target.value)}} />
              <Input placeholder="URL" value={l.value} onChange={function(e){updateLink(i,'value',e.target.value)}} />
              <Button onClick={function(){removeLink(i)}}>✕</Button>
            </div>
          );
        })}
        <Button variant="outline" onClick={addLink}>+ Ajouter</Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Technologies</h2>
        <div className="grid grid-cols-4 gap-2">
          {technologies.map(function (tech) {
            return (
              <Badge
                key={tech.id}
                onClick={function(){toggleTech(tech.id)}}
                className="cursor-pointer"
                variant={techIds.includes(tech.id) ? 'default' : 'outline'}
              >
                {tech.name}
              </Badge>
            );
          })}
        </div>
      </div>

      {isEdit && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Images</h2>
          <div className="flex gap-2 flex-wrap">
            {images.map(function (img) {
              return (
                <div key={img.id} className="relative w-24 h-24">
                  <img
                    src={process.env.NEXT_PUBLIC_API_URL + img.url}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    className="absolute top-0 right-0"
                    onClick={function () {
                      projectService.deleteImage(img.id).then(function () {
                        setImages(function (prev) {
                          return prev.filter(function (i) { return i.id !== img.id; });
                        });
                      });
                    }}
                  >
                    ✕
                  </Button>
                </div>
              );
            })}
          </div>
          <Input
            type="file"
            multiple
            onChange={function(e){setFiles(Array.from(e.target.files ?? []))}}
            className="mt-2"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSave}>Sauvegarder</Button>
        <Button variant="outline" onClick={goBack}>
          Annuler
        </Button>
      </div>
    </div>
  );
}