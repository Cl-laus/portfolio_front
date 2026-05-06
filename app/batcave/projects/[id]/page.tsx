'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrashCan, faFloppyDisk, faUpload } from '@fortawesome/free-solid-svg-icons';
import { projectService } from '@/services/projectService';
import { technologyService } from '@/services/technologyService';
import { Technology } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function ProjectFormPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();
  const router = useRouter();
  const params = useParams();

  const isEdit    = params?.id !== 'new';
  const projectId = isEdit ? Number(params?.id) : null;

  const [title, setTitle]           = useState('');
  const [summary, setSummary]       = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks]           = useState<{ key: string; value: string }[]>([]);
  const [techIds, setTechIds]       = useState<number[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [images, setImages]         = useState<{ id: number; url: string }[]>([]);
  const [files, setFiles]           = useState<File[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [visible, setVisible]       = useState(true);

  useEffect(function () {
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
          setVisible(p.displayOrder <= 3);
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

  function addLink() { setLinks(prev => [...prev, { key: '', value: '' }]); }
  function updateLink(i: number, field: 'key' | 'value', val: string) {
    setLinks(prev => { const c = [...prev]; c[i][field] = val; return c; });
  }
  function removeLink(i: number) {
    if (!confirm('Supprimer ce lien ?')) return;
    setLinks(prev => prev.filter((_, idx) => idx !== i));
  }

  function formatLinks(): Record<string, string> {
    const obj: Record<string, string> = {};
    links.forEach(l => { if (l.key) obj[l.key] = l.value; });
    return obj; // empty object = clear all links
  }

  function toggleTech(id: number) {
    setTechIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }

  function deleteImage(id: number) {
    if (!confirm('Supprimer cette image ?')) return;
    projectService.deleteImage(id)
      .then(() => setImages(prev => prev.filter(img => img.id !== id)))
      .catch(console.error);
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      if (isEdit && projectId) {
        await projectService.update(projectId, { title, summary, description, links: formatLinks(), technologies: techIds });
        if (files.length > 0) await projectService.addImages(projectId, files);
      } else {
        await projectService.create({ title, summary, description, links: formatLinks(), technologies: techIds });
      }
      router.push('/batcave/projects');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (checkingAuth || loading) return <LoadingSpinner />;
  if (!isAuth) return null;

  const crumbLabel = isEdit ? title || 'Édition projet' : 'Nouveau projet';

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-crumb">
          <span className="dash" />
          <span>Admin · {crumbLabel}</span>
        </div>
        <Link className="adm-back-link" href="/batcave/projects">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Retour aux projets</span>
        </Link>
      </header>

      <main className="adm-page">
        <div className="adm-page-header">
          <div>
            <h1>{isEdit ? (title || 'Édition projet') : 'Nouveau projet'}{isEdit ? '.' : ''}</h1>
            <p className="subtitle">Édite le contenu, les liens et les médias de ce projet.</p>
          </div>
          {isEdit && (
            <div className="actions">
              <div className="adm-toggle-group">
                <button
                  type="button"
                  className={`adm-toggle-opt ${visible ? 'adm-toggle-opt--on' : ''}`}
                  onClick={() => setVisible(true)}
                >
                  Visible
                </button>
                <button
                  type="button"
                  className={`adm-toggle-opt ${!visible ? 'adm-toggle-opt--on' : ''}`}
                  onClick={() => setVisible(false)}
                >
                  Archivé
                </button>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>

          {/* ── Informations ── */}
          <section className="adm-card">
            <div className="adm-card-head">
              <h2><span className="hairline" />Informations</h2>
            </div>
            <div className="adm-card-body">
              <div className="adm-field">
                <label className="adm-field-label" htmlFor="title">Titre</label>
                <input className="adm-input" id="title" type="text"
                  value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Ex. Helio Dispatch" />
              </div>
              <div className="adm-field">
                <label className="adm-field-label" htmlFor="summary">Résumé</label>
                <input className="adm-input" id="summary" type="text"
                  value={summary} onChange={e => setSummary(e.target.value)}
                  placeholder="Une phrase pour décrire le projet" />
              </div>
              <div className="adm-field">
                <label className="adm-field-label" htmlFor="desc">Description</label>
                <textarea className="adm-textarea" id="desc"
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Description complète du projet, stack, décisions techniques…" />
              </div>
            </div>
          </section>

          {/* ── Liens ── */}
          <section className="adm-card">
            <div className="adm-card-head">
              <h2><span className="hairline" />Liens</h2>
            </div>
            <div className="adm-card-body">
              {links.map((l, i) => (
                <div key={i} className="adm-field-row">
                  <input className="adm-input" type="text"
                    value={l.key} onChange={e => updateLink(i, 'key', e.target.value)}
                    placeholder="Libellé" />
                  <input className="adm-input" type="url"
                    value={l.value} onChange={e => updateLink(i, 'value', e.target.value)}
                    placeholder="https://..." />
                  <button className="adm-icon-btn adm-icon-btn--danger" type="button"
                    onClick={() => removeLink(i)} title="Supprimer">
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              ))}
              <button className="adm-add-link" type="button" onClick={addLink}>
                <FontAwesomeIcon icon={faPlus} />
                Ajouter un lien
              </button>
            </div>
          </section>

          {/* ── Technologies ── */}
          <section className="adm-card">
            <div className="adm-card-head">
              <h2><span className="hairline" />Technologies</h2>
            </div>
            <div className="adm-card-body">
              <div className="adm-chips">
                {technologies.map(tech => (
                  <button
                    key={tech.id}
                    type="button"
                    className={`adm-chip ${techIds.includes(tech.id) ? 'adm-chip--active' : ''}`}
                    onClick={() => toggleTech(tech.id)}
                  >
                    {tech.name}
                    {techIds.includes(tech.id) && <span className="x">×</span>}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Images ── */}
          {isEdit && (
            <section className="adm-card">
              <div className="adm-card-head">
                <h2><span className="hairline" />Images</h2>
              </div>
              <div className="adm-card-body">
                {images.length > 0 && (
                  <div className="adm-gallery" style={{ marginBottom: 16 }}>
                    {images.map((img, i) => (
                      <div key={img.id} className="adm-thumb">
                        <img
                          className="adm-thumb-img"
                          src={`${API_URL}${img.url}`}
                          alt={`Image ${i + 1}`}
                        />
                        <span className="adm-thumb-badge">{String(i + 1).padStart(2, '0')}</span>
                        <button
                          type="button"
                          className="adm-thumb-remove"
                          onClick={() => deleteImage(img.id)}
                          title="Retirer"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="adm-upload" htmlFor="files">
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Ajouter des images — glisse-dépose ou clique</span>
                  <span className="adm-upload-hint">PNG · JPG · WEBP</span>
                  <input
                    id="files"
                    type="file"
                    multiple
                    hidden
                    accept="image/*"
                    onChange={e => setFiles(Array.from(e.target.files ?? []).slice(0, 10))}
                  />
                </label>
                {files.length > 0 && (
                  <p style={{ marginTop: 10, fontSize: 13, color: 'var(--amber-bright)' }}>
                    {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ── Actions ── */}
          <div className="adm-form-actions">
            <Link className="adm-btn-link" href="/batcave/projects">Annuler</Link>
            <button className="adm-btn adm-btn-amber" type="submit" disabled={saving}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
          </div>

        </form>
      </main>
    </>
  );
}
