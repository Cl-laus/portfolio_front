'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { projectService } from '@/services/projectService';
import { technologyService } from '@/services/technologyService';
import { Technology } from '@/types';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export function useProjectForm() {
  const { isAuth, checkingAuth } = useProtectedRoute();
  const router  = useRouter();
  const params  = useParams();

  const isEdit    = params?.id !== 'new';
  const projectId = isEdit ? Number(params?.id) : null;

  const [title,        setTitle]        = useState('');
  const [summary,      setSummary]      = useState('');
  const [description,  setDescription]  = useState('');
  const [links,        setLinks]        = useState<{ key: string; value: string }[]>([]);
  const [techIds,      setTechIds]      = useState<number[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [images,       setImages]       = useState<{ id: number; url: string }[]>([]);
  const [files,        setFiles]        = useState<File[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    if (!isAuth) return;
    let ignore = false;

    async function loadData() {
      try {
        const techs = await technologyService.getAll();
        if (ignore) return;
        setTechnologies(techs);

        if (isEdit && projectId) {
          const p = await projectService.getById(projectId);
          if (ignore) return;
          setTitle(p.title);
          setSummary(p.summary);
          setDescription(p.description);
          setTechIds(p.technologies.map((t: Technology) => t.id));
          setImages(p.images ?? []);
          if (p.links) {
            setLinks(Object.entries(p.links).map(([k, v]) => ({ key: k, value: v as string })));
          }
        }
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();
    return () => { ignore = true; };
  }, [isAuth]);

  // ── Links ────────────────────────────────────────────────────
  function addLink() {
    setLinks(prev => [...prev, { key: '', value: '' }]);
  }
  function updateLink(i: number, field: 'key' | 'value', val: string) {
    setLinks(prev => { const c = [...prev]; c[i][field] = val; return c; });
  }
  function removeLink(i: number) {
    if (!confirm('Supprimer ce lien ?')) return;
    setLinks(prev => prev.filter((_, idx) => idx !== i));
  }

  // ── Technologies ─────────────────────────────────────────────
  function toggleTech(id: number) {
    setTechIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }

  // ── Images ───────────────────────────────────────────────────
  function deleteImage(id: number) {
    if (!confirm('Supprimer cette image ?')) return;
    projectService.deleteImage(id)
      .then(() => setImages(prev => prev.filter(img => img.id !== id)))
      .catch(console.error);
  }

  // ── Save ─────────────────────────────────────────────────────
  async function handleSave() {
    if (saving) return;
    setSaving(true);
    const linksObj: Record<string, string> = {};
    links.forEach(l => { if (l.key) linksObj[l.key] = l.value; });
    try {
      if (isEdit && projectId) {
        await projectService.update(projectId, { title, summary, description, links: linksObj, technologies: techIds });
        if (files.length > 0) await projectService.addImages(projectId, files);
      } else {
        await projectService.create({ title, summary, description, links: linksObj, technologies: techIds });
      }
      router.push('/batcave/projects');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde. Vérifiez votre connexion et réessayez.');
    } finally {
      setSaving(false);
    }
  }

  return {
    isAuth, checkingAuth, loading, saving, isEdit,
    title, setTitle,
    summary, setSummary,
    description, setDescription,
    links, addLink, updateLink, removeLink,
    techIds, technologies, toggleTech,
    images, deleteImage, files, setFiles,
    handleSave,
  };
}
