'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Project } from '@/types';
import { projectService } from '@/services/projectService';
import LoadingPage from '@/app/batcave/loading';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function ProjectsPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(function () {
    if (!isAuth) return;
    fetchProjects();
  }, [isAuth]);

  async function fetchProjects() {
    try {
      const data = await projectService.getAll();
      setProjects(data.sort(function(a, b) { return a.displayOrder - b.displayOrder; }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderChange(project: Project, inputEl: HTMLInputElement) {
    const newOrder = parseInt(inputEl.value, 10);
    if (!newOrder || newOrder === project.displayOrder) {
      inputEl.value = String(project.displayOrder);
      return;
    }
    try {
      await projectService.update(project.id, { displayOrder: newOrder });
      await fetchProjects();
    } catch (error) {
      console.error(error);
      inputEl.value = String(project.displayOrder);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await projectService.delete(id);
      await fetchProjects();
    } catch (error) {
      console.error(error);
    }
  }

  if (checkingAuth || loading) return <LoadingPage />;
  if (!isAuth) return null;

  const sorted  = [...projects].sort((a, b) => a.displayOrder - b.displayOrder);
  const visible  = sorted.filter(p => p.displayOrder <= 3);
  const archived = sorted.filter(p => p.displayOrder > 3);

  function renderRows(list: Project[]) {
    if (list.length === 0) {
      return (
        <tr>
          <td colSpan={5} style={{ textAlign: 'center', color: 'var(--fg-muted)', padding: '24px 28px' }}>
            Aucun projet
          </td>
        </tr>
      );
    }
    return list.map(project => (
      <tr key={project.id}>
        <td className="adm-col-id" data-label="ID">
          {String(project.id).padStart(2, '0')}
        </td>
        <td className="adm-col-title" data-label="Titre">
          <button
            className="title-link"
            onClick={() => router.push(`/batcave/projects/${project.id}`)}
          >
            {project.title}
          </button>
        </td>
        <td className="adm-col-status" data-label="Statut">
          <span className={`adm-pill ${project.displayOrder <= 3 ? 'adm-pill--visible' : ''}`}>
            <span className="dot" />
            {project.displayOrder <= 3 ? 'Visible' : 'Archivé'}
          </span>
        </td>
        <td className="adm-col-order" data-label="Ordre">
          <input
            className="adm-order-input"
            type="number"
            min={1}
            defaultValue={project.displayOrder}
            key={project.displayOrder}
            onBlur={e => handleOrderChange(project, e.currentTarget)}
            onKeyDown={e => {
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') {
                e.currentTarget.value = String(project.displayOrder);
                e.currentTarget.blur();
              }
            }}
          />
        </td>
        <td className="adm-col-actions" data-label="Actions">
          <div className="adm-row-actions">
            <button
              className="adm-icon-btn"
              onClick={() => router.push(`/batcave/projects/${project.id}`)}
              title="Éditer"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button
              className="adm-icon-btn adm-icon-btn--danger"
              onClick={() => handleDelete(project.id)}
              title="Supprimer"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-crumb">
          <span className="dash" />
          <span>Admin · Projets</span>
        </div>
        <Link className="adm-back-link" href="/">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to home</span>
        </Link>
      </header>

      <main className="adm-page">
        <div className="adm-page-header">
          <div className="lead">
            <h1>Projets.</h1>
            <p className="subtitle">
              Gère l'ordre, la visibilité et le contenu de chaque projet du portfolio.
            </p>
          </div>
          <div className="actions">
            <Link className="adm-btn" href="/batcave/informations">
              <FontAwesomeIcon icon={faPenToSquare} />
              Informations globales
            </Link>
            <button className="adm-btn" onClick={() => router.push('/batcave/projects/new')}>
              <FontAwesomeIcon icon={faPlus} />
              Nouveau projet
            </button>
          </div>
        </div>

        {/* Visibles */}
        <section className="adm-card" style={{ marginBottom: 36 }}>
          <div className="adm-card-head">
            <h2><span className="hairline" /><span>Visibles</span></h2>
            <span className="count">{String(visible.length).padStart(2, '0')} projets</span>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-col-id">ID</th>
                <th className="adm-col-title">Titre</th>
                <th className="adm-col-status">Statut</th>
                <th className="adm-col-order">Ordre</th>
                <th className="adm-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>{renderRows(visible)}</tbody>
          </table>
        </section>

        {/* Archivés */}
        <section className="adm-card" style={{ marginBottom: 36 }}>
          <div className="adm-card-head">
            <h2><span className="hairline" /><span style={{ color: 'var(--fg-muted)' }}>Archivés</span></h2>
            <span className="count">{String(archived.length).padStart(2, '0')} projets</span>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-col-id">ID</th>
                <th className="adm-col-title">Titre</th>
                <th className="adm-col-status">Statut</th>
                <th className="adm-col-order">Ordre</th>
                <th className="adm-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>{renderRows(archived)}</tbody>
          </table>
        </section>
      </main>
    </>
  );
}
