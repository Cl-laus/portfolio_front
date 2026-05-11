'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faFloppyDisk, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useProjectForm } from '@/hooks/useProjectForm';
import AdminCard from '@/components/AdminCard';
import AdminField from '@/components/AdminField';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function ProjectFormPage() {
  const {
    isAuth, checkingAuth, loading, saving, isEdit,
    title, setTitle,
    summary, setSummary,
    description, setDescription,
    links, addLink, updateLink, removeLink,
    techIds, technologies, toggleTech,
    images, deleteImage, files, setFiles,
    handleSave,
  } = useProjectForm();

  if (checkingAuth || loading) return <LoadingSpinner />;
  if (!isAuth) return null;

  return (
    <main className="adm-page">
      <div className="adm-page-header">
        <div className="lead">
          <h1>{isEdit ? 'Éditer ce projet.' : 'Nouveau projet.'}</h1>
          <p className="subtitle">Édite le contenu, les liens et les médias de ce projet.</p>
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSave(); }}>

        <AdminCard title="Informations" body>
          <AdminField label="Titre" htmlFor="title">
            <input className="adm-input" id="title" type="text"
              value={title} placeholder="Ex. Helio Dispatch"
              onChange={e => setTitle(e.target.value)} />
          </AdminField>
          <AdminField label="Résumé" htmlFor="summary">
            <input className="adm-input" id="summary" type="text"
              value={summary} placeholder="Une phrase pour décrire le projet"
              onChange={e => setSummary(e.target.value)} />
          </AdminField>
          <AdminField label="Description" htmlFor="desc">
            <textarea className="adm-textarea" id="desc"
              value={description} placeholder="Description complète, stack, décisions techniques…"
              onChange={e => setDescription(e.target.value)} />
          </AdminField>
        </AdminCard>

        <AdminCard title="Liens" body>
          {links.map((l, i) => (
            <div key={i} className="adm-field-row">
              <input className="adm-input" type="text" value={l.key} placeholder="Libellé"
                onChange={e => updateLink(i, 'key', e.target.value)} />
              <input className="adm-input" type="url" value={l.value} placeholder="https://..."
                onChange={e => updateLink(i, 'value', e.target.value)} />
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
        </AdminCard>

        <AdminCard title="Technologies" body>
          <div className="flex flex-wrap gap-2 mb-5">
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
        </AdminCard>

        {isEdit && (
          <AdminCard title="Images" body>
            {images.length > 0 && (
              <div className={`${styles.gallery} mb-4`}>
                {images.map((img, i) => (
                  <div key={img.id} className={styles.thumb}>
                    <img className={styles.thumbImg} src={`${API_URL}${img.url}`} alt={`Image ${i + 1}`} />
                    <span className={styles.thumbBadge}>{String(i + 1).padStart(2, '0')}</span>
                    <button type="button" className={styles.thumbRemove}
                      onClick={() => deleteImage(img.id)} title="Retirer">
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className={styles.upload} htmlFor="files">
              <FontAwesomeIcon icon={faUpload} />
              <span>Ajouter des images — glisse-dépose ou clique</span>
              <span className={styles.uploadHint}>PNG · JPG · WEBP</span>
              <input id="files" type="file" multiple hidden accept="image/*"
                onChange={e => setFiles(Array.from(e.target.files ?? []).slice(0, 10))} />
            </label>
            {files.length > 0 && (
              <p className={styles.uploadCount}>
                {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
              </p>
            )}
          </AdminCard>
        )}

        <div className="adm-form-actions">
          <Link className="adm-btn-link" href="/batcave/projects">Annuler</Link>
          <button className="adm-btn adm-btn-amber" type="submit" disabled={saving}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>

      </form>
    </main>
  );
}
